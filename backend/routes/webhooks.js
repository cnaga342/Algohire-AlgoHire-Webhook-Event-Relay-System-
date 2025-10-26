import express from "express";
import mongoose from "mongoose";
import { Client } from "../models/Client.js";
import { Subscription } from "../models/Subscription.js";

const router = express.Router();

// Create subscription
router.post("/register", async (req, res) => {
  try {
    const { clientId, url, events } = req.body;

    if (!mongoose.Types.ObjectId.isValid(clientId)) {
      return res.status(400).json({ error: "Invalid clientId" });
    }

    const client = await Client.findById(clientId);
    if (!client) return res.status(404).json({ error: "Client not found" });

    const sub = await Subscription.create({ clientId, url, events, active: true });
    res.status(201).json({ success: true, subscription: sub });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// List all subscriptions
router.get("/", async (_req, res) => {
  const subs = await Subscription.find().populate("clientId");
  res.json(subs);
});

// Update subscription
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { url, active, events } = req.body;
  const updates = {};
  if (url) updates.url = url;
  if (typeof active === "boolean") updates.active = active;
  if (Array.isArray(events)) updates.events = events;

  const updatedSub = await Subscription.findByIdAndUpdate(id, updates, { new: true });
  res.json(updatedSub);
});

// Delete subscription
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  await Subscription.findByIdAndDelete(id);
  res.json({ success: true });
});

export default router;
