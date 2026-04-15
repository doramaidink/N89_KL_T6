import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

const ContentChitietdiadiem = ({ user = null }) => {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [diaDiem, setDiaDiem] = useState(null);
  const [loading, setLoading] = useState(true);

  const [allGuides, setAllGuides] = useState([]);
  const [loadingGuides, setLoadingGuides] = useState(false);
  const [showGuideModal, setShowGuideModal] = useState(false);

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

  const fetchGuides = async () => {
    try {
      setLoadingGuides(true);
      const res = await axios.get("http://localhost:5000/huongdanvien");
      setAllGuides(res.data.huongdanviens || []);
      setShowGuideModal(true);
    } catch (error) {
      console.error("Lỗi lấy hướng dẫn viên:", error);
      toast.error("Không thể tải danh sách hướng dẫn viên.");
    } finally {
      setLoadingGuides(false);
    }
  };

  const guidesByPlace = useMemo(() => {
    if (!diaDiem?._id) return [];

    return allGuides.filter((guide) => {
      const inCacDiaDiemDangKy = (guide.cacDiaDiemDangKy || []).some(
        (item) => String(item?._id || item) === String(diaDiem._id)
      );

      const inDiaDiemGiaCa = (guide.diaDiemGiaCa || []).some(
        (item) => String(item?.diaDiem?._id || item?.diaDiem) === String(diaDiem._id)
      );

      return inCacDiaDiemDangKy || inDiaDiemGiaCa;
    });
  }, [allGuides, diaDiem]);

  const handleOpenGuideModal = () => {
    fetchGuides();
  };

  const handleHireGuide = (guide) => {
    if (!user) {
      toast.warning("Bạn cần đăng nhập để thuê hướng dẫn viên.");
      return;
    }

    localStorage.setItem("selectedGuide", JSON.stringify(guide));
    navigate("/thanhtoan");
  };

  const getGuidePrice = (guide) => {
    const giaTheoDiaDiem = (guide.diaDiemGiaCa || []).find(
      (item) => String(item?.diaDiem?._id || item?.diaDiem) === String(diaDiem?._id)
    );

    if (giaTheoDiaDiem?.mucGia) return giaTheoDiaDiem.mucGia;
    if (guide.giaThue) return guide.giaThue;
    return 0;
  };

  const formatPrice = (price) => {
    if (!price && price !== 0) return "Liên hệ";
    return `${Number(price).toLocaleString("vi-VN")}đ/ngày`;
  };

  const getImageUrl = (image) => {
    if (!image) return "/img/default-user.jpg";
    if (image.startsWith("http")) return image;
    if (image.startsWith("/")) return image;
    return `/${image}`;
  };

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
                <button
                  className="btn-hero"
                  onClick={handleOpenGuideModal}
                  disabled={loadingGuides}
                >
                  {loadingGuides ? "Đang tải..." : "Thuê Hướng Dẫn Viên"}
                </button>
                <button className="btn-hero btn-hero-outline">
                  Chia sẻ địa điểm
                </button>
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

      {showGuideModal && (
        <div
          className="guide-place-modal-overlay"
          onClick={() => setShowGuideModal(false)}
        >
          <div
            className="guide-place-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="guide-place-header">
              <div>
                <span className="guide-place-subtitle">
                  DỊCH VỤ BACKPACKING VIỆT NAM
                </span>
                <h2>Danh sách Hướng dẫn viên tại {diaDiem.tenDiaDiem}</h2>
                <p>
                  Tìm kiếm người bản địa đồng hành bên bạn, am hiểu sâu sắc về hệ sinh
                  thái địa phương.
                </p>
              </div>

              <button
                className="guide-place-close"
                onClick={() => setShowGuideModal(false)}
              >
                ×
              </button>
            </div>

         

            <div className="guide-place-list">
              {guidesByPlace.length > 0 ? (
                guidesByPlace.map((guide) => (
                  <div className="guide-place-card" key={guide._id}>
                    <div className="guide-place-left">
                      <img
                        src={getImageUrl(guide.image)}
                        alt={guide.hoTen}
                        className="guide-place-avatar"
                      />

                      <div className="guide-place-info">
                        <div className="guide-place-name-row">
                          <h3>{guide.hoTen}</h3>
                          {guide.verificationStatus === "da_xac_thuc" && (
                            <span className="guide-place-badge">ĐÃ XÁC MINH</span>
                          )}
                        </div>

                        <div className="guide-place-meta">
                          <span>📍 {guide.tinhDangKy || guide.queQuan || "Chưa cập nhật"}</span>
                          <span>
                            ⏱ {guide.soNamKinhNghiem || 0} năm kinh nghiệm
                          </span>
                        </div>

                        <div className="guide-place-rating">
                          ★★★★★ <span>(52 đánh giá)</span>
                        </div>

                        <div className="guide-place-price">
                          <span>GIÁ THUÊ</span>
                          <strong>{formatPrice(getGuidePrice(guide))}</strong>
                        </div>
                      </div>
                    </div>

                    <div className="guide-place-right">
                      <button
                        className="guide-place-action"
                        onClick={() => handleHireGuide({
                          ...guide,
                          giaThue: getGuidePrice(guide),
                        })}
                      >
                        Thuê
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="guide-place-empty">
                  Hiện chưa có hướng dẫn viên đăng ký tại địa điểm này.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentChitietdiadiem;