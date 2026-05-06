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
    hinhAnh: {
        type: [String],
        default: [],
    },
    thoiGian: { type: Date, default: Date.now }
});
 
module.exports = mongoose.model("Chat", ChatSchema);