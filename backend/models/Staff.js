const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const staffSchema = new mongoose.Schema(
  {
    staffId: { type: String, required: true, unique: true }, 
    name: { type: String, required: true },
    password: { type: String, required: true }, // stored hashed, never plain text
    role: { type: String, enum: ["staff", "admin"], default: "staff" },
  },
  { timestamps: true }
);



staffSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

staffSchema.methods.comparePassword = function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

module.exports = mongoose.model("Staff", staffSchema);
