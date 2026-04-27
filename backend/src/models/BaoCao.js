const mongoose = require("mongoose");

const BaoCaoSchema = new mongoose.Schema(
  {
    nguoiDung: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "NguoiDung",
      required: true,
    },

    loaiBaoCao: {
      type: String,
      enum: ["An toàn hành trình", "Gian lận",  "Lừa đảo","Quấy rối","Chương trình khuyến mãi","Thanh toán","Đóng góp ý kiến","Khiếu nại", "Khác"],
      required: true,
    },

    viTri: {
      type: String,
      default: "",
    },

    moTa: {
      type: String,
      required: true,
    },

    hinhAnh: {
      type: String,
      default: "",
    },

    trangThai: {
      type: String,
      enum: ["dang_xu_ly", "da_giai_quyet", "tu_choi"],
      default: "dang_xu_ly",
    },

    phanHoiAdmin: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("BaoCao", BaoCaoSchema);