const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const diaDiemGiaCaSchema = new Schema({
  diaDiem: {
    type: Schema.Types.ObjectId,
    ref: 'DiaDiem',
    required: true,
  },
  mucGia: {
    type: Number,
    default: 0,
  },
  kinhNghiem: {
    type: String,
    default: '',
  }
}, { _id: false });

const DoiTac = new Schema({
  nguoiDung: {
    type: Schema.Types.ObjectId,
    ref: 'NguoiDung',
    required: true,
    unique: true,
  },

  slug: {
    type: String,
    unique: true,
  },

  soDienThoai: {
    type: String,
    default: '',
  },

  soCCCD: {
    type: String,
    required: true,
    trim: true,
  },

  diaChi: {
    type: String,
    required: true,
    trim: true,
  },

  queQuan: {
    type: String,
    default: '',
    trim: true,
  },

  image: {
    type: String,
    default: '',
  },

  thuMucAnh: {
    type: String,
    default: '',
  },

  anhCCCDMatTruoc: {
    type: String,
    default: '',
  },

  anhCCCDMatSau: {
    type: String,
    default: '',
  },

  anhKhuonMat: {
    type: String,
    default: '',
  },

  lyLichTuPhap: {
    type: String,
    default: '',
  },

  tinhDangKy: {
    type: String,
    required: true,
    trim: true,
  },

  gioiThieuBanThan: {
    type: String,
    default: '',
  },

  kyNangDacBiet: {
    type: [String],
    default: [],
  },

  ngonNguHoTro: {
    type: [String],
    default: [],
  },

  kinhNghiem: {
    type: String,
    default: '',
  },

  soNamKinhNghiem: {
    type: Number,
    default: 0,
  },

  giaThue: {
    type: Number,
    default: 0,
  },

  cacDiaDiemDangKy: [
    {
      type: Schema.Types.ObjectId,
      ref: 'DiaDiem',
    }
  ],

  diaDiemGiaCa: {
    type: [diaDiemGiaCaSchema],
    default: [],
  },

  giayChungNhan: {
    type: [String],
    default: [],
  },

  faceMatched: {
    type: Boolean,
    default: false,
  },

  faceDistance: {
    type: Number,
    default: null,
  },

  verificationStatus: {
    type: String,
    enum: ['cho_xac_thuc', 'da_xac_thuc', 'khong_khop', 'can_chup_lai'],
    default: 'cho_xac_thuc',
  },

  trangThaiHoSo: {
    type: String,
    enum: ['cho_duyet', 'da_duyet', 'tu_choi'],
    default: 'cho_duyet',
  },

  lyDoTuChoi: {
    type: String,
    default: '',
  },

  ngayDuyet: {
    type: Date,
    default: null,
  },
}, {
  timestamps: true,
});

DoiTac.pre('save', function(next) {
  if (!this.slug) {
    this.slug = this._id.toString();
  }
  next();
});
