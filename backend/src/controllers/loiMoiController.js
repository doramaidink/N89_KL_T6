const LoiMoi = require("../models/LoiMoi");
const Nhom = require("../models/Nhom");
const DoiTac = require("../models/DoiTac");

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

        // const doiTac = await DoiTac.findOne({
        //     nguoiDung: doiTacId
        // });

        // if (!doiTac) {
        //     return res.json({ loiMois: [] });
        // }

        // dùng đúng ID
        let loiMois = await LoiMoi.find({
            doiTacId: doiTacId,
            trangThai: "cho_xac_nhan"
        })
            .populate({
                path: "nhomId",
                populate: [
                    {
                        path: "thanhVien.user",
                        select: "hoTen email image"
                    },
                    {
                        path: "diaDiem",
                        select: "tenDiaDiem diaChi image"
                    }
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

        //  tránh trùng thành viên
        if (!nhom.thanhVien.includes(loiMoi.doiTacId)) {
            const doiTac = await DoiTac.findById(loiMoi.doiTacId);

            if (!doiTac) {
                return res.status(404).json({ message: "Không tìm thấy đối tác" });
            }

            // 🔥 lấy userId từ đối tác
            const userId = doiTac.nguoiDung;

            if (!nhom.thanhVien.includes(userId)) {
                const exists = nhom.thanhVien.some(
                    tv => tv.user.toString() === userId.toString()
                );

                if (!exists) {
                    nhom.thanhVien.push({
                        user: userId,
                        role: "huong_dan_vien"
                    });

                    await nhom.save();
                }
            }
            await nhom.save();
        }

        //  xóa lời mời
        // await LoiMoi.findByIdAndDelete(loiMoiId);
        loiMoi.trangThai = "da_chap_nhan";
        await loiMoi.save();

        res.json({ message: "Đã tham gia nhóm thành công", nhomId: nhom._id });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Lỗi server" });
    }
};

exports.rejectLoiMoi = async (req, res) => {
    try {
        const { loiMoiId } = req.params;

        // tìm lời mời
        const loiMoi = await LoiMoi.findById(loiMoiId);

        // check tồn tại
        if (!loiMoi) {
            return res.status(404).json({ message: "Không tìm thấy lời mời" });
        }

        // update trạng thái
        loiMoi.trangThai = "da_tu_choi";
        await loiMoi.save();

        res.json({ message: "Đã từ chối lời mời" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Lỗi server" });
    }
};

//Thống kê lời mời đối tác
exports.getThongKe = async (req, res) => {
    try {
        const { doiTacId } = req.query;

        const moi = await LoiMoi.countDocuments({
            doiTacId: doiTacId,
            trangThai: "cho_xac_nhan"
        });

        const daChapNhan = await LoiMoi.countDocuments({
            doiTacId: doiTacId,
            trangThai: "da_chap_nhan"
        });

        res.json({
            moi,
            daChapNhan
        });

    } catch (err) {
        res.status(500).json({ message: "Lỗi server" });
    }
};