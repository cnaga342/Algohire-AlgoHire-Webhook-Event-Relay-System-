import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema({
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: "Client", required: true },
  url: { type: String, required: true },
  events: [{ type: String }],
  active: { type: Boolean, default: true },
});

export const Subscription = mongoose.model("Subscription", subscriptionSchema);
