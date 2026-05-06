const Nhom = require("../models/Nhom");
const Chat = require("../models/Chat");
const Checkin = require("../models/Checkin");
const ThanhToan = require("../models/ThanhToan");
const LichSu = require("../models/LichSu");
const mongoose = require("mongoose");

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

    // Tạo nhóm
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

    // Lấy nhóm theo địa điểm
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
                await nhom.save();// Lưu nhóm sau khi thêm thành viên mới 

                const io = req.app.get("io");
                io.to(id).emit("update_member_list");
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
                .sort({ createdAt: -1 })
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

            const isHDV = role === "hdv";

            // chỉ tìm theo nhomId
            let record = await Checkin.findOne({ nhomId });

            // nếu chưa có → tạo mới
            if (!record) {
                record = new Checkin({
                    nhomId,
                    status: "checking"
                });
            }

            // USER CHECKIN
            if (!isHDV) {
                if (record.userId) {
                    return res.status(400).json({ message: "Bạn đã checkin rồi" });
                }

                record.userId = userId;
                record.userCode = code;
                record.checkinAt = new Date();

                // UAN TRỌNG
                record.checkinLocationUser = { lat, lng };
            }

            // HDV CHECKIN
            if (isHDV) {
                if (record.hdvId) {
                    return res.status(400).json({ message: "HDV đã checkin rồi" });
                }

                record.hdvId = userId;
                record.hdvCode = code;

                // ✅ THÊM DÒNG NÀY
                record.checkinLocationHdv = { lat, lng };
            }

            await record.save();

            res.json({
                message: "Checkin OK",
                record
            });

        } catch (err) {
            console.log("CHECKIN ERROR:", err);
            res.status(500).json({ message: "Lỗi checkin", err });
        }
    }

    async checkout(req, res) {
        console.log("CHECKOUT HIT");

        try {
            const { nhomId, userId, role, code, lat, lng } = req.body;

            console.log("REQ DATA:", { nhomId, userId, role });

             
            const record = await Checkin.findOne({ nhomId });

            if (!record) {
                return res.status(404).json({ message: "Không tìm thấy bản ghi checkin" });
            }

            // HDV
            if (role === "hdv") {
                if (!record.hdvCode || record.hdvCode !== code) {
                    return res.status(400).json({ message: "Sai mã HDV" });
                }

                record.checkoutLocationHdv = { lat, lng };
            }

            // USER
            else {
                if (!record.userCode || record.userCode !== code) {
                    return res.status(400).json({ message: "Sai mã User" });
                }

                record.checkoutLocationUser = { lat, lng };
            }

            record.checkoutAt = new Date();
            record.status = "done";

            await record.save();

            res.json({ message: "Checkout OK", record });

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
                    populate: [
                        {
                            path: "diaDiem",
                            select: "tenDiaDiem"
                        },
                        {
                            path: "thanhVien.user",
                            select: "hoTen"
                        }
                    ]

                })

            res.json({
                data: list
            });
        } catch (err) {
            console.log("ADMIN ERROR:", err);
            res.status(500).json({ message: "Lỗi admin" });
        }
    }

    async getLichSu(req, res) {
        try {
            const { userId } = req.params;

            const list = await Checkin.find({
                userId: new mongoose.Types.ObjectId(userId),
                status: "done"
            })
                .populate("hdvId", "hoTen")
                .populate({
                    path: "nhomId",
                    populate: {
                        path: "diaDiem",
                        select: "tenDiaDiem image slug"
                    }
                });

            console.log("CHECKIN LIST:", list);

             
            const result = await Promise.all(
                list.map(async (item) => {
                    const payment = await ThanhToan.findOne({
                        nhomId: item.nhomId?._id,
                        nguoiGuiId: item.userId
                    });

                    console.log("PAYMENT:", payment);

                    return {
                        ...item._doc,
                        amount: payment?.amount || 0
                    };
                })
            );

            res.json({ data: result });

        } catch (err) {
            console.log(err);
            res.status(500).json({ message: "Lỗi lấy lịch sử" });
        }
    }
}

module.exports = new nhomController();