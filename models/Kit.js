const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const kitSchema = new Schema({
  owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
  type: { type: String, required: true, default: "HerejiaEconomica" },
  level: { type: Number, required: true },
  parentKit: { type: Schema.Types.ObjectId, ref: "Kit" },
  invitationCode: { type: String, unique: true },
  maxInvitations: { type: Number, default: 6 },
  active: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Kit", kitSchema);
