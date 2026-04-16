const NguoiDung = require("../models/NguoiDung");

class TaiKhoanController {
  async layThongTinTaiKhoan(req, res) {
    try {
      const { id } = req.params;

      const user = await NguoiDung.findById(id).select(
        "hoTen email soDienThoai image vaiTro ngaysinh trangThai"
      );

      if (!user) {
        return res.status(404).json({
          message: "Không tìm thấy người dùng",
        });
      }

      return res.status(200).json({
        user,
      });
    } catch (error) {
      console.log("Lỗi layThongTinTaiKhoan:", error);
      return res.status(500).json({
        message: "Lỗi server khi lấy thông tin tài khoản",
      });
    }
  }

  async capNhatHoTen(req, res) {
  try {
    const { id } = req.params;
    const { hoTen, matKhauXacNhanTen } = req.body;

    if (!hoTen || !hoTen.trim()) {
      return res.status(400).json({
        message: "Họ tên không được để trống",
      });
    }

    if (!matKhauXacNhanTen) {
      return res.status(400).json({
        message: "Vui lòng nhập mật khẩu xác nhận",
      });
    }

    const userCheck = await NguoiDung.findById(id);

    if (!userCheck) {
      return res.status(404).json({
        message: "Không tìm thấy người dùng",
      });
    }

    if (userCheck.matKhau !== matKhauXacNhanTen) {
      return res.status(400).json({
        message: "Mật khẩu xác nhận không đúng",
      });
    }

    userCheck.hoTen = hoTen.trim();
    await userCheck.save();

    return res.status(200).json({
      message: "Cập nhật tên hiển thị thành công",
      user: {
        _id: userCheck._id,
        hoTen: userCheck.hoTen,
        email: userCheck.email,
        soDienThoai: userCheck.soDienThoai,
        image: userCheck.image,
        vaiTro: userCheck.vaiTro,
      },
    });
  } catch (error) {
    console.log("Lỗi capNhatHoTen:", error);
    return res.status(500).json({
      message: "Lỗi server khi cập nhật họ tên",
    });
  }
}

  async themSoDienThoai(req, res) {
    try {
      const { id } = req.params;
      const { soDienThoai } = req.body;

      if (!soDienThoai || !soDienThoai.trim()) {
        return res.status(400).json({
          message: "Số điện thoại không được để trống",
        });
      }

      const sdt = soDienThoai.trim();

      if (!/^(0|\+84)[0-9]{9,10}$/.test(sdt)) {
        return res.status(400).json({
          message: "Số điện thoại không hợp lệ",
        });
      }

      const daTonTai = await NguoiDung.findOne({
        soDienThoai: sdt,
        _id: { $ne: id },
      });

      if (daTonTai) {
        return res.status(400).json({
          message: "Số điện thoại đã được sử dụng",
        });
      }

      const user = await NguoiDung.findByIdAndUpdate(
        id,
        { soDienThoai: sdt },
        { new: true }
      ).select("hoTen email soDienThoai image vaiTro");

      if (!user) {
        return res.status(404).json({
          message: "Không tìm thấy người dùng",
        });
      }

      return res.status(200).json({
        message: "Thêm số điện thoại thành công",
        user,
      });
    } catch (error) {
      console.log("Lỗi themSoDienThoai:", error);
      return res.status(500).json({
        message: "Lỗi server khi thêm số điện thoại",
      });
    }
  }

  async doiMatKhau(req, res) {
    try {
      const { id } = req.params;
      const { matKhauHienTai, matKhauMoi, xacNhanMatKhauMoi } = req.body;

      if (!matKhauHienTai || !matKhauMoi || !xacNhanMatKhauMoi) {
        return res.status(400).json({
          message: "Vui lòng nhập đầy đủ thông tin mật khẩu",
        });
      }

      if (matKhauMoi.length < 6) {
        return res.status(400).json({
          message: "Mật khẩu mới phải có ít nhất 6 ký tự",
        });
      }

      if (matKhauMoi !== xacNhanMatKhauMoi) {
        return res.status(400).json({
          message: "Xác nhận mật khẩu mới không khớp",
        });
      }

      const user = await NguoiDung.findById(id);

      if (!user) {
        return res.status(404).json({
          message: "Không tìm thấy người dùng",
        });
      }

      if (user.matKhau !== matKhauHienTai) {
        return res.status(400).json({
          message: "Mật khẩu hiện tại không đúng",
        });
      }

      user.matKhau = matKhauMoi;
      await user.save();

      return res.status(200).json({
        message: "Đổi mật khẩu thành công",
      });
    } catch (error) {
      console.log("Lỗi doiMatKhau:", error);
      return res.status(500).json({
        message: "Lỗi server khi đổi mật khẩu",
      });
    }
  }
  async capNhatAvatar(req, res) {
  try {
    const { id } = req.params;

    if (!req.file) {
      return res.status(400).json({
        message: "Vui lòng chọn ảnh avatar",
      });
    }

    const user = await NguoiDung.findById(id);

    if (!user) {
      return res.status(404).json({
        message: "Không tìm thấy người dùng",
      });
    }

    user.image = `/uploads/avatars/${req.file.filename}`;
    await user.save();

    return res.status(200).json({
      message: "Cập nhật avatar thành công",
      user: {
        _id: user._id,
        id: user._id,
        hoTen: user.hoTen,
        email: user.email,
        soDienThoai: user.soDienThoai,
        image: user.image,
        vaiTro: user.vaiTro,
        slug: user.slug,
      },
    });
  } catch (error) {
    console.log("Lỗi capNhatAvatar:", error);
    return res.status(500).json({
      message: "Lỗi server khi cập nhật avatar",
    });
  }
}
}

module.exports = new TaiKhoanController();