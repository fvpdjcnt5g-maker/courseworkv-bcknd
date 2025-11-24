import express from "express";
import dotenv from "dotenv";
import { MongoClient } from "mongodb";
import cors from "cors";
import logger from "./middleware/logger.js";      // your logger middleware
import serveStatic from "./middleware/static.js"; // your static file middleware
import lessonsRoutes from "./routes/lessons.js";
import ordersRoutes from "./routes/orders.js";

dotenv.config();

const app = express();

// 🔹 Allow frontend to call backend
app.use(cors());

// 🔹 Parse incoming JSON
app.use(express.json());

// 🔹 Optional: prevent crashes on empty JSON GET requests
app.use((req, res, next) => {
  if (req.method === "GET" && req.headers['content-type']?.includes('application/json')) {
    req.body = {};
  }
  next();
});

// 🔹 Logger middleware
app.use(logger);

// 🔹 Serve static files
app.use("/static", serveStatic);

// 🔹 MongoDB Atlas connection
const client = new MongoClient(process.env.MONGO_URI);

async function start() {
  try {
    await client.connect();
    const db = client.db("courses"); // your Atlas DB name
    app.locals.db = db;

    // 🔹 Routes
    app.use("/lessons", lessonsRoutes);
    app.use("/orders", ordersRoutes);

    const port = process.env.PORT || 3000;
    app.listen(port, () => console.log(`Server running on port ${port}`));
  } catch (err) {
    console.error("Database connection error:", err);
  }
}

start();
