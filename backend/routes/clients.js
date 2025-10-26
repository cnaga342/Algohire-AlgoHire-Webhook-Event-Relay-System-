import express from "express";
import { Client } from "../models/Client.js";

const router = express.Router();

// GET all clients
router.get("/", async (_req, res) => {
  try {
    const clients = await Client.find();
    res.json(clients);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST create a new client
router.post("/", async (req, res) => {
  try {
    const { name, apiKey, secret } = req.body;
    if (!name || !apiKey || !secret) {
      return res.status(400).json({ error: "name, apiKey, and secret are required" });
    }

    const newClient = await Client.create({ name, apiKey, secret });
    res.status(201).json(newClient);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
