const path = require('path');
const fs = require('fs');
const multer = require('multer');

const NguoiDung = require('../models/NguoiDung');
const DoiTac = require('../models/DoiTac');
const DiaDiem = require('../models/DiaDiem');

const {
  detectText,
  parseFrontCCCD,
  parseBackCCCD,
} = require('../services/cccdOcrService');

function removeVietnamese(str = '') {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D');
}

function toFolderSafeName(name = 'doi-tac') {
  return removeVietnamese(name)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'doi-tac';
}

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function getPartnerFolder(req) {
  const hoTen = (
    req.body.hoTen ||
    req.query.hoTen ||
    req.headers['x-partner-name'] ||
    'doi-tac'
  ).trim();

  const folderName = toFolderSafeName(hoTen);
  const relativeDir = `/imageDoiTac/${folderName}`;
  const absoluteDir = path.join(__dirname, '../../public', relativeDir);

  ensureDir(absoluteDir);

  return { folderName, relativeDir, absoluteDir };
}

function createStorage(prefix) {
  return multer.diskStorage({
    destination: function (req, file, cb) {
      const { absoluteDir } = getPartnerFolder(req);
      cb(null, absoluteDir);
    },
    filename: function (req, file, cb) {
      const ext = path.extname(file.originalname || '.jpg');
      cb(null, `${prefix}-${Date.now()}${ext}`);
    }
  });
}

const imageFileFilter = (req, file, cb) => {
  if (!file.mimetype.startsWith('image/')) {
    return cb(new Error('Chỉ cho phép file ảnh'));
  }
  cb(null, true);
};

const pdfOrImageFilter = (req, file, cb) => {
  const ok = file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf';
  if (!ok) {
    return cb(new Error('Chỉ cho phép ảnh hoặc PDF'));
  }
  cb(null, true);
};

const uploadFront = multer({
  storage: createStorage('cccd-front'),
  fileFilter: imageFileFilter,
});

const uploadBack = multer({
  storage: createStorage('cccd-back'),
  fileFilter: imageFileFilter,
});

const uploadFace = multer({
  storage: createStorage('face'),
  fileFilter: imageFileFilter,
});

const uploadJudicial = multer({
  storage: createStorage('ly-lich-tu-phap'),
  fileFilter: pdfOrImageFilter,
});

