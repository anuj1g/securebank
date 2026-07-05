const mongoose = require("mongoose");


const queueEntrySchema = new mongoose.Schema(
  {
    tokenNumber: { type: String, required: true }, 
    customerName: { type: String, required: true },
    phone: { type: String, required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "ServiceCategory", required: true },
    counter: { type: mongoose.Schema.Types.ObjectId, ref: "Counter", default: null },
    status: {
      type: String,
      enum: ["waiting", "called", "served", "no-show"],
      default: "waiting",
    },
    joinedAt: { type: Date, default: Date.now },
    calledAt: { type: Date, default: null },
    servedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("QueueEntry", queueEntrySchema);
