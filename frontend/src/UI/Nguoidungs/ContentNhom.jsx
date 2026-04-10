import React from "react";

const Nhom = () => {
  return (
    <div className="nhom">

      {/* HEADER */}
      <div className="header-nhom">
        <h2>Group của tôi</h2>
        <p>
          Quản lý các nhóm trekking bạn đang tham gia. Kết nối cùng đồng đội cho những chuyến đi sắp tới.
        </p>
      </div>

      {/* GRID */}
      <div className="grid-nhom">

        {/* CREATE CARD */}
        <div className="create-card-nhom">
          <div className="plus-nhom">＋</div>
          <h3>Tạo Nhóm mới</h3>
          <p>Tạo chuyến đi kết hợp cùng bạn bè và đối tác.</p>
        </div>

        {/* CARD 1 */}
        <div className="card-nhom">
          <div className="image-nhom">
            <img src="/img/person.jpg" alt="" />
            <span className="badge active">ĐANG DIỄN RA</span>
          </div>

          <div className="info-nhom">
            <h3>Chinh phục Rừng Dầu</h3>
            <p>📍 Vườn quốc gia Tà Đùng</p>
            <p>👥 12 thành viên</p>

            <button>Vào nhóm →</button>
          </div>
        </div>

        {/* CARD 2 */}
        <div className="card-nhom">
          <div className="image-nhom">
            <img src="/img/forest.jpg" alt="" />
            <span className="badge-nhom hot-nhom">HOT</span>
          </div>

          <div className="info-nhom">
            <h3>Trekking Tà Năng - Phan Dũng</h3>
            <p>📅 25/10/2023</p>
            <p>📍 Bình Thuận</p>

            <button>Vào nhóm →</button>
          </div>
        </div>

        {/* CARD 3 */}
        <div className="card-nhom">
          <div className="image-nhom">
            <img src="/img/girl.jpg" alt="" />
            <span className="badge-nhom done-nhom">ĐÃ HOÀN THÀNH</span>
          </div>

          <div className="info-nhom">
            <h3>Chạm đỉnh Fansipan</h3>
            <p>📍 Lào Cai</p>
            <p>⭐ Hoàn thành 100%</p>

            <button>Xem lại</button>
          </div>
        </div>

      </div>

    </div>
  );
};

export default Nhom;