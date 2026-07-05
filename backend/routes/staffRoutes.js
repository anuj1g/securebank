const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const Staff = require("../models/Staff");

router.post("/login", async (req, res) => {
  try {
    const { staffId, password } = req.body;

    const staff = await Staff.findOne({ staffId });
    if (!staff) return res.status(401).json({ message: "Invalid staff ID or password" });

    const isMatch = await staff.comparePassword(password);
    if (!isMatch) return res.status(401).json({ message: "Invalid staff ID or password" });

    const token = jwt.sign(
      { id: staff._id, staffId: staff.staffId, role: staff.role },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );

    res.json({
      token,
      staff: { id: staff._id, staffId: staff.staffId, name: staff.name, role: staff.role },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
