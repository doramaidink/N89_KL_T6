const mongoose = require("mongoose");

const lichSuSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    nhomId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Nhom"
    },
    hdvId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    amount: {
        type: Number,
        default: 0
    },
    checkinAt: {
        type: Date
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("LichSu", lichSuSchema);