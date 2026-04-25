const mongoose = require("mongoose");

const ChatSchema = new mongoose.Schema({
    nhomId: { type: mongoose.Schema.Types.ObjectId, ref: "Nhom" },
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: "NguoiDung" },
    senderRole: {
        type: String,
        default: "user"
    },
    hoTen: String,
    noiDung: String,
    thoiGian: { type: Date, default: Date.now }
});

// Sửa lại dòng này (Xóa chữ .now)
module.exports = mongoose.model("Chat", ChatSchema);