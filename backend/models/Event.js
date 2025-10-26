import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
  eventId: { type: String, unique: true },
  type: { type: String, required: true },
  payload: { type: Object, required: true },
  source: { type: String, default: "internal" },
  createdAt: { type: Date, default: Date.now },
});

export const Event = mongoose.model("Event", eventSchema);
