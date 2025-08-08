const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const donationSchema = new Schema({
  fromUser: { type: Schema.Types.ObjectId, ref: "User", required: true },
  toUser: { type: Schema.Types.ObjectId, ref: "User", required: true },
  amount: { type: Number, required: true },
  currency: { type: String, default: "COP" },
  status: { 
    type: String, 
    enum: ["pending", "confirmed", "rejected"], 
    default: "pending" 
  },
  paymentMethod: { type: String },
  paymentProof: { type: String },
  relatedKit: { type: Schema.Types.ObjectId, ref: "Kit" },
  createdAt: { type: Date, default: Date.now },
  confirmedAt: { type: Date }
});

module.exports = mongoose.model("Donation", donationSchema);
