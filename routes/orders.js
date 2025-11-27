import express from "express";

const router = express.Router();


router.post("/", async (req, res) => {
  console.log("📩 Incoming order:", req.body); 

  const db = req.app.locals.db;
  const order = req.body;

 
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

export default router; 
