const DiaDiem = require('../models/DiaDiem');
const NguoiDung = require('../models/NguoiDung');

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
}

module.exports = new homeuserController();