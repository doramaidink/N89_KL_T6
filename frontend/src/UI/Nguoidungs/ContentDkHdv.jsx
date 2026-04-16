import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-toastify";

const NgaySinhSelector = ({ value, onChange }) => {
  const [day, setDay] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");

  const days = useMemo(() => Array.from({ length: 31 }, (_, i) => i + 1), []);
  const months = useMemo(() => Array.from({ length: 12 }, (_, i) => i + 1), []);
  const years = useMemo(() => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 80 }, (_, i) => currentYear - i);
  }, []);

  useEffect(() => {
    if (value) {
      const parts = value.split("-");
      if (parts.length === 3) {
        if (
          parts[0] !== year ||
          String(Number(parts[1])) !== month ||
          String(Number(parts[2])) !== day
        ) {
          setYear(parts[0]);
          setMonth(String(Number(parts[1])));
          setDay(String(Number(parts[2])));
        }
      }

    }
  }, [value]);

  useEffect(() => {
    if (day && month && year) {
      const formatted = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      onChange(formatted);
    } else {
      onChange("");
    }
  }, [day, month, year, onChange]);

  return (
    <div className="form-group">
      <label>Ngày sinh</label>

      <div className="grid grid-cols-3 gap-3">
        <select
          value={day}
          onChange={(e) => setDay(e.target.value)}
          className="w-full rounded-xl border border-emerald-700/60 bg-emerald-950/60 px-4 py-3 text-white outline-none transition duration-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/30"
        >
          <option value="" className="text-black">
            Ngày
          </option>
          {days.map((d) => (
            <option key={d} value={d} className="text-black">
              {d}
            </option>
          ))}
        </select>

        <select
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="w-full rounded-xl border border-emerald-700/60 bg-emerald-950/60 px-4 py-3 text-white outline-none transition duration-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/30"
        >
          <option value="" className="text-black">
            Tháng
          </option>
          {months.map((m) => (
            <option key={m} value={m} className="text-black">
              {m}
            </option>
          ))}
        </select>

        <select
          value={year}
          onChange={(e) => setYear(e.target.value)}
          className="w-full rounded-xl border border-emerald-700/60 bg-emerald-950/60 px-4 py-3 text-white outline-none transition duration-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/30"
        >
          <option value="" className="text-black">
            Năm
          </option>
          {years.map((y) => (
            <option key={y} value={y} className="text-black">
              {y}
            </option>
          ))}
        </select>
      </div>

      {value && (
        <p className="mt-2 text-sm text-emerald-300">
          Ngày đã chọn: {value.split("-").reverse().join("/")}
        </p>
      )}
    </div>
  );
};

