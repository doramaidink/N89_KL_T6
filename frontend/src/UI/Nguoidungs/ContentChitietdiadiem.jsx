import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const ContentChitietdiadiem = () => {
  const { slug } = useParams();

  const [diaDiem, setDiaDiem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openCreateGroup, setOpenCreateGroup] = useState(false);
  const [stepGroup, setStepGroup] = useState(1);

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

      /// TẠO NHÓM
      {openCreateGroup && (
        <div className="overlay-group-chitiet">

          <div className="modal-group-chitiet">
            {stepGroup === 1 && (
              <div className="step1-container-step1">

                {/* HEADER */}
                <div className="step1-header-step1">
                  <h2>Tạo Nhóm Trekking Mới</h2>
                  <p>Thiết lập thông tin nhóm và đảm bảo an toàn cho hành trình của bạn.</p>
                </div>

                {/* STEPPER */}
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

                {/* FORM */}
                <div className="step1-form-step1">

                  {/* Địa điểm */}
                  <label>Địa điểm trekking</label>
                  <div className="step1-input-lock-step1">
                    <span> Rừng Dầu Sơn Trà, Đà Nẵng</span>
                    <span className="fixed-step1">CỐ ĐỊNH</span>
                  </div>

                  {/* Tên nhóm */}
                  <label>Tên nhóm</label>
                  <input
                    className="step1-input-step1"
                    placeholder="Ví dụ: Chinh phục Rừng Dầu Cuối Tuần"
                  />

                  {/* DATE */}
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

                  {/* SỐ NGƯỜI + LEVEL */}
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

                  {/* INFO */}
                  <div className="step1-info-step1">
                    Lưu ý: Nhóm sẽ tự động giải tán và xóa dữ liệu sau 30 ngày kể từ ngày kết thúc chuyến đi để đảm bảo bảo mật dữ liệu.
                  </div>

                  {/* MÔ TẢ */}
                  <label>Mô tả chuyến đi</label>
                  <textarea
                    className="step1-textarea-step1"
                    placeholder="Chia sẻ về lịch trình cụ thể, vật dụng cần mang theo và các yêu cầu khác cho thành viên..."
                  />

                  {/* CAM KẾT */}
                  <div className="step1-commit-step1">
                    <div className="step1-commit-title-step1">
                      🛡 Cam kết An toàn & Hệ thống Cảnh báo Muộn
                    </div>

                    <p>
                      Bằng việc tạo nhóm này, bạn đồng ý kích hoạt Hệ thống Giám sát Thông minh. Nếu nhóm
                      không hoàn tất check-out trước thời gian dự kiến 30 phút, hệ thống sẽ tự động gửi tin nhắn
                      SOS cho đội cứu hộ địa phương và người thân liên hệ khẩn cấp.                    </p>

                    <label className="step1-checkbox-step1">
                      <input className="tick-step1" type="checkbox" />
                      Tôi cam kết tuân theo quy trình an toàn và chấp nhận các điều khoản trên.
                    </label>
                  </div>

                </div>

                {/* FOOTER */}
                <div className="step1-footer-step1">
                  <span className="cancel-step1">Hủy bỏ</span>

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

            {/* ===== STEP 2 ===== */}
            {stepGroup === 2 && (
              <div className="step2-container-step2">

                {/* HEADER */}
                <div className="step2-header-step2">
                  <h2>Tạo Nhóm Trekking Mới</h2>
                  <p>Thiết lập thông tin nhóm và đảm bảo an toàn cho hành trình của bạn.</p>
                </div>

                {/* STEPPER */}
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

                {/* CARD */}
                <div className="step2-card-step2">

                  <h3> Tập Trung</h3>

                  <div className="step2-body-step2">


                    <div className="step2-content-step2">

                      {/* ROW 1 */}
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

                      {/* TEXTAREA */}
                      <textarea placeholder="Ghi chú:" />

                      {/* ROW 2 */}
                      <div className="step2-row-step2">
                        <div>
                          <label>THỜI GIAN KẾT THÚC</label>
                          <input placeholder="VD: 05:00 PM" />
                        </div>
                      </div>

                    </div>
                  </div>

                </div>

                {/* ADD DAY */}
                <div className="step2-addday-step2">
                  <span><img className="sum-step2" src="/img/sum.png" alt="" /></span>
                  <p>Thêm Ngày mới</p>
                  <small>Mở rộng lịch trình cho chuyến đi dài ngày</small>
                </div>

                {/* FOOTER */}
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

            {/* ===== STEP 3 ===== */}
            {stepGroup === 3 && (
              <div className="step3-container-step3">

                {/* HEADER */}
                <div className="step3-header-step3">
                  <h2>Tạo Nhóm Trekking Mới</h2>
                  <p>Thiết lập thông tin nhóm và đảm bảo an toàn cho hành trình của bạn.</p>
                </div>

                {/* STEPPER */}
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

                {/* TITLE */}
                <h3 className="step3-title-step3">Thiết lập An toàn & Xác minh</h3>
                <p className="step3-sub-step3">
                  Đảm bảo an toàn cho tất cả thành viên trong suốt hành trình trekking.
                </p>

                {/* CAM KẾT */}
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

                {/* VERIFY */}
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

                {/* CONTACT */}
                <h4 className="step3-contact-title-step3">Thông tin liên hệ khẩn cấp</h4>

                <div className="step3-row-step3">
                  <input placeholder="Nguyễn Văn A" />
                  <input placeholder="0901 234 567" />
                </div>

                <span className="step3-add-step3">+ Thêm liên hệ khác</span>

                {/* WARNING */}
                <div className="step3-warning-step3">
                  ⚠ Nhắc nhở: Nhóm sẽ tự động đóng và dữ liệu liên lạc nội bộ sẽ được xóa sau 30 ngày kể từ khi chuyến đi kết thúc để bảo vệ quyền riêng tư.
                </div>

                {/* FOOTER */}
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

            {/* CLOSE */}
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