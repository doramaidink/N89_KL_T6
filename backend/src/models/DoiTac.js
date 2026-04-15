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

const DoiTacSchema = new Schema({
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

  hoTen: {
    type: String,
    required: true,
    trim: true,
  },

  soDienThoai: {
    type: String,
    required: true,
    trim: true,
  },

  soCCCD: {
    type: String,
    required: true,
    trim: true,
  },

  ngaySinh: {
    type: Date,
    default: null,
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

  tinhDangKy: {
    type: String,
    required: true,
    trim: true,
  },

  image: {
    type: String,
    default: '',
  },

  thuMucAnh: {
    type: String,
    default: 'img/huongdanvien',
  },

  anhCCCDMatTruoc: {
    type: String,
    required: true,
  },

  anhCCCDMatSau: {
    type: String,
    required: true,
  },

  anhKhuonMat: {
    type: String,
    required: true,
  },

  lyLichTuPhap: {
    type: String,
    default: '',
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

DoiTacSchema.pre('save', function() {
  if (!this.slug) {
    this.slug = this._id.toString();
  }

});

module.exports = mongoose.model('DoiTac', DoiTacSchema);