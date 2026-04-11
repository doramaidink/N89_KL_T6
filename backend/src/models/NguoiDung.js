const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');


const Schema = mongoose.Schema;

const NguoiDung = new Schema({
  hoTen: { type: String },
  email: { type: String, unique: true },
  matKhau: { type: String },
  ngaysinh: { type: Date },
  vaiTro: { type: String, default: 'nguoiDung' },
  trangThai: { type: String, default: 'active' },
  image: { type: String },
  slug: { type: String, unique: true },
}, {
  timestamps: true,
});


NguoiDung.pre('save', function(next) {
  if (!this.slug) {
    this.slug = this._id.toString();
  }
});

module.exports = mongoose.model('NguoiDung', NguoiDung);