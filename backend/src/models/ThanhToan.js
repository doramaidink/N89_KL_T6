const mongoose = require("mongoose");

const ThanhToanSchema = new mongoose.Schema(
  {
    orderCode: { type: Number, required: true, unique: true },
    guideName: { type: String },
    amount: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "paid", "cancelled", "failed"],
      default: "pending",
    },
    paymentLinkId: { type: String, default: "" },
    reference: { type: String, default: "" },
    transactionDateTime: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ThanhToan", ThanhToanSchema);