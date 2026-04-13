import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import Webcam from 'react-webcam';
import * as faceapi from 'face-api.js';

const BACKEND_URL = 'http://localhost:5000';
const MATCH_THRESHOLD = 0.45;

const ContentDangKyDoiTac = () => {
  const webcamRef = useRef(null);

  const [step, setStep] = useState(1);
  const [modelsLoaded, setModelsLoaded] = useState(false);

  const [captureTarget, setCaptureTarget] = useState('front');
  const [cameraOpen, setCameraOpen] = useState(false);

  const [cccdFrontFile, setCccdFrontFile] = useState(null);
  const [cccdBackFile, setCccdBackFile] = useState(null);
  const [faceFile, setFaceFile] = useState(null);

  const [cccdFrontPreview, setCccdFrontPreview] = useState('');
  const [cccdBackPreview, setCccdBackPreview] = useState('');
  const [facePreview, setFacePreview] = useState('');

  const [ocrLoading, setOcrLoading] = useState(false);
  const [faceLoading, setFaceLoading] = useState(false);
  const [verifyMessage, setVerifyMessage] = useState('');

  const [cccdInfo, setCccdInfo] = useState({
    hoTen: '',
    soCCCD: '',
    diaChi: '',
    queQuan: '',
    ngaySinh: '',
    anhCCCDMatTruoc: '',
    anhCCCDMatSau: ''
  });

  const [formData, setFormData] = useState({
    email: '',
    soDienThoai: '',
    hoTen: '',
    soCCCD: '',
    diaChi: '',
    queQuan: '',
    ngaySinh: '',
    tinhDangKy: '',
    soNamKinhNghiem: '',
    ngonNgu: '',
    moTaBanThan: '',
    lyLichTuPhap: '',
    anhCCCDMatTruoc: '',
    anhCCCDMatSau: '',
    anhKhuonMat: '',
    faceMatched: false,
    faceDistance: null,
    verificationStatus: 'cho_xac_thuc',
    diaDiemGiaCa: [
      {
        diaDiem: '',
        mucGia: '',
        kinhNghiem: ''
      }
    ],
    camKet: false
  });

  useEffect(() => {
    const loadModels = async () => {
      try {
        await faceapi.nets.ssdMobilenetv1.loadFromUri('/models');
        await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
        await faceapi.nets.faceRecognitionNet.loadFromUri('/models');
        setModelsLoaded(true);
      } catch (error) {
        console.error('Lỗi load model:', error);
      }
    };

    loadModels();
  }, []);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    setFormData((prev) => ({
      ...prev,
      email: user.email || '',
      soDienThoai: user.soDienThoai || '',
    }));
  }, []);

  const handlePartnerChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleLocationChange = (index, field, value) => {
    const updated = [...formData.diaDiemGiaCa];
    updated[index][field] = value;
    setFormData((prev) => ({
      ...prev,
      diaDiemGiaCa: updated
    }));
  };

  const addLocationRow = () => {
    setFormData((prev) => ({
      ...prev,
      diaDiemGiaCa: [
        ...prev.diaDiemGiaCa,
        { diaDiem: '', mucGia: '', kinhNghiem: '' }
      ]
    }));
  };

  const removeLocationRow = (index) => {
    const updated = formData.diaDiemGiaCa.filter((_, i) => i !== index);
    setFormData((prev) => ({
      ...prev,
      diaDiemGiaCa: updated.length
        ? updated
        : [{ diaDiem: '', mucGia: '', kinhNghiem: '' }]
    }));
  };

  const handleUploadCCCD = (e, side) => {
    const file = e.target.files[0];
    if (!file) return;

    const preview = URL.createObjectURL(file);

    if (side === 'front') {
      setCccdFrontFile(file);
      setCccdFrontPreview(preview);
    } else {
      setCccdBackFile(file);
      setCccdBackPreview(preview);
    }
  };

  const openCameraFor = (target) => {
    setCaptureTarget(target);
    setCameraOpen(true);
  };

  const closeCamera = () => {
    setCameraOpen(false);
  };

  const captureImage = async () => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (!imageSrc) {
      alert('Không chụp được ảnh');
      return;
    }

    const blob = await fetch(imageSrc).then((r) => r.blob());
    const file = new File([blob], `${captureTarget}-${Date.now()}.jpg`, {
      type: 'image/jpeg'
    });

    if (captureTarget === 'front') {
      setCccdFrontFile(file);
      setCccdFrontPreview(imageSrc);
    } else if (captureTarget === 'back') {
      setCccdBackFile(file);
      setCccdBackPreview(imageSrc);
    } else {
      setFaceFile(file);
      setFacePreview(imageSrc);
      await uploadFaceToServer(file);
    }

    setCameraOpen(false);
  };

  const uploadFaceToServer = async (file) => {
    try {
      const data = new FormData();
      data.append('faceImage', file);
      data.append('hoTen', formData.hoTen || cccdInfo.hoTen || 'doi-tac');

      const res = await axios.post(`${BACKEND_URL}/doitac/upload-face`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setFormData((prev) => ({
        ...prev,
        anhKhuonMat: res.data.imageUrl
      }));
    } catch (error) {
      console.error(error);
      alert('Lưu ảnh khuôn mặt thất bại');
    }
  };

  const handleReadCCCD = async () => {
    try {
      if (!cccdFrontFile || !cccdBackFile) {
        alert('Bạn phải có đủ ảnh CCCD mặt trước và mặt sau');
        return;
      }

      setOcrLoading(true);

      const currentName = formData.hoTen || 'doi-tac';

      const frontData = new FormData();
      frontData.append('cccdImage', cccdFrontFile);
      frontData.append('hoTen', currentName);

      const backData = new FormData();
      backData.append('cccdImage', cccdBackFile);
      backData.append('hoTen', currentName);

      const [frontRes, backRes] = await Promise.all([
        axios.post(`${BACKEND_URL}/doitac/ocr-cccd-front`, frontData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        }),
        axios.post(`${BACKEND_URL}/doitac/ocr-cccd-back`, backData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
      ]);

      const merged = {
        hoTen: frontRes.data.data.hoTen || '',
        soCCCD: frontRes.data.data.soCCCD || '',
        diaChi: backRes.data.data.diaChi || '',
        queQuan: backRes.data.data.queQuan || '',
        ngaySinh: frontRes.data.data.ngaySinh || '',
        anhCCCDMatTruoc: frontRes.data.imageUrl,
        anhCCCDMatSau: backRes.data.imageUrl
      };

      setCccdInfo(merged);

      setFormData((prev) => ({
        ...prev,
        hoTen: merged.hoTen,
        soCCCD: merged.soCCCD,
        diaChi: merged.diaChi,
        queQuan: merged.queQuan,
        ngaySinh: merged.ngaySinh,
        anhCCCDMatTruoc: merged.anhCCCDMatTruoc,
        anhCCCDMatSau: merged.anhCCCDMatSau
      }));

      setStep(2);
    } catch (error) {
      console.error(error);
      alert(error?.response?.data?.message || 'Đọc CCCD thất bại');
    } finally {
      setOcrLoading(false);
    }
  };

  const confirmCCCDInfo = () => {
    setStep(3);
  };

  const loadImageElement = (src) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  };

  const cropPortraitFromCCCD = async (imageSrc) => {
    const img = await loadImageElement(imageSrc);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    const cropX = img.width * 0.03;
    const cropY = img.height * 0.18;
    const cropW = img.width * 0.33;
    const cropH = img.height * 0.55;

    canvas.width = cropW;
    canvas.height = cropH;

    ctx.drawImage(
      img,
      cropX, cropY, cropW, cropH,
      0, 0, cropW, cropH
    );

    return canvas;
  };

  const getSingleFaceDescriptor = async (input) => {
    return await faceapi
      .detectSingleFace(input, new faceapi.SsdMobilenetv1Options({ minConfidence: 0.5 }))
      .withFaceLandmarks()
      .withFaceDescriptor();
  };

  const verifyFace = async () => {
    try {
      if (!modelsLoaded) {
        alert('Model khuôn mặt chưa load xong');
        return;
      }

      if (!cccdFrontPreview && !formData.anhCCCDMatTruoc) {
        alert('Thiếu ảnh CCCD mặt trước');
        return;
      }

      if (!facePreview || !faceFile) {
        alert('Bạn chưa chụp khuôn mặt');
        return;
      }

      setFaceLoading(true);
      setVerifyMessage('');

      const cccdSource = cccdFrontPreview || `${BACKEND_URL}${formData.anhCCCDMatTruoc}`;
      const croppedFace = await cropPortraitFromCCCD(cccdSource);

      const cccdFace = await getSingleFaceDescriptor(croppedFace);
      if (!cccdFace) {
        setVerifyMessage('Không lấy được khuôn mặt từ CCCD. Hãy chụp lại CCCD rõ hơn.');
        setFormData((prev) => ({
          ...prev,
          faceMatched: false,
          faceDistance: null,
          verificationStatus: 'can_chup_lai'
        }));
        return;
      }

      const selfieImg = await loadImageElement(facePreview);
      const selfieFace = await getSingleFaceDescriptor(selfieImg);

      if (!selfieFace) {
        setVerifyMessage('Không nhận diện được khuôn mặt. Vui lòng tháo kính, bỏ khẩu trang và chụp lại.');
        setFormData((prev) => ({
          ...prev,
          faceMatched: false,
          faceDistance: null,
          verificationStatus: 'can_chup_lai'
        }));
        return;
      }

      const distance = faceapi.euclideanDistance(
        cccdFace.descriptor,
        selfieFace.descriptor
      );

      const matched = distance <= MATCH_THRESHOLD;

      if (!matched) {
        setVerifyMessage(`Khuôn mặt không khớp CCCD hoặc mắt bị che. Vui lòng tháo kính và chụp lại. Độ lệch: ${distance.toFixed(4)}`);
        setFormData((prev) => ({
          ...prev,
          faceMatched: false,
          faceDistance: Number(distance.toFixed(4)),
          verificationStatus: 'khong_khop'
        }));
        return;
      }

      setVerifyMessage(`Xác thực thành công. Độ lệch: ${distance.toFixed(4)}`);
      setFormData((prev) => ({
        ...prev,
        faceMatched: true,
        faceDistance: Number(distance.toFixed(4)),
        verificationStatus: 'da_xac_thuc'
      }));

      setStep(4);
    } catch (error) {
      console.error(error);
      setVerifyMessage('Có lỗi khi xác thực khuôn mặt');
    } finally {
      setFaceLoading(false);
    }
  };

  const handleUploadJudicialRecord = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const data = new FormData();
      data.append('lyLichFile', file);
      data.append('hoTen', formData.hoTen || cccdInfo.hoTen || 'doi-tac');

      const res = await axios.post(`${BACKEND_URL}/doitac/upload-judicial-record`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setFormData((prev) => ({
        ...prev,
        lyLichTuPhap: res.data.fileUrl
      }));
    } catch (error) {
      console.error(error);
      alert('Upload lý lịch tư pháp thất bại');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.faceMatched || formData.verificationStatus !== 'da_xac_thuc') {
      alert('Bạn phải xác thực khuôn mặt thành công');
      return;
    }

    if (!formData.camKet) {
      alert('Bạn phải xác nhận cam kết');
      return;
    }

    try {
      const payload = {
        ...formData,
        faceMatched: Boolean(formData.faceMatched),
        camKet: Boolean(formData.camKet)
      };

      const res = await axios.post(`${BACKEND_URL}/doitac/create`, payload);
      alert(res.data.message);
      console.log(res.data);
    } catch (error) {
      console.error(error);
      alert(error?.response?.data?.message || 'Đăng ký thất bại');
    }
  };

  return (
    <div className="dkdt-page">
      <div className="dkdt-container">
        <h1 className="dkdt-title">Đăng ký trở thành Đối tác Hướng dẫn viên</h1>
        <p className="dkdt-desc">Hoàn tất 4 bước để gửi hồ sơ đăng ký.</p>

        <div className="dkdt-stepbar">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={`dkdt-stepitem ${step === s ? 'active' : ''}`}
            >
              Bước {s}
            </div>
          ))}
        </div>

        {cameraOpen && (
          <div className="dkdt-card">
            <h3>Camera</h3>
            <Webcam
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              videoConstraints={{ facingMode: 'user' }}
              className="dkdt-webcam"
            />
            <div className="dkdt-actionrow">
              <button type="button" className="dkdt-button" onClick={captureImage}>
                Chụp ảnh
              </button>
              <button type="button" className="dkdt-button-outline" onClick={closeCamera}>
                Đóng camera
              </button>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="dkdt-card">
            <h3>Bước 1: Chụp CCCD 2 mặt</h3>

            <div className="dkdt-uploadgrid">
              <div className="dkdt-uploadbox">
                <p className="dkdt-label">CCCD mặt trước</p>
                {cccdFrontPreview && (
                  <img src={cccdFrontPreview} alt="CCCD trước" className="dkdt-previewimage" />
                )}
                <div className="dkdt-actionrow">
                  <label className="dkdt-button">
                    Upload ảnh
                    <input
                      hidden
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleUploadCCCD(e, 'front')}
                    />
                  </label>
                  <button type="button" className="dkdt-button-outline" onClick={() => openCameraFor('front')}>
                    Chụp ảnh
                  </button>
                </div>
              </div>

              <div className="dkdt-uploadbox">
                <p className="dkdt-label">CCCD mặt sau</p>
                {cccdBackPreview && (
                  <img src={cccdBackPreview} alt="CCCD sau" className="dkdt-previewimage" />
                )}
                <div className="dkdt-actionrow">
                  <label className="dkdt-button">
                    Upload ảnh
                    <input
                      hidden
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleUploadCCCD(e, 'back')}
                    />
                  </label>
                  <button type="button" className="dkdt-button-outline" onClick={() => openCameraFor('back')}>
                    Chụp ảnh
                  </button>
                </div>
              </div>
            </div>

            <button type="button" className="dkdt-submit" onClick={handleReadCCCD}>
              {ocrLoading ? 'Đang đọc CCCD...' : 'Tiếp tục kiểm tra thông tin'}
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="dkdt-card">
            <h3>Bước 2: Kiểm tra thông tin</h3>

            <div className="dkdt-infogrid">
              <div>
                <label className="dkdt-label">Họ tên</label>
                <input
                  className="dkdt-input"
                  value={formData.hoTen}
                  onChange={(e) => setFormData((prev) => ({ ...prev, hoTen: e.target.value }))}
                />
              </div>

              <div>
                <label className="dkdt-label">Số CCCD</label>
                <input
                  className="dkdt-input"
                  value={formData.soCCCD}
                  onChange={(e) => setFormData((prev) => ({ ...prev, soCCCD: e.target.value }))}
                />
              </div>

              <div>
                <label className="dkdt-label">Địa chỉ</label>
                <input
                  className="dkdt-input"
                  value={formData.diaChi}
                  onChange={(e) => setFormData((prev) => ({ ...prev, diaChi: e.target.value }))}
                />
              </div>

              <div>
                <label className="dkdt-label">Quê quán</label>
                <input
                  className="dkdt-input"
                  value={formData.queQuan}
                  onChange={(e) => setFormData((prev) => ({ ...prev, queQuan: e.target.value }))}
                />
              </div>

              <div>
                <label className="dkdt-label">Ngày sinh</label>
                <input
                  className="dkdt-input"
                  value={formData.ngaySinh}
                  onChange={(e) => setFormData((prev) => ({ ...prev, ngaySinh: e.target.value }))}
                />
              </div>

              <div>
                <label className="dkdt-label">Tỉnh đăng ký hướng dẫn</label>
                <input
                  className="dkdt-input"
                  name="tinhDangKy"
                  value={formData.tinhDangKy}
                  onChange={handlePartnerChange}
                  placeholder="Ví dụ: Đà Nẵng"
                />
              </div>
            </div>

            <button type="button" className="dkdt-submit" onClick={confirmCCCDInfo}>
              Xác nhận thông tin đúng
            </button>
          </div>
        )}

        {step === 3 && (
          <div className="dkdt-card">
            <h3>Bước 3: Xác thực khuôn mặt</h3>

            <div className="dkdt-notebox">
              Vui lòng tháo kính, bỏ khẩu trang, không đội mũ và chụp nơi đủ sáng.
            </div>

            <div className="dkdt-actionrow">
              <button type="button" className="dkdt-button" onClick={() => openCameraFor('face')}>
                Chụp hình
              </button>
              <button type="button" className="dkdt-button-outline" onClick={verifyFace}>
                {faceLoading ? 'Đang xác thực...' : 'Xác thực khuôn mặt'}
              </button>
            </div>

            {facePreview && (
              <img src={facePreview} alt="Selfie" className="dkdt-previewimage" />
            )}

            {verifyMessage && (
              <div className={`dkdt-messagebox ${formData.faceMatched ? 'success' : 'error'}`}>
                {verifyMessage}
              </div>
            )}
          </div>
        )}

        {step === 4 && (
          <form onSubmit={handleSubmit} className="dkdt-form">
            <div className="dkdt-card">
              <h3>Bước 4: Điền thông tin đối tác</h3>

              <div className="dkdt-sectiontitle">Địa điểm & Giá cả</div>

              {formData.diaDiemGiaCa.map((item, index) => (
                <div key={index} className="dkdt-locationrow">
                  <input
                    className="dkdt-input"
                    placeholder="Địa điểm hướng dẫn"
                    value={item.diaDiem}
                    onChange={(e) => handleLocationChange(index, 'diaDiem', e.target.value)}
                  />
                  <input
                    className="dkdt-input"
                    placeholder="Mức giá (VNĐ/ngày)"
                    value={item.mucGia}
                    onChange={(e) => handleLocationChange(index, 'mucGia', e.target.value)}
                  />
                  <input
                    className="dkdt-input"
                    placeholder="Kinh nghiệm tại địa điểm này"
                    value={item.kinhNghiem}
                    onChange={(e) => handleLocationChange(index, 'kinhNghiem', e.target.value)}
                  />
                  <button type="button" className="dkdt-small-danger" onClick={() => removeLocationRow(index)}>
                    Xóa
                  </button>
                </div>
              ))}

              <button type="button" className="dkdt-addbtn" onClick={addLocationRow}>
                + Thêm địa điểm
              </button>
            </div>

            <div className="dkdt-card">
              <div className="dkdt-sectiontitle">Kỹ năng & Giới thiệu</div>

              <div className="dkdt-infogrid">
                <div>
                  <label className="dkdt-label">Số năm kinh nghiệm</label>
                  <input
                    className="dkdt-input"
                    name="soNamKinhNghiem"
                    value={formData.soNamKinhNghiem}
                    onChange={handlePartnerChange}
                  />
                </div>

                <div>
                  <label className="dkdt-label">Ngôn ngữ sử dụng</label>
                  <input
                    className="dkdt-input"
                    name="ngonNgu"
                    value={formData.ngonNgu}
                    onChange={handlePartnerChange}
                    placeholder="Ví dụ: vi, en"
                  />
                </div>
              </div>

              <label className="dkdt-label">Mô tả bản thân</label>
              <textarea
                className="dkdt-textarea"
                name="moTaBanThan"
                value={formData.moTaBanThan}
                onChange={handlePartnerChange}
              />
            </div>

            <div className="dkdt-card">
              <div className="dkdt-sectiontitle">Xác thực hồ sơ</div>
              <label className="dkdt-uploadarea">
                Kéo thả file hoặc click để tải lên lý lịch tư pháp
                <input
                  hidden
                  type="file"
                  accept=".jpg,.jpeg,.png,.pdf"
                  onChange={handleUploadJudicialRecord}
                />
              </label>

              {formData.lyLichTuPhap && (
                <p className="dkdt-filetext">Đã tải lên: {formData.lyLichTuPhap}</p>
              )}
            </div>

            <label className="dkdt-checkboxwrap">
              <input
                type="checkbox"
                name="camKet"
                checked={formData.camKet}
                onChange={handlePartnerChange}
              />
              Tôi cam kết thông tin cung cấp là chính xác và chịu trách nhiệm trước pháp luật.
            </label>

            <button type="submit" className="dkdt-submit">
              Đăng ký ngay
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ContentDangKyDoiTac;