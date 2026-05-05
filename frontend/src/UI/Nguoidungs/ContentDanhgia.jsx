import React, { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";

const API = "http://localhost:5000";

const ContentDanhgia = ({ user = null, canReview = false }) => {
  const { slug } = useParams();

  const [loading, setLoading] = useState(true);
  const [diaDiem, setDiaDiem] = useState(null);
  const [danhGias, setDanhGias] = useState([]);
  const [thongKe, setThongKe] = useState({
    tongDanhGia: 0,
    diemTrungBinh: 0,
    demTheoSao: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    phanTramTheoSao: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
  });

  const [soSao, setSoSao] = useState(5);
  const [noiDung, setNoiDung] = useState("");
  const [hinhAnh, setHinhAnh] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const fileInputRef = useRef(null);

  const userId = user?.id || user?._id || "";

  const fetchDanhGia = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API}/danhgia/diadiem/${slug}`);
      setDiaDiem(res.data.diaDiem);
      setDanhGias(res.data.danhGias || []);
      setThongKe(
        res.data.thongKe || {
          tongDanhGia: 0,
          diemTrungBinh: 0,
          demTheoSao: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
          phanTramTheoSao: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
        }
      );

      if (userId && res.data.danhGias?.length) {
        const myReview = res.data.danhGias.find(
          (item) =>
            String(item.nguoiDung?._id || item.nguoiDung) === String(userId)
        );

        if (myReview) {
          setSoSao(myReview.soSao || 5);
          setNoiDung(myReview.noiDung || "");
          setHinhAnh(myReview.hinhAnh || []);
        }
      }
    } catch (error) {
      console.error(error);
      toast.error("Không tải được đánh giá");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (slug) fetchDanhGia();
  }, [slug]);

  const docAnhBase64 = async (files) => {
    const fileList = Array.from(files).slice(0, 5);
    const promises = fileList.map(
      (file) =>
        new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        })
    );

    return Promise.all(promises);
  };

  const handleChonAnh = async (e) => {
    try {
      const files = e.target.files;
      if (!files || !files.length) return;

      const base64Images = await docAnhBase64(files);
      setHinhAnh(base64Images.slice(0, 5));
    } catch (error) {
      console.error(error);
      toast.error("Không đọc được ảnh");
    }
  };

  const handleSubmit = async () => {
    if (!canReview || !userId) {
      toast.warning("Bạn cần đăng nhập để đánh giá");
      return;
    }

    if (!soSao) {
      toast.warning("Vui lòng chọn số sao");
      return;
    }

    if (!noiDung.trim()) {
      toast.warning("Vui lòng nhập nội dung đánh giá");
      return;
    }

    try {
      setSubmitting(true);

      await axios.post(`${API}/danhgia`, {
        diaDiemSlug: slug,
        nguoiDungId: userId,
        soSao,
        noiDung,
        hinhAnh,
      });

      toast.success("Đánh giá thành công");
      fetchDanhGia();
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Không thể gửi đánh giá");
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (star, clickable = false) => {
    return (
      <div className="stars-select-wrap">
        {[1, 2, 3, 4, 5].map((item) => (
          <span
            key={item}
            className={`star-item ${item <= star ? "active" : ""} ${clickable ? "clickable" : ""
              }`}
            onClick={() => clickable && setSoSao(item)}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const d = new Date(dateString);
    return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
  };
  const getAvatarUrl = (image) => {
    if (!image) return "/img/default-user.jpg";
    if (image.startsWith("http")) return image;

    if (image.startsWith("/uploads") || image.startsWith("/img")) {
      return `${API}${image}`;
    }

    return `${API}/${image}`;
  };

  const danhGiasDaSapXep = useMemo(() => {
    return [...danhGias];
  }, [danhGias]);

  if (loading) {
    return <div className="danhgia-page-wrap">Đang tải đánh giá...</div>;
  }

  return (
    <div className="danhgia-page-wrap">
      <div className="danhgia-page-container">
        <div className="danhgia-header-top">
          <div>
            <h2>Đánh giá từ cộng đồng</h2>
            <p>
              Chia sẻ trải nghiệm của bạn về{" "}
              <strong>{diaDiem?.tenDiaDiem || "địa điểm này"}</strong>
            </p>
          </div>

          {canReview && user ? (
            <button
              className="btn-write-review"
              onClick={() =>
                document
                  .getElementById("form-danhgia-section")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              ✍ Viết đánh giá
            </button>
          ) : null}
        </div>

        <div className="overview-review-box">
          <div className="overview-score-left">
            <h1>{thongKe.diemTrungBinh || 0}</h1>
            {renderStars(Math.round(thongKe.diemTrungBinh || 0))}
            <p>Dựa trên {thongKe.tongDanhGia || 0} lượt đánh giá</p>
          </div>

          <div className="overview-bars-right">
            {[5, 4, 3, 2, 1].map((star) => (
              <div className="bar-row-review" key={star}>
                <span>{star}</span>
                <div className="bar-review">
                  <div
                    style={{
                      width: `${thongKe.phanTramTheoSao?.[star] || 0}%`,
                    }}
                  ></div>
                </div>
                <span>{thongKe.phanTramTheoSao?.[star] || 0}%</span>
              </div>
            ))}
          </div>
        </div>

        {canReview && user ? (
          <div className="form-review-box" id="form-danhgia-section">
            <h3>📝 Đánh giá của bạn</h3>

            <div className="review-label">Xếp hạng của bạn</div>
            {renderStars(soSao, true)}

            <div className="review-label">Nội dung đánh giá</div>
            <textarea
              value={noiDung}
              onChange={(e) => setNoiDung(e.target.value)}
              placeholder="Chia sẻ chi tiết về trải nghiệm của bạn (ví dụ: đường đi, phong cảnh, thời điểm đẹp nhất...)"
            />

            <div className="review-label">Hình ảnh thực tế</div>
            <div
              className="upload-review-box"
              onClick={() => fileInputRef.current?.click()}
            >
              <p>Nhấn để tải lên hoặc chọn ảnh vào đây</p>
              <span>Tối đa 5 ảnh</span>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                hidden
                onChange={handleChonAnh}
              />
            </div>

            {hinhAnh.length > 0 && (
              <div className="review-preview-grid">
                {hinhAnh.map((img, index) => (
                  <img key={index} src={img} alt={`preview-${index}`} />
                ))}
              </div>
            )}

            <div className="review-submit-row">
              <button
                className="btn-submit-review"
                onClick={handleSubmit}
                disabled={submitting}
              >
                {submitting ? "ĐANG GỬI..." : "ĐĂNG ĐÁNH GIÁ"}
              </button>
            </div>
          </div>
        ) : null}

        <div className="review-list-section">
          <h3>Đánh giá mới nhất</h3>

          {danhGiasDaSapXep.length === 0 ? (
            <div className="review-empty-box">
              Chưa có đánh giá nào cho địa điểm này.
            </div>
          ) : (
            danhGiasDaSapXep.map((item) => (
              <div className="review-item-box" key={item._id}>
                <div className="review-item-top">
                  <div className="review-user-left">
                    <img
                      src={getAvatarUrl(item.nguoiDung?.image)}
                      alt={item.nguoiDung?.hoTen || "avatar"}
                    />
                    <div>
                      <h4>{item.nguoiDung?.hoTen || "Người dùng"}</h4>
                      <span>{formatDate(item.createdAt)}</span>
                    </div>
                  </div>

                  <div className="review-right-stars">
                    {renderStars(item.soSao)}
                  </div>
                </div>

                {item.noiDung?.trim() && (
                  <p className="review-item-content">{item.noiDung}</p>
                )}

                {item.hinhAnh?.length > 0 && (
                  <div className="review-images-grid">
                    {item.hinhAnh.slice(0, 4).map((img, index) => (
                      <img key={index} src={img} alt={`review-${index}`} />
                    ))}
                    {item.hinhAnh.length > 4 && (
                      <div className="review-more-image-box">
                        +{item.hinhAnh.length - 4}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ContentDanhgia;