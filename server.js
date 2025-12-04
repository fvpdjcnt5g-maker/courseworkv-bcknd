import express from "express";
import dotenv from "dotenv";
import { MongoClient } from "mongodb";
import cors from "cors";
import logger from "./middleware/logger.js";
import lessonsRoutes from "./routes/lessons.js";
import ordersRoutes from "./routes/orders.js";
import path from "path";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(logger);

app.use((req, res, next) => {
  res.set("Cache-Control", "no-store");
  next();
});

// Serve public folder directly
app.use(express.static(path.join(process.cwd(), "public")));

// Root route
app.get("/", (req, res) => {
  res.send("Backend API is running 🚀");
});

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", mongo: client.topology?.s?.state || "unknown" });
});

// MongoDB Atlas connection
const client = new MongoClient(process.env.MONGO_URI, {
  tls: true,
  tlsInsecure: false,
  serverSelectionTimeoutMS: 10000,
});

async function start() {
  try {
    await client.connect();
    console.log("✅ MongoDB connected successfully");

    const db = client.db("courses");
    app.locals.db = db;

    // Routes
    app.use("/lessons", lessonsRoutes);
    app.use("/orders", ordersRoutes);

    const port = process.env.PORT || 3000;
    app.listen(port, () => console.log(`🚀 Server running on port ${port}`));
  } catch (err) {
    console.error("❌ Database connection error:", err);
    setTimeout(start, 5000);
  }
}

start();
