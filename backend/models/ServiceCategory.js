const mongoose = require("mongoose");



const serviceCategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    icon: { type: String, default: "briefcase" }, 
    avgServiceTimeMinutes: { type: Number, default: 5 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ServiceCategory", serviceCategorySchema);
