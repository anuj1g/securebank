const express = require("express");
const router = express.Router();
const Counter = require("../models/Counter");

router.get("/", async (req, res) => {
  try {
    const counters = await Counter.find().populate("category");
    res.json(counters);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const counter = await Counter.create(req.body);
    res.status(201).json(counter);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});



router.get("/my-counter/:staffId", async (req, res) => {
  try {
    const counter = await Counter.findOne({ assignedStaff: req.params.staffId }).populate("category");
    if (!counter) return res.status(404).json({ message: "No counter assigned to this staff member" });
    res.json(counter);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
