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

  const [openCreateGroup, setOpenCreateGroup] = useState(false);
  const [stepGroup, setStepGroup] = useState(1);
  const [reviewData, setReviewData] = useState({
    thongKe: {
      tongDanhGia: 0,
      diemTrungBinh: 0,
    },
    danhGias: [],
  });
  useEffect(() => {
    const getDanhGiaMoiNhat = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/danhgia/diadiem/${slug}?limit=2`);
        setReviewData({
          thongKe: res.data.thongKe || { tongDanhGia: 0, diemTrungBinh: 0 },
          danhGias: res.data.danhGias || [],
        });
      } catch (error) {
        console.error("Lỗi lấy đánh giá:", error);
      }
    };

    if (slug) getDanhGiaMoiNhat();
  }, [slug]);

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
  const handleXemTatCaDanhGia = () => {
    if (user?.hoTen) {
      navigate(`/${encodeURIComponent(user.hoTen)}/chitietdiadiemuser/${slug}/danhgia`);
    } else {
      navigate(`/chitietdiadiem/${slug}/danhgia`);
    }
  };

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

  const getGuidePrice = (guide) => {
    const giaTheoDiaDiem = (guide.diaDiemGiaCa || []).find(
      (item) => String(item?.diaDiem?._id || item?.diaDiem) === String(diaDiem?._id)
    );

    if (giaTheoDiaDiem?.mucGia) return giaTheoDiaDiem.mucGia;
    if (guide.giaThue) return guide.giaThue;
    return 0;
  };

  const handleHireGuide = (guide) => {
    if (!user) {
      toast.warning("Bạn cần đăng nhập để thuê hướng dẫn viên.");
      return;
    }

    const guideForPayment = {
      ...guide,
      giaThue: getGuidePrice(guide),
      diaDiemDuocChon: {
        _id: diaDiem?._id || "",
        tenDiaDiem: diaDiem?.tenDiaDiem || "",
        khuVuc: diaDiem?.khuVuc || "",
        image: diaDiem?.image || "",
        images: diaDiem?.images || [],
        slug: diaDiem?.slug || "",
      },
    };

    localStorage.setItem("selectedGuide", JSON.stringify(guideForPayment));
    navigate("/thanhtoan");
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

  console.log("diaDiem:", diaDiem);
  console.log("dacDiemDiaDanh:", diaDiem?.dacDiemDiaDanh);

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
              {(diaDiem.dacDiemDiaDanh || []).slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  className={`hero-tag-pill ${index === 0
                      ? "hero-tag-green"
                      : index === 1
                        ? "hero-tag-gray"
                        : "hero-tag-red"
                    }`}
                >
                  {tag}
                </span>
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
                <h3>
                  Đánh giá từ cộng đồng
                  {reviewData.thongKe?.tongDanhGia > 0 && (
                    <span style={{ marginLeft: 10, color: "#00d26a", fontSize: 16 }}>
                      {reviewData.thongKe.diemTrungBinh} ★
                    </span>
                  )}
                </h3>

                <span className="more-link" onClick={handleXemTatCaDanhGia}>
                  Xem tất cả
                </span>
              </div>

              <div className="review-grid">
                {reviewData.danhGias.length > 0 ? (
                  reviewData.danhGias.map((item) => (
                    <div className="review-card" key={item._id}>
                      <div className="review-header">
                        <img
                          src={item.nguoiDung?.image || "/img/default-user.jpg"}
                          alt={item.nguoiDung?.hoTen || "avatar"}
                          className="review-avatar-img"
                        />
                        <div>
                          <h4>{item.nguoiDung?.hoTen || "Người dùng"}</h4>
                          <span>
                            {"★".repeat(item.soSao || 5)}
                            {"☆".repeat(5 - (item.soSao || 5))}
                          </span>
                        </div>
                      </div>

                      <p>{item.noiDung || "Người dùng chưa nhập nội dung đánh giá."}</p>

                      {item.hinhAnh?.length > 0 && (
                        <div className="review-images">
                          {item.hinhAnh.slice(0, 2).map((img, index) => (
                            <img key={index} src={img} alt={`review-${index}`} />
                          ))}
                          {item.hinhAnh.length > 2 && (
                            <div className="more-photos">+{item.hinhAnh.length - 2} ảnh</div>
                          )}
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="review-empty-box">
                    Chưa có đánh giá nào cho địa điểm này.
                  </div>
                )}
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

              <div
                className="all-group-btn"
                onClick={() => {
                  setOpenCreateGroup(true);
                  setStepGroup(1);
                }}
              >
                Tạo nhóm mới
              </div>
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

      {/* POPUP DANH SÁCH HƯỚNG DẪN VIÊN */}
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
                          <span>⏱ {guide.soNamKinhNghiem || 0} năm kinh nghiệm</span>
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
                        onClick={() => handleHireGuide(guide)}
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

      {/* TẠO NHÓM */}
      {openCreateGroup && (
        <div className="overlay-group-chitiet">
          <div className="modal-group-chitiet">
            {stepGroup === 1 && (
              <div className="step1-container-step1">
                <div className="step1-header-step1">
                  <h2>Tạo Nhóm Trekking Mới</h2>
                  <p>Thiết lập thông tin nhóm và đảm bảo an toàn cho hành trình của bạn.</p>
                </div>

                <div className="step1-stepper-step1">
                  <div className="step1-item-step1 active-step1">
                    <div className="step1-circle-step1">1</div>
                    <span>Thông tin chung</span>
                  </div>

                  <div className="step1-line-step1"></div>

                  <div className="step1-item-step1">
                    <div className="step1-circle-outline-step1">2</div>
                    <span>Lịch trình</span>
                  </div>

                  <div className="step1-line-step1"></div>

                  <div className="step1-item-step1">
                    <div className="step1-circle-outline-step1">3</div>
                    <span>An toàn</span>
                  </div>
                </div>

                <div className="step1-form-step1">
                  <label>Địa điểm trekking</label>
                  <div className="step1-input-lock-step1">
                    <span>{diaDiem.tenDiaDiem}</span>
                    <span className="fixed-step1">CỐ ĐỊNH</span>
                  </div>

                  <label>Tên nhóm</label>
                  <input
                    className="step1-input-step1"
                    placeholder="Ví dụ: Chinh phục cuối tuần"
                  />

                  <div className="step1-row-step1">
                    <div>
                      <label>Thời gian kết thúc dự kiến</label>
                      <input type="datetime-local" className="step1-input-step1" />
                    </div>

                    <div>
                      <label>Ngày & Giờ khởi hành</label>
                      <input type="datetime-local" className="step1-input-step1" />
                    </div>
                  </div>

                  <p className="step1-note-step1">
                    * Hệ thống sẽ kích hoạt cảnh báo nếu bạn không check-out sau giờ này.
                  </p>

                  <div className="step1-row-step1">
                    <input
                      className="step1-input-step1"
                      placeholder="Tối đa 20 người"
                      type="number"
                    />

                    <select className="step1-select-step1">
                      <option>Trung bình (Có kinh nghiệm)</option>
                      <option>Dễ (Cho người mới)</option>
                      <option>Khó (Yêu cầu thể lực)</option>
                      <option>Rất khó (Chuyên nghiệp)</option>
                    </select>
                  </div>

                  <div className="step1-info-step1">
                    Lưu ý: Nhóm sẽ tự động giải tán và xóa dữ liệu sau 30 ngày kể từ ngày kết thúc chuyến đi để đảm bảo bảo mật dữ liệu.
                  </div>

                  <label>Mô tả chuyến đi</label>
                  <textarea
                    className="step1-textarea-step1"
                    placeholder="Chia sẻ về lịch trình cụ thể, vật dụng cần mang theo và các yêu cầu khác cho thành viên..."
                  />

                  <div className="step1-commit-step1">
                    <div className="step1-commit-title-step1">
                      🛡 Cam kết An toàn & Hệ thống Cảnh báo Muộn
                    </div>

                    <p>
                      Bằng việc tạo nhóm này, bạn đồng ý kích hoạt Hệ thống Giám sát Thông minh. Nếu nhóm
                      không hoàn tất check-out trước thời gian dự kiến 30 phút, hệ thống sẽ tự động gửi tin nhắn
                      SOS cho đội cứu hộ địa phương và người thân liên hệ khẩn cấp.
                    </p>

                    <label className="step1-checkbox-step1">
                      <input className="tick-step1" type="checkbox" />
                      Tôi cam kết tuân theo quy trình an toàn và chấp nhận các điều khoản trên.
                    </label>
                  </div>
                </div>

                <div className="step1-footer-step1">
                  <span className="cancel-step1" onClick={() => setOpenCreateGroup(false)}>
                    Hủy bỏ
                  </span>

                  <div className="step1-btn-group-step1">
                    <button className="draft-step1">Lưu bản nháp</button>
                    <button
                      className="next-step1"
                      onClick={() => setStepGroup(2)}
                    >
                      Tiếp theo: Thiết lập Lịch trình →
                    </button>
                  </div>
                </div>
              </div>
            )}

            {stepGroup === 2 && (
              <div className="step2-container-step2">
                <div className="step2-header-step2">
                  <h2>Tạo Nhóm Trekking Mới</h2>
                  <p>Thiết lập thông tin nhóm và đảm bảo an toàn cho hành trình của bạn.</p>
                </div>

                <div className="step2-stepper-step2">
                  <div className="step2-item-step2 done-step2">
                    <div className="step2-circle-done-step2">1</div>
                    <span>Thông tin chung</span>
                  </div>

                  <div className="step2-line-step2"></div>

                  <div className="step2-item-step2 active-step2">
                    <div className="step2-circle-step2">2</div>
                    <span>Lịch trình</span>
                  </div>

                  <div className="step2-line-step2"></div>

                  <div className="step2-item-step2">
                    <div className="step2-circle-outline-step2">3</div>
                    <span>An toàn</span>
                  </div>
                </div>

                <div className="step2-card-step2">
                  <h3>Tập Trung</h3>

                  <div className="step2-body-step2">
                    <div className="step2-content-step2">
                      <div className="step2-row-step2">
                        <div>
                          <label>THỜI GIAN XUẤT PHÁT</label>
                          <input placeholder="VD: 08:00 AM" />
                        </div>

                        <div>
                          <label>ĐỊA ĐIỂM / HOẠT ĐỘNG</label>
                          <input placeholder="Tập trung tại điểm ...." />
                        </div>
                      </div>

                      <textarea placeholder="Ghi chú:" />

                      <div className="step2-row-step2">
                        <div>
                          <label>THỜI GIAN KẾT THÚC</label>
                          <input placeholder="VD: 05:00 PM" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="step2-addday-step2">
                  <span><img className="sum-step2" src="/img/sum.png" alt="" /></span>
                  <p>Thêm Ngày mới</p>
                  <small>Mở rộng lịch trình cho chuyến đi dài ngày</small>
                </div>

                <div className="step2-footer-step2">
                  <button
                    className="back-step2"
                    onClick={() => setStepGroup(1)}
                  >
                    ← Quay lại
                  </button>

                  <button
                    className="next-step2"
                    onClick={() => setStepGroup(3)}
                  >
                    Tiếp theo: Thiết lập An toàn →
                  </button>
                </div>
              </div>
            )}

            {stepGroup === 3 && (
              <div className="step3-container-step3">
                <div className="step3-header-step3">
                  <h2>Tạo Nhóm Trekking Mới</h2>
                  <p>Thiết lập thông tin nhóm và đảm bảo an toàn cho hành trình của bạn.</p>
                </div>

                <div className="step3-stepper-step3">
                  <div className="step3-item-step3 done-step3">
                    <div className="step3-circle-done-step3">1</div>
                    <span>Thông tin chung</span>
                  </div>

                  <div className="step3-line-step3"></div>

                  <div className="step3-item-step3 done-step3">
                    <div className="step3-circle-done-step3">2</div>
                    <span>Lịch trình</span>
                  </div>

                  <div className="step3-line-step3"></div>

                  <div className="step3-item-step3 active-step3">
                    <div className="step3-circle-step3">3</div>
                    <span>An toàn</span>
                  </div>
                </div>

                <h3 className="step3-title-step3">Thiết lập An toàn & Xác minh</h3>
                <p className="step3-sub-step3">
                  Đảm bảo an toàn cho tất cả thành viên trong suốt hành trình trekking.
                </p>

                <div className="step3-commit-box-step3">
                  <div className="step3-commit-header-step3">
                    🛡 Cam kết an toàn
                  </div>

                  <label className="step3-check-item-step3">
                    <input type="checkbox" />
                    Tôi đồng ý tuân theo các giao thức an toàn và hướng dẫn của trưởng đoàn.
                  </label>

                  <label className="step3-check-item-step3">
                    <input type="checkbox" />
                    Tôi hiểu rõ các rủi ro và tình huống có thể xảy ra trong chuyến đi.
                  </label>

                  <label className="step3-check-item-step3">
                    <input type="checkbox" />
                    Tôi cam kết thực hiện điểm danh (check-in/out) tại các trạm dừng.
                  </label>
                </div>

                <div className="step3-verify-step3">
                  <div>
                    <h4>Xác minh nâng cao (Advanced Verification)</h4>
                    <span>Bạn bè bắt buộc xác minh danh tính</span>
                  </div>
                  <div className="step3-check-icon">✔</div>
                </div>

                <p className="step3-note-step3">
                  Lưu ý: Chuyến đi này yêu cầu tất cả thành viên phải có tích xanh xác minh danh tính để đảm bảo an toàn cộng đồng.
                </p>

                <h4 className="step3-contact-title-step3">Thông tin liên hệ khẩn cấp</h4>

                <div className="step3-row-step3">
                  <input placeholder="Nguyễn Văn A" />
                  <input placeholder="0901 234 567" />
                </div>

                <span className="step3-add-step3">+ Thêm liên hệ khác</span>

                <div className="step3-warning-step3">
                  ⚠ Nhắc nhở: Nhóm sẽ tự động đóng và dữ liệu liên lạc nội bộ sẽ được xóa sau 30 ngày kể từ khi chuyến đi kết thúc để bảo vệ quyền riêng tư.
                </div>

                <div className="step3-footer-step3">
                  <button
                    className="step3-back-step3"
                    onClick={() => setStepGroup(2)}
                  >
                    ← Quay lại
                  </button>

                  <button className="step3-submit-step3">
                    Hoàn tất & Tạo Nhóm
                  </button>
                </div>
              </div>
            )}

            <span
              className="close-chitiet"
              onClick={() => setOpenCreateGroup(false)}
            >
              ✕
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentChitietdiadiem;