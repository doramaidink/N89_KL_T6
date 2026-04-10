import React from "react";

const ContentLichsuchuyendi = () => {
  return (
    <div className="page-lichsu">

      {/* SIDEBAR */}
      <div className="sidebar-lichsu">

        <div className="profile-lichsu">
          <img src="/img/avatar.jpg" />
          <h4>Nguyễn Văn A</h4>
          <span>THÀNH VIÊN HẠNG VÀNG</span>
        </div>

        <div className="menu-lichsu">
          <div className="item-lichsu">Thông tin cá nhân</div>
          <div className="item-lichsu">Thông báo</div>
          <div className="item-lichsu active">Lịch sử chuyến đi</div>
          <div className="item-lichsu">Hóa đơn</div>
          <div className="item-lichsu logout">Đăng xuất</div>
        </div>

      </div>

      {/* RIGHT CONTENT */}
      <div className="content-lichsu">

        <h2>Lịch sử chuyến đi</h2>
        <p className="sub-lichsu">
          Lưu giữ những kỷ niệm trên hành trình khám phá Việt Nam của bạn.
        </p>

        {/* CARD */}
        <div className="card-lichsu">

          {/* LEFT */}
          <div className="left-lichsu">
            <div className="img-lichsu"></div>
          </div>

          {/* CENTER */}
          <div className="center-lichsu">

            <span className="badge-lichsu active-lichsu">
              ĐANG DIỄN RA
            </span>

            <h3>Rừng Dừa Sơn Trà - Chinh phục đỉnh Bàn Cờ</h3>

            <div className="meta-lichsu">
              <div className="meta-left-lichsu">
                <p>📅 Ngày đi: 20/05/2024</p>
                <p>📍 Địa điểm: Đà Nẵng</p>
              </div>

              <div className="meta-right-lichsu">
                <p>👤 Hướng dẫn viên: Trần Văn B</p>
                <p>👥 Đoàn: 12 người</p>
              </div>
            </div>

            <div className="action-lichsu">
              <button className="btn-green-lichsu">
                Liên hệ hướng dẫn viên
              </button>
              <button className="btn-dark-lichsu">
                Xem hóa đơn
              </button>
            </div>

          </div>

          {/* RIGHT */}
          <div className="right-lichsu">
            <div className="price-lichsu">
              <span>VND</span>
              <strong>850.000</strong>
            </div>
          </div>

        </div>

        {/* CARD 2 */}
        <div className="card-lichsu">

          <div className="left-lichsu">
            <div className="img-lichsu"></div>
          </div>

          <div className="center-lichsu">

            <span className="badge-lichsu done-lichsu">
              ĐÃ HOÀN THÀNH
            </span>

            <h3>Cung đường hạnh phúc: Hà Giang - Đồng Văn</h3>

            <div className="meta-lichsu">
              <div className="meta-left-lichsu">
                <p>📅 Ngày đi: 15/04/2024</p>
                <p>📍 Địa điểm: Hà Giang</p>
              </div>

              <div className="meta-right-lichsu">
                <p>👤 Hướng dẫn viên: Lê Thị C</p>
                <p>⭐ Đánh giá: 5/5</p>
              </div>
            </div>

            <div className="action-lichsu">
              <button className="btn-gray-lichsu">Đã đánh giá</button>
              <button className="btn-dark-lichsu">Xem hóa đơn</button>
            </div>

          </div>

          <div className="right-lichsu">
            <div className="price-lichsu">
              <span>VND</span>
              <strong>3.200.000</strong>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

export default ContentLichsuchuyendi;