import React, { useEffect, useMemo, useState } from 'react';
import {
  Search,
  Plus,
  Map,
  CheckCircle2,
  AlertTriangle,
  Edit3,
  Eye,
  Filter,
  Download,
  X,
  MapPin,
  Mountain,
  Ticket,
  Route,
  Save,
  Star,
  Image as ImageIcon,
} from 'lucide-react';
import { useParams } from 'react-router-dom';

const API_URL = 'http://localhost:5000';

const getImageUrl = (image) => {
  if (!image) return '/img/default-trekking.jpg';
  if (image.startsWith('http')) return image;
  if (image.startsWith('/img')) return image;
  if (image.startsWith('img')) return `/${image}`;

  const cleanPath = image.startsWith('/') ? image.slice(1) : image;
  return `${API_URL}/${cleanPath}`;
};

const formatPrice = (value) => {
  if (value === null || value === undefined || value === '') return 'Miễn phí';

  const text = String(value).trim().toLowerCase();

  if (
    text === '0' ||
    text === 'free' ||
    text === 'mien phi' ||
    text === 'miễn phí'
  ) {
    return 'Miễn phí';
  }

  const cleaned = text
    .replace(/vnđ|vnd/g, '')
    .replace(/\./g, '')
    .replace(/,/g, '')
    .trim();

  const number = Number(cleaned);

  if (Number.isNaN(number) || number <= 0) return value;

  return `${number.toLocaleString('vi-VN')} VNĐ`;
};

const normalizeStatus = (item) => {
  const raw = item.trangThai || item.status;

  if (raw === 'da_duyet' || raw === 'Đang hoạt động') {
    return 'Đang hoạt động';
  }

  if (raw === 'cho_duyet' || raw === 'Chờ duyệt') {
    return 'Chờ duyệt';
  }

  if (raw === 'tu_choi' || raw === 'Từ chối') {
    return 'Từ chối';
  }

  return 'Chờ duyệt';
};

