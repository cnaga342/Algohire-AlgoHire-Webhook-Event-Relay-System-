import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import eventsRouter from "./routes/events.js";
import webhooksRouter from "./routes/webhooks.js";
import clientsRouter from "./routes/clients.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.use("/webhooks", webhooksRouter);
app.use("/events", eventsRouter);


app.use("/clients", clientsRouter);
const PORT = process.env.PORT || 5000;

connectDB();

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
