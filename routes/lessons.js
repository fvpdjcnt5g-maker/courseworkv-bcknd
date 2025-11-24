import express from "express";
import { ObjectId } from "mongodb";

const router = express.Router();

// GET all lessons
router.get("/", async (req, res) => {
  try {
    const db = req.app.locals.db;
    const lessons = await db.collection("lessons").find({}).toArray();
    res.json(lessons);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch lessons" });
  }
});

// PUT update lesson spaces
router.put("/:id", async (req, res) => {
  const db = req.app.locals.db;
  const { id } = req.params;
  const updates = req.body;

  // ✅ Validate request body
  if (!updates || Object.keys(updates).length === 0) {
    return res.status(400).json({ error: "Request body is empty or invalid JSON" });
  }

  try {
    const result = await db.collection("lessons").updateOne(
      { _id: new ObjectId(id) },
      { $set: updates }
    );
    res.json({ modified: result.modifiedCount });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
