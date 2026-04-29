const mongoose = require("mongoose");

const ThanhToanSchema = new mongoose.Schema(
  {
    orderCode: { type: Number, required: true, unique: true },

    guideName: { type: String, default: "" },
    amount: { type: Number, required: true },

    status: {
      type: String,
      enum: ["pending", "paid", "cancelled", "failed"],
      default: "pending",
    },

    paymentLinkId: { type: String, default: "" },
    reference: { type: String, default: "" },
    transactionDateTime: { type: String, default: "" },

    doiTacId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DoiTac",
      default: null,
    },

    nguoiGuiId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "NguoiDung",
      default: null,
    },

    nhomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Nhom",
      default: null,
    },

    loaiLoiMoi: {
      type: String,
      enum: ["co_nhom", "tao_moi"],
      default: "tao_moi",
    },

    daTaoLoiMoi: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ThanhToan", ThanhToanSchema);