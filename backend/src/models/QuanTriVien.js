const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const QuanTriVienSchema = new Schema(
  {
    hoTen: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },

    matKhau: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      unique: true,
    },

    vaiTro: {
      type: String,
      enum: ['quanTriVien'],
      default: 'quanTriVien',
    },

    lanDangNhapCuoi: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

QuanTriVienSchema.pre('save', function () {
  if (!this.slug) {
    this.slug = this._id.toString();
  }
});

module.exports = mongoose.model('QuanTriVien', QuanTriVienSchema);