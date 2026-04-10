const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');


const Schema = mongoose.Schema;

const DiaDiem = new Schema({
  tenDiaDiem: { type: String },
  moTa: { type: String },
  gioiThieu: [{ type: String }],
  doKho: { type: String },
  veVao: { type: String },
  quangduong: { type: String },
  khuVuc: { type: String },
  hot:{ type: Boolean, default: false },
  image: { type: String },
  images:  [{ type: String }],
  dacDiemDiaDanh: [{ type: String }],
  slug: { type: String, unique: true },
}, {
  timestamps: true,
});


DiaDiem.pre('save', function () {
  if (!this.slug) {
    this.slug = this._id.toString();
  }
});

module.exports = mongoose.model('DiaDiem', DiaDiem);