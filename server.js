import express from "express";
import dotenv from "dotenv";
import { MongoClient } from "mongodb";
import cors from "cors";
import logger from "./middleware/logger.js";
import serveStatic from "./middleware/static.js";
import lessonsRoutes from "./routes/lessons.js";
import ordersRoutes from "./routes/orders.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Prevent empty JSON errors on GET
app.use((req, res, next) => {
  if (req.method === "GET" && req.headers['content-type']?.includes("application/json")) {
    req.body = {};
  }
  next();
});

app.use(logger);
app.use("/static", serveStatic);

// 🔹 Root route (fixes "Not Found")
app.get("/", (req, res) => {
  res.send("Backend API is running 🚀");
});

// 🔹 Health check (for Render debugging)
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

    // Retry after 5 seconds
    setTimeout(start, 5000);
  }
}

start();
