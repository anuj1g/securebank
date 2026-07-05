const mongoose = require("mongoose");


const counterSchema = new mongoose.Schema(
  {
    name: { type: String, required: true }, 
    category: { type: mongoose.Schema.Types.ObjectId, ref: "ServiceCategory", required: true },
    assignedStaff: { type: mongoose.Schema.Types.ObjectId, ref: "Staff", default: null },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Counter", counterSchema);
