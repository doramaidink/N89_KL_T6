import React from "react";

const ContentThongbao = () => {
  return (
    <div className="container-thongbao">

      {/* SIDEBAR */}
      <div className="sidebar-thongbao">

        <div className="profile-thongbao">
          <img src="/img/avatar.jpg" />
          <h4>Nguyễn Văn A</h4>
          <span>Thành viên hạng vàng</span>
        </div>

        <div className="menu-thongbao">
          <div className="item-thongbao">Thông tin cá nhân</div>
          <div className="item-thongbao active-thongbao">Thông báo</div>
          <div className="item-thongbao">Lịch sử chuyến đi</div>
          <div className="item-thongbao">Hóa đơn</div>
          <div className="item-thongbao logout-thongbao">Đăng xuất</div>
        </div>

      </div>

      {/* CONTENT */}
      <div className="content-thongbao">

        <div className="card-thongbao">

          <div className="header-thongbao">
            <h3>🔔 Thư hệ thống</h3>
            <span>Xem tất cả</span>
          </div>

          {/* ITEM 1 */}
          <div className="item-noti-thongbao">
            <div className="icon-thongbao green-thongbao">%</div>

            <div className="body-thongbao">
              <h4>Khuyến mãi đậm vào ngày 20/4</h4>
              <p>Giảm giá 50% cho các tour miền Tây.</p>
              <span className="tag-thongbao">Ưu đãi</span>
            </div>

            <div className="time-thongbao">2 giờ trước</div>
          </div>

          {/* ITEM 2 */}
          <div className="item-noti-thongbao">
            <div className="icon-thongbao blue-thongbao">↻</div>

            <div className="body-thongbao">
              <h4>Cập nhật tính năng mới</h4>
              <p>Hệ thống đã được nâng cấp trải nghiệm.</p>
              <span className="tag-thongbao blue-tag-thongbao">Tin tức</span>
            </div>

            <div className="time-thongbao">1 ngày trước</div>
          </div>

          {/* ITEM 3 */}
          <div className="item-noti-thongbao">
            <div className="icon-thongbao green-thongbao">✔</div>

            <div className="body-thongbao">
              <h4>Chào mừng bạn đến với Backpacking</h4>
              <p>Hãy hoàn thiện hồ sơ để bắt đầu hành trình.</p>
              <span className="tag-thongbao">Hệ thống</span>
            </div>

            <div className="time-thongbao">3 ngày trước</div>
          </div>

          <div className="more-thongbao">
            Xem các thông báo cũ hơn
          </div>

        </div>

      </div>

    </div>
  );
};

export default ContentThongbao;