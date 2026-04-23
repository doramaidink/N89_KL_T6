import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import io from "socket.io-client";

const ContentChitietdiadiem = ({ user = null }) => {
  const { slug } = useParams();

  const socket = io.connect("http://localhost:5000");

  const navigate = useNavigate();

  const [diaDiem, setDiaDiem] = useState(null);
  const [loading, setLoading] = useState(true);

  const [allGuides, setAllGuides] = useState([]);
  const [loadingGuides, setLoadingGuides] = useState(false);
  const [showGuideModal, setShowGuideModal] = useState(false);

  const [openCreateGroup, setOpenCreateGroup] = useState(false);
  const [stepGroup, setStepGroup] = useState(1);
  const [groups, setGroups] = useState([]);

  const [openJoinModal, setOpenJoinModal] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);

  const [reviewData, setReviewData] = useState({
    thongKe: {
      tongDanhGia: 0,
      diemTrungBinh: 0,
    },
    danhGias: [],
  });

  const [groupForm, setGroupForm] = useState({
    ten: "",
    moTa: "",
    soLuong: 10,
    doKho: "Trung bình (Có kinh nghiệm)",
    startTime: "",
    endTime: "",
    lichTrinh: {
      timeStart: "08:00 AM",
      location: "",
      note: "",
      timeEnd: "05:00 PM"
    },
    lienHeKhanCap: {
      hoTen: "",
      sdt: ""
    }
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setGroupForm((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/nhom/${diaDiem._id}`);
        setGroups(res.data.nhoms);
      } catch (err) {
        console.error(err);
      }
    };
    if (diaDiem?._id) fetchGroups();
  }, [diaDiem]);


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

  const handleJoinGroup = async () => {
    if (!user) {
      toast.error("Vui lòng đăng nhập để tham gia!");
      return;
    }

    try {
      // 1. Gọi API lưu vào DB
      const res = await axios.post(`http://localhost:5000/nhom/join/${selectedGroup._id}`, {
        userId: user.id || user._id // Đảm bảo lấy đúng ID người dùng
      });

      if (res.status === 200) {
        toast.success("Đã tham gia nhóm!");
        setOpenJoinModal(false);

        // Phát tín hiệu TRƯỚC khi chuyển trang để đảm bảo dữ liệu đi kịp
        socket.emit("new_member_joined", { groupId: selectedGroup._id });

        // Sau đó mới chuyển hướng
        navigate(`/nhomchat/${selectedGroup._id}`);
      }
    } catch (error) {
      // Kiểm tra nếu lỗi do đã là thành viên hoặc nhóm đầy
      const message = error.response?.data?.message || "Lỗi khi tham gia nhóm";
      toast.error(message);
    }
  };

  const handleCreateGroup = async () => {
    if (!user) {
      toast.warning("Bạn cần đăng nhập để tạo nhóm");
      return;
    }
    if (!groupForm.ten) {
      toast.warning("Vui lòng nhập tên nhóm");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/nhom", {
        ...groupForm,
        diaDiemId: diaDiem._id,
        nguoiTao: {
          id: user?.id || user?._id,
          hoTen: user?.hoTen,
        },
        // Đảm bảo các thông tin này được gửi đi
        lichTrinh: groupForm.lichTrinh,
        lienHeKhanCap: groupForm.lienHeKhanCap,
        startTime: groupForm.startTime,
        endTime: groupForm.endTime,
      });

      if (res.status === 201) {
        toast.success("Tạo nhóm thành công!");
        // Sau khi tạo xong, chuyển về trang nhóm chat của nhóm đó
        navigate(`/nhomchat/${res.data.nhom._id}`);
        setOpenCreateGroup(false);
      }
    } catch (error) {
      console.error(error);
      toast.error("Lỗi tạo nhóm");
    }
  };
  // const handleCreateGroup = async () => {
  //   if (!user) {
  //     toast.warning("Bạn cần đăng nhập để tạo nhóm");
  //     return;
  //   }
  //   if (!groupForm.ten) {
  //     toast.warning("Vui lòng nhập tên nhóm");
  //     return;
  //   }

  //   try {
  //     const res = await axios.post("http://localhost:5000/nhom", {
  //       ...groupForm, // ✅ PHẢI GỬI TOÀN BỘ STATE ĐỂ CÓ LICH TRINH & LIEN HE
  //       diaDiemId: diaDiem._id,
  //       nguoiTao: {
  //         id: user?.id,
  //         hoTen: user?.hoTen,
  //       },
  //       lichTrinh: groupForm.lichTrinh,
  //       startTime: groupForm.startTime,
  //       endTime: groupForm.endTime,
  //     });
  //     if (res.status === 201) {
  //       toast.success("Tạo nhóm thành công!");
  //       navigate(`/nhomchat/${res.data.nhom._id}`);
  //       setOpenCreateGroup(false);
  //     }
  //   } catch (error) {
  //     toast.error("Lỗi tạo nhóm");
  //   }
  // };

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

    const rawImage = diaDiem?.image || "";
    const cleanPath = rawImage.startsWith('/') ? rawImage.slice(1) : rawImage;
    const fullImage = `http://localhost:5000/${cleanPath}`;

    const guideForPayment = {
      ...guide,
      giaThue: getGuidePrice(guide),
      diaDiemDuocChon: {
        _id: diaDiem?._id || "",
        tenDiaDiem: diaDiem?.tenDiaDiem || "",
        khuVuc: diaDiem?.khuVuc || "",
        image: fullImage, 
        images: diaDiem?.images || [],
        slug: diaDiem?.slug || "",
      },
    };

    localStorage.setItem("selectedGuide", JSON.stringify(guideForPayment));
    navigate("/chonloainhom");
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
                {groups.slice(0, 2).map((item) => (
                  <div className="nhom-item" key={item._id}>
                    <div>
                      <h4>{item.ten}</h4>
                      <span>{item.moTa || "Trekking khám phá"}</span>
                    </div>
                    <button onClick={() => {
                      setSelectedGroup(item);
                      setOpenJoinModal(true);
                    }}>Tham gia</button>
                  </div>
                ))}
              </div>

              {openJoinModal && selectedGroup && (
                <div className="join2-overlay">
                  <div className="join2-modal">
                    <span className="join2-close" onClick={() => setOpenJoinModal(false)}>✕</span>

                    <div className="join2-back" onClick={() => setOpenJoinModal(false)}>
                      ← Quay lại Chi Tiết Địa Điểm
                    </div>

                    <h2 className="join2-title">Xác nhận Tham gia Nhóm Trekking</h2>
                    <p className="join2-sub">
                      Vui lòng kiểm tra lại thông tin nhóm và xác nhận các điều khoản an toàn trước khi tham gia.
                    </p>

                    <div className="join2-grid">
                      {/* Cột trái */}
                      <div className="join2-left">
                        <div className="join2-card">
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3>{selectedGroup.ten}</h3>
                            <span className="join2-badge">NHÓM CÔNG KHAI</span>
                          </div>
                          <p style={{ color: '#888', marginTop: '5px' }}>📍 Điểm đến: {diaDiem.tenDiaDiem}</p>

                          <div className="join2-row">
                            <div>
                              <span>TRƯỞNG NHÓM (GUIDE)</span>
                              <p><strong>{selectedGroup?.nguoiTao?.hoTen}</strong> ✓</p>
                            </div>
                            <div>
                              <span>THỜI GIAN XUẤT PHÁT</span>
                              <p><strong>{selectedGroup.startTime ? new Date(selectedGroup.startTime).toLocaleString('vi-VN') : "05:30 - 11/02"}</strong></p>
                            </div>
                          </div>

                          <div style={{ margin: '15px 0' }}>
                            <span>THÀNH VIÊN HIỆN TẠI</span>
                            <p>👥 {selectedGroup.thanhVien?.length || 1} / {selectedGroup.soLuong || 10} người</p>
                          </div>

                          <div className="join2-warning-box">
                            <h4 style={{ color: '#d4a373', marginBottom: '8px' }}>⚠ Yêu cầu xác minh danh tính</h4>
                            <p style={{ fontSize: '13px', color: '#ccc' }}>
                              Để đảm bảo an toàn cho toàn bộ thành viên trong nhóm trekking khu vực rừng núi hiểm trở, bạn cần hoàn tất xác minh danh tính nâng cao.
                            </p>
                            <button className="join2-btn-verify">
                              🔒 Xác minh danh tính nâng cao
                            </button>
                          </div>

                          <button className="join2-btn-join" onClick={handleJoinGroup} style={{ marginTop: '20px' }}>
                            👤 Xác nhận Tham gia
                          </button>
                        </div>

                        <p style={{ fontSize: '11px', color: '#666', marginTop: '15px', textAlign: 'center' }}>
                          Bằng cách nhấp vào "Xác nhận tham gia", bạn đồng ý tuân thủ giao thức <strong>An toàn Check-in/Check-out</strong> của hệ thống.
                        </p>
                      </div>

                      {/* Cột phải */}
                      <div className="join2-right">
                        <div className="join2-box">
                          <h4>📋 Lưu ý quan trọng</h4>
                          <ul>
                            <li>✓ Trang bị giày trekking có độ bám tốt.</li>
                            <li>✓ Mang theo tối thiểu 2 lít nước/người.</li>
                            <li>✓ Luôn đi cùng nhóm, không tách đoàn.</li>
                            <li>✓ Đã sạc đầy pin điện thoại và dự phòng.</li>
                          </ul>
                        </div>

                        <div className="join2-map">
                          <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '40px', marginBottom: '10px' }}>🗺</div>
                            <p>Khu vực: {diaDiem.tenDiaDiem}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

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
      {/* ✅ PHẦN SỬA: TẠO NHÓM (DỮ LIỆU ĐƯỢC BIND VÀO STATE) */}
      {openCreateGroup && (
        <div className="overlay-group-chitiet">
          <div className="modal-group-chitiet">
            <span className="close-chitiet" onClick={() => setOpenCreateGroup(false)}>✕</span>

            {/* --- STEP 1: THÔNG TIN CHUNG (GIỮ NGUYÊN) --- */}
            {stepGroup === 1 && (
              <div className="step1-container-step1">
                <div className="step1-header-step1">
                  <h2>Tạo Nhóm Trekking Mới</h2>
                  <p>Thiết lập thông tin nhóm và đảm bảo an toàn cho hành trình của bạn.</p>
                </div>
                {/* ... Phần Stepper 1-2-3 giữ nguyên như file cũ của bạn ... */}
                <div className="step1-form-step1">
                  <label>Tên nhóm</label>
                  <input name="ten" value={groupForm.ten} onChange={handleInputChange} className="step1-input-step1" placeholder="Ví dụ: Chinh phục Sơn Trà" />

                  <div className="step1-row-step1">
                    <div>
                      <label>Ngày & Giờ khởi hành</label>
                      <input name="startTime" type="datetime-local" value={groupForm.startTime} onChange={handleInputChange} className="step1-input-step1" />
                    </div>
                    <div>
                      <label>Kết thúc dự kiến</label>
                      <input name="endTime" type="datetime-local" value={groupForm.endTime} onChange={handleInputChange} className="step1-input-step1" />
                    </div>
                  </div>

                  <div className="step1-row-step1">
                    <input name="soLuong" type="number" value={groupForm.soLuong} onChange={handleInputChange} className="step1-input-step1" placeholder="Số lượng người" />
                    <select name="doKho" value={groupForm.doKho} onChange={handleInputChange} className="step1-select-step1">
                      <option>Dễ (Cho người mới)</option>
                      <option>Trung bình (Có kinh nghiệm)</option>
                      <option>Khó (Yêu cầu thể lực)</option>
                    </select>
                  </div>
                  <label>Mô tả chuyến đi</label>
                  <textarea name="moTa" value={groupForm.moTa} onChange={handleInputChange} className="step1-textarea-step1" />
                </div>
                <div className="step1-footer-step1">
                  <button className="next-step1" onClick={() => setStepGroup(2)}>Tiếp theo: Thiết lập Lịch trình →</button>
                </div>
              </div>
            )}

            {/* --- STEP 2: LỊCH TRÌNH (KHÔI PHỤC GIAO DIỆN CỦA BẠN) --- */}
            {stepGroup === 2 && (
              <div className="step2-container-step2">
                <div className="step2-header-step2">
                  <h2>Tạo Nhóm Trekking Mới</h2>
                  <p>Thiết lập thông tin nhóm và đảm bảo an toàn cho hành trình của bạn.</p>
                </div>
                {/* Stepper active ở 2 */}
                <div className="step2-card-step2">
                  <h3>Tập Trung</h3>
                  <div className="step2-body-step2">
                    <div className="step2-content-step2">
                      <div className="step2-row-step2">
                        <div>
                          <label>THỜI GIAN XUẤT PHÁT</label>
                          <input
                            placeholder="VD: 08:00 AM"
                            value={groupForm.lichTrinh.timeStart}
                            onChange={(e) => setGroupForm({ ...groupForm, lichTrinh: { ...groupForm.lichTrinh, timeStart: e.target.value } })}
                          />
                        </div>
                        <div>
                          <label>ĐỊA ĐIỂM / HOẠT ĐỘNG</label>
                          <input
                            placeholder="Tập trung tại điểm ...."
                            value={groupForm.lichTrinh.location}
                            onChange={(e) => setGroupForm({ ...groupForm, lichTrinh: { ...groupForm.lichTrinh, location: e.target.value } })}
                          />
                        </div>
                      </div>
                      <textarea
                        placeholder="Ghi chú:"
                        value={groupForm.lichTrinh.note}
                        onChange={(e) => setGroupForm({ ...groupForm, lichTrinh: { ...groupForm.lichTrinh, note: e.target.value } })}
                      />
                      <div className="step2-row-step2">
                        <div>
                          <label>THỜI GIAN KẾT THÚC</label>
                          <input
                            placeholder="VD: 05:00 PM"
                            value={groupForm.lichTrinh.timeEnd}
                            onChange={(e) => setGroupForm({ ...groupForm, lichTrinh: { ...groupForm.lichTrinh, timeEnd: e.target.value } })}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="step2-addday-step2">
                  <span><img className="sum-step2" src="/img/sum.png" alt="" /></span>
                  <p>Thêm Ngày mới</p>
                </div>
                <div className="step2-footer-step2">
                  <button className="back-step2" onClick={() => setStepGroup(1)}>← Quay lại</button>
                  <button className="next-step2" onClick={() => setStepGroup(3)}>Tiếp theo: Thiết lập An toàn →</button>
                </div>
              </div>
            )}

            {/* --- STEP 3: AN TOÀN (KHÔI PHỤC GIAO DIỆN CỦA BẠN) --- */}
            {stepGroup === 3 && (
              <div className="step3-container-step3">
                <div className="step3-header-step3">
                  <h2>Tạo Nhóm Trekking Mới</h2>
                </div>
                <div className="step3-title-step3">Thiết lập An toàn & Xác minh</div>
                <div className="step3-commit-box-step3">
                  <div className="step3-commit-header-step3">🛡 Cam kết an toàn</div>
                  <label className="step3-check-item-step3"><input type="checkbox" defaultChecked /> Tôi đồng ý tuân theo các giao thức an toàn...</label>
                  <label className="step3-check-item-step3"><input type="checkbox" defaultChecked /> Tôi hiểu rõ các rủi ro...</label>
                </div>

                <div className="step3-verify-step3">
                  <div>
                    <h4>Xác minh nâng cao (Advanced Verification)</h4>
                    <span>Bạn bè bắt buộc xác minh danh tính</span>
                  </div>
                  <div className="step3-check-icon">✔</div>
                </div>

                <h4 className="step3-contact-title-step3">Thông tin liên hệ khẩn cấp</h4>
                <div className="step3-row-step3">
                  <input
                    placeholder="Họ và tên người thân"
                    value={groupForm.lienHeKhanCap.hoTen}
                    onChange={(e) => setGroupForm({ ...groupForm, lienHeKhanCap: { ...groupForm.lienHeKhanCap, hoTen: e.target.value } })}
                  />
                  <input
                    placeholder="Số điện thoại"
                    value={groupForm.lienHeKhanCap.sdt}
                    onChange={(e) => setGroupForm({ ...groupForm, lienHeKhanCap: { ...groupForm.lienHeKhanCap, sdt: e.target.value } })}
                  />
                </div>

                <div className="step3-warning-step3">
                  ⚠ Nhắc nhở: Nhóm sẽ tự động đóng và dữ liệu xóa sau 30 ngày...
                </div>

                <div className="step3-footer-step3">
                  <button className="step3-back-step3" onClick={() => setStepGroup(2)}>← Quay lại</button>
                  <button className="step3-submit-step3" onClick={handleCreateGroup}>Hoàn tất & Tạo Nhóm</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentChitietdiadiem;