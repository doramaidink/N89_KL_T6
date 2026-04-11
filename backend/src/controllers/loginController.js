const NguoiDungs = require('../models/NguoiDung')
// const DoanhNghieps = require('../models/DoanhNghiep')
// const QuanTriViens = require('../models/QuanTriVien')

class loginController{
 async dangky(req, res) {
    try {
      const data = req.body;
       const exist = await NguoiDungs.findOne({
       email: data.email
      });

      if (exist) {
        return res.status(400).json({
          field: "email",
          message: "Email đã tồn tại"
        });
      }
      // TỰ THÊM vaiTro
      const user = await NguoiDungs.create({
        hoTen: data.hoTen || "",
        email: data.email || "",
        matKhau: data.passWord,
        ngaysinh: data.ngaysinh,
        vaiTro: "nguoiDung",              // <<< TỰ THÊM
        trangThai: "active",
      });

      res.status(201).json({
        message: "Đăng ký thành công!",
        user: user
      });

    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Lỗi server khi đăng ký!" });
    }
  }
   async dangnhap(req, res) {
    try {
    const { email, passWord } = req.body;
    

    // 1. Kiểm tra quản trị viên
    // let admin = await QuanTriViens.findOne({ soDienThoai });
    // if (admin && admin.matKhau === passWord) {
    //   return res.status(200).json({
    //     user: {
    //       id: admin._id,
    //       soDienThoai: admin.soDienThoai,
    //       vaiTro: "quanTriVien",
    //       slug: admin.slug || admin.soDienThoai.toLowerCase().replace(/ /g, "-")
    //     }
    //   });
    // }

    // // 2. Kiểm tra doanh nghiệp
    // let dn = await DoanhNghieps.findOne({ soDienThoai });
    // if (dn && dn.matKhau === passWord) {
    //   return res.status(200).json({
    //     user: {
    //       id: dn._id,
    //       soDienThoai: dn.soDienThoai,
    //       vaiTro: "doanhNghiep",
    //       slug: dn.slug || dn.soDienThoai.toLowerCase().replace(/ /g, "-")
    //     }
    //   });
    // }

    // 3. Kiểm tra người dùng
    let nd = await NguoiDungs.findOne({ email });
    if (nd && nd.matKhau === passWord) {
      return res.status(200).json({
        user: {
          id: nd._id,
          email: nd.email,
          vaiTro: "nguoiDung",
          slug: nd.slug || nd.email.toLowerCase().replace(/ /g, "-")
        }
      });
    }

    return res.status(400).json({ message: "Sai email hoặc mật khẩu!" });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Lỗi server!" });
  }
  }
  
}

module.exports = new loginController();