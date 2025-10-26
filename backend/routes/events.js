import express from "express";
import { Event } from "../models/Event.js";
import { Subscription } from "../models/Subscription.js";
import { Delivery } from "../models/Delivery.js";
import axios from "axios";
import crypto from "crypto";

const router = express.Router();

// Generate HMAC signature
const signPayload = (secret, payload) =>
  crypto.createHmac("sha256", secret).update(JSON.stringify(payload)).digest("hex");

// POST /events
router.post("/", async (req, res) => {
  try {
    const { type, payload } = req.body;
    const eventId = crypto.randomBytes(12).toString("hex");

    const event = await Event.create({ eventId, type, payload });

    // Find active subscriptions
    const subscriptions = await Subscription.find({ events: type, active: true }).populate("clientId");

    // Queue deliveries
    const deliveries = subscriptions.map((sub) => ({
      eventId,
      subscriptionId: sub._id,
    }));
    await Delivery.insertMany(deliveries);

    // Async delivery (fire-and-forget)
    subscriptions.forEach((sub) => deliverEvent(event, sub));

    res.json({ success: true, eventId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Delivery function
async function deliverEvent(event, subscription) {
  const secret = subscription.clientId.secret;
  const signature = signPayload(secret, event.payload);

  try {
    const res = await axios.post(subscription.url, event.payload, {
      headers: { "X-Signature": signature },
      timeout: 5000,
    });

    await Delivery.findOneAndUpdate(
      { eventId: event.eventId, subscriptionId: subscription._id },
      { status: "success", responseCode: res.status, responseBody: JSON.stringify(res.data), attempt: 1 }
    );
  } catch (err) {
    console.error("Delivery failed:", err.message);
    await Delivery.findOneAndUpdate(
      { eventId: event.eventId, subscriptionId: subscription._id },
      { status: "failed", error: err.message, attempt: 1 }
    );
  }
}
// GET /events - fetch all triggered events
router.get("/", async (_req, res) => {
  try {
    const events = await Event.find().sort({ createdAt: -1 }); // latest first
    res.json(events);
  } catch (err) {
    console.error("Error fetching events:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
