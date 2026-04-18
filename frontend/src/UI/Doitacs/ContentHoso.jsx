import React, { useRef, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Camera, PlusCircle, X } from "lucide-react";

const ContentHoso = () => {
  const { slug } = useParams();

  const avatarInputRef = useRef(null);
  const locationInputRef = useRef(null);

  const hoTenRef = useRef(null);
  const diaChiRef = useRef(null);
  const tinhRef = useRef(null);
  const kinhNghiemNamRef = useRef(null);
  const giaRef = useRef(null);
  const ngonNguRef = useRef(null);
  const moTaRef = useRef(null);
  const kinhNghiemRef = useRef(null);
  const sdtRef = useRef(null);
  const cccdRef = useRef(null);
  const diaDiemHuongDanRef = useRef(null);

  const [avatarPreview, setAvatarPreview] = useState(null);
  const [locationImages, setLocationImages] = useState([]);
  const [doiTacData, setDoiTacData] = useState(null);
  const resolveImagePath = (path) => {
    if (!path) return "";
    if (path.startsWith("http://") || path.startsWith("https://")) return path;
    if (path.startsWith("/")) return path;
    return `/${path}`;
  };

  const handleFileChangeAvatar = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setAvatarPreview(imageUrl);
      console.log("File đã chọn:", file.name);
    }
  };

  const handleFileChangeLocation = (e) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const filesArray = Array.from(e.target.files);
    const newPreviews = filesArray
      .map((file) => {
        if (!file.type.startsWith("image/")) return null;
        return {
          id: Math.random().toString(36).substring(2, 11),
          url: URL.createObjectURL(file),
        };
      })
      .filter((item) => item !== null);

    setLocationImages((prev) => [...prev, ...newPreviews]);
    e.target.value = "";
  };

  useEffect(() => {
    return () => {
      locationImages.forEach((img) => URL.revokeObjectURL(img.url));
    };
  }, [locationImages]);

  const removeImage = (id, url) => {
    URL.revokeObjectURL(url);
    setLocationImages((prev) => prev.filter((img) => img.id !== id));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`http://localhost:5000/doitac/${slug}/hoso`);
        const result = await res.json();

        if (res.ok && result.doiTac) {
          const dt = result.doiTac;
          setDoiTacData(dt);

          if (hoTenRef.current) hoTenRef.current.value = dt.hoTen || "";
          if (diaChiRef.current) diaChiRef.current.value = dt.diaChi || "";
          if (tinhRef.current) tinhRef.current.value = dt.tinhDangKy || "";
          if (kinhNghiemNamRef.current) kinhNghiemNamRef.current.value = dt.soNamKinhNghiem || 0;
          if (giaRef.current) giaRef.current.value = dt.giaThue || 0;
          if (ngonNguRef.current) {
            ngonNguRef.current.value = Array.isArray(dt.ngonNguHoTro)
              ? dt.ngonNguHoTro.join(", ")
              : "";
          }
          if (moTaRef.current) moTaRef.current.value = dt.gioiThieuBanThan || "";
          if (kinhNghiemRef.current) kinhNghiemRef.current.value = dt.kinhNghiem || "";
          if (sdtRef.current) sdtRef.current.value = dt.soDienThoai || "";
          if (cccdRef.current) cccdRef.current.value = dt.soCCCD || "";

          if (diaDiemHuongDanRef.current) {
            diaDiemHuongDanRef.current.value = Array.isArray(dt.cacDiaDiemDangKy)
              ? dt.cacDiaDiemDangKy
                .map((item) => item?.tenDiaDiem)
                .filter(Boolean)
                .join(", ")
              : "";
          }

          if (dt.image) {
            setAvatarPreview(resolveImagePath(dt.image));
          }

          if (Array.isArray(dt.cacDiaDiemDangKy)) {
            const previewFromDb = dt.cacDiaDiemDangKy
              .map((item) => {
                const img =
                  item?.image ||
                  (Array.isArray(item?.images) && item.images.length > 0 ? item.images[0] : null);

                if (!img) return null;

                return {
                  id: item._id || Math.random().toString(36).substring(2, 11),
                  url: resolveImagePath(img),
                  isServerImage: true,
                };
              })
              .filter(Boolean);

            setLocationImages(previewFromDb);
          }
        }
      } catch (err) {
        console.log(err);
      }
    };

    if (slug) fetchData();
  }, [slug]);

  const handleSave = async () => {
    try {
      const body = {
        hoTen: hoTenRef.current?.value || "",
        diaChi: diaChiRef.current?.value || "",
        tinhDangKy: tinhRef.current?.value || "",
        soNamKinhNghiem: kinhNghiemNamRef.current?.value || 0,
        giaThue: giaRef.current?.value || 0,
        ngonNguHoTro: ngonNguRef.current?.value || "",
        gioiThieuBanThan: moTaRef.current?.value || "",
        kinhNghiem: kinhNghiemRef.current?.value || "",
        soDienThoai: sdtRef.current?.value || "",
        soCCCD: cccdRef.current?.value || "",
      };

      const res = await fetch(`http://localhost:5000/doitac/${slug}/hoso`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const result = await res.json();
      alert(result.message || "Lưu thay đổi thành công!");
    } catch (error) {
      console.log(error);
      alert("Lỗi khi lưu dữ liệu!");
    }
  };

  return (
    <div className="doitac-content-hoso">
      <div className="hoso-edit-container">
        <div className="hoso-title">
          <h2>Chỉnh sửa hồ sơ đối tác</h2>
          <p>Cập nhật thông tin cá nhân và chi tiết hướng dẫn của bạn để thu hút nhiều du khách hơn</p>
        </div>

        <div className="hoso-two-columns-layout">
          <div className="hoso-column-left">
            <div className="hoso-edit-card avatar">
              <div className="avatar-edit-wrapper">
                <img src={avatarPreview || "/img/doitac.jpg"} alt="Avatar" />
                <button
                  type="button"
                  className="change-photo-overlay"
                  onClick={() => avatarInputRef.current.click()}
                >
                  <Camera size={20} />
                </button>
                <input
                  type="file"
                  ref={avatarInputRef}
                  onChange={handleFileChangeAvatar}
                  hidden
                  accept="image/*"
                />
              </div>
              <p className="avatar-hoso">Ảnh đại diện</p>
              <p className="avatar-hint">Định dạng JPG, PNG. Kích thước 400x400px.</p>
            </div>

            <div className="hoso-edit-card">
              <div className="input-group-with-icon">
                <label>Số CCCD</label>
                <div className="input-wrapper">
                  <img src="/img/cccd.jpg" alt="CCCD" className="input-icon" />
                  <input type="text" defaultValue="048201004567" ref={cccdRef} />
                </div>
              </div>
              <div className="input-group-with-icon">
                <label>Số điện thoại</label>
                <div className="input-wrapper">
                  <img src="/img/dienthoai.jpg" alt="Sodienthoai" className="input-icon" />
                  <input type="text" defaultValue="0905 123 456" ref={sdtRef} />
                </div>
              </div>
            </div>

            <div className="hoso-edit-card">
              <div className="input-group">
                <label>Mô tả bản thân</label>
                <textarea rows="6" defaultValue="" ref={moTaRef}></textarea>
              </div>
            </div>
          </div>

          <div className="hoso-column-right">
            <div className="hoso-edit-card">
              <div className="input-group">
                <label>Tên (Full Name)</label>
                <input type="text" defaultValue="Nguyễn Thành Nam" ref={hoTenRef} />
              </div>
              <div className="input-group">
                <label>Địa chỉ liên hệ</label>
                <input
                  type="text"
                  defaultValue="123 Nguyễn Văn Linh, Quận Hải Châu, Đà Nẵng"
                  ref={diaChiRef}
                />
              </div>
              <div className="form-row">
                <div className="input-group">
                  <label>Tỉnh thành đăng ký</label>
                  <select ref={tinhRef} defaultValue="">
                    <option value="">Chọn tỉnh thành</option>
                    <option value="Đà Nẵng">Đà Nẵng</option>
                    <option value="Quảng Nam">Quảng Nam</option>
                    <option value="Thừa Thiên Huế">Thừa Thiên Huế</option>
                    <option value="Quảng Ngãi">Quảng Ngãi</option>
                    <option value="Bình Định">Bình Định</option>
                    <option value="Phú Yên">Phú Yên</option>
                    <option value="Khánh Hòa">Khánh Hòa</option>
                    <option value="Gia Lai">Gia Lai</option>
                    <option value="Kon Tum">Kon Tum</option>
                    <option value="Đắk Lắk">Đắk Lắk</option>
                    <option value="Lâm Đồng">Lâm Đồng</option>
                  </select>
                </div>
                <div className="input-group">
                  <label>Số năm kinh nghiệm</label>
                  <input type="number" defaultValue="5" ref={kinhNghiemNamRef} />
                </div>
              </div>
            </div>

            <div className="hoso-edit-card">
              <div className="input-group">
                <label>Địa điểm hướng dẫn</label>
                <input
                  type="text"
                  defaultValue="Rừng dâu, Bán đảo Sơn Trà, Đà Nẵng"
                  ref={diaDiemHuongDanRef}
                  readOnly
                />
              </div>
              <div className="form-row">
                <div className="input-group">
                  <label>Mức giá (VND/Ngày)</label>
                  <div className="input-with-suffix">
                    <input type="text" defaultValue="100,000" ref={giaRef} />
                    <span className="suffix">VNĐ</span>
                  </div>
                </div>
                <div className="input-group">
                  <label>Ngôn ngữ sử dụng</label>
                  <input
                    type="text"
                    defaultValue="Tiếng Việt, Tiếng Anh (IELTS 7.0)"
                    ref={ngonNguRef}
                  />
                </div>
              </div>
              <div className="input-group">
                <label>Kinh nghiệm</label>
                <textarea rows="3" defaultValue="" ref={kinhNghiemRef}></textarea>
              </div>
              <div className="location-upload-wrapper">
                <div className="location-preview-list">
                  {locationImages.map((img) => (
                    <div key={img.id} className="preview-card">
                      <img src={img.url} alt="Preview" />
                      <button
                        type="button"
                        className="delete-preview"
                        onClick={() => removeImage(img.id, img.url)}
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="btn-add-location" onClick={() => locationInputRef.current.click()}>
                  <div className="content-add-location">
                    <div className="plus-circle">
                      <PlusCircle size={20} />
                    </div>
                    <span> THÊM ĐỊA ĐIỂM HƯỚNG DẪN MỚI</span>
                  </div>
                  <input
                    type="file"
                    ref={locationInputRef}
                    onChange={handleFileChangeLocation}
                    hidden
                    multiple
                    accept="image/png, image/jpeg, image/jpg"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="hoso-actions">
          <button className="btn-cancel" type="button"> Hủy bỏ </button>
          <button className="btn-save" type="button" onClick={handleSave}> Lưu thay đổi </button>
        </div>
      </div>
    </div>
  );
};

export default ContentHoso;