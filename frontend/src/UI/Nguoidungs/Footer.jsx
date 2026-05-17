import React from "react";

const Footer = () => {
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
          <p>Dưới Biển</p>
          <p>Trên Núi</p>
          <p>Trong Rừng</p>
          <p>Đồi Dóc</p>
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
          <h4>Phản ánh/ Góp ý</h4>
          <p>
            Chúng tôi luôn lắng nghe và trân trọng mọi ý kiến đóng góp để cải thiện dịch vụ và mang đến trải nghiệm tốt nhất cho cộng đồng.
          </p>
            <p>Gửi phản ánh/ góp ý qua :</p>
          <div className="lienhe">
            <h2>SĐT: 0382130809</h2>
          </div>
           <div className="lienhe">
            <h2>Email: vqthanh1999@gmail.com</h2>
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

export default Footer;