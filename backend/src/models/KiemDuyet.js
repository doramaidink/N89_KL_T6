const mongoose = require("mongoose");

const KiemDuyetSchema = new mongoose.Schema(
  {
    nguoiDung: { type: mongoose.Schema.Types.ObjectId, ref: "NguoiDung" },

    loaiNoiDung: {
      type: String,
      enum: ["danhGia", "group", "binhLuan"],
      required: true,
    },

    noiDungId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },

    noiDungGoc: {
      type: String,
      default: "",
    },

    trangThai: {
      type: String,
      enum: ["an_toan", "canh_bao", "vi_pham", "cho_admin_duyet"],
      default: "an_toan",
    },

    hanhDong: {
      type: String,
      enum: ["cho_phep", "chan", "an_noi_dung", "khoa_tai_khoan"],
      default: "cho_phep",
    },

    lyDo: {
      type: String,
      default: "",
    },

    diemNguyHiem: {
      type: Number,
      default: 0,
    },

    ketQuaAI: {
      type: Object,
      default: {},
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("KiemDuyet", KiemDuyetSchema);