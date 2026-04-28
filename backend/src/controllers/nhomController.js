const Nhom = require("../models/Nhom");
const Chat = require("../models/Chat");
const Checkin = require("../models/Checkin");

function calcDistance(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;

    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(lat1 * Math.PI / 180) *
        Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) ** 2;

    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
class nhomController {

    // ✅ Tạo nhóm
    async taoNhom(req, res) {
        try {
            const data = req.body;

            const nhom = await Nhom.create({
                ten: data.ten,
                moTa: data.moTa,
                diaDiem: data.diaDiemId,
                nguoiTao: data.nguoiTao,
                soLuong: data.soLuong,
                doKho: data.doKho,
                startTime: data.startTime,
                endTime: data.endTime,
                thanhVien: [
                    {
                        user: data.nguoiTao.id,
                        role: "truong_nhom"
                    }
                ],

                lichTrinh: data.lichTrinh,
                lienHeKhanCap: data.lienHeKhanCap
            });

            return res.status(201).json({
                message: "Tạo nhóm thành công",
                nhom,
            });
        } catch (err) {
            console.log(err);
            return res.status(500).json({ message: "Lỗi server" });
        }
    }

    // ✅ Lấy nhóm theo địa điểm
    async layNhomTheoDiaDiem(req, res) {
        try {
            const { diaDiemId } = req.params;

            const nhoms = await Nhom.find({ diaDiem: diaDiemId }).sort({
                createdAt: -1,
            });

            return res.status(200).json({ nhoms });
        } catch (err) {
            console.log(err);
            return res.status(500).json({ message: "Lỗi server" });
        }
    }

    // Thêm vào class nhomController
    // nhomController.js
    async layChiTietNhom(req, res) {
        try {
            const { id } = req.params;
            // Populate thanhVien để lấy hoTen và image của từng người
            const nhom = await Nhom.findById(id)
                .populate("nguoiTao.id", "hoTen image")
                .populate("thanhVien.user", "hoTen image")
                .populate("diaDiem"); //lấy thông tin các thành viên

            const tinNhan = await Chat.find({ nhomId: id }).sort({ thoiGian: 1 });

            return res.status(200).json({ nhom, tinNhan });
        } catch (err) {
            return res.status(500).json({ message: "Lỗi lấy chi tiết nhóm" });
        }
    }

    async thamGiaNhom(req, res) {
        try {
            const { id } = req.params; // ID của nhóm
            const { userId } = req.body; // ID người dùng muốn tham gia

            const nhom = await Nhom.findById(id);
            if (!nhom) return res.status(404).json({ message: "Không tìm thấy nhóm" });

            // Kiểm tra xem đã tham gia chưa để tránh trùng lặp
            const exists = nhom.thanhVien.some(
                tv => tv.user.toString() === userId.toString()
            );

            if (!exists) {
                nhom.thanhVien.push({
                    user: userId,
                    role: "thanh_vien"
                });
            }

            return res.status(200).json({ message: "Tham gia nhóm thành công", nhom });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: "Lỗi server" });
        }
    }
    async layNhomCuaToi(req, res) {
        try {
            const { userId } = req.params;
            const nhoms = await Nhom.find({
                $or: [
                    { "nguoiTao.id": userId },
                    { "thanhVien.user": userId }
                ]
            })
                .populate("diaDiem")
                .populate("nguoiTao.id", "hoTen");

            return res.status(200).json({ nhoms });
        } catch (error) {
            return res.status(500).json({ message: "Lỗi server" });
        }
    }

    async checkin(req, res) {
        try {
            const { nhomId, userId, role, lat, lng, code } = req.body;

            if (!nhomId || !userId || lat == null || lng == null || !code) {
                return res.status(400).json({ message: "Thiếu dữ liệu" });
            }

            let record = await Checkin.findOne({ nhomId });

            if (!record) {
                record = new Checkin({
                    nhomId,
                    checkinAt: new Date(),
                    checkinLocation: { lat, lng }
                });
            }

            if (role === "hdv") {
                record.hdvId = userId;
                record.hdvCode = code;
            } else {
                record.userId = userId;
                record.userCode = code;
            }

            await record.save();

            res.json({ message: "Checkin OK", record });

        } catch (err) {
            console.log("CHECKIN ERROR:", err);
            res.status(500).json({ message: "Lỗi checkin", err });
        }
    }

    async checkout(req, res) {
        try {
            const { nhomId, role, code, lat, lng } = req.body;

            const record = await Checkin.findOne({ nhomId });

            if (!record) {
                return res.status(404).json({ message: "Chưa checkin" });
            }

            if (role === "hdv") {
                if (record.hdvCode !== code) {
                    return res.status(400).json({ message: "Sai mã HDV" });
                }
            } else {
                if (record.userCode !== code) {
                    return res.status(400).json({ message: "Sai mã User" });
                }
            }

            record.checkoutAt = new Date();
            record.checkoutLocation = { lat, lng };
            record.status = "done";

            await record.save();

            res.json({ message: "Checkout OK" });

        } catch (err) {
            console.log("CHECKOUT ERROR:", err);
            res.status(500).json({ message: "Lỗi checkout", err });
        }
    }

    async getCheckinAdmin(req, res) {
        try {
            const list = await Checkin.find()
                .populate("userId", "hoTen")
                .populate("hdvId", "hoTen")
                .populate({
                    path: "nhomId",
                    populate: {
                        path: "diaDiem",
                        select: "tenDiaDiem"
                    }
                })

            res.json({
                data: list
            });
        } catch (err) {
            console.log("ADMIN ERROR:", err);
            res.status(500).json({ message: "Lỗi admin" });
        }
    }
}

module.exports = new nhomController();