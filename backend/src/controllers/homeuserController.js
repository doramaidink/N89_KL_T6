const DiaDiem = require('../models/DiaDiem');
const NguoiDung = require('../models/NguoiDung');
const BaoCao = require("../models/BaoCao");

class homeuserController {
  async hienThiTrangChuUser(req, res) {
    try {
      const hotenParam = decodeURIComponent(req.params.hoten).trim();

      const nguoiDung = await NguoiDung.findOne({
        hoTen: { $regex: new RegExp(`^${hotenParam}$`, 'i') }
      }).select('hoTen email image vaiTro');

      if (!nguoiDung) {
        return res.status(404).json({
          message: 'Không tìm thấy người dùng'
        });
      }

      const diaDiemnoibat = await DiaDiem.find({ hot: true });

      return res.status(200).json({
        user: nguoiDung,
        diaDiemnoibat
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: 'Lỗi server khi lấy dữ liệu trang chủ người dùng'
      });
    }
  }
 async layBaoCaoCuaUser(req, res) {
    try {
      const hotenParam = decodeURIComponent(req.params.hoten).trim();

      const nguoiDung = await NguoiDung.findOne({
        hoTen: { $regex: new RegExp(`^${hotenParam}$`, "i") },
      });

      if (!nguoiDung) {
        return res.status(404).json({ message: "Không tìm thấy người dùng" });
      }

      const baoCaos = await BaoCao.find({ nguoiDung: nguoiDung._id })
        .sort({ createdAt: -1 })
        .populate("nguoiDung", "hoTen email image");

      return res.status(200).json({
        user: nguoiDung,
        baoCaos,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "Lỗi server khi lấy báo cáo",
      });
    }
  }

  async taoBaoCao(req, res) {
    try {
      const hotenParam = decodeURIComponent(req.params.hoten).trim();
      const { loaiBaoCao, viTri, moTa } = req.body;

      const nguoiDung = await NguoiDung.findOne({
        hoTen: { $regex: new RegExp(`^${hotenParam}$`, "i") },
      });

      if (!nguoiDung) {
        return res.status(404).json({ message: "Không tìm thấy người dùng" });
      }

      if (!loaiBaoCao || !moTa) {
        return res.status(400).json({
          message: "Vui lòng nhập đầy đủ loại báo cáo và mô tả",
        });
      }

      const hinhAnh = req.file ? `/uploads/baocao/${req.file.filename}` : "";

      const baoCao = await BaoCao.create({
        nguoiDung: nguoiDung._id,
        loaiBaoCao,
        viTri,
        moTa,
        hinhAnh,
      });

      return res.status(201).json({
        message: "Gửi báo cáo thành công",
        baoCao,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "Lỗi server khi gửi báo cáo",
      });
    }
  }
}

module.exports = new homeuserController();