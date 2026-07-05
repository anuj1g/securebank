const express = require("express");
const router = express.Router();

const QueueEntry = require("../models/QueueEntry");
const ServiceCategory = require("../models/ServiceCategory");
const { generateToken, getQueueSnapshot } = require("../utils/queueHelpers");
const { broadcastQueueUpdate } = require("../socket/socketHandler");


router.post("/join", async (req, res) => {
  try {
    const { customerName, phone, categoryId } = req.body;

    if (!customerName || !phone || !categoryId) {
      return res.status(400).json({ message: "customerName, phone and categoryId are required" });
    }

    const category = await ServiceCategory.findById(categoryId);
    if (!category) return res.status(404).json({ message: "Service category not found" });

    const tokenNumber = await generateToken(category);

    const entry = await QueueEntry.create({
      tokenNumber,
      customerName,
      phone,
      category: categoryId,
    });

    await broadcastQueueUpdate(categoryId);

    res.status(201).json(entry);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});



router.get("/status/:tokenId", async (req, res) => {
  try {
    const entry = await QueueEntry.findById(req.params.tokenId).populate("category");
    if (!entry) return res.status(404).json({ message: "Token not found" });

    const snapshot = await getQueueSnapshot(entry.category._id);
    const mine = snapshot.find((s) => String(s.id) === String(entry._id));

    res.json({
      tokenNumber: entry.tokenNumber,
      status: entry.status,
      position: mine ? mine.position : null,
      estimatedWaitMinutes: mine ? mine.estimatedWaitMinutes : 0,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.get("/category/:categoryId", async (req, res) => {
  try {
    const snapshot = await getQueueSnapshot(req.params.categoryId);
    res.json(snapshot);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.post("/call-next", async (req, res) => {
  try {
    const { categoryId, counterId } = req.body;

    const next = await QueueEntry.findOne({ category: categoryId, status: "waiting" }).sort({ joinedAt: 1 });
    if (!next) return res.status(404).json({ message: "No one is waiting in this queue" });

    next.status = "called";
    next.calledAt = new Date();
    if (counterId) next.counter = counterId;
    await next.save();

    await broadcastQueueUpdate(categoryId);

    res.json(next);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.post("/:id/serve", async (req, res) => {
  try {
    const entry = await QueueEntry.findById(req.params.id);
    if (!entry) return res.status(404).json({ message: "Entry not found" });

    entry.status = "served";
    entry.servedAt = new Date();
    await entry.save();

    await broadcastQueueUpdate(entry.category);

    res.json(entry);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.post("/:id/no-show", async (req, res) => {
  try {
    const entry = await QueueEntry.findById(req.params.id);
    if (!entry) return res.status(404).json({ message: "Entry not found" });

    entry.status = "no-show";
    await entry.save();

    await broadcastQueueUpdate(entry.category);

    res.json(entry);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Simple history/stats for a category, used by the staff "History" page.
router.get("/category/:categoryId/history", async (req, res) => {
  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const entries = await QueueEntry.find({
      category: req.params.categoryId,
      status: { $in: ["served", "no-show"] },
      joinedAt: { $gte: startOfDay },
    }).sort({ servedAt: -1 });

    res.json({
      servedCount: entries.filter((e) => e.status === "served").length,
      entries,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
