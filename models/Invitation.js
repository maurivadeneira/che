const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const invitationSchema = new Schema({
  fromKit: { type: Schema.Types.ObjectId, ref: "Kit", required: true },
  code: { type: String, required: true, unique: true },
  email: { type: String },
  status: { 
    type: String, 
    enum: ["pending", "sent", "accepted", "expired"], 
    default: "pending" 
  },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date },
  acceptedAt: { type: Date }
});

module.exports = mongoose.model("Invitation", invitationSchema);
