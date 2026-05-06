import React, { useMemo, useRef, useState } from "react";
import {
  Save,
  X,
  MapPin,
  Info,
  FileText,
  Plus,
  Upload,
  Image as ImageIcon,
} from "lucide-react";
import { useParams } from "react-router-dom";

const API_URL = "http://localhost:5000";

const ContentThemdiadiem = () => {
  const { slug } = useParams();

  const mainImageRef = useRef(null);
  const subImagesRef = useRef(null);

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    tenDiaDiem: "",
    moTa: "",
    gioiThieuText: "",
    doKho: "Dễ",
    veVao: "",
    quangduong: "",
    khuVuc: "",
    tinh: "",
    hot: false,
    dacDiemDiaDanhText: "",
  });

  const [mainImage, setMainImage] = useState(null);
  const [mainImagePreview, setMainImagePreview] = useState("");

  const [subImages, setSubImages] = useState([]);
  const [subImagePreviews, setSubImagePreviews] = useState([]);

  const [quickTags, setQuickTags] = useState([
    "Trong rừng",
    "Không thu phí",
    "Dễ tiếp cận",
    "Gần nguồn nước",
    "Có thác/suối",
    "Cắm trại",
    "Ngắm bình minh",
    "Đường khó",
  ]);

  const selectedTags = useMemo(() => {
    return formData.dacDiemDiaDanhText
      .split(",")
      .map((x) => x.trim())
      .filter(Boolean);
  }, [formData.dacDiemDiaDanhText]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const toggleQuickTag = (tag) => {
    const current = formData.dacDiemDiaDanhText
      .split(",")
      .map((x) => x.trim())
      .filter(Boolean);

    const existed = current.includes(tag);

    const next = existed
      ? current.filter((x) => x !== tag)
      : [...current, tag];

    setFormData((prev) => ({
      ...prev,
      dacDiemDiaDanhText: next.join(", "),
    }));
  };

  const addCustomTag = (e) => {
    if (e.key !== "Enter") return;

    e.preventDefault();

    const value = e.target.value.trim();
    if (!value) return;

    if (!quickTags.includes(value)) {
      setQuickTags((prev) => [...prev, value]);
    }

    const current = formData.dacDiemDiaDanhText
      .split(",")
      .map((x) => x.trim())
      .filter(Boolean);

    if (!current.includes(value)) {
      setFormData((prev) => ({
        ...prev,
        dacDiemDiaDanhText: [...current, value].join(", "),
      }));
    }

    e.target.value = "";
  };

  const handleMainImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setMainImage(file);
    setMainImagePreview(URL.createObjectURL(file));

    e.target.value = "";
  };

  const handleSubImagesChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setSubImages((prev) => [...prev, ...files]);

    const previews = files.map((file) => ({
      id: `${file.name}-${Date.now()}-${Math.random()}`,
      url: URL.createObjectURL(file),
      file,
    }));

    setSubImagePreviews((prev) => [...prev, ...previews]);

    e.target.value = "";
  };

  const removeSubImage = (index) => {
    setSubImages((prev) => prev.filter((_, i) => i !== index));
    setSubImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const removeMainImage = () => {
    setMainImage(null);
    setMainImagePreview("");
  };

  const validateForm = () => {
    if (!formData.tenDiaDiem.trim()) {
      alert("Vui lòng nhập tên địa điểm");
      return false;
    }

    if (!formData.tinh.trim()) {
      alert("Vui lòng nhập tỉnh/thành");
      return false;
    }

    if (!formData.khuVuc.trim()) {
      alert("Vui lòng nhập khu vực");
      return false;
    }

    if (!formData.moTa.trim()) {
      alert("Vui lòng nhập mô tả");
      return false;
    }

    if (!mainImage) {
      alert("Vui lòng chọn ảnh chính");
      return false;
    }

    return true;
  };

  const resetForm = () => {
    setFormData({
      tenDiaDiem: "",
      moTa: "",
      gioiThieuText: "",
      doKho: "Dễ",
      veVao: "",
      quangduong: "",
      khuVuc: "",
      tinh: "",
      hot: false,
      dacDiemDiaDanhText: "",
    });

    setMainImage(null);
    setMainImagePreview("");
    setSubImages([]);
    setSubImagePreviews([]);
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);

      const gioiThieu = formData.gioiThieuText
        .split("\n")
        .map((x) => x.trim())
        .filter(Boolean);

      const dacDiemDiaDanh = formData.dacDiemDiaDanhText
        .split(",")
        .map((x) => x.trim())
        .filter(Boolean);

      const payload = new FormData();

      payload.append("tenDiaDiem", formData.tenDiaDiem);
      payload.append("moTa", formData.moTa);
      payload.append("gioiThieu", JSON.stringify(gioiThieu));
      payload.append("doKho", formData.doKho);
      payload.append("veVao", formData.veVao);
      payload.append("quangduong", formData.quangduong);
      payload.append("khuVuc", formData.khuVuc);
      payload.append("tinh", formData.tinh);
      payload.append("hot", String(formData.hot));
      payload.append("dacDiemDiaDanh", JSON.stringify(dacDiemDiaDanh));

      payload.append("image", mainImage);

      subImages.forEach((file) => {
        payload.append("images", file);
      });

      const res = await fetch(`${API_URL}/doitac/${slug}/diadiem`, {
        method: "POST",
        body: payload,
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Thêm địa điểm thất bại");
      }

      alert("Thêm địa điểm thành công, vui lòng chờ quản trị viên duyệt");
      resetForm();
    } catch (error) {
      console.log(error);
      alert(error.message || "Lỗi server khi thêm địa điểm");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="doitac-content-them">
      <div className="them-header">
        <div className="them-title">
          <h2>Thêm địa điểm mới</h2>
          <p>
            Chia sẻ tọa độ trekking/cắm trại với cộng đồng Backpacking Việt Nam.
            Địa điểm sau khi gửi sẽ ở trạng thái chờ duyệt.
          </p>
        </div>

        <div className="them-actions">
          <button className="btn-cancel-them" type="button" onClick={resetForm}>
            Hủy bỏ
          </button>

          <button
            className="btn-save-them"
            type="button"
            onClick={handleSubmit}
            disabled={loading}
          >
            <Save size={18} />
            {loading ? "Đang lưu..." : "Lưu địa điểm"}
          </button>
        </div>
      </div>

      <div className="them-grid-layout">
        <div className="them-column-left">
          <div className="them-box">
            <h4 className="box-label-green">
              <MapPin size={16} /> THÔNG TIN CƠ BẢN
            </h4>

            <div className="input-group">
              <label>TÊN ĐỊA ĐIỂM</label>
              <input
                type="text"
                name="tenDiaDiem"
                value={formData.tenDiaDiem}
                onChange={handleChange}
                placeholder="VD: Đỉnh Chư Nâm, Núi Bằng Am..."
              />
            </div>

            <div className="form-row">
              <div className="input-group">
                <label>TỈNH / THÀNH</label>
                <input
                  type="text"
                  name="tinh"
                  value={formData.tinh}
                  onChange={handleChange}
                  placeholder="VD: Gia Lai"
                />
              </div>

              <div className="input-group">
                <label>KHU VỰC</label>
                <div className="input-with-icon">
                  <MapPin size={16} className="inner-icon" />
                  <input
                    type="text"
                    name="khuVuc"
                    value={formData.khuVuc}
                    onChange={handleChange}
                    placeholder="VD: Pleiku, Gia Lai"
                  />
                </div>
              </div>
            </div>

            <div className="form-row">
              <div className="input-group">
                <label>ĐỘ KHÓ</label>
                <select
                  className="select"
                  name="doKho"
                  value={formData.doKho}
                  onChange={handleChange}
                >
                  <option value="Dễ">Dễ</option>
                  <option value="Trung bình">Trung bình</option>
                  <option value="Khó">Khó</option>
                  <option value="Rất khó">Rất khó</option>
                </select>
              </div>

              <div className="input-group">
                <label>QUÃNG ĐƯỜNG</label>
                <input
                  type="text"
                  name="quangduong"
                  value={formData.quangduong}
                  onChange={handleChange}
                  placeholder="VD: 5km trekking"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="input-group">
                <label>VÉ VÀO</label>
                <input
                  type="text"
                  name="veVao"
                  value={formData.veVao}
                  onChange={handleChange}
                  placeholder="VD: Miễn phí hoặc 20.000"
                />
              </div>

              <div className="input-group">
                <label>ĐỊA ĐIỂM NỔI BẬT</label>
                <select
                  name="hot"
                  value={formData.hot ? "true" : "false"}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      hot: e.target.value === "true",
                    }))
                  }
                >
                  <option value="false">Không</option>
                  <option value="true">Có</option>
                </select>
              </div>
            </div>
          </div>

          <div className="them-box">
            <h4 className="box-label-green">
              <FileText size={16} /> MÔ TẢ CHI TIẾT
            </h4>

            <textarea
              rows="6"
              name="moTa"
              value={formData.moTa}
              onChange={handleChange}
              placeholder="Mô tả ngắn về địa điểm, đường đi, cảnh quan, lưu ý an toàn..."
            />
          </div>

          <div className="them-box">
            <h4 className="box-label-green">
              <Info size={16} /> GIỚI THIỆU
            </h4>

            <textarea
              rows="5"
              name="gioiThieuText"
              value={formData.gioiThieuText}
              onChange={handleChange}
              placeholder={`Mỗi dòng là một đoạn giới thiệu.\nVD:\nChư Nâm là điểm trekking nổi tiếng...\nThời điểm đẹp nhất là mùa khô...`}
            />
          </div>
        </div>

        <div className="them-column-right">
          <div className="them-box">
            <h4 className="box-label-green">🛠 ĐẶC ĐIỂM ĐỊA DANH</h4>

            <div className="tag-container">
              {quickTags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  className={`tag-item ${selectedTags.includes(tag) ? "active" : ""}`}
                  onClick={() => toggleQuickTag(tag)}
                >
                  <span>{tag}</span>
                </button>
              ))}
            </div>

            <div className="add-tag-wrapper">
              <button className="btn-add-tag" type="button">
                <Plus size={18} className="add-icon" />
              </button>

              <input
                type="text"
                placeholder="Nhập đặc điểm rồi Enter..."
                onKeyDown={addCustomTag}
              />
            </div>

            <div className="input-group" style={{ marginTop: 14 }}>
              <label>ĐẶC ĐIỂM ĐÃ CHỌN</label>
              <input
                name="dacDiemDiaDanhText"
                value={formData.dacDiemDiaDanhText}
                onChange={handleChange}
                placeholder="VD: Trong rừng, Cắm trại, Gần nguồn nước"
              />
            </div>
          </div>

          <div className="upload-section">
            <h4 className="box-label-green">🖼 ẢNH CHÍNH</h4>

            <button
              type="button"
              className="upload-main-dropzone"
              onClick={() => mainImageRef.current?.click()}
            >
              {mainImagePreview ? (
                <div className="main-image-preview-box">
                  <img src={mainImagePreview} alt="Ảnh chính" />
                  <span>Nhấn để đổi ảnh chính</span>
                </div>
              ) : (
                <>
                  <Upload size={32} className="upload-icon" />
                  <p>Tải lên ảnh chính</p>
                  <span>Ảnh này sẽ hiển thị đầu tiên ở địa điểm</span>
                </>
              )}

              <input
                type="file"
                ref={mainImageRef}
                onChange={handleMainImageChange}
                hidden
                accept="image/*"
              />
            </button>

            {mainImagePreview && (
              <button
                type="button"
                className="btn-remove-main-image"
                onClick={removeMainImage}
              >
                <X size={14} /> Xóa ảnh chính
              </button>
            )}
          </div>

          <div className="upload-section">
            <h4 className="box-label-green">🖼 ẢNH PHỤ</h4>

            <button
              type="button"
              className="upload-main-dropzone"
              onClick={() => subImagesRef.current?.click()}
            >
              <Upload size={32} className="upload-icon" />
              <p>Tải lên nhiều ảnh phụ</p>
              <span>Có thể chọn nhiều ảnh JPG, PNG, WEBP</span>

              <input
                type="file"
                ref={subImagesRef}
                onChange={handleSubImagesChange}
                hidden
                multiple
                accept="image/*"
              />
            </button>

            <div className="upload-preview-grid">
              {subImagePreviews.map((img, index) => (
                <div key={img.id} className="preview-item">
                  <img src={img.url} alt={`Ảnh phụ ${index + 1}`} />

                  <button
                    type="button"
                    className="btn-remove-image"
                    onClick={() => removeSubImage(index)}
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}

              <button
                type="button"
                className="preview-item add-more-img"
                onClick={() => subImagesRef.current?.click()}
              >
                <ImageIcon size={24} />
                <span>Thêm</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="them-footer-info">
        <div>
          <span>🛡️ Thông tin sẽ được quản trị viên kiểm duyệt </span>
          <span>🕒 Trạng thái mặc định: Chờ duyệt</span>
        </div>

        <div>
          <span>POWERED BY BACKPACKING VIETNAM DATA ENGINE</span>
        </div>
      </div>
    </div>
  );
};

export default ContentThemdiadiem;