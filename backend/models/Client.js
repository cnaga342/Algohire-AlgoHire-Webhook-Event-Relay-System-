import mongoose from "mongoose";

const clientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  apiKey: { type: String, required: true },
  secret: { type: String, required: true },
});

export const Client = mongoose.model("Client", clientSchema);
