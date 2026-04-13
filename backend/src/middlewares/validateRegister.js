function validateRegister(req, res, next) {
  try {
    const data = req.body;
    const email = (data.email || "").trim().toLowerCase();

    if (!data.hoTen || !data.hoTen.trim()) {
      return res.status(400).json({
        field: "hoTen",
        message: "Họ tên không được để trống"
      });
    }

    if (data.hoTen.trim().length < 6) {
      return res.status(400).json({
        field: "hoTen",
        message: "Họ tên phải có ít nhất 6 ký tự"
      });
    }

    if (!email) {
      return res.status(400).json({
        field: "email",
        message: "Email không được để trống"
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        field: "email",
        message: "Email không hợp lệ"
      });
    }

    if (!data.passWord || data.passWord.length < 6) {
      return res.status(400).json({
        field: "passWord",
        message: "Mật khẩu phải có ít nhất 6 ký tự"
      });
    }

    if (!data.ngaysinh) {
      return res.status(400).json({
        field: "ngaysinh",
        message: "Ngày sinh không được để trống"
      });
    }

    if (data.daDongYDieuKhoan !== true) {
      return res.status(400).json({
        field: "daDongYDieuKhoan",
        message: "Bạn phải đồng ý điều khoản trước khi đăng ký"
      });
    }

    if (!data.phienBanDieuKhoan || !data.phienBanDieuKhoan.trim()) {
      return res.status(400).json({
        field: "phienBanDieuKhoan",
        message: "Thiếu phiên bản điều khoản"
      });
    }

    next();
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Lỗi middleware kiểm tra đăng ký"
    });
  }
}

module.exports = validateRegister;