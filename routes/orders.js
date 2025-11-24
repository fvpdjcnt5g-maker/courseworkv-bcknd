import express from "express";

const router = express.Router();

// POST new order
router.post("/", async (req, res) => {
  console.log("📩 Incoming order:", req.body); // logs the request body

  const db = req.app.locals.db;
  const order = req.body;

  // validation: check name, phone, and cart array
  if (!order || !order.name || !order.phone || !Array.isArray(order.cart)) {
    console.log("❌ Validation failed:", order);
    return res.status(400).json({ error: "Invalid order format" });
  }

  try {
    const result = await db.collection("orders").insertOne(order);

    console.log("✅ Order inserted:", result.insertedId);

    res.json({
      message: "Order created",
      orderId: result.insertedId
    });

  } catch (err) {
    console.log("🔥 ORDER INSERT ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router; // <--- this is crucial for your server.js import
