import mongoose from "mongoose";

const deliverySchema = new mongoose.Schema({
  eventId: { type: String, required: true },
  subscriptionId: { type: mongoose.Schema.Types.ObjectId, ref: "Subscription", required: true },
  attempt: { type: Number, default: 0 },
  status: { type: String, enum: ["queued", "success", "failed"], default: "queued" },
  responseCode: Number,
  responseBody: String,
  error: String,
  createdAt: { type: Date, default: Date.now },
});

export const Delivery = mongoose.model("Delivery", deliverySchema);