class doiTacController {
  async ocrCCCDFront(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'Không có ảnh CCCD mặt trước' });
      }

      const { relativeDir } = getPartnerFolder(req);
      const imageUrl = `${relativeDir}/${req.file.filename}`;

      const rawText = await detectText(req.file.path);
      const data = parseFrontCCCD(rawText);

      return res.status(200).json({
        message: 'Đọc CCCD mặt trước thành công',
        imageUrl,
        data,
        rawText,
      });
    } catch (error) {
      console.log('ocrCCCDFront error:', error);
      return res.status(500).json({ message: 'Không thể đọc CCCD mặt trước' });
    }
  }

  async ocrCCCDBack(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'Không có ảnh CCCD mặt sau' });
      }

      const { relativeDir } = getPartnerFolder(req);
      const imageUrl = `${relativeDir}/${req.file.filename}`;

      const rawText = await detectText(req.file.path);
      const data = parseBackCCCD(rawText);

      return res.status(200).json({
        message: 'Đọc CCCD mặt sau thành công',
        imageUrl,
        data,
        rawText,
      });
    } catch (error) {
      console.log('ocrCCCDBack error:', error);
      return res.status(500).json({ message: 'Không thể đọc CCCD mặt sau' });
    }
  }

  async uploadFace(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'Thiếu ảnh khuôn mặt' });
      }

      const { relativeDir } = getPartnerFolder(req);

      return res.status(200).json({
        message: 'Upload ảnh khuôn mặt thành công',
        imageUrl: `${relativeDir}/${req.file.filename}`,
      });
    } catch (error) {
      console.log('uploadFace error:', error);
      return res.status(500).json({ message: 'Lỗi upload ảnh khuôn mặt' });
    }
  }

  async uploadJudicialRecord(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'Thiếu file lý lịch tư pháp' });
      }

      const { relativeDir } = getPartnerFolder(req);

      return res.status(200).json({
        message: 'Upload lý lịch tư pháp thành công',
        fileUrl: `${relativeDir}/${req.file.filename}`,
      });
    } catch (error) {
      console.log('uploadJudicialRecord error:', error);
      return res.status(500).json({ message: 'Lỗi upload lý lịch tư pháp' });
    }
  }

  async create(req, res) {
    try {
      const data = req.body;
      const email = (data.email || '').trim().toLowerCase();

      if (!email) {
        return res.status(400).json({ message: 'Thiếu email tài khoản hiện tại' });
      }

      const user = await NguoiDung.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: 'Không tìm thấy tài khoản người dùng' });
      }

      if (!data.soCCCD || !data.diaChi || !data.tinhDangKy) {
        return res.status(400).json({
          message: 'Thiếu thông tin bắt buộc: số CCCD, địa chỉ, tỉnh đăng ký'
        });
      }

      if (!data.anhCCCDMatTruoc || !data.anhCCCDMatSau || !data.anhKhuonMat) {
        return res.status(400).json({
          message: 'Thiếu ảnh CCCD hoặc ảnh khuôn mặt xác thực'
        });
      }

      if (data.verificationStatus !== 'da_xac_thuc' || data.faceMatched !== true) {
        return res.status(400).json({
          message: 'Bạn chưa xác thực khuôn mặt thành công'
        });
      }

      if (data.camKet !== true) {
        return res.status(400).json({
          message: 'Bạn phải xác nhận cam kết'
        });
      }

      const diaDiemGiaCaRaw = Array.isArray(data.diaDiemGiaCa) ? data.diaDiemGiaCa : [];
      const tenDiaDiems = diaDiemGiaCaRaw
        .map(item => (item?.diaDiem || '').trim())
        .filter(Boolean);

      if (!tenDiaDiems.length) {
        return res.status(400).json({
          message: 'Bạn phải nhập ít nhất 1 địa điểm hướng dẫn'
        });
      }

      const diaDiems = await DiaDiem.find({
        tenDiaDiem: { $in: tenDiaDiems }
      });

      const diaDiemMap = new Map(diaDiems.map(d => [d.tenDiaDiem, d]));

      const diaDiemGiaCa = diaDiemGiaCaRaw
        .filter(item => item?.diaDiem && diaDiemMap.has(item.diaDiem.trim()))
        .map(item => ({
          diaDiem: diaDiemMap.get(item.diaDiem.trim())._id,
          mucGia: Number(item.mucGia || 0),
          kinhNghiem: item.kinhNghiem || '',
        }));

      if (!diaDiemGiaCa.length) {
        return res.status(400).json({
          message: 'Không tìm thấy địa điểm hợp lệ trong database'
        });
      }

      user.hoTen = data.hoTen || user.hoTen;
      user.soDienThoai = data.soDienThoai || user.soDienThoai;
      if (data.ngaySinh) {
        const parts = data.ngaySinh.split('/');
        if (parts.length === 3) {
          user.ngaysinh = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
        }
      }
      user.image = data.anhKhuonMat || user.image;
      user.vaiTro = 'doiTac';
      await user.save();

      let doiTac = await DoiTac.findOne({ nguoiDung: user._id });
      if (!doiTac) {
        doiTac = new DoiTac({ nguoiDung: user._id });
      }

      const folderName = toFolderSafeName(user.hoTen || 'doi-tac');

      doiTac.soDienThoai = user.soDienThoai || '';
      doiTac.soCCCD = data.soCCCD;
      doiTac.diaChi = data.diaChi;
      doiTac.queQuan = data.queQuan || '';
      doiTac.tinhDangKy = data.tinhDangKy;

      doiTac.image = data.anhKhuonMat;
      doiTac.thuMucAnh = `/imageDoiTac/${folderName}`;
      doiTac.anhCCCDMatTruoc = data.anhCCCDMatTruoc;
      doiTac.anhCCCDMatSau = data.anhCCCDMatSau;
      doiTac.anhKhuonMat = data.anhKhuonMat;
      doiTac.lyLichTuPhap = data.lyLichTuPhap || '';

      doiTac.gioiThieuBanThan = data.moTaBanThan || '';
      doiTac.ngonNguHoTro = (data.ngonNgu || '')
        .split(',')
        .map(s => s.trim())
        .filter(Boolean);

      doiTac.soNamKinhNghiem = Number(data.soNamKinhNghiem || 0);
      doiTac.kinhNghiem = data.moTaBanThan || '';

      doiTac.faceMatched = data.faceMatched === true;
      doiTac.faceDistance = data.faceDistance ?? null;
      doiTac.verificationStatus = data.verificationStatus || 'cho_xac_thuc';

      doiTac.trangThaiHoSo = 'cho_duyet';
      doiTac.cacDiaDiemDangKy = diaDiemGiaCa.map(item => item.diaDiem);
      doiTac.diaDiemGiaCa = diaDiemGiaCa;
      doiTac.giaThue = diaDiemGiaCa[0]?.mucGia || 0;

      await doiTac.save();

      return res.status(201).json({
        message: 'Đăng ký hướng dẫn viên thành công, hồ sơ đang chờ duyệt',
        doiTac,
      });
    } catch (error) {
      console.log('create doiTac error:', error);
      return res.status(500).json({ message: 'Lỗi server khi tạo hồ sơ đối tác' });
    }
  }
}

module.exports = {
  doiTacController: new doiTacController(),
  uploadFront,
  uploadBack,
  uploadFace,
  uploadJudicial,
};