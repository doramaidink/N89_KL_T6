const QuanTriVien = require('../models/QuanTriVien');
const NguoiDung = require('../models/NguoiDung');
const DoiTac = require('../models/DoiTac');
const DiaDiem = require('../models/DiaDiem');
const BaoCao = require('../models/BaoCao');

class QuanTriVienController {
  async thongke(req, res) {
    try {
      const { slug } = req.params;

      const admin = await QuanTriVien.findOne({ slug });
      if (!admin) {
        return res.status(404).json({
          message: 'Không tìm thấy quản trị viên'
        });
      }

      const tongNguoiDung = await NguoiDung.countDocuments();
      const tongDoiTac = await DoiTac.countDocuments();
      const tongDiaDiem = await DiaDiem.countDocuments();

      const tongTaiKhoanDaKhoa = await NguoiDung.countDocuments({
        trangThai: { $in: ['blocked', 'inactive', 'locked'] }
      });

      const tongDoiTacDungHopTac = await DoiTac.countDocuments({
        trangThaiHoSo: 'tu_choi'
      });

      const doiTacMoi = await DoiTac.find({})
        .sort({ createdAt: -1 })
        .limit(5)
        .select('hoTen image createdAt');

      const donDangKyChoDuyet = await DoiTac.countDocuments({
        trangThaiHoSo: 'cho_duyet'
      });

      const diaDiemChoDuyet = await DiaDiem.countDocuments({
        trangThai: 'cho_duyet'
      });

      // Thống kê 7 ngày gần nhất
      const today = new Date();
      const sevenDays = [];

      for (let i = 6; i >= 0; i--) {
        const start = new Date(today);
        start.setHours(0, 0, 0, 0);
        start.setDate(today.getDate() - i);

        const end = new Date(start);
        end.setDate(start.getDate() + 1);

        const soNguoiDungMoi = await NguoiDung.countDocuments({
          createdAt: { $gte: start, $lt: end }
        });

        const soDoiTacMoi = await DoiTac.countDocuments({
          createdAt: { $gte: start, $lt: end }
        });

        sevenDays.push({
          day: start.toLocaleDateString('vi-VN', { weekday: 'long' }),
          date: start.toLocaleDateString('vi-VN'),
          users: soNguoiDungMoi,
          partners: soDoiTacMoi,
          total: soNguoiDungMoi + soDoiTacMoi,
        });
      }

      return res.status(200).json({
        admin: {
          hoTen: admin.hoTen,
          email: admin.email,
          slug: admin.slug,
        },
        cards: {
          tongNguoiDung,
          tongDoiTac,
          tongTaiKhoanDaKhoa,
          tongDoiTacDungHopTac,
          tongDiaDiem,
          donDangKyChoDuyet,
          diaDiemChoDuyet,
        },
        chart: sevenDays,
        doiTacMoi,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: 'Lỗi server khi lấy thống kê'
      });
    }
  }

  async donDangky(req, res) {
    try {
      const { slug } = req.params;

      const admin = await QuanTriVien.findOne({ slug });
      if (!admin) {
        return res.status(404).json({
          message: 'Không tìm thấy quản trị viên'
        });
      }

      const hoSoDangKy = await DoiTac.find({
        trangThaiHoSo: 'cho_duyet'
      })
        .sort({ createdAt: -1 })
        .select('_id hoTen soDienThoai tinhDangKy soNamKinhNghiem trangThaiHoSo createdAt');

      const applicants = hoSoDangKy.map((item) => ({
        id: `#BP-${String(item._id).slice(-6).toUpperCase()}`,
        _id: item._id,
        name: item.hoTen || 'Chưa có tên',
        email: item.soDienThoai || '',
        city: item.tinhDangKy || 'Chưa cập nhật',
        exp: `${item.soNamKinhNghiem || 0} năm`,
        status: item.trangThaiHoSo === 'cho_duyet' ? 'CHỜ DUYỆT' : item.trangThaiHoSo,
        avatar: (item.hoTen || 'UV')
          .split(' ')
          .filter(Boolean)
          .slice(0, 2)
          .map(x => x[0]?.toUpperCase())
          .join('')
      }));

      return res.status(200).json({
        applicants
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: 'Lỗi server khi lấy danh sách đơn đăng ký'
      });
    }
  }

