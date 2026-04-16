const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');


const Schema = mongoose.Schema;

const NguoiDung = new Schema({
 hoTen: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, trim: true, lowercase: true },
  matKhau: { type: String },
  ngaysinh: { type: Date },
  vaiTro: { type: String,  enum: ['nguoiDung', 'doiTac', 'quanTriVien'], default: 'nguoiDung' },
  trangThai: { type: String, default: 'active' },
  soDienThoai: { type: String, default: "" },
  image: { type: String, default: "" },
  slug: { type: String, unique: true },
  daDongYDieuKhoan: { type: Boolean, required: true, default: false },
  thoiDiemDongYDieuKhoan: { type: Date, default: null },
  phienBanDieuKhoan: { type: String, default: null },
  soLanViPham: { type: Number, default: 0 },
  resetPasswordToken: { type: String, default: null },
  resetPasswordExpires: { type: Date, default: null },
  danhSachViPham: [
      {
        loai: { type: String, default: "" }, // spam, toxic, lua_dao...
        noiDung: { type: String, default: "" },
        thoiGian: { type: Date, default: Date.now },
        mucDo: { type: String, default: "nhe" }, // nhe, vua, nang
      },
    ],
}, {
  timestamps: true,
});


NguoiDung.pre('save', function() {
  if (!this.slug) {
    this.slug = this._id.toString();
  }
});

module.exports = mongoose.model('NguoiDung', NguoiDung);