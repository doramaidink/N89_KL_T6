const mongoose = require("mongoose");

const KiemDuyetLogSchema = new mongoose.Schema(
  {
    nguoiDung: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "NguoiDung",
      required: true,
    },

    doiTuong: {
      type: String,
      enum: ["danh_gia", "binh_luan", "bai_dang", "anh"],
      default: "danh_gia",
    },

    doiTuongId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },

    hanhDong: {
      type: String,
      enum: ["cho_phep", "canh_bao", "an_bai", "khoa_tai_khoan"],
      default: "cho_phep",
    },

    mucDo: {
      type: String,
      enum: ["an_toan", "nhe", "vua", "nang"],
      default: "an_toan",
    },

    loaiViPham: {
      type: String,
      default: "",
    },

    lyDo: {
      type: String,
      default: "",
    },

    noiDungGoc: {
      type: String,
      default: "",
    },
n
    ketQuaAI: {
      type: Object,
      default: {},
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("KiemDuyetLog", KiemDuyetLogSchema);b