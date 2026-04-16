const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DanhGiaDiaDiem = new Schema(
  {
    diaDiem: {
      type: Schema.Types.ObjectId,
      ref: "DiaDiem",
      required: true,
    },
    nguoiDung: {
      type: Schema.Types.ObjectId,
      ref: "NguoiDung",
      required: true,
    },
    soSao: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    noiDung: {
      type: String,
      trim: true,
      default: "",
    },
    hinhAnh: [
      {
        type: String,
      },
    ],
    trangThai: {
      type: String,
      enum: ["hien", "an"],
      default: "hien",
    },
  },
  {
    timestamps: true,
  }
);

// mỗi user chỉ được 1 đánh giá / 1 địa điểm
DanhGiaDiaDiem.index({ diaDiem: 1, nguoiDung: 1 }, { unique: true });

module.exports = mongoose.model("DanhGiaDiaDiem", DanhGiaDiaDiem);