  async DuyetDiaDiem(req, res) {
    try {
      const data = await DiaDiem.find({ trangThai: 'cho_duyet' }).sort({ createdAt: -1 });
      return res.status(200).json(data);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: 'Lỗi server' });
    }
  }

 async QuanLyBaoCao(req, res) {
  try {
    const { slug } = req.params;

    const admin = await QuanTriVien.findOne({ slug });
    if (!admin) {
      return res.status(404).json({
        message: 'Không tìm thấy quản trị viên'
      });
    }

    const baoCaos = await BaoCao.find({})
      .sort({ createdAt: -1 })
      .populate('nguoiDung', 'hoTen email image');

    const reports = baoCaos.map((item) => ({
      id: `#REP-${String(item._id).slice(-6).toUpperCase()}`,
      _id: item._id,

      user: item.nguoiDung?.hoTen || 'Ẩn danh',
      email: item.nguoiDung?.email || '',

      type: item.loaiBaoCao,
      status:
        item.trangThai === 'dang_xu_ly'
          ? 'ĐANG XỬ LÝ'
          : item.trangThai === 'da_giai_quyet'
          ? 'ĐÃ XỬ LÝ'
          : 'TỪ CHỐI',

      desc: item.moTa,
      image: item.hinhAnh,
      createdAt: item.createdAt,
    }));

    return res.status(200).json({
      reports
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: 'Lỗi server khi lấy báo cáo'
    });
  }
}

  async ThongBaoHeThong(req, res) {
    return res.status(200).json([]);
  }

  async ThongKeNguoiDung(req, res) {
    try {
      const { slug } = req.params;

      const admin = await QuanTriVien.findOne({ slug });
      if (!admin) {
        return res.status(404).json({ message: 'Không tìm thấy quản trị viên' });
      }

      const users = await NguoiDung.find({})
        .sort({ createdAt: -1 })
        .select('_id hoTen email vaiTro trangThai createdAt');

      const partners = await DoiTac.find({})
        .sort({ createdAt: -1 })
        .select('_id hoTen soDienThoai trangThaiHoSo createdAt');

      const tongNguoiDung = await NguoiDung.countDocuments();
      const tongDoiTacHoatDong = await DoiTac.countDocuments({
        trangThaiHoSo: { $in: ['da_duyet', 'cho_duyet'] }
      });

      const tongDichVuDangCungCap = await DiaDiem.countDocuments();

      const now = new Date();
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();

      const startCurrentMonth = new Date(currentYear, currentMonth, 1);
      const startPrevMonth = new Date(currentYear, currentMonth - 1, 1);
      const endPrevMonth = new Date(currentYear, currentMonth, 1);

      const newUsersThisMonth = await NguoiDung.countDocuments({
        createdAt: { $gte: startCurrentMonth }
      });

      const newUsersPrevMonth = await NguoiDung.countDocuments({
        createdAt: { $gte: startPrevMonth, $lt: endPrevMonth }
      });

      let phanTramTangNguoiDung = '+0%';
      if (newUsersPrevMonth > 0) {
        const percent = ((newUsersThisMonth - newUsersPrevMonth) / newUsersPrevMonth) * 100;
        phanTramTangNguoiDung = `${percent >= 0 ? '+' : ''}${percent.toFixed(1)}%`;
      } else if (newUsersThisMonth > 0) {
        phanTramTangNguoiDung = '+100%';
      }

      const chartData = [];
      const monthLabels = [
        'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
        'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
      ];

      for (let i = 5; i >= 0; i--) {
        const date = new Date(currentYear, currentMonth - i, 1);
        const start = new Date(date.getFullYear(), date.getMonth(), 1);
        const end = new Date(date.getFullYear(), date.getMonth() + 1, 1);

        const count = await NguoiDung.countDocuments({
          createdAt: { $gte: start, $lt: end }
        });

        chartData.push({
          m: i === 0 ? 'Hiện tại' : monthLabels[date.getMonth()],
          value: count,
          active: i === 0
        });
      }

      const userAccounts = users.map((u) => ({
        id: `#ND-${String(u._id).slice(-6).toUpperCase()}`,
        name: u.hoTen || 'Người dùng',
        email: u.email || '',
        type: 'NGƯỜI DÙNG',
        status: ['inactive', 'locked', 'blocked'].includes(u.trangThai) ? 'Tạm khóa' : 'Hoạt động',
        date: u.createdAt ? new Date(u.createdAt).toLocaleDateString('vi-VN') : '',
        avatar: (u.hoTen || 'ND')
          .split(' ')
          .filter(Boolean)
          .slice(0, 2)
          .map(x => x[0]?.toUpperCase())
          .join('')
      }));

      const partnerAccounts = partners.map((p) => ({
        id: `#DT-${String(p._id).slice(-6).toUpperCase()}`,
        name: p.hoTen || 'Đối tác',
        email: p.soDienThoai || '',
        type: 'ĐỐI TÁC',
        status: p.trangThaiHoSo === 'tu_choi' ? 'Tạm khóa' : 'Hoạt động',
        date: p.createdAt ? new Date(p.createdAt).toLocaleDateString('vi-VN') : '',
        avatar: (p.hoTen || 'DT')
          .split(' ')
          .filter(Boolean)
          .slice(0, 2)
          .map(x => x[0]?.toUpperCase())
          .join('')
      }));

      const accounts = [...userAccounts, ...partnerAccounts].sort((a, b) => {
        const da = a.date.split('/').reverse().join('');
        const db = b.date.split('/').reverse().join('');
        return db.localeCompare(da);
      });

      return res.status(200).json({
        chartData,
        tongNguoiDung,
        tongDoiTacHoatDong,
        tongDichVuDangCungCap,
        phanTramTangNguoiDung,
        accounts,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: 'Lỗi server khi lấy thống kê người dùng' });
    }
  }
  async QuanLyDiaDiem(req, res) {
    try {
      const { slug } = req.params;

      const admin = await QuanTriVien.findOne({ slug });
      if (!admin) {
        return res.status(404).json({
          message: 'Không tìm thấy quản trị viên'
        });
      }

      const diaDiems = await DiaDiem.find({})
        .sort({ createdAt: -1 })
        .select('_id tenDiaDiem khuVuc doKho veVao image images trangThai createdAt');

      const locations = diaDiems.map((item) => ({
        id: `#LOC-${String(item._id).slice(-6).toUpperCase()}`,
        _id: item._id,
        name: item.tenDiaDiem || 'Chưa có tên',
        area: item.khuVuc || 'Chưa cập nhật',
        level: item.doKho || 'Chưa rõ',
        price: (() => {
          const raw = item.veVao;

          if (raw === null || raw === undefined || raw === '') {
            return 'Miễn phí';
          }

          if (typeof raw === 'number') {
            return raw <= 0 ? 'Miễn phí' : `${raw.toLocaleString('vi-VN')} VNĐ`;
          }

          const text = String(raw).trim().toLowerCase();

          if (
            text === '0' ||
            text === 'mien phi' ||
            text === 'miễn phí' ||
            text === 'free'
          ) {
            return 'Miễn phí';
          }

          // bỏ dấu chấm, dấu phẩy, chữ vnđ...
          const cleaned = text
            .replace(/vnđ|vnd/g, '')
            .replace(/\./g, '')
            .replace(/,/g, '')
            .trim();

          const parsed = Number(cleaned);

          if (Number.isNaN(parsed) || parsed <= 0) {
            return 'Miễn phí';
          }

          return `${parsed.toLocaleString('vi-VN')} VNĐ`;
        })(),
        status: (() => {
          if (!item.trangThai) return 'Đang hoạt động';

          const s = String(item.trangThai).toLowerCase();
          if (s.includes('bao tri') || s.includes('bảo trì') || s.includes('maintenance')) {
            return 'Đang bảo trì';
          }
          if (s.includes('an') || s.includes('hidden') || s.includes('inactive') || s.includes('dung') || s.includes('dừng')) {
            return 'Đã xóa/Dừng hoạt động';
          }
          return 'Đang hoạt động';
        })(),
        image: item.image || (Array.isArray(item.images) && item.images.length > 0 ? item.images[0] : ''),
        createdAt: item.createdAt,
      }));

      return res.status(200).json({
        locations
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: 'Lỗi server khi lấy danh sách địa điểm'
      });
    }
  }
}

module.exports = new QuanTriVienController();