const ContentDkHdv = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [diaDiems, setDiaDiems] = useState([]);

  const [previewFront, setPreviewFront] = useState("");
  const [previewBack, setPreviewBack] = useState("");
  const [previewSelfie, setPreviewSelfie] = useState("");
  const [previewLyLich, setPreviewLyLich] = useState("");

  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const [formData, setFormData] = useState({
    hoTen: "",
    soDienThoai: "",
    soCCCD: "",
    ngaySinh: "",
    diaChi: "",
    queQuan: "",
    tinhDangKy: "",
    gioiThieuBanThan: "",
    kyNangDacBiet: "",
    ngonNguHoTro: "",
    kinhNghiem: "",
    soNamKinhNghiem: "",
    giaThue: "",
    diaDiemGiaCa: [
      {
        diaDiem: "",
        mucGia: "",
        kinhNghiem: "",
      },
    ],
  });

  const [files, setFiles] = useState({
    anhCCCDMatTruoc: null,
    anhCCCDMatSau: null,
    anhKhuonMat: null,
    lyLichTuPhap: null,
  });

  useEffect(() => {
    const fetchDiaDiem = async () => {
      try {
        const res = await fetch("http://localhost:5000/diadiem");
        const data = await res.json();

        if (res.ok && Array.isArray(data)) {
          setDiaDiems(data);
        } else {
          setDiaDiems([]);
        }
      } catch (error) {
        console.log(error);
        toast.error("Không tải được danh sách địa điểm");
      }
    };

    fetchDiaDiem();
  }, []);

  useEffect(() => {
    if (step === 3) {
      startCamera();
    } else {
      stopCamera();
    }
  }, [step]);

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        toast.error("Trình duyệt không hỗ trợ camera");
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
        },
        audio: false,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.log(error);
      toast.error("Không thể mở camera. Hãy cấp quyền camera cho trình duyệt.");
    }
  };

  const stopCamera = () => {
    const stream = videoRef.current?.srcObject;
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    }
  };

  const dataURLtoFile = (dataurl, filename) => {
    const arr = dataurl.split(",");
    const mime = arr[0].match(/:(.*?);/)?.[1] || "image/png";
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, { type: mime });
  };

  const captureImage = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas) {
      toast.error("Không tìm thấy camera");
      return;
    }

    const context = canvas.getContext("2d");
    if (!context) {
      toast.error("Không thể xử lý ảnh");
      return;
    }

    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    const dataUrl = canvas.toDataURL("image/png");
    const selfieFile = dataURLtoFile(dataUrl, `selfie-${Date.now()}.png`);

    setPreviewSelfie(dataUrl);
    setFiles((prev) => ({
      ...prev,
      anhKhuonMat: selfieFile,
    }));

    stopCamera();
    toast.success("Chụp ảnh selfie thành công");
  };

  const retakeSelfie = () => {
    setPreviewSelfie("");
    setFiles((prev) => ({
      ...prev,
      anhKhuonMat: null,
    }));
    startCamera();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNgaySinhChange = useCallback((value) => {
    setFormData(prev => ({
      ...prev,
      ngaySinh: value
    }));
  }, []);

  const handleDiaDiemGiaCaChange = (index, field, value) => {
    const updated = [...formData.diaDiemGiaCa];
    updated[index][field] = value;

    setFormData((prev) => ({
      ...prev,
      diaDiemGiaCa: updated,
    }));
  };

  const addDiaDiemGiaCa = () => {
    setFormData((prev) => ({
      ...prev,
      diaDiemGiaCa: [
        ...prev.diaDiemGiaCa,
        {
          diaDiem: "",
          mucGia: "",
          kinhNghiem: "",
        },
      ],
    }));
  };

  const removeDiaDiemGiaCa = (index) => {
    const updated = [...formData.diaDiemGiaCa];
    updated.splice(index, 1);

    setFormData((prev) => ({
      ...prev,
      diaDiemGiaCa:
        updated.length > 0
          ? updated
          : [
            {
              diaDiem: "",
              mucGia: "",
              kinhNghiem: "",
            },
          ],
    }));
  };

  const handleFileChange = (e) => {
    const { name, files: inputFiles } = e.target;
    const file = inputFiles[0];
    if (!file) return;

    setFiles((prev) => ({
      ...prev,
      [name]: file,
    }));

    if (name === "anhCCCDMatTruoc") {
      setPreviewFront(URL.createObjectURL(file));
    }
    if (name === "anhCCCDMatSau") {
      setPreviewBack(URL.createObjectURL(file));
    }
    if (name === "lyLichTuPhap") {
      setPreviewLyLich(file.name);
    }
  };

  const validateStep1 = () => {
    if (!formData.hoTen.trim()) {
      toast.error("Vui lòng nhập họ tên");
      return false;
    }
    if (!formData.soDienThoai.trim()) {
      toast.error("Vui lòng nhập số điện thoại");
      return false;
    }
    if (!formData.soCCCD.trim()) {
      toast.error("Vui lòng nhập số CCCD");
      return false;
    }
    if (!formData.ngaySinh) {
      toast.error("Vui lòng chọn ngày sinh");
      return false;
    }
    if (!formData.diaChi.trim()) {
      toast.error("Vui lòng nhập địa chỉ");
      return false;
    }
    if (!formData.tinhDangKy.trim()) {
      toast.error("Vui lòng nhập tỉnh/thành đăng ký");
      return false;
    }

    const validDiaDiem = formData.diaDiemGiaCa.some((item) => item.diaDiem);
    if (!validDiaDiem) {
      toast.error("Vui lòng chọn ít nhất 1 địa điểm hướng dẫn");
      return false;
    }

    return true;
  };

  const validateStep2 = () => {
    if (!files.anhCCCDMatTruoc) {
      toast.error("Vui lòng upload CCCD mặt trước");
      return false;
    }
    if (!files.anhCCCDMatSau) {
      toast.error("Vui lòng upload CCCD mặt sau");
      return false;
    }
    if (!files.lyLichTuPhap) {
      toast.error("Vui lòng upload lý lịch tư pháp");
      return false;
    }
    return true;
  };

  const validateStep3 = () => {
    if (!files.anhKhuonMat) {
      toast.error("Vui lòng chụp ảnh selfie");
      return false;
    }
    return true;
  };

  const nextStep = () => {
    if (step === 1 && !validateStep1()) return;
    if (step === 2 && !validateStep2()) return;
    setStep((prev) => prev + 1);
  };

  const prevStep = () => {
    setStep((prev) => prev - 1);
  };

  const handleSubmit = async () => {
    if (!validateStep3()) return;

    try {
      setLoading(true);

      const user = JSON.parse(localStorage.getItem("user") || "{}");
      if (!user.id) {
        toast.error("Bạn cần đăng nhập trước");
        return;
      }

      const cacDiaDiemDangKy = formData.diaDiemGiaCa
        .map((item) => item.diaDiem)
        .filter(Boolean);

      const payload = new FormData();
      payload.append("nguoiDung", user.id);
      payload.append("hoTen", formData.hoTen);
      payload.append("soDienThoai", formData.soDienThoai);
      payload.append("soCCCD", formData.soCCCD);
      payload.append("ngaySinh", formData.ngaySinh);
      payload.append("diaChi", formData.diaChi);
      payload.append("queQuan", formData.queQuan);
      payload.append("tinhDangKy", formData.tinhDangKy);
      payload.append("gioiThieuBanThan", formData.gioiThieuBanThan);
      payload.append("kyNangDacBiet", formData.kyNangDacBiet);
      payload.append("ngonNguHoTro", formData.ngonNguHoTro);
      payload.append("kinhNghiem", formData.kinhNghiem);
      payload.append("soNamKinhNghiem", formData.soNamKinhNghiem || 0);
      payload.append("giaThue", formData.giaThue || 0);

      payload.append("cacDiaDiemDangKy", JSON.stringify(cacDiaDiemDangKy));
      payload.append("diaDiemGiaCa", JSON.stringify(formData.diaDiemGiaCa));

      payload.append("anhCCCDMatTruoc", files.anhCCCDMatTruoc);
      payload.append("anhCCCDMatSau", files.anhCCCDMatSau);
      payload.append("anhKhuonMat", files.anhKhuonMat);
      payload.append("lyLichTuPhap", files.lyLichTuPhap);

      const response = await fetch("http://localhost:5000/doitac/dang-ky-huong-dan-vien", {
        method: "POST",
        body: payload,
      });

      const result = await response.json();

      if (!response.ok) {
        toast.error(result.message || "Gửi hồ sơ thất bại");
        return;
      }

      toast.success("Gửi hồ sơ đăng ký hướng dẫn viên thành công");
    } catch (error) {
      console.log(error);
      toast.error("Lỗi server khi gửi hồ sơ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="content-dkhdv-page">
      <div className="dkhdv-container">
        <div className="dkhdv-header">
          <h1>Đăng ký trở thành Đối tác Hướng dẫn viên</h1>
          <p>Tham gia cộng đồng hướng dẫn viên bản địa chuyên nghiệp để chia sẻ vẻ đẹp Việt Nam.</p>
        </div>

        <div className="step-bar">
          <div className={`step-item ${step >= 1 ? "active" : ""}`}>
            <div className="step-circle">1</div>
            <div className="step-label">Điền thông tin</div>
          </div>

          <div className="step-line"></div>

          <div className={`step-item ${step >= 2 ? "active" : ""}`}>
            <div className="step-circle">2</div>
            <div className="step-label">CCCD & Lý lịch tư pháp</div>
          </div>

          <div className="step-line"></div>

          <div className={`step-item ${step >= 3 ? "active" : ""}`}>
            <div className="step-circle">3</div>
            <div className="step-label">Chụp selfie</div>
          </div>
        </div>

        {step === 1 && (
          <div className="dkhdv-card">
            <h3>Thông tin cá nhân</h3>

            <div className="dkhdv-grid two-col">
              <div className="form-group">
                <label>Họ và tên</label>
                <input
                  name="hoTen"
                  value={formData.hoTen}
                  onChange={handleChange}
                  placeholder="Nguyễn Văn A"
                />
              </div>

              <NgaySinhSelector
                value={formData.ngaySinh}
                onChange={handleNgaySinhChange}
              />

              <div className="form-group">
                <label>Số điện thoại</label>
                <input
                  name="soDienThoai"
                  value={formData.soDienThoai}
                  onChange={handleChange}
                  placeholder="0123456789"
                />
              </div>

              <div className="form-group">
                <label>Số CCCD</label>
                <input
                  name="soCCCD"
                  value={formData.soCCCD}
                  onChange={handleChange}
                  placeholder="Nhập số CCCD/CMND"
                />
              </div>

              <div className="form-group full-col">
                <label>Địa chỉ</label>
                <input
                  name="diaChi"
                  value={formData.diaChi}
                  onChange={handleChange}
                  placeholder="Số nhà, tên đường, phường/xã..."
                />
              </div>

              <div className="form-group full-col">
                <label>Quê quán</label>
                <input
                  name="queQuan"
                  value={formData.queQuan}
                  onChange={handleChange}
                  placeholder="Quê quán"
                />
              </div>

              <div className="form-group">
                <label>Tỉnh/Thành đăng ký</label>
                <input
                  name="tinhDangKy"
                  value={formData.tinhDangKy}
                  onChange={handleChange}
                  placeholder="Đà Nẵng"
                />
              </div>

              <div className="form-group">
                <label>Số năm kinh nghiệm</label>
                <input
                  type="number"
                  name="soNamKinhNghiem"
                  value={formData.soNamKinhNghiem}
                  onChange={handleChange}
                  placeholder="2"
                />
              </div>

              <div className="form-group full-col">
                <label>Kỹ năng đặc biệt</label>
                <input
                  name="kyNangDacBiet"
                  value={formData.kyNangDacBiet}
                  onChange={handleChange}
                  placeholder="Nhiếp ảnh gia, sơ cứu..."
                />
              </div>

              <div className="form-group full-col">
                <label>Giới thiệu bản thân</label>
                <textarea
                  name="gioiThieuBanThan"
                  value={formData.gioiThieuBanThan}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Hãy chia sẻ thêm về phong cách hướng dẫn của bạn..."
                />
              </div>
            </div>

            <div className="dkhdv-card child-card" style={{ marginTop: 24 }}>
              <h3>Địa điểm & Giá cả</h3>

              {formData.diaDiemGiaCa.map((item, index) => (
                <div className="dkhdv-grid three-col" key={index} style={{ marginBottom: 16 }}>
                  <div className="form-group">
                    <label>Địa điểm hướng dẫn</label>
                    <select
                      value={item.diaDiem}
                      onChange={(e) =>
                        handleDiaDiemGiaCaChange(index, "diaDiem", e.target.value)
                      }
                    >
                      <option value="">-- Chọn địa điểm --</option>
                      {diaDiems.map((diaDiem) => (
                        <option key={diaDiem._id} value={diaDiem._id}>
                          {diaDiem.tenDiaDiem}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Mức giá (VND/Ngày)</label>
                    <input
                      type="number"
                      value={item.mucGia}
                      onChange={(e) =>
                        handleDiaDiemGiaCaChange(index, "mucGia", e.target.value)
                      }
                      placeholder="500000"
                    />
                  </div>

                  <div className="form-group">
                    <label>Kinh nghiệm</label>
                    <input
                      value={item.kinhNghiem}
                      onChange={(e) =>
                        handleDiaDiemGiaCaChange(index, "kinhNghiem", e.target.value)
                      }
                      placeholder="Ví dụ: 3 năm dẫn tour văn hóa"
                    />
                  </div>

                  <div className="form-group">
                    <button
                      type="button"
                      className="btn-remove-dd"
                      onClick={() => removeDiaDiemGiaCa(index)}
                    >
                      Xóa
                    </button>
                  </div>
                </div>
              ))}

              <button type="button" className="btn-add-dd" onClick={addDiaDiemGiaCa}>
                + Thêm địa điểm
              </button>
            </div>

            <div className="step-actions">
              <button className="btn-next" onClick={nextStep}>
                Tiếp theo
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="dkhdv-card">
            <h3>Bước 2: CCCD và Lý lịch tư pháp</h3>

            <div className="upload-grid">
              <div className="upload-box">
                <label>CCCD mặt trước</label>
                <input
                  type="file"
                  name="anhCCCDMatTruoc"
                  accept="image/*"
                  onChange={handleFileChange}
                />
                {previewFront && (
                  <img src={previewFront} alt="CCCD mặt trước" className="preview-img" />
                )}
              </div>

              <div className="upload-box">
                <label>CCCD mặt sau</label>
                <input
                  type="file"
                  name="anhCCCDMatSau"
                  accept="image/*"
                  onChange={handleFileChange}
                />
                {previewBack && (
                  <img src={previewBack} alt="CCCD mặt sau" className="preview-img" />
                )}
              </div>
            </div>

            <div className="upload-box" style={{ marginTop: 20 }}>
              <label>Lý lịch tư pháp</label>
              <input
                type="file"
                name="lyLichTuPhap"
                accept=".jpg,.jpeg,.png,.webp,.pdf"
                onChange={handleFileChange}
              />
              {previewLyLich && <p className="file-name-preview">{previewLyLich}</p>}
            </div>

            <div className="step-actions">
              <button className="btn-back" onClick={prevStep}>
                Quay lại
              </button>
              <button className="btn-next" onClick={nextStep}>
                Tiếp theo
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="dkhdv-card">
            <h3>Bước 3: Chụp ảnh selfie</h3>

            <div className="flex flex-col items-center gap-4">
              {!previewSelfie && (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full max-w-md rounded-xl border border-emerald-700"
                />
              )}

              {previewSelfie && (
                <img
                  src={previewSelfie}
                  alt="Selfie"
                  className="w-full max-w-md rounded-xl border border-emerald-700"
                />
              )}

              <canvas ref={canvasRef} className="hidden" />

              <div className="flex gap-3">
                {!previewSelfie ? (
                  <button type="button" className="btn-next" onClick={captureImage}>
                    📸 Chụp ảnh
                  </button>
                ) : (
                  <button type="button" className="btn-back" onClick={retakeSelfie}>
                    🔄 Chụp lại
                  </button>
                )}
              </div>
            </div>

            <div className="step-actions">
              <button className="btn-back" onClick={prevStep}>
                Quay lại
              </button>
              <button className="btn-submit" onClick={handleSubmit} disabled={loading}>
                {loading ? "Đang gửi hồ sơ..." : "Gửi đăng ký làm HDV"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContentDkHdv;