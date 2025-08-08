const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const activationSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  kit: { type: Schema.Types.ObjectId, ref: "Kit", required: true },
  donationsMade: [{ type: Schema.Types.ObjectId, ref: "Donation" }],
  status: { 
    type: String, 
    enum: ["pending", "partial", "complete"], 
    default: "pending" 
  },
  startedAt: { type: Date, default: Date.now },
  completedAt: { type: Date }
});

module.exports = mongoose.model("Activation", activationSchema);
