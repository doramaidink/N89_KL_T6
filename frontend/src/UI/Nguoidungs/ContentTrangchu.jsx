import React, { useMemo, useState } from 'react';
import { useNavigate } from "react-router-dom";

const ContentTrangchu = ({ data, user = null }) => {
  const { diaDiemnoibat = [] } = data || {};
  const navigate = useNavigate();

  const [searchKeyword, setSearchKeyword] = useState("");

  const handleDiKhamPha = () => {
    if (user) {
      navigate(`/${encodeURIComponent(user.hoTen)}/khamphauser`);
    } else {
      navigate("/khampha");
    }
  };
  const handleTimHieuThem = () => {
    document
      .getElementById("lydo-section")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleDiHuongDanVien = () => {
    if (user) {
      navigate(`/${encodeURIComponent(user.hoTen)}/huongdanvienuser`);
    } else {
      navigate("/huongdanvien");
    }
  };
  ///chitietdiadiem/${item.slug}
  const handleChiTietDiaDiem = (slug) => {
    if (user) {
      navigate(`/${encodeURIComponent(user.hoTen)}/chitietdiadiemuser/${slug}`);
    } else {
      navigate(`/chitietdiadiem/${slug}`);
    }
  };

  const handleTimKiem = () => {
    const keyword = searchKeyword.trim();

    if (user) {
      navigate(`/${encodeURIComponent(user.hoTen)}/khamphauser`, {
        state: { keyword }
      });
    } else {
      navigate("/khampha", {
        state: { keyword }
      });
    }
  };

  const filteredDiaDiem = useMemo(() => {
    return diaDiemnoibat.filter(item => item.hot);
  }, [diaDiemnoibat]);

  return (
    <div className="home">
      <section className="tieude-trangchu">
        <h1>Khám phá vẻ đẹp tiềm<br /> ẩn của Việt Nam</h1>
        <p>
          Trải nghiệm những địa điểm hoang sơ, kết nối cùng hướng dẫn viên<br />
          bản địa và chinh phục những cung đường mạo hiểm nhất.
        </p>

        <div className="timkiem-trangchu">
          <input
            placeholder="Bạn muốn đi đâu hôm nay?"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleTimKiem();
            }}
          />
          <button type="button" onClick={handleTimKiem}>
            Tìm kiếm
          </button>
        </div>
      </section>

      <section className="gioithieu-trangchu">
        <div className="container-trangchu">
          <div className="left-trangchu">
            <span className="badge-trangchu">
              <img
                className="vechungtoi-contenttrangchu"
                src="/public/img/chu y.png"
                alt=""
              />
              Về chúng tôi
            </span>

            <h1>
              Về Backpacking <br /> VietNam
            </h1>

            <p>
              Một trang web dành cho những người du lịch bụi, thích khám phá những
              nơi ở Việt Nam, đồng thời gắn kết những người chung chí hướng với
              nhau. Mọi người có thể chia sẻ những tấm ảnh, địa điểm mình đã khám
              phá lên cho mọi người cùng biết.
            </p>

            <p>
              Bạn có thể tạo một tour cho địa điểm này khi mọi người muốn đi và bạn
              có thể thu phí cho việc dẫn đường với trung gian là chúng tôi.
            </p>

            <div className="buttons-trangchu">
              <button
                type="button"
                className="btn-primary-contenttrangchu"
                onClick={handleDiKhamPha}
              >
                Bắt đầu ngay
              </button>

              <button
                type="button"
                className="btn-secondary-contenttrangchu"
                onClick={handleTimHieuThem}
              >
                Tìm hiểu thêm
              </button>
            </div>
          </div>

          <div className="right-trangchu">
            <div className="grid-trangchu">
              <div className="card-trangchu large-trangchu">
                <img src="/public/img/anhgioithieu.jpg" alt="" />
              </div>

              <div className="card-trangchu stat-card-trangchu">
                <span>📷</span>
                <h3>50k+</h3>
                <p>Ảnh chia sẻ</p>
              </div>

              <div className="cardanh2-trangchu ">
                <img src="/public/img/anhgioithieu1.jpg" alt="" />
              </div>

              <div className="cardtrangchu image-card-trangchu">
                <span>👥</span>
                <h3>10k+</h3>
                <p>Thành viên</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="diemnoibat-trangchu">
        <div className="header-trangchu">
          <div>
            <h2>Điểm Đến Nổi Bật</h2>
            <p>
              Khám phá những vùng đất chưa từng xuất hiện trên bản đồ du lịch thông thường.
            </p>
          </div>

          <button
            type="button"
            className="all-trangchu"
            onClick={handleDiKhamPha}
          >
            Xem tất cả →
          </button>
        </div>

        <div className="luoi-trangchu">
          {filteredDiaDiem.map(item => (
            <div
              key={item._id}
              onClick={() => handleChiTietDiaDiem(item.slug)}
              className="place-card-trangchu"
            >
              <div className="image-trangchu">
                <img src={item.image} alt="" />

                <div className="tags-trangchu">
                  {item.dacDiemDiaDanh?.slice(0, 2).map((tag, index) => (
                    <span key={index} className="tag-item">
                      {tag.toUpperCase()}
                    </span>
                  ))}
                </div>
              </div>

              <div className="info-trangchu">
                <span className="location-trangchu">
                  <img className="poin-trangchu" src="/public/img/poin.png" alt="" />
                  {item.khuVuc}
                </span>
                <h3>{item.tenDiaDiem}</h3>
                <div className="rating-trangchu">
                  <img className="sao-trangchu" src="/public/img/saovang.png" alt="" />
                  4.8 <span>(500 đánh giá)</span>
                </div>
              </div>
            </div>
          ))}

          <div className="cta-card-trangchu">
            <div className="icon-trangchu">
              <img className="bando-trangchu" src="/public/img/address.png" alt="" />
            </div>
            <h3>Địa Điểm Nổi Bật</h3>
            <p>Xem tất cả các địa điểm nổi bật.</p>
            <button type="button" onClick={handleDiKhamPha}>
              Xem địa điểm
            </button>
          </div>
        </div>
      </section>

      <section className="why-trangchu">
        <div className="cta-banner-trangchu">
          <div className="cta-left-trangchu">
            <h2>Kết nối cùng Hướng Dẫn Viên Bản Địa</h2>

            <p>
              Hơn 500+ chuyên gia leo núi và người dẫn bản địa đã sẵn sàng đồng
              hành cùng bạn trên mọi cung đường.
            </p>

            <div className="cta-features-trangchu">
              <span>✔ Xác thực 100%</span>
              <span>✔ Bảo hiểm chuyến đi</span>
              <span>✔ Đa ngôn ngữ</span>
            </div>

            <button type="button" onClick={handleDiHuongDanVien}>
              Tìm Người Đồng Hành
            </button>
          </div>

          <div className="cta-right-trangchu">
            <img src="/images/beach.jpg" alt="" />
            <img src="/images/forest.jpg" alt="" />
          </div>
        </div>

        <div className="why-title-trangchu" id="lydo-section">
          <h2>Lý do nên chọn chúng tôi</h2>
          <div className="line-trangchu"></div>
        </div>

        <div className="why-grid-trangchu">
          <div className="why-card-trangchu">
            <div className="icon-trangchu">
              <img className="kefooter-trangchu" src="/public/img/prestige.png" alt="" />
            </div>
            <h3>Uy tín</h3>
            <p>
              Mọi dịch vụ và hội nhóm đều được kiểm duyệt nghiêm ngặt đảm bảo an
              toàn tối đa cho chuyến đi của bạn.
            </p>
          </div>

          <div className="why-card-trangchu">
            <div className="icon-trangchu">
              <img className="kefooter-trangchu" src="/public/img/nui.png" alt="" />
            </div>
            <h3>Vô vàn địa điểm</h3>
            <p>
              Khám phá kho tàng các địa điểm hoang sơ, từ những cánh rừng già Tây
              Bắc đến những hòn đảo bí ẩn tại miền Nam.
            </p>
          </div>

          <div className="why-card-trangchu">
            <div className="icon-trangchu">
              <img className="kefooter-trangchu" src="/public/img/hotro.png" alt="" />
            </div>
            <h3>Hỗ trợ 24/7</h3>
            <p>
              Đội ngũ hỗ trợ và cộng đồng Backpacking luôn sẵn sàng giúp bạn trên
              mọi cung đường bất kể ngày đêm.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContentTrangchu;