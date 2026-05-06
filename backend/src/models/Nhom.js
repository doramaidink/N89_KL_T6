const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Nhom = new Schema(
    {
        ten: { type: String, required: true },
        moTa: { type: String },
        diaDiem: { type: mongoose.Schema.Types.ObjectId, ref: "DiaDiem" },
        nguoiTao: {
            id: { type: mongoose.Schema.Types.ObjectId, ref: "NguoiDung" },
            hoTen: String,
        },
        // Thêm mảng thành viên để quản lý người tham gia
        thanhVien: [
            {
                user: { type: mongoose.Schema.Types.ObjectId, ref: "NguoiDung" },
                role: { type: String, enum: ["truong_nhom", "huong_dan_vien", "thanh_vien"], default: "thanh_vien" }
            }
        ],
        soLuong: { type: Number },
        doKho: { type: String },
        startTime: Date,
        endTime: Date,

        // Lưu dữ liệu từ Step 2: Lịch trình
        lichTrinh: {
            timeStart: { type: String, default: "08:00 AM" },
            location: { type: String, default: "" },
            note: { type: String, default: "" },
            timeEnd: { type: String, default: "05:00 PM" }
        },

        // Lưu dữ liệu từ Step 3: An toàn & Liên hệ
        lienHeKhanCap: {
            hoTen: String,
            sdt: String
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Nhom", Nhom);