const ContentQuanLyDiaDiem = () => {
  const { slug } = useParams();

  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedProvince, setSelectedProvince] = useState('Tất cả Tỉnh/Thành');
  const [selectedStatus, setSelectedStatus] = useState('Tất cả Trạng thái');
  const [searchKeyword, setSearchKeyword] = useState('');

  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);

  useEffect(() => {
    const fetchQuanLyDiaDiem = async () => {
      try {
        setLoading(true);

        const res = await fetch(`${API_URL}/quantrivien/${slug}/quanlydiadiem`);
        const result = await res.json();

        if (!res.ok) {
          throw new Error(result.message || 'Không tải được dữ liệu địa điểm');
        }

        const rawData = Array.isArray(result.locations) ? result.locations : [];

        const mapped = rawData.map((item) => {
          const imagesRaw = [
            item.image,
            ...(Array.isArray(item.images) ? item.images : []),
          ].filter(Boolean);

          const images = imagesRaw.length > 0
            ? imagesRaw.map(getImageUrl)
            : ['/img/default-trekking.jpg'];
          return {
            ...item,

            id: item.id || `#LOC-${String(item._id).slice(-6).toUpperCase()}`,

            name: item.name || item.tenDiaDiem || 'Chưa có tên',
            tenDiaDiem: item.tenDiaDiem || item.name || 'Chưa có tên',

            moTa: item.moTa || 'Chưa có mô tả',

            gioiThieu: Array.isArray(item.gioiThieu) ? item.gioiThieu : [],

            doKho: item.doKho || item.level || 'Chưa rõ',
            level: item.doKho || item.level || 'Chưa rõ',

            veVao: formatPrice(item.veVao || item.price),
            veVaoRaw: item.veVao || '',

            quangduong: item.quangduong || 'Chưa cập nhật',

            khuVuc: item.khuVuc || item.area || 'Chưa cập nhật',
            area: item.khuVuc || item.area || item.tinh || 'Chưa cập nhật',

            tinh: item.tinh || 'Chưa cập nhật',

            hot: !!item.hot,

            imageRaw: item.image || '',
            imagesRaw: Array.isArray(item.images) ? item.images : [],

            image: images[0],
            images,

            dacDiemDiaDanh: Array.isArray(item.dacDiemDiaDanh)
              ? item.dacDiemDiaDanh
              : [],

            status: normalizeStatus(item),
            trangThai: item.trangThai || 'cho_duyet',

            slug: item.slug,
            createdAt: item.createdAt,
            updatedAt: item.updatedAt,
          };
        });

        setLocations(mapped);
      } catch (error) {
        console.log(error);
        setLocations([]);
      } finally {
        setLoading(false);
      }
    };

    if (slug) fetchQuanLyDiaDiem();
  }, [slug]);

  const provinceOptions = useMemo(() => {
    const unique = [...new Set(locations.map((item) => item.area).filter(Boolean))];
    return ['Tất cả Tỉnh/Thành', ...unique];
  }, [locations]);

  const filteredLocations = useMemo(() => {
    let data = [...locations];

    if (selectedProvince !== 'Tất cả Tỉnh/Thành') {
      data = data.filter((item) => item.area === selectedProvince);
    }

    if (selectedStatus !== 'Tất cả Trạng thái') {
      data = data.filter((item) => item.status === selectedStatus);
    }

    if (searchKeyword.trim()) {
      const keyword = searchKeyword.trim().toLowerCase();

      data = data.filter((item) =>
        (item.id || '').toLowerCase().includes(keyword) ||
        (item.name || '').toLowerCase().includes(keyword) ||
        (item.area || '').toLowerCase().includes(keyword) ||
        (item.status || '').toLowerCase().includes(keyword)
      );
    }

    return data;
  }, [locations, selectedProvince, selectedStatus, searchKeyword]);

  const stats = useMemo(() => {
    const tongSoDiaDiem = locations.length;
    const dangHoatDong = locations.filter((item) => item.status === 'Đang hoạt động').length;
    const choDuyet = locations.filter((item) => item.status === 'Chờ duyệt').length;
    const tuChoi = locations.filter((item) => item.status === 'Từ chối').length;

    return [
      {
        label: 'TỔNG SỐ ĐỊA ĐIỂM',
        value: tongSoDiaDiem.toLocaleString('vi-VN'),
        icon: <Map size={20} />,
        color: 'emerald',
      },
      {
        label: 'ĐANG HOẠT ĐỘNG',
        value: dangHoatDong.toLocaleString('vi-VN'),
        icon: <CheckCircle2 size={20} />,
        color: 'green',
      },
      {
        label: 'CHỜ DUYỆT',
        value: choDuyet.toLocaleString('vi-VN'),
        icon: <AlertTriangle size={20} />,
        color: 'amber',
      },
      {
        label: 'TỪ CHỐI',
        value: tuChoi.toLocaleString('vi-VN'),
        icon: <AlertTriangle size={20} />,
        color: 'red',
      },
    ];
  }, [locations]);

  const openViewModal = (loc) => {
    setSelectedLocation(loc);
    setViewModalOpen(true);
  };

  const openEditModal = (loc) => {
    setSelectedLocation(loc);
    setEditModalOpen(true);
  };

  const closeViewModal = () => {
    setViewModalOpen(false);
    setSelectedLocation(null);
  };

  const closeEditModal = () => {
    setEditModalOpen(false);
    setSelectedLocation(null);
  };

  const handleSaveEdit = async (updatedLocation) => {
    try {
      const formData = new FormData();

      formData.append("tenDiaDiem", updatedLocation.tenDiaDiem);
      formData.append("moTa", updatedLocation.moTa);
      formData.append("gioiThieu", JSON.stringify(updatedLocation.gioiThieu));
      formData.append("doKho", updatedLocation.doKho);
      formData.append("veVao", updatedLocation.veVaoRaw);
      formData.append("quangduong", updatedLocation.quangduong);
      formData.append("khuVuc", updatedLocation.khuVuc);
      formData.append("tinh", updatedLocation.tinh);
      formData.append("hot", String(updatedLocation.hot));
      formData.append("dacDiemDiaDanh", JSON.stringify(updatedLocation.dacDiemDiaDanh));
      formData.append("trangThai", updatedLocation.trangThai);

      formData.append("oldImages", JSON.stringify(updatedLocation.imagesRaw || []));

      if (updatedLocation.imageFile) {
        formData.append("image", updatedLocation.imageFile);
      }

      if (updatedLocation.newImageFiles?.length > 0) {
        updatedLocation.newImageFiles.forEach((file) => {
          formData.append("images", file);
        });
      }

      const res = await fetch(
        `${API_URL}/quantrivien/${slug}/quanlydiadiem/${updatedLocation._id}`,
        {
          method: "PATCH",
          body: formData,
        }
      );

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Cập nhật thất bại");
      }

      alert("Cập nhật địa điểm thành công");
      window.location.reload();
    } catch (error) {
      console.log(error);
      alert(error.message || "Cập nhật thất bại");
    }
  };

  return (
    <div className="quanlydiadiem-container">
      <div className="qldd-header">
        <div className="qldd-header-left">
          <h2 className="qldd-title">Quản lý địa điểm</h2>
          <p className="qldd-subtitle">
            Quản trị danh mục các điểm đến trên toàn lãnh thổ Việt Nam
          </p>
        </div>

        <button className="qldd-btn-add">
          <Plus size={18} /> Thêm địa điểm mới
        </button>
      </div>

      <div className="qldd-stats-grid">
        {stats.map((s, i) => (
          <div key={i} className={`qldd-stat-card border-${s.color}`}>
            <div className="qldd-stat-info">
              <div className="qldd-stat-label">{s.label}</div>
              <div className="qldd-stat-value">{s.value}</div>
            </div>

            {s.icon && (
              <div className={`qldd-stat-icon text-${s.color}`}>
                {s.icon}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="qldd-filter-bar">
        <div className="qldd-filter-left">
          <span className="qldd-filter-label">LỌC THEO:</span>

          <select
            className="qldd-select"
            value={selectedProvince}
            onChange={(e) => setSelectedProvince(e.target.value)}
          >
            {provinceOptions.map((province) => (
              <option key={province} value={province}>
                {province}
              </option>
            ))}
          </select>

          <select
            className="qldd-select"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option>Tất cả Trạng thái</option>
            <option>Đang hoạt động</option>
            <option>Chờ duyệt</option>
            <option>Từ chối</option>
          </select>
        </div>

        <div className="qldd-filter-right">
          <div className="qldd-search-box">
            <Search size={16} className="qldd-search-icon" />
            <input
              type="text"
              placeholder="Tìm kiếm địa điểm, ID, hoặc tỉnh thành..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
            />
          </div>

          <button className="qldd-btn-icon">
            <Filter size={18} />
          </button>

          <button className="qldd-btn-icon">
            <Download size={18} />
          </button>
        </div>
      </div>

      <div className="qldd-table-wrapper custom-scrollbar">
        <table className="qldd-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>ĐỊA ĐIỂM</th>
              <th>KHU VỰC</th>
              <th>ĐỘ KHÓ</th>
              <th>GIÁ VÉ</th>
              <th>TRẠNG THÁI</th>
              <th>THAO TÁC</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" className="qldd-empty">
                  Đang tải dữ liệu...
                </td>
              </tr>
            ) : filteredLocations.length > 0 ? (
              filteredLocations.map((loc) => (
                <tr key={loc._id || loc.id}>
                  <td className="text-emerald font-bold">{loc.id}</td>

                  <td>
                    <div className="qldd-loc-cell">
                      <div className="qldd-loc-img">
                        <img src={loc.image} alt={loc.name} />
                      </div>

                      <span className="qldd-loc-name">{loc.name}</span>
                    </div>
                  </td>

                  <td className="qldd-text-muted">{loc.area}</td>

                  <td>
                    <span className="qldd-badge-level">{loc.level}</span>
                  </td>

                  <td className="qldd-text-muted">{loc.veVao}</td>

                  <td>
                    <div
                      className={`qldd-status ${loc.status === 'Đang hoạt động'
                        ? 'status-active'
                        : loc.status === 'Chờ duyệt'
                          ? 'status-pending'
                          : 'status-rejected'
                        }`}
                    >
                      <span className="qldd-dot"></span>
                      {loc.status}
                    </div>
                  </td>

                  <td>
                    <div className="qldd-actions">
                      <button
                        type="button"
                        className="qldd-action-btn"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          openEditModal(loc);
                        }}
                        title="Chỉnh sửa"
                      >
                        <Edit3 size={16} />
                      </button>

                      <button
                        type="button"
                        className="qldd-action-btn"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          openViewModal(loc);
                        }}
                        title="Xem chi tiết"
                      >
                        <Eye size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="qldd-empty">
                  Không có dữ liệu địa điểm
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="qldd-footer">
        <div className="qldd-footer-info">
          Hiển thị {filteredLocations.length > 0 ? 1 : 0} - {filteredLocations.length} trong số {locations.length} địa điểm
        </div>

        <div className="qldd-pagination">
          <button className="qldd-page-nav">{'<'}</button>
          <button className="qldd-page-num active">1</button>
          <button className="qldd-page-nav">{'>'}</button>
        </div>
      </div>

      <ViewLocationModal
        open={viewModalOpen}
        data={selectedLocation}
        onClose={closeViewModal}
      />

      <EditLocationModal
        open={editModalOpen}
        data={selectedLocation}
        onClose={closeEditModal}
        onSave={handleSaveEdit}
      />
    </div>
  );
};

const ViewLocationModal = ({ open, data, onClose }) => {
  if (!open || !data) return null;

  const images = Array.isArray(data.images) && data.images.length > 0
    ? data.images
    : [data.image || '/img/default-trekking.jpg'];

  return (
    <div className="qldd-modal-overlay" onClick={onClose}>
      <div className="qldd-modal qldd-modal-preview" onClick={(e) => e.stopPropagation()}>
        <button className="qldd-preview-close" onClick={onClose}>
          <X size={22} />
        </button>

        <div className="qldd-preview-header">
          <h2>{data.tenDiaDiem}</h2>
          <p>{data.moTa || 'Chưa có mô tả'}</p>
        </div>

        <div className="qldd-preview-gallery">
          <div className="qldd-preview-main-img">
            <img src={images[0]} alt={data.tenDiaDiem} />
          </div>

          <div className="qldd-preview-side-imgs">
            {(images.length > 1 ? images.slice(1, 4) : images.slice(0, 1)).map((img, index) => (
              <div className="qldd-preview-sub-img" key={index}>
                <img src={img} alt={`${data.tenDiaDiem}-${index}`} />
              </div>
            ))}
          </div>
        </div>

        <div className="qldd-preview-status">
          <span
            className={
              data.trangThai === 'da_duyet'
                ? 'qldd-preview-badge active'
                : data.trangThai === 'tu_choi'
                  ? 'qldd-preview-badge rejected'
                  : 'qldd-preview-badge pending'
            }
          >
            {data.status}
          </span>
        </div>

        <div className="qldd-preview-info-grid">
          <InfoCard icon={<MapPin size={18} />} label="Tỉnh / khu vực" value={`${data.tinh || ''} ${data.khuVuc ? `- ${data.khuVuc}` : ''}`} />
          <InfoCard icon={<Mountain size={18} />} label="Độ khó" value={data.doKho} />
          <InfoCard icon={<Ticket size={18} />} label="Vé vào" value={data.veVao} />
          <InfoCard icon={<Route size={18} />} label="Quãng đường" value={data.quangduong} />
        </div>

        <div className="qldd-preview-section">
          <h4>Mô tả</h4>
          <p>{data.moTa || 'Chưa có mô tả'}</p>
        </div>

        <div className="qldd-preview-section">
          <h4>Giới thiệu</h4>
          {Array.isArray(data.gioiThieu) && data.gioiThieu.length > 0 ? (
            data.gioiThieu.map((item, index) => <p key={index}>{item}</p>)
          ) : (
            <p>Chưa có giới thiệu chi tiết</p>
          )}
        </div>

        <div className="qldd-preview-section">
          <h4>Đặc điểm địa danh</h4>
          <div className="qldd-tags">
            {Array.isArray(data.dacDiemDiaDanh) && data.dacDiemDiaDanh.length > 0 ? (
              data.dacDiemDiaDanh.map((tag, index) => <span key={index}>{tag}</span>)
            ) : (
              <span>Chưa cập nhật</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const EditLocationModal = ({ open, data, onClose, onSave }) => {
  const [form, setForm] = useState(null);

  useEffect(() => {
    if (data) {
      setForm({
        _id: data._id,
        tenDiaDiem: data.tenDiaDiem || '',
        moTa: data.moTa || '',
        gioiThieuText: Array.isArray(data.gioiThieu) ? data.gioiThieu.join('\n') : '',
        doKho: data.doKho || '',
        veVaoRaw: data.veVaoRaw || '',
        quangduong: data.quangduong || '',
        khuVuc: data.khuVuc || '',
        tinh: data.tinh || '',
        hot: !!data.hot,
        imageRaw: data.imageRaw || '',
        imagesText: Array.isArray(data.imagesRaw) ? data.imagesRaw.join('\n') : '',
        tagsText: Array.isArray(data.dacDiemDiaDanh) ? data.dacDiemDiaDanh.join(', ') : '',
        trangThai: data.trangThai || 'cho_duyet',
        imagesRaw: Array.isArray(data.imagesRaw) ? data.imagesRaw : [],
        newImageFiles: [],
        newImagePreviews: [],
        imageFile: null,
        imagePreview: "",
      });
    }
  }, [data]);

  if (!open || !form) return null;

  const previewMain = getImageUrl(form.imageRaw);
  const previewSubs = form.imagesText
    .split('\n')
    .map((x) => x.trim())
    .filter(Boolean)
    .map(getImageUrl);

  const handleChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = () => {
    const updated = {
      ...data,
      ...form,

      tenDiaDiem: form.tenDiaDiem,
      name: form.tenDiaDiem,

      moTa: form.moTa,

      gioiThieu: form.gioiThieuText
        .split('\n')
        .map((x) => x.trim())
        .filter(Boolean),

      doKho: form.doKho,
      level: form.doKho,

      veVaoRaw: form.veVaoRaw,
      veVao: formatPrice(form.veVaoRaw),
      price: formatPrice(form.veVaoRaw),

      quangduong: form.quangduong,

      khuVuc: form.khuVuc,
      area: form.khuVuc,

      tinh: form.tinh,

      hot: form.hot,

      imageRaw: form.imageRaw,

      imagesRaw: form.imagesText
        .split('\n')
        .map((x) => x.trim())
        .filter(Boolean),

      dacDiemDiaDanh: form.tagsText
        .split(',')
        .map((x) => x.trim())
        .filter(Boolean),

      trangThai: form.trangThai,
      status: normalizeStatus({ trangThai: form.trangThai }),
    };

    onSave(updated);
  };

  return (
    <div className="qldd-modal-overlay" onClick={onClose}>
      <div className="qldd-modal qldd-modal-preview" onClick={(e) => e.stopPropagation()}>
        <button className="qldd-preview-close" onClick={onClose}>
          <X size={22} />
        </button>

        <div className="qldd-preview-header">
          <h2>Chỉnh sửa địa điểm</h2>
          <p>{form.tenDiaDiem || 'Chưa có tên'}</p>
        </div>

        <div className="qldd-preview-gallery">
          <div className="qldd-preview-main-img">
            <img src={previewMain} alt={form.tenDiaDiem} />
          </div>

          <div className="qldd-preview-side-imgs">
            {(previewSubs.length > 0 ? previewSubs.slice(0, 3) : [previewMain]).map((img, index) => (
              <div className="qldd-preview-sub-img" key={index}>
                <img src={img} alt={`${form.tenDiaDiem}-${index}`} />
              </div>
            ))}
          </div>
        </div>

        <div className="qldd-form-grid">
          <div className="qldd-form-group">
            <label>Tên địa điểm</label>
            <input value={form.tenDiaDiem} onChange={(e) => handleChange('tenDiaDiem', e.target.value)} />
          </div>

          <div className="qldd-form-group">
            <label>Tỉnh</label>
            <input value={form.tinh} onChange={(e) => handleChange('tinh', e.target.value)} />
          </div>

          <div className="qldd-form-group">
            <label>Khu vực</label>
            <input value={form.khuVuc} onChange={(e) => handleChange('khuVuc', e.target.value)} />
          </div>

          <div className="qldd-form-group">
            <label>Độ khó</label>
            <input value={form.doKho} onChange={(e) => handleChange('doKho', e.target.value)} />
          </div>

          <div className="qldd-form-group">
            <label>Vé vào</label>
            <input value={form.veVaoRaw} onChange={(e) => handleChange('veVaoRaw', e.target.value)} />
          </div>

          <div className="qldd-form-group">
            <label>Quãng đường</label>
            <input value={form.quangduong} onChange={(e) => handleChange('quangduong', e.target.value)} />
          </div>

          <div className="qldd-form-group">
            <label>Trạng thái</label>
            <select value={form.trangThai} onChange={(e) => handleChange('trangThai', e.target.value)}>
              <option value="cho_duyet">Chờ duyệt</option>
              <option value="da_duyet">Đang hoạt động</option>
              <option value="tu_choi">Từ chối</option>
            </select>
          </div>

          <div className="qldd-form-group">
            <label>Nổi bật</label>
            <select value={form.hot ? 'true' : 'false'} onChange={(e) => handleChange('hot', e.target.value === 'true')}>
              <option value="false">Không</option>
              <option value="true">Có</option>
            </select>
          </div>
        </div>

        <div className="qldd-edit-image-section">
          <label>Ảnh chính</label>

          <label className="qldd-edit-main-image">
            <img src={form.imagePreview || getImageUrl(form.imageRaw)} alt="Ảnh chính" />
            <span>Ấn để đổi ảnh chính</span>

            <input
              type="file"
              accept="image/*"
              hidden
              onChange={(e) => {
                const file = e.target.files[0];
                if (!file) return;

                setForm((prev) => ({
                  ...prev,
                  imageFile: file,
                  imagePreview: URL.createObjectURL(file),
                }));
              }}
            />
          </label>
        </div>

        <div className="qldd-edit-image-section">
          <label>Ảnh phụ</label>

          <div className="qldd-edit-sub-images">
            {(form.imagesRaw || []).map((img, index) => (
              <div className="qldd-edit-sub-image" key={index}>
                <img src={getImageUrl(img)} alt={`Ảnh phụ ${index + 1}`} />

                <button
                  type="button"
                  onClick={() => {
                    setForm((prev) => ({
                      ...prev,
                      imagesRaw: prev.imagesRaw.filter((_, i) => i !== index),
                    }));
                  }}
                >
                  ×
                </button>
              </div>
            ))}

            {(form.newImagePreviews || []).map((img, index) => (
              <div className="qldd-edit-sub-image" key={`new-${index}`}>
                <img src={img} alt={`Ảnh mới ${index + 1}`} />

                <button
                  type="button"
                  onClick={() => {
                    setForm((prev) => ({
                      ...prev,
                      newImagePreviews: prev.newImagePreviews.filter((_, i) => i !== index),
                      newImageFiles: prev.newImageFiles.filter((_, i) => i !== index),
                    }));
                  }}
                >
                  ×
                </button>
              </div>
            ))}

            <label className="qldd-add-sub-image">
              +
              <input
                type="file"
                accept="image/*"
                hidden
                multiple
                onChange={(e) => {
                  const files = Array.from(e.target.files || []);
                  if (files.length === 0) return;

                  setForm((prev) => ({
                    ...prev,
                    newImageFiles: [...(prev.newImageFiles || []), ...files],
                    newImagePreviews: [
                      ...(prev.newImagePreviews || []),
                      ...files.map((file) => URL.createObjectURL(file)),
                    ],
                  }));
                }}
              />
            </label>
          </div>
        </div>
        <div className="qldd-form-group">
          <label>Mô tả</label>
          <textarea value={form.moTa} onChange={(e) => handleChange('moTa', e.target.value)} />
        </div>

        <div className="qldd-form-group">
          <label>Giới thiệu, mỗi dòng là một đoạn</label>
          <textarea value={form.gioiThieuText} onChange={(e) => handleChange('gioiThieuText', e.target.value)} />
        </div>

        <div className="qldd-form-group">
          <label>Đặc điểm địa danh, cách nhau bằng dấu phẩy</label>
          <input value={form.tagsText} onChange={(e) => handleChange('tagsText', e.target.value)} />
        </div>

        <div className="qldd-modal-actions">
          <button className="qldd-btn-cancel" onClick={onClose}>
            Hủy
          </button>

          <button className="qldd-btn-save" onClick={handleSubmit}>
            <Save size={17} />
            Lưu thay đổi
          </button>
        </div>
      </div>
    </div>
  );
};

const InfoCard = ({ icon, label, value }) => (
  <div className="qldd-info-card">
    {icon}
    <div>
      <span>{label}</span>
      <strong>{value || 'Chưa cập nhật'}</strong>
    </div>
  </div>
);

export default ContentQuanLyDiaDiem;