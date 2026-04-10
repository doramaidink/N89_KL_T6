import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const ContentChitietdiadiem = () => {
  const { slug } = useParams();

  const [diaDiem, setDiaDiem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getChiTietDiaDiem = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/chitietdiadiem/${slug}`);
        setDiaDiem(res.data.diaDiems);
      } catch (error) {
        console.error("Lỗi lấy chi tiết địa điểm:", error);
      } finally {
        setLoading(false);
      }
    };

    if (slug) getChiTietDiaDiem();
  }, [slug]);

  if (loading) {
    return <div className="chitiet-loading">Đang tải dữ liệu...</div>;
  }

  if (!diaDiem) {
    return <div className="chitiet-loading">Không tìm thấy địa điểm.</div>;
  }

  const mockDanhGia = [
    {
      ten: "Hoàng Tuấn Anh",
      thoiGian: "1 tháng trước",
      noiDung:
        "Tuyệt vời nếu bạn thích khám phá! Khung cảnh hùng vĩ và không khí trong lành.",
      anh1: "/img/rungdau/rungdau1.jpg",
      anh2: "/img/rungdau/rungdau2.jpg",
    },
    {
      ten: "Trần Minh Thư",
      thoiGian: "1 tuần trước",
      noiDung:
        "Cảm giác rất đã, thích hợp trekking và chụp ảnh. Nên đi buổi sáng để có ánh sáng đẹp.",
      anh1: "/img/dinhbanco/dinhbanco1.jpg",
      anh2: "/img/dinhbanco/dinhbanco2.jpg",
    },
  ];

  const mockNhom = [
    {
      ten: "Biệt đội Sơn Trà",
      moTa: "Trekking cuối tuần",
    },
    {
      ten: "Hội săn ảnh",
      moTa: "Phong cảnh - thiên nhiên",
    },
  ];

  return (
    <div className="chitiet-wrapper">
      <div className="chitiet-container">
        <section
          className="hero-chitiet"
          style={{ backgroundImage: `url(${diaDiem.image})` }}
        >
          <div className="hero-overlay">
            <div className="hero-tags">
              {diaDiem.dacDiemDiaDanh?.slice(0, 3).map((tag, index) => (
                <span key={index}>{tag}</span>
              ))}
            </div>

            <div className="hero-content">
              <div className="hero-left">
                <h1>{diaDiem.tenDiaDiem}</h1>
                <p>{diaDiem.moTa}</p>
              </div>

              <div className="hero-right">
                <button className="btn-hero">Thuê Hướng Dẫn Viên</button>
                <button className="btn-hero btn-hero-outline">Chia sẻ địa điểm</button>
              </div>
            </div>
          </div>
        </section>

        <section className="main-chitiet">
          <div className="left-chitiet">
            <div className="card-chitiet">
              <h3>Giới thiệu về {diaDiem.tenDiaDiem}</h3>

              {diaDiem.gioiThieu?.map((doan, index) => (
                <p key={index}>{doan}</p>
              ))}

              <div className="thongso-grid">
                <div className="thongso-item">
                  <span>Độ khó</span>
                  <strong>{diaDiem.doKho}</strong>
                </div>

                <div className="thongso-item">
                  <span>Khu vực</span>
                  <strong>{diaDiem.khuVuc}</strong>
                </div>

                <div className="thongso-item">
                  <span>Vé vào</span>
                  <strong>{diaDiem.veVao}</strong>
                </div>

                <div className="thongso-item">
                  <span>Quãng đường</span>
                  <strong>{diaDiem.quangduong}</strong>
                </div>
              </div>
            </div>

            <div className="card-chitiet">
              <div className="section-title-row">
                <h3>Đánh giá từ cộng đồng</h3>
                <span className="more-link">Xem tất cả</span>
              </div>

              <div className="review-grid">
                {mockDanhGia.map((item, index) => (
                  <div className="review-card" key={index}>
                    <div className="review-header">
                      <div className="avatar-review">{item.ten.charAt(0)}</div>
                      <div>
                        <h4>{item.ten}</h4>
                        <span>{item.thoiGian}</span>
                      </div>
                    </div>

                    <p>{item.noiDung}</p>

                    <div className="review-images">
                      <img src={item.anh1} alt="" />
                      <img src={item.anh2} alt="" />
                      <div className="more-photos">+2 ảnh</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="right-chitiet">
            <div className="card-chitiet">
              <h3>Nhóm đang hoạt động</h3>
              <p className="sub-card">
                Tham gia các nhóm khám phá địa điểm đang được quan tâm.
              </p>

              <div className="nhom-list">
                {mockNhom.map((item, index) => (
                  <div className="nhom-item" key={index}>
                    <div>
                      <h4>{item.ten}</h4>
                      <span>{item.moTa}</span>
                    </div>
                    <button>Tham gia</button>
                  </div>
                ))}
              </div>

              <div className="all-group-btn">Tạo nhóm mới</div>
            </div>

            <div className="card-chitiet">
              <h3>Hình ảnh địa điểm</h3>

              <div className="gallery-grid">
                {diaDiem.images?.slice(0, 4).map((img, index) => (
                  <img key={index} src={img} alt="" />
                ))}
                {diaDiem.images?.length > 4 && (
                  <div className="gallery-more">+{diaDiem.images.length - 4}</div>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ContentChitietdiadiem;