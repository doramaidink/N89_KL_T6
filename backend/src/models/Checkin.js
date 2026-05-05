const mongoose = require("mongoose");

const checkinSchema = new mongoose.Schema({
    nhomId: { type: mongoose.Schema.Types.ObjectId, ref: "Nhom" },

    userId: { type: mongoose.Schema.Types.ObjectId, ref: "NguoiDung" },
    hdvId: { type: mongoose.Schema.Types.ObjectId, ref: "NguoiDung" },

    userCode: String,
    hdvCode: String,

    checkinAt: Date,
    checkoutAt: Date,

    checkinLocationUser: {
        lat: Number,
        lng: Number
    },

    checkoutLocationUser: {
        lat: Number,
        lng: Number
    },

    checkinLocationHdv: {
        lat: Number,
        lng: Number
    },

    checkoutLocationHdv: {
        lat: Number,
        lng: Number
    },

    status: {
        type: String,
        default: "checking"
    }
});

module.exports = mongoose.model("Checkin", checkinSchema);