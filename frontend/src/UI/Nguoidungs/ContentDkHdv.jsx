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

  const [captureTarget, setCaptureTarget] = useState('front'); // front | back | face
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

      const frontData = new FormData();
      frontData.append('hoTen', formData.hoTen || 'doi-tac');

      const backData = new FormData();
      backData.append('hoTen', formData.hoTen || 'doi-tac');

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
        diaChi: backRes.data.data.diaChi || frontRes.data.data.diaChi || '',
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
      alert('Đọc CCCD thất bại');
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
      const res = await axios.post(`${BACKEND_URL}/doitac/create`, formData);
      alert(res.data.message);
      console.log(res.data);
    } catch (error) {
      console.error(error);
      alert('Đăng ký thất bại');
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.title}>Đăng ký trở thành Đối tác Hướng dẫn viên</h1>
        <p style={styles.desc}>Hoàn tất 4 bước để gửi hồ sơ đăng ký.</p>

        <div style={styles.stepBar}>
          {[1, 2, 3, 4].map((s) => (
            <div key={s} style={{
              ...styles.stepItem,
              background: step === s ? '#00c16a' : '#083126'
            }}>
              Bước {s}
            </div>
          ))}
        </div>

        {cameraOpen && (
          <div style={styles.card}>
            <h3>Camera</h3>
            <Webcam
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              videoConstraints={{ facingMode: 'user' }}
              style={styles.webcam}
            />
            <div style={styles.actionRow}>
              <button type="button" style={styles.button} onClick={captureImage}>
                Chụp ảnh
              </button>
              <button type="button" style={styles.buttonOutline} onClick={closeCamera}>
                Đóng camera
              </button>
            </div>
          </div>
        )}

        {step === 1 && (
          <div style={styles.card}>
            <h3>Bước 1: Chụp CCCD 2 mặt</h3>

            <div style={styles.uploadGrid}>
              <div style={styles.uploadBox}>
                <p style={styles.label}>CCCD mặt trước</p>
                {cccdFrontPreview && (
                  <img src={cccdFrontPreview} alt="CCCD trước" style={styles.previewImage} />
                )}
                <div style={styles.actionRow}>
                  <label style={styles.button}>
                    Upload ảnh
                    <input
                      hidden
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleUploadCCCD(e, 'front')}
                    />
                  </label>
                  <button type="button" style={styles.buttonOutline} onClick={() => openCameraFor('front')}>
                    Chụp ảnh
                  </button>
                </div>
              </div>

              <div style={styles.uploadBox}>
                <p style={styles.label}>CCCD mặt sau</p>
                {cccdBackPreview && (
                  <img src={cccdBackPreview} alt="CCCD sau" style={styles.previewImage} />
                )}
                <div style={styles.actionRow}>
                  <label style={styles.button}>
                    Upload ảnh
                    <input
                      hidden
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleUploadCCCD(e, 'back')}
                    />
                  </label>
                  <button type="button" style={styles.buttonOutline} onClick={() => openCameraFor('back')}>
                    Chụp ảnh
                  </button>
                </div>
              </div>
            </div>

            <button type="button" style={styles.submit} onClick={handleReadCCCD}>
              {ocrLoading ? 'Đang đọc CCCD...' : 'Tiếp tục kiểm tra thông tin'}
            </button>
          </div>
        )}

        {step === 2 && (
          <div style={styles.card}>
            <h3>Bước 2: Kiểm tra thông tin</h3>

            <div style={styles.infoGrid}>
              <div>
                <label style={styles.label}>Họ tên</label>
                <input style={styles.input} value={cccdInfo.hoTen} readOnly />
              </div>
              <div>
                <label style={styles.label}>Số CCCD</label>
                <input style={styles.input} value={cccdInfo.soCCCD} readOnly />
              </div>
              <div>
                <label style={styles.label}>Địa chỉ</label>
                <input style={styles.input} value={cccdInfo.diaChi} readOnly />
              </div>
              <div>
                <label style={styles.label}>Quê quán</label>
                <input style={styles.input} value={cccdInfo.queQuan} readOnly />
              </div>
              <div>
                <label style={styles.label}>Ngày sinh</label>
                <input style={styles.input} value={cccdInfo.ngaySinh} readOnly />
              </div>
            </div>

            <button type="button" style={styles.submit} onClick={confirmCCCDInfo}>
              Xác nhận thông tin đúng
            </button>
          </div>
        )}

        {step === 3 && (
          <div style={styles.card}>
            <h3>Bước 3: Xác thực khuôn mặt</h3>
            <div style={styles.noteBox}>
              Vui lòng tháo kính, bỏ khẩu trang, không đội mũ và chụp nơi đủ sáng.
            </div>

            <div style={styles.actionRow}>
              <button type="button" style={styles.button} onClick={() => openCameraFor('face')}>
                Chụp hình
              </button>
              <button type="button" style={styles.buttonOutline} onClick={verifyFace}>
                {faceLoading ? 'Đang xác thực...' : 'Xác thực khuôn mặt'}
              </button>
            </div>

            {facePreview && (
              <img src={facePreview} alt="Selfie" style={styles.previewImage} />
            )}

            {verifyMessage && (
              <div style={{
                ...styles.messageBox,
                borderColor: formData.faceMatched ? '#00c16a' : '#ff6b6b'
              }}>
                {verifyMessage}
              </div>
            )}
          </div>
        )}

        {step === 4 && (
          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.card}>
              <h3>Bước 4: Điền thông tin đối tác</h3>

              <div style={styles.sectionTitle}>Địa điểm & Giá cả</div>

              {formData.diaDiemGiaCa.map((item, index) => (
                <div key={index} style={styles.locationRow}>
                  <input
                    style={styles.input}
                    placeholder="Địa điểm hướng dẫn"
                    value={item.diaDiem}
                    onChange={(e) => handleLocationChange(index, 'diaDiem', e.target.value)}
                  />
                  <input
                    style={styles.input}
                    placeholder="Mức giá (VNĐ/ngày)"
                    value={item.mucGia}
                    onChange={(e) => handleLocationChange(index, 'mucGia', e.target.value)}
                  />
                  <input
                    style={styles.input}
                    placeholder="Kinh nghiệm"
                    value={item.kinhNghiem}
                    onChange={(e) => handleLocationChange(index, 'kinhNghiem', e.target.value)}
                  />
                  <button type="button" style={styles.smallDanger} onClick={() => removeLocationRow(index)}>
                    Xóa
                  </button>
                </div>
              ))}

              <button type="button" style={styles.addBtn} onClick={addLocationRow}>
                + Thêm địa điểm
              </button>
            </div>

            <div style={styles.card}>
              <div style={styles.sectionTitle}>Kỹ năng & Giới thiệu</div>

              <div style={styles.infoGrid}>
                <div>
                  <label style={styles.label}>Số năm kinh nghiệm</label>
                  <input
                    style={styles.input}
                    name="soNamKinhNghiem"
                    value={formData.soNamKinhNghiem}
                    onChange={handlePartnerChange}
                  />
                </div>
                <div>
                  <label style={styles.label}>Ngôn ngữ sử dụng</label>
                  <input
                    style={styles.input}
                    name="ngonNgu"
                    value={formData.ngonNgu}
                    onChange={handlePartnerChange}
                  />
                </div>
              </div>

              <label style={styles.label}>Mô tả bản thân</label>
              <textarea
                style={styles.textarea}
                name="moTaBanThan"
                value={formData.moTaBanThan}
                onChange={handlePartnerChange}
              />
            </div>

            <div style={styles.card}>
              <div style={styles.sectionTitle}>Xác thực hồ sơ</div>
              <label style={styles.uploadArea}>
                Kéo thả file hoặc click để tải lên lý lịch tư pháp
                <input
                  hidden
                  type="file"
                  accept=".jpg,.jpeg,.png,.pdf"
                  onChange={handleUploadJudicialRecord}
                />
              </label>

              {formData.lyLichTuPhap && (
                <p style={styles.fileText}>Đã tải lên: {formData.lyLichTuPhap}</p>
              )}
            </div>

            <label style={styles.checkboxWrap}>
              <input
                type="checkbox"
                name="camKet"
                checked={formData.camKet}
                onChange={handlePartnerChange}
              />
              Tôi cam kết thông tin cung cấp là chính xác và chịu trách nhiệm trước pháp luật.
            </label>

            <button type="submit" style={styles.submit}>
              Đăng ký ngay
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

const styles = {
  page: {
    minHeight: '100vh',
    background: '#031b13',
    padding: '30px',
    color: '#fff'
  },
  container: {
    maxWidth: '980px',
    margin: '0 auto'
  },
  title: {
    fontSize: '34px',
    fontWeight: 800,
    marginBottom: 10
  },
  desc: {
    color: '#b8d8ca',
    marginBottom: 20
  },
  stepBar: {
    display: 'flex',
    gap: 10,
    marginBottom: 20,
    flexWrap: 'wrap'
  },
  stepItem: {
    padding: '10px 16px',
    borderRadius: 999,
    fontWeight: 700
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: 20
  },
  card: {
    background: '#06261b',
    border: '1px solid #0c4a34',
    borderRadius: 18,
    padding: 20,
    marginBottom: 20
  },
  uploadGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 20
  },
  uploadBox: {
    border: '1px solid #0c4a34',
    borderRadius: 14,
    padding: 16,
    background: '#041f16'
  },
  label: {
    display: 'block',
    marginBottom: 8,
    color: '#d6efe2',
    fontWeight: 600
  },
  input: {
    width: '100%',
    padding: 12,
    borderRadius: 10,
    border: '1px solid #0c4a34',
    background: '#031a12',
    color: '#fff'
  },
  textarea: {
    width: '100%',
    minHeight: 120,
    padding: 12,
    borderRadius: 10,
    border: '1px solid #0c4a34',
    background: '#031a12',
    color: '#fff'
  },
  previewImage: {
    width: '100%',
    maxWidth: '300px',
    borderRadius: 12,
    marginBottom: 12,
    marginTop: 12,
    display: 'block'
  },
  actionRow: {
    display: 'flex',
    gap: 12,
    flexWrap: 'wrap',
    marginTop: 12
  },
  button: {
    padding: '10px 16px',
    background: '#00c16a',
    border: 'none',
    borderRadius: 10,
    color: '#fff',
    cursor: 'pointer',
    fontWeight: 700
  },
  buttonOutline: {
    padding: '10px 16px',
    background: 'transparent',
    border: '1px solid #00c16a',
    borderRadius: 10,
    color: '#00c16a',
    cursor: 'pointer',
    fontWeight: 700
  },
  submit: {
    marginTop: 16,
    padding: '14px 20px',
    background: '#00c16a',
    border: 'none',
    borderRadius: 12,
    color: '#fff',
    fontSize: 16,
    fontWeight: 800,
    cursor: 'pointer'
  },
  webcam: {
    width: '100%',
    maxWidth: 420,
    borderRadius: 12,
    background: '#000'
  },
  noteBox: {
    background: '#093124',
    border: '1px solid #0c4a34',
    padding: 12,
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 12
  },
  messageBox: {
    marginTop: 14,
    padding: 12,
    borderRadius: 10,
    border: '1px solid',
    background: '#09251b'
  },
  infoGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 16
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 700,
    marginBottom: 16
  },
  locationRow: {
    display: 'grid',
    gridTemplateColumns: '2fr 1.2fr 1.2fr auto',
    gap: 12,
    marginBottom: 12,
    alignItems: 'end'
  },
  addBtn: {
    marginTop: 8,
    background: 'transparent',
    border: 'none',
    color: '#00e57d',
    fontWeight: 700,
    cursor: 'pointer'
  },
  smallDanger: {
    padding: '10px 12px',
    background: '#5b1b1b',
    border: 'none',
    color: '#fff',
    borderRadius: 10,
    cursor: 'pointer'
  },
  uploadArea: {
    display: 'block',
    padding: '30px',
    border: '1px dashed #0c8c5c',
    borderRadius: 14,
    color: '#9ce7bf',
    textAlign: 'center',
    cursor: 'pointer'
  },
  fileText: {
    marginTop: 12,
    color: '#9ce7bf'
  },
  checkboxWrap: {
    display: 'flex',
    gap: 10,
    alignItems: 'flex-start',
    marginBottom: 20
  }
};

export default ContentDangKyDoiTac;