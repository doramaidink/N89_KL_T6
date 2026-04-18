const NguoiDungs = require('../models/NguoiDung')
const crypto = require("crypto");
const sendMail = require("../utils/sendMail");
const QuanTriViens = require('../models/QuanTriVien');
const DoiTac = require('../models/DoiTac');

class loginController{
 async dangky(req, res) {
    try {
      const data = req.body;

      // chuẩn hóa email
      const email = (data.email || "").trim().toLowerCase();

      // kiểm tra dữ liệu cơ bản
      if (!data.hoTen || !data.hoTen.trim()) {
        return res.status(400).json({
          field: "hoTen",
          message: "Họ tên không được để trống"
        });
      }

      if (!email) {
        return res.status(400).json({
          field: "email",
          message: "Email không được để trống"
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

      // kiểm tra đã đồng ý điều khoản chưa
      if (data.daDongYDieuKhoan !== true) {
        return res.status(400).json({
          field: "daDongYDieuKhoan",
          message: "Bạn phải đồng ý điều khoản trước khi đăng ký"
        });
      }

      // kiểm tra version điều khoản
      if (!data.phienBanDieuKhoan) {
        return res.status(400).json({
          field: "phienBanDieuKhoan",
          message: "Thiếu phiên bản điều khoản"
        });
      }

      // kiểm tra email tồn tại
      const exist = await NguoiDungs.findOne({ email: email });

      if (exist) {
        return res.status(400).json({
          field: "email",
          message: "Email đã tồn tại"
        });
      }

      // tạo user
      const user = await NguoiDungs.create({
        hoTen: data.hoTen.trim(),
        email: email,
        matKhau: data.passWord,
        ngaysinh: data.ngaysinh,
        soDienThoai: "",

        vaiTro: "nguoiDung",
        trangThai: "active",

        daDongYDieuKhoan: true,
        thoiDiemDongYDieuKhoan: new Date(),
        phienBanDieuKhoan: data.phienBanDieuKhoan
      });

      return res.status(201).json({
        message: "Đăng ký thành công!",
        user: user
      });

    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "Lỗi server khi đăng ký!"
      });
    }
  }
   async dangnhap(req, res) {
  try {
    const email = (req.body.email || "").trim().toLowerCase();
    const { passWord } = req.body;
    // 1. CHECK ADMIN
    const admin = await QuanTriViens.findOne({ email });

    if (admin) {
      if (admin.matKhau !== passWord) {
        return res.status(400).json({
          message: "Sai email hoặc mật khẩu!"
        });
      }
       admin.lanDangNhapCuoi = new Date();
      await admin.save();

      return res.status(200).json({
        user: {
          id: admin._id,
          email: admin.email,
          hoTen: admin.hoTen,
          vaiTro: "quanTriVien",
          slug: admin.slug,
        }
      });
    }
    // 2. CHECK USER
    // 2. Người dùng
    const nd = await NguoiDungs.findOne({ email });
    if (!nd) {
      return res.status(400).json({ message: "Sai email hoặc mật khẩu!" });
    }

    if (nd.matKhau !== passWord) {
      return res.status(400).json({ message: "Sai email hoặc mật khẩu!" });
    }

    // 3. Nếu user đã là đối tác thì lấy hồ sơ đối tác
    if (nd.vaiTro === "doiTac") {
      const doiTac = await DoiTac.findOne({
        nguoiDung: nd._id,
        trangThaiHoSo: "da_duyet"
      });

      if (doiTac) {
        return res.status(200).json({
          user: {
            id: nd._id,
            email: nd.email,
            hoTen: doiTac.hoTen || nd.hoTen,
            vaiTro: "doiTac",
            slug: doiTac.slug,
            image: doiTac.image || nd.image || "",
            doiTacId: doiTac._id,
          }
        });
      }
    }

    // 4. User thường
    return res.status(200).json({
      user: {
        id: nd._id,
        email: nd.email,
        hoTen: nd.hoTen,
        vaiTro: nd.vaiTro,
        slug: nd.slug || nd.email.toLowerCase().replace(/ /g, "-"),
        image: nd.image || "",
      }
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Lỗi server!" });
  }
}
/*---------------Quên mật khẩu----------------------*/
  async quenMatKhau(req, res) {
    try {
      const email = (req.body.email || "").trim().toLowerCase();

      if (!email) {
        return res.status(400).json({ message: "Vui lòng nhập email" });
      }

      const user = await NguoiDungs.findOne({ email });

      if (!user) {
        return res.status(404).json({ message: "Email chưa được đăng ký" });
      }

      const resetToken = crypto.randomBytes(32).toString("hex");
      const expireTime = new Date(Date.now() + 15 * 60 * 1000);

      user.resetPasswordToken = resetToken;
      user.resetPasswordExpires = expireTime;
      await user.save();

      const resetLink = `${process.env.FRONTEND_URL}/dat-lai-mat-khau?token=${resetToken}`;

      await sendMail(
        email,
        "Yêu cầu đặt lại mật khẩu",
        `
          <div style="font-family: Arial, sans-serif; line-height: 1.6;">
            <h2>Đặt lại mật khẩu</h2>
            <p>Bạn vừa yêu cầu đặt lại mật khẩu cho tài khoản Backpacking VietNam.</p>
            <p>Nhấn vào nút bên dưới để đặt lại mật khẩu:</p>
            <a href="${resetLink}" style="display:inline-block;padding:12px 20px;background:#00d26a;color:#fff;text-decoration:none;border-radius:8px;">
              Đặt lại mật khẩu
            </a>
            <p>Liên kết này sẽ hết hạn sau 15 phút.</p>
            <p>Nếu không phải bạn thực hiện, hãy bỏ qua email này.</p>
          </div>
        `
      );

      return res.status(200).json({
        message: "Đã gửi email đặt lại mật khẩu"
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "Không thể gửi email đặt lại mật khẩu"
      });
    }
  }

/*---------------Kiểm tra xác nhận email----------------------*/
  async kiemTraResetToken(req, res) {
    try {
      const token = req.query.token;

      if (!token) {
        return res.status(400).json({ message: "Thiếu token" });
      }

      const user = await NguoiDungs.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: new Date() }
      });

      if (!user) {
        return res.status(400).json({
          message: "Link đặt lại mật khẩu không hợp lệ hoặc đã hết hạn"
        });
      }

      return res.status(200).json({
        message: "Token hợp lệ"
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "Lỗi server"
      });
    }
  }

  async datLaiMatKhau(req, res) {
    try {
      const { token, newPassword } = req.body;

      if (!token) {
        return res.status(400).json({ message: "Thiếu token" });
      }

      if (!newPassword || newPassword.length < 6) {
        return res.status(400).json({
          message: "Mật khẩu mới phải có ít nhất 6 ký tự"
        });
      }

      const user = await NguoiDungs.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: new Date() }
      });

      if (!user) {
        return res.status(400).json({
          message: "Link đặt lại mật khẩu không hợp lệ hoặc đã hết hạn"
        });
      }

      user.matKhau = newPassword;
      user.resetPasswordToken = null;
      user.resetPasswordExpires = null;
      await user.save();

      return res.status(200).json({
        message: "Đổi mật khẩu thành công"
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "Không thể đặt lại mật khẩu"
      });
    }
  }
  
}

module.exports = new loginController();