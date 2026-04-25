const LoiMoi = require("../models/LoiMoi");
const Nhom = require("../models/Nhom");

exports.taoLoiMoi = async (req, res) => {
    try {
        const { nhomId, doiTacId, nguoiGuiId, loaiLoiMoi } = req.body;

        const loiMoi = await LoiMoi.create({
            nhomId,
            doiTacId,
            nguoiGuiId,
            loaiLoiMoi,
        });

        res.status(201).json({ success: true, loiMoi });
    } catch (error) {
        res.status(500).json({ message: "Lỗi tạo lời mời" });
    }
};

exports.getLoiMoi = async (req, res) => {
    try {
        const { doiTacId } = req.query;

        let loiMois = await LoiMoi.find({ doiTacId })
            .populate({
                path: "nhomId",
                populate: [
                    { path: "nguoiTao", select: "hoTen" },
                    { path: "diaDiem", select: "tenDiaDiem" }
                ]
            })
            .populate("doiTacId", "hoTen image");

        // LOẠI TRÙNG THEO NHÓM
        const unique = Object.values(
            loiMois.reduce((acc, item) => {
                acc[item.nhomId?._id] = item;
                return acc;
            }, {})
        );

        res.json({ loiMois: unique });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Lỗi server" });
    }
};

exports.acceptLoiMoi = async (req, res) => {
    try {
        const { loiMoiId } = req.params;

        const loiMoi = await LoiMoi.findById(loiMoiId);

        if (!loiMoi) {
            return res.status(404).json({ message: "Không tìm thấy lời mời" });
        }

        const nhom = await Nhom.findById(loiMoi.nhomId);

        if (!nhom) {
            return res.status(404).json({ message: "Không tìm thấy nhóm" });
        }

        // ❗ tránh trùng thành viên
        if (!nhom.thanhVien.includes(loiMoi.doiTacId)) {
            nhom.thanhVien.push(loiMoi.doiTacId);
            await nhom.save();
        }

        //  xóa lời mời
        await LoiMoi.findByIdAndDelete(loiMoiId);

        res.json({ message: "Đã tham gia nhóm thành công", nhomId: nhom._id });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Lỗi server" });
    }
};

exports.rejectLoiMoi = async (req, res) => {
    try {
        const { loiMoiId } = req.params;

        await LoiMoi.findByIdAndDelete(loiMoiId);

        res.json({ message: "Đã từ chối lời mời" });

    } catch (err) {
        res.status(500).json({ message: "Lỗi server" });
    }
};