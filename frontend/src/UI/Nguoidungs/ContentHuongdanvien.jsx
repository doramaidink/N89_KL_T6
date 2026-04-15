import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const ContentHuongdanvien = ({ user = null }) => {
  const navigate = useNavigate();

  const [huongdanviens, setHuongdanviens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [selectedPrice, setSelectedPrice] = useState("");
  const [selectedGuide, setSelectedGuide] = useState(null);
  const [showLoginNotice, setShowLoginNotice] = useState(false);

  useEffect(() => {
    const fetchHuongDanVien = async () => {
      try {
        const response = await fetch("http://localhost:5000/huongdanvien");
        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || "Không thể tải dữ liệu");
        }

        setHuongdanviens(result.huongdanviens || []);
      } catch (error) {
        console.error("Lỗi lấy hướng dẫn viên:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHuongDanVien();
  }, []);

  const getImageUrl = (image) => {
    if (!image) return "/img/default-user.jpg";
    if (image.startsWith("http")) return image;
    if (image.startsWith("/")) return image;
    return `/${image}`;
  };

  const getDiaDiemImage = (diaDiem) => {
    if (!diaDiem) return "/img/default-place.jpg";

    if (diaDiem.image) return getImageUrl(diaDiem.image);
    if (Array.isArray(diaDiem.images) && diaDiem.images.length > 0) {
      return getImageUrl(diaDiem.images[0]);
    }

    return "/img/default-place.jpg";
  };

  const formatPrice = (price) => {
    if (!price && price !== 0) return "Liên hệ";
    return `${Number(price).toLocaleString("vi-VN")}đ`;
  };

  const filteredHuongDanViens = useMemo(() => {
    return huongdanviens.filter((item) => {
      const text = keyword.trim().toLowerCase();

      const matchKeyword =
        !text ||
        item.hoTen?.toLowerCase().includes(text) ||
        item.tinhDangKy?.toLowerCase().includes(text) ||
        item.queQuan?.toLowerCase().includes(text) ||
        item.gioiThieuBanThan?.toLowerCase().includes(text);

      const matchLanguage =
        !selectedLanguage ||
        (item.ngonNguHoTro || []).includes(selectedLanguage);

      let matchPrice = true;
      if (selectedPrice === "under500") {
        matchPrice = Number(item.giaThue) < 500000;
      } else if (selectedPrice === "500to1m") {
        matchPrice =
          Number(item.giaThue) >= 500000 && Number(item.giaThue) <= 1000000;
      } else if (selectedPrice === "over1m") {
        matchPrice = Number(item.giaThue) > 1000000;
      }

      return matchKeyword && matchLanguage && matchPrice;
    });
  }, [huongdanviens, keyword, selectedLanguage, selectedPrice]);
  const handleDangKyThueTheoDiaDiem = (guide, place) => {
    if (!user) {
      setShowLoginNotice(true);
      setTimeout(() => {
        setShowLoginNotice(false);
      }, 2500);
      return;
    }

    const selectedGuideForPayment = {
      ...guide,
      giaThue: place?.mucGia || guide?.giaThue || 0,
      diaDiemDuocChon: {
        _id: place?.diaDiem?._id || "",
        tenDiaDiem: place?.diaDiem?.tenDiaDiem || "",
        khuVuc: place?.diaDiem?.khuVuc || "",
        image: place?.diaDiem?.image || "",
        images: place?.diaDiem?.images || [],
        slug: place?.diaDiem?.slug || "",
      },
      kinhNghiemTaiDiaDiem: place?.kinhNghiem || "",
    };

    localStorage.setItem("selectedGuide", JSON.stringify(selectedGuideForPayment));
    navigate("/thanhtoan");
  };

  const handleDangKyThue = () => {
    if (!user) {
      setShowLoginNotice(true);
      setTimeout(() => {
        setShowLoginNotice(false);
      }, 2500);
      return;
    }

    // Có thể lưu tạm guide đang chọn để test thanh toán
    if (selectedGuide) {
      localStorage.setItem("selectedGuide", JSON.stringify(selectedGuide));
    }

    // Chuyển thẳng sang trang thanh toán để test
    navigate("/thanhtoan");
  };

  if (loading) {
    return (
      <div className="hdv-page">
        <div className="hdv-container">
          <p className="hdv-loading">Đang tải dữ liệu hướng dẫn viên...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="hdv-page">
      {showLoginNotice && (
        <div className="fixed top-24 right-5 z-[99999] animate-bounce">
          <div className="bg-amber-400 text-black px-5 py-4 rounded-2xl shadow-2xl border border-amber-200 min-w-[280px]">
            <div className="font-bold text-[15px] mb-1">Thông báo</div>
            <div className="text-sm">Bạn cần đăng nhập để thuê hướng dẫn viên.</div>
          </div>
        </div>
      )}

      <div className="hdv-container">
        <section className="hdv-header">
          <h1>Tất Cả Hướng Dẫn Viên</h1>
          <p>
            Kết nối với những người am hiểu bản địa để khám phá vẻ đẹp hoang sơ,
            hùng vĩ của dải đất hình chữ S.
          </p>

          <div className="hdv-filter-box">
            <input
              type="text"
              placeholder="Tìm kiếm tên hoặc vùng"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />

            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
            >
              <option value="">Tất cả ngôn ngữ</option>
              <option value="Tiếng Việt">Tiếng Việt</option>
              <option value="English">English</option>
            </select>

            <select
              value={selectedPrice}
              onChange={(e) => setSelectedPrice(e.target.value)}
            >
              <option value="">Tất cả mức giá</option>
              <option value="under500">Dưới 500k</option>
              <option value="500to1m">500k - 1 triệu</option>
              <option value="over1m">Trên 1 triệu</option>
            </select>
          </div>
        </section>

        <section className="hdv-grid">
          {filteredHuongDanViens.length > 0 ? (
            filteredHuongDanViens.map((item) => (
              <div className="hdv-card" key={item._id}>
                <div className="hdv-card-image">
                  <img src={getImageUrl(item.image)} alt={item.hoTen} />
                  {item.verificationStatus === "da_xac_thuc" && (
                    <span className="hdv-badge">ĐÃ XÁC MINH</span>
                  )}
                </div>

                <div className="hdv-card-body">
                  <div className="hdv-card-meta">
                    <span>★ 4.9</span>
                    <span>{item.tinhDangKy || item.queQuan || "Chưa cập nhật"}</span>
                  </div>

                  <h3>{item.hoTen}</h3>

                  <p className="hdv-card-desc">
                    {item.gioiThieuBanThan || "Chưa có mô tả giới thiệu."}
                  </p>

                  <div className="hdv-card-tags">
                    {(item.ngonNguHoTro || []).slice(0, 2).map((lang, index) => (
                      <span key={index}>{lang}</span>
                    ))}
                    {item.soNamKinhNghiem > 0 && (
                      <span>{item.soNamKinhNghiem} năm KN</span>
                    )}
                  </div>

                  <div className="hdv-card-bottom">

                    <button
                      className="hdv-card-btn"
                      onClick={() => setSelectedGuide(item)}
                    >
                      Xem Hồ Sơ & Đặt Lịch
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="hdv-empty">Không có hướng dẫn viên phù hợp.</div>
          )}
        </section>
      </div>

      {selectedGuide && (
        <div
          className="hdv-modal-overlay"
          onClick={() => setSelectedGuide(null)}
        >
          <div className="hdv-modal" onClick={(e) => e.stopPropagation()}>
            <button
              className="hdv-modal-close"
              onClick={() => setSelectedGuide(null)}
            >
              ×
            </button>

            <div className="hdv-modal-left">
              <div className="hdv-profile-card">
                <img
                  src={getImageUrl(selectedGuide.image)}
                  alt={selectedGuide.hoTen}
                />
                <h3>{selectedGuide.hoTen}</h3>
                <p>{selectedGuide.tinhDangKy || selectedGuide.queQuan}</p>



                <div className="hdv-profile-mini">
                  <div>
                    <span>Kinh nghiệm</span>
                    <strong>
                      {selectedGuide.soNamKinhNghiem
                        ? `${selectedGuide.soNamKinhNghiem} năm`
                        : "Chưa rõ"}
                    </strong>
                  </div>
                  <div>
                    <span>Ngôn ngữ</span>
                    <strong>
                      {(selectedGuide.ngonNguHoTro || []).join(" / ") || "Chưa rõ"}
                    </strong>
                  </div>
                </div>
              </div>

              <div className="hdv-info-card">
                <h4>Thông tin cá nhân</h4>

                <div className="hdv-info-list">
                  <div><span>Họ và tên</span><strong>{selectedGuide.hoTen || "Chưa có"}</strong></div>
                  <div><span>Số điện thoại</span><strong>{selectedGuide.soDienThoai || "Chưa có"}</strong></div>
                  <div><span>Số CCCD</span><strong>{selectedGuide.soCCCD || "Chưa có"}</strong></div>
                  <div><span>Địa chỉ</span><strong>{selectedGuide.diaChi || "Chưa có"}</strong></div>
                  <div><span>Quê quán</span><strong>{selectedGuide.queQuan || "Chưa có"}</strong></div>
                  <div><span>Tỉnh đăng ký</span><strong>{selectedGuide.tinhDangKy || "Chưa có"}</strong></div>
                </div>
              </div>
            </div>

            <div className="hdv-modal-right">
              <div className="hdv-section-card">
                <h3>Giới thiệu bản thân</h3>
                <p className="hdv-intro-text">
                  {selectedGuide.gioiThieuBanThan || "Chưa có giới thiệu bản thân."}
                </p>

                <div className="hdv-skill-tags">
                  {(selectedGuide.kyNangDacBiet || []).map((item, index) => (
                    <span key={index}>{item}</span>
                  ))}
                </div>
              </div>

              <div className="hdv-section-card">
                <h3>Địa điểm & Giá cả</h3>

                <div className="hdv-place-grid">
                  {(selectedGuide.diaDiemGiaCa || []).length > 0 ? (
                    selectedGuide.diaDiemGiaCa.map((place, index) => (
                      <div className="hdv-place-card" key={index}>
                        <div className="hdv-place-image">
                          <img
                            src={getDiaDiemImage(place.diaDiem)}
                            alt={place.diaDiem?.tenDiaDiem || "Địa điểm"}
                          />
                        </div>

                        <div className="hdv-place-info">
                          <div className="hdv-place-top">
                            <h4>
                              {place.diaDiem?.tenDiaDiem || `Địa điểm ${index + 1}`}
                            </h4>
                            <strong>{formatPrice(place.mucGia)}/tour</strong>
                          </div>

                          <p className="hdv-place-area">
                            {place.diaDiem?.khuVuc || "Chưa cập nhật khu vực"}
                          </p>

                          <p className="hdv-place-exp">
                            {place.kinhNghiem || "Chưa có mô tả kinh nghiệm"}
                          </p>

                          <button
                            className="hdv-place-hire-btn"
                            onClick={() => handleDangKyThueTheoDiaDiem(selectedGuide, place)}
                          >
                            Đăng ký thuê
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="hdv-empty">Chưa có dữ liệu địa điểm giá cả.</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentHuongdanvien;