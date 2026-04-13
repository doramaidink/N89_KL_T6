const fs = require('fs');
const path = require('path');
const multer = require('multer');
const NguoiDung = require('../models/NguoiDung');
const DoiTac = require('../models/DoiTac');
const DiaDiem = require('../models/DiaDiem');

// Optional OCR: cài nếu muốn đọc text thật
// npm i tesseract.js
let Tesseract = null;
try {
  Tesseract = require('tesseract.js');
} catch (e) {
  Tesseract = null;
}

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
  const hoTen = (req.body.hoTen || req.query.hoTen || req.headers['x-partner-name'] || 'doi-tac').trim();
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

const uploadFront = multer({ storage: createStorage('cccd-front'), fileFilter: imageFileFilter });
const uploadBack = multer({ storage: createStorage('cccd-back'), fileFilter: imageFileFilter });
const uploadFace = multer({ storage: createStorage('face'), fileFilter: imageFileFilter });
const uploadJudicial = multer({ storage: createStorage('ly-lich-tu-phap'), fileFilter: pdfOrImageFilter });

function parseFrontCCCDText(rawText = '') {
  const text = rawText.replace(/\r/g, '');
  const lines = text.split('\n').map(s => s.trim()).filter(Boolean);

  let soCCCD = '';
  let hoTen = '';
  let ngaySinh = '';

  const cccdMatch = text.match(/\b\d{12}\b/);
  if (cccdMatch) soCCCD = cccdMatch[0];

  const dobMatch = text.match(/(\d{2}[\/\-]\d{2}[\/\-]\d{4})/);
  if (dobMatch) ngaySinh = dobMatch[1];

  // cố tìm dòng sau "Họ và tên" hoặc dòng viết hoa dài
  const hoTenLabelIndex = lines.findIndex(line =>
    removeVietnamese(line).toLowerCase().includes('ho va ten')
  );

  if (hoTenLabelIndex !== -1 && lines[hoTenLabelIndex + 1]) {
    hoTen = lines[hoTenLabelIndex + 1];
  } else {
    const upperName = lines.find(line =>
      /^[A-ZÀÁẠẢÃĂẮẰẶẲẴÂẤẦẬẨẪĐÈÉẸẺẼÊẾỀỆỂỄÌÍỊỈĨÒÓỌỎÕÔỐỒỘỔỖƠỚỜỢỞỠÙÚỤỦŨƯỨỪỰỬỮỲÝỴỶỸ\s]{5,}$/.test(line)
    );
    if (upperName) hoTen = upperName;
  }

  return {
    hoTen: hoTen.trim(),
    soCCCD: soCCCD.trim(),
    ngaySinh: ngaySinh.trim(),
  };
}

function parseBackCCCDText(rawText = '') {
  const text = rawText.replace(/\r/g, '');
  const lines = text.split('\n').map(s => s.trim()).filter(Boolean);

  let queQuan = '';
  let diaChi = '';

  const qqIndex = lines.findIndex(line =>
    removeVietnamese(line).toLowerCase().includes('que quan')
  );
  if (qqIndex !== -1 && lines[qqIndex + 1]) {
    queQuan = lines[qqIndex + 1];
  }

  const dcIndex = lines.findIndex(line =>
    removeVietnamese(line).toLowerCase().includes('noi thuong tru') ||
    removeVietnamese(line).toLowerCase().includes('thuong tru')
  );
  if (dcIndex !== -1 && lines[dcIndex + 1]) {
    diaChi = lines[dcIndex + 1];
  }

  if (!diaChi) {
    const fallback = lines.slice(-2).join(' ');
    diaChi = fallback;
  }

  return {
    queQuan: queQuan.trim(),
    diaChi: diaChi.trim(),
  };
}

async function readTextFromImage(imagePath) {
  if (!Tesseract) {
    return '';
  }
  const result = await Tesseract.recognize(imagePath, 'vie+eng');
  return result?.data?.text || '';
}

class doiTacController {
  async uploadFace(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'Thiếu ảnh khuôn mặt' });
      }

      const { relativeDir } = getPartnerFolder(req);
      return res.status(200).json({
        message: 'Upload ảnh khuôn mặt thành công',
        imageUrl: `${relativeDir}/${req.file.filename}`,
        folder: relativeDir,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: 'Lỗi upload ảnh khuôn mặt' });
    }
  }

  async ocrCCCDFront(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'Thiếu ảnh CCCD mặt trước' });
      }

      const { relativeDir } = getPartnerFolder(req);
      const imageUrl = `${relativeDir}/${req.file.filename}`;
      const text = await readTextFromImage(req.file.path);
      const data = parseFrontCCCDText(text);

      return res.status(200).json({
        message: 'Đọc CCCD mặt trước thành công',
        imageUrl,
        data,
        rawText: text,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: 'Không thể đọc CCCD mặt trước' });
    }
  }

  async ocrCCCDBack(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'Thiếu ảnh CCCD mặt sau' });
      }

      const { relativeDir } = getPartnerFolder(req);
      const imageUrl = `${relativeDir}/${req.file.filename}`;
      const text = await readTextFromImage(req.file.path);
      const data = parseBackCCCDText(text);

      return res.status(200).json({
        message: 'Đọc CCCD mặt sau thành công',
        imageUrl,
        data,
        rawText: text,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: 'Không thể đọc CCCD mặt sau' });
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
      console.log(error);
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
        return res.status(400).json({ message: 'Bạn phải chọn ít nhất 1 địa điểm hướng dẫn' });
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
        return res.status(400).json({ message: 'Không map được địa điểm nào hợp lệ trong database' });
      }

      user.hoTen = data.hoTen || user.hoTen;
      user.soDienThoai = data.soDienThoai || user.soDienThoai;
      user.ngaysinh = data.ngaySinh ? new Date(data.ngaySinh.split('/').reverse().join('-')) : user.ngaysinh;
      user.image = data.anhKhuonMat || user.image;
      user.vaiTro = 'doiTac';
      await user.save();

      const folderName = toFolderSafeName(user.hoTen || 'doi-tac');
      const thuMucAnh = `/imageDoiTac/${folderName}`;

      let doiTac = await DoiTac.findOne({ nguoiDung: user._id });

      if (!doiTac) {
        doiTac = new DoiTac({
          nguoiDung: user._id,
        });
      }

      doiTac.soCCCD = data.soCCCD;
      doiTac.diaChi = data.diaChi;
      doiTac.queQuan = data.queQuan || '';
      doiTac.tinhDangKy = data.tinhDangKy;
      doiTac.image = data.anhKhuonMat;
      doiTac.thuMucAnh = thuMucAnh;
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
      console.log(error);
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