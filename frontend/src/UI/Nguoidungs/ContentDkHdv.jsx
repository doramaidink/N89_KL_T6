import React from "react";

const ContentDkHdv = () => {
  return (
    <div className="dkhdv">

      <h1>Đăng ký trở thành Đối tác Hướng dẫn viên</h1>
      <p className="subtitle-dkhdv">
        Tham gia cộng đồng hướng dẫn viên bản địa chuyên nghiệp
      </p>

      {/* SECTION 1 */}
      <div className="card-dkhdv">
        <h3>👤 Thông tin cá nhân</h3>

        <input placeholder="Họ và tên" />

        <div className="row-dkhdv">
          <input placeholder="Số điện thoại" />
          <input placeholder="Số CCCD/CMND" />
        </div>

        <input placeholder="Địa chỉ liên hệ" />

        <select>
          <option>Chọn tỉnh thành</option>
        </select>
      </div>

      {/* SECTION 2 */}
      <div className="card-dkhdv">
        <div className="dd-dkhdv">
          <img className="address-dkhsv" src="/img/address.png" alt="" />
          <h3> Địa điểm & Giá cả</h3>
        </div>
        <div className="row-dkhdv">
          <input placeholder="Địa điểm hướng dẫn" />
          <input placeholder="Mức giá (VNĐ/ngày)" />
          <input placeholder="Kinh nghiệm" />
        </div>
        <div className="dd-dkhdv">
          <img className="address-dkhsv" src="/img/sum.png" alt="" />

          <h3> Thêm địa điểm </h3>
        </div>
      </div>

      {/* SECTION 3 */}
      <div className="card-dkhdv">
        <div className="dd-dkhdv">
          <img className="address-dkhsv" src="/img/kinang.png" alt="" />
          <h3> Kỹ năng & Giới thiệu</h3>
        </div>


        <div className="row-dkhdv">
          <input placeholder="Số năm kinh nghiệm" />
          <input placeholder="Ngôn ngữ sử dụng" />
        </div>

        <textarea placeholder="Mô tả bản thân..." />
      </div>

      {/* SECTION 4 */}
      <div className="card-dkhdv">
        <div className="dd-dkhdv">
          <img className="address-dkhsv" src="/img/xacthuc.png" alt="" />
          <h3> Xác thực hồ sơ</h3>
        </div>


        <div className="upload-dkhdv">
          <img  src="/img/file.png" alt="" />
          <p>Kéo thả file hoặc click để tải lên</p>
          <span>Định dạng JPG, PNG, PDF</span>
        </div>
      </div>

      {/* FOOTER */}
      <div className="footer-form-dkhdv">

        <div className="lb-dkhdv">
          <input type="checkbox" />
          <p>Tôi cam kết tuân thủ quy trình an toàn và chính sách đối tác của Backpacking VietNam. Tôi xác nhận rằng mọi thông tin
          cung cấp phía trên là hoàn toàn chính xác và chịu trách nhiệm trước pháp luật.</p>
   
        </div>

        <div className="dieukhoan-dkhdv">
          <img src="/img/chuy.png" alt="" /><a href="">Điều khoản</a>
        </div>

        <div className="btn-group-dkhdv">
          <button className="submit-dkhdv">Gửi hồ sơ đăng ký</button>
          <button className="cancel-dkhdv">Hủy bỏ</button>
        </div>
      </div>

    </div>
  );
};

export default ContentDkHdv;