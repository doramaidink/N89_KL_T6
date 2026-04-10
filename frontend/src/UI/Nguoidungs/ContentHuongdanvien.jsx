import React from "react";

const ContentHuongdanvien = () => {
  return (
    <div className="hdv">

      {/* HEADER */}
      <section className="hdv-header">
        <h1>Tất Cả Hướng Dẫn Viên</h1>
        <p>
          Kết nối với những người am hiểu bản địa để khám phá vẻ đẹp hoang sơ,
          hùng vĩ của dải đất hình chữ S.
        </p>

        {/* FILTER BOX */}
        <div className="hdv-filter-box">

          <input placeholder="Tên hướng dẫn viên hoặc khu vực..." />

          <select>
            <option>Tất cả địa điểm</option>
            <option>Hà Giang</option>
            <option>Sapa</option>
            <option>Đà Lạt</option>
          </select>

          <select>
            <option>Tất cả ngôn ngữ</option>
            <option>Tiếng Việt</option>
            <option>English</option>
          </select>

          <select>
            <option>Tất cả mức giá</option>
            <option>Dưới 500k</option>
            <option>500k - 1tr</option>
            <option>Trên 1tr</option>
          </select>

        </div>

        {/* TAG ACTIVE */}
        <div className="hdv-tags">
          <span>Hà Giang ✖</span>
          <span>Tiếng Anh ✖</span>
          <span className="hdv-clear">Xóa tất cả bộ lọc</span>
        </div>

      </section>

      {/* GRID */}
      <section className="hdv-grid">

        {/* CARD */}
        <div className="hdv-card">
          <div className="hdv-img">
            <img src="/img/hdv1.jpg" alt="" />
            <span className="verify">✔ ĐÃ XÁC MINH</span>
            <div className="hdv-rating">⭐ 4.9 (120)</div>
          </div>

          <div className="hdv-info">
            <h3>Thanh Thảo</h3>
            <p>Hà Giang, Việt Nam</p>

            <p className="hdv-desc">
              Chuyên gia leo núi với hơn 5 năm kinh nghiệm dẫn đoàn trekking.
            </p>

            <div className="hdv-tags">
              <span>Tiếng Anh</span>
              <span>Trung cấp</span>
            </div>

            <div className="hdv-price">
              <p>750.000đ <span>/ngày</span></p>
              <button>Xem Hồ Sơ & Đặt Lịch</button>
            </div>
          </div>
        </div>

        {/* CARD 2 */}
        <div className="hdv-card">
          <div className="hdv-img">
            <img src="/img/hdv2.jpg" alt="" />
            <span className="hdv-verify">✔ ĐÃ XÁC MINH</span>
            <div className="hdv-rating">⭐ 4.8 (95)</div>
          </div>

          <div className="hdv-info">
            <h3>Hoàng Nam</h3>
            <p> Sapa, Lào Cai</p>

            <p className="hdv-desc">
              Thành thạo văn hóa bản địa, dẫn tour trekking và khám phá.
            </p>

            <div className="hdv-tags">
              <span>Tiếng Việt</span>
              <span>Tiếng Mông</span>
            </div>

            <div className="hdv-price">
              <p>600.000đ <span>/ngày</span></p>
              <button>Xem Hồ Sơ & Đặt Lịch</button>
            </div>
          </div>
        </div>

        {/* CARD 3 */}
        <div className="hdv-card">
          <div className="hdv-img">
            <img src="/img/hdv3.jpg" alt="" />
            <span className="hdv-verify">✔ ĐÃ XÁC MINH</span>
            <div className="hdv-rating">⭐ 5.0 (80)</div>
          </div>

          <div className="hdv-info">
            <h3>Lan Hương</h3>
            <p> Phong Nha, Quảng Bình</p>

            <p className="hdv-desc">
              Chuyên gia hang động, dẫn tour khám phá thiên nhiên mạo hiểm.
            </p>

            <div className="hdv-tags">
              <span>Tiếng Anh</span>
              <span>Tiếng Nhật</span>
            </div>

            <div className="hdv-price">
              <p>1.200.000đ <span>/ngày</span></p>
              <button>Xem Hồ Sơ & Đặt Lịch</button>
            </div>
          </div>
        </div>

        {/* CARD 4 */}
        <div className="hdv-card">
          <div className="hdv-img">
            <img src="/img/hdv4.jpg" alt="" />
            <span className="hdv-verify">✔ ĐÃ XÁC MINH</span>
            <div className="hdv-rating">⭐ 4.7 (60)</div>
          </div>

          <div className="hdv-info">
            <h3>Minh Tuấn</h3>
            <p> Đà Lạt, Lâm Đồng</p>

            <p className="hdv-desc">
              Hướng dẫn viên thân thiện, phù hợp chuyến đi nhẹ nhàng.
            </p>

            <div className="hdv-tags">
              <span>Tiếng Anh</span>
              <span>Tiếng Trung</span>
            </div>

            <div className="hdv-price">
              <p>500.000đ <span>/ngày</span></p>
              <button>Xem Hồ Sơ & Đặt Lịch</button>
            </div>
          </div>
        </div>

      </section>

      {/* PAGINATION */}
      <div className="hdv-pagination">
        <button>{"<"}</button>
        <button className="hdv-active">1</button>
        <button>2</button>
        <button>3</button>
        <button>...</button>
        <button>12</button>
        <button>{">"}</button>
      </div>

    </div>
  );
};

export default ContentHuongdanvien;