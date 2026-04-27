const mongoose = require("mongoose");

const thongBaoSchema = new mongoose.Schema(
    {
        tieuDe: String,
        noiDung: String,

        loai: {
            type: String,
            enum: ["user", "doitac", "all"],
            default: "all"
        },

        nguoiNhan: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "NguoiDung", // optional
        },
        loaiThongBao: {
            type: String,
            enum: ["khuyen_mai", "he_thong", "canh_bao"],
            default: "he_thong"
        },

        daDoc: {
            type: Boolean,
            default: false
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("ThongBao", thongBaoSchema);