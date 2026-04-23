const Nhom = require("../models/Nhom");
const Chat = require("../models/Chat");

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
                thanhVien: [data.nguoiTao.id],

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
                .populate("thanhVien", "hoTen image")
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
            if (!nhom.thanhVien.includes(userId)) {
                nhom.thanhVien.push(userId);
                await nhom.save();
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
                    { thanhVien: userId }
                ]
            }).populate("diaDiem");

            return res.status(200).json({ nhoms });
        } catch (error) {
            return res.status(500).json({ message: "Lỗi server" });
        }
    }
}

module.exports = new nhomController();