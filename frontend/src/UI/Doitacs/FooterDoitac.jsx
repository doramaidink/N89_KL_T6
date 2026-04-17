import React from "react";

const FooterDoitac = () => {
  return (
    <footer className="footer">
      <div className="footer-content">

        {/* COL 1 */}
        <div className="footer-col brand">
          <h3>🌿 Backpacking VN</h3>
          <p>
            Nền tảng dành cho những tâm hồn tự do, yêu thiên nhiên và khao khát
            khám phá những cung đường mạo hiểm tại Việt Nam.
          </p>

          
        </div>

        {/* COL 2 */}
        <div className="footer-col">
          <h4>KHÁM PHÁ</h4>
          <p>Miền Bắc</p>
          <p>Miền Trung</p>
          <p>Miền Tây</p>
          <p>Tây Nguyên</p>
        </div>

        {/* COL 3 */}
        <div className="footer-col">
          <h4>THÔNG TIN</h4>
          <p>Về chúng tôi</p>
          <p>Chính sách bảo mật</p>
          <p>Điều khoản sử dụng</p>
          <p>Liên hệ quảng cáo</p>
        </div>

        {/* COL 4 */}
        <div className="footer-col newsletter">
          <h4>ĐĂNG KÝ BẢN TIN</h4>
          <p>
            Nhận thông tin về các cung đường mới nhất mỗi tuần.
          </p>

          <div className="input-box-footer">
            <input placeholder="Email của bạn" />
            <button>➤</button>
          </div>
        </div>

      </div>

      {/* LINE */}
      <div className="footer-line"></div>

      {/* COPYRIGHT */}
      <p className="copy-footer">
        © 2024 Backpacking VietNam. All rights reserved. Made for explorers.
      </p>
    </footer>
  );
};

export default FooterDoitac;