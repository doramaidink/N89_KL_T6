const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const LoiMoiSchema = new Schema({
    nhomId: { type: Schema.Types.ObjectId, ref: "Nhom" },
    doiTacId: { type: Schema.Types.ObjectId, ref: "DoiTac" }, // HDV nhận lời mời
    nguoiGuiId: { type: Schema.Types.ObjectId, ref: "NguoiDung" },
    trangThai: {
        type: String,
        enum: ['cho_xac_nhan', 'da_chap_nhan', 'da_tu_choi'],
        default: 'cho_xac_nhan'
    },
    loaiLoiMoi: { type: String, enum: ['co_nhom', 'tao_moi'] }
}, { timestamps: true });

module.exports = mongoose.model("LoiMoi", LoiMoiSchema);