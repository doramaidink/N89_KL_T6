import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import {
  Search,
  MapPin,
  Eye,
  X,
  Mountain,
  Ticket,
  Route,
  CheckCircle,
  Clock,
  XCircle,
} from 'lucide-react';
import { useParams } from 'react-router-dom';


const API_URL = 'http://localhost:5000';

const ContentDuyetDiaDiem = () => {
  const { slug } = useParams();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [locations, setLocations] = useState([]);
  const [keyword, setKeyword] = useState('');
  const [loading, setLoading] = useState(true);

  const getImageUrl = (image) => {
    if (!image) return '/img/default-trekking.jpg';

    if (image.startsWith('http')) return image;

    if (image.startsWith('/img')) return image;

    if (image.startsWith('img')) return `/${image}`;

    const cleanPath = image.startsWith('/') ? image.slice(1) : image;

    return `${API_URL}/${cleanPath}`;
  };

  const formatPrice = (value) => {
    if (value === null || value === undefined || value === '') {
      return 'Miễn phí';
    }

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

  const getStatusLabel = (status) => {
    if (status === 'da_duyet') return 'ĐÃ DUYỆT';
    if (status === 'tu_choi') return 'TỪ CHỐI';
    return 'CHỜ DUYỆT';
  };

  const fetchDiaDiem = async () => {
    try {
      setLoading(true);

      const res = await axios.get(`${API_URL}/quantrivien/${slug}/duyetdiadiem`);

      const rawData = Array.isArray(res.data) ? res.data : [];

      const mappedData = rawData.map((item) => {
        const gallery = [
          item.image,
          ...(Array.isArray(item.images) ? item.images : []),
        ].filter(Boolean);

        const realImages = gallery.length > 0
          ? gallery.map(getImageUrl)
          : ['/img/default-trekking.jpg'];

        return {
          _id: item._id,
          id: `#LOC-${String(item._id).slice(-6).toUpperCase()}`,

          name: item.tenDiaDiem || 'Chưa có tên',
          tenDiaDiem: item.tenDiaDiem || 'Chưa có tên',

          type: item.dacDiemDiaDanh?.[0] || 'Địa điểm trekking',

          city: item.tinh || item.khuVuc || 'Chưa cập nhật',
          tinh: item.tinh || 'Chưa cập nhật',

          area: item.khuVuc || 'Chưa cập nhật',
          khuVuc: item.khuVuc || 'Chưa cập nhật',

          level: item.doKho || 'Chưa rõ',
          doKho: item.doKho || 'Chưa rõ',

          price: formatPrice(item.veVao),
          veVao: formatPrice(item.veVao),

          quangduong: item.quangduong || 'Chưa cập nhật',

          description: item.moTa || 'Chưa có mô tả',
          moTa: item.moTa || 'Chưa có mô tả',

          gioiThieu: Array.isArray(item.gioiThieu) ? item.gioiThieu : [],
          dacDiemDiaDanh: Array.isArray(item.dacDiemDiaDanh)
            ? item.dacDiemDiaDanh
            : [],

          image: realImages[0],
          images: realImages,

          slug: item.slug,

          status: item.trangThai || 'cho_duyet',
          trangThai: item.trangThai || 'cho_duyet',
          statusLabel: getStatusLabel(item.trangThai || 'cho_duyet'),

          createdAt: item.createdAt,
        };
      });

      setLocations(mappedData);
    } catch (error) {
      console.log('Lỗi lấy địa điểm:', error);
      setLocations([]);
    } finally {
      setLoading(false);
    }
  };
  const handleApprove = async (id) => {
    try {

      await axios.patch(
        `${API_URL}/quantrivien/${slug}/duyetdiadiem/${id}/duyet`
      );

      setLocations((prev) =>
        prev.map((item) =>
          item._id === id
            ? {
              ...item,
              status: 'da_duyet',
              trangThai: 'da_duyet',
              statusLabel: 'ĐÃ DUYỆT',
            }
            : item
        )
      );

      if (
        selectedLocation &&
        selectedLocation._id === id
      ) {
        setSelectedLocation((prev) => ({
          ...prev,
          status: 'da_duyet',
          trangThai: 'da_duyet',
          statusLabel: 'ĐÃ DUYỆT',
        }));
      }

      toast.success('Đã duyệt địa điểm');

    } catch (error) {
      console.log(error);

      toast.error('Duyệt thất bại');
    }
  };

  const handleReject = async (id) => {
    try {

      await axios.patch(
        `${API_URL}/quantrivien/${slug}/duyetdiadiem/${id}/tuchoi`
      );

      setLocations((prev) =>
        prev.map((item) =>
          item._id === id
            ? {
              ...item,
              status: 'tu_choi',
              trangThai: 'tu_choi',
              statusLabel: 'TỪ CHỐI',
            }
            : item
        )
      );

      if (
        selectedLocation &&
        selectedLocation._id === id
      ) {
        setSelectedLocation((prev) => ({
          ...prev,
          status: 'tu_choi',
          trangThai: 'tu_choi',
          statusLabel: 'TỪ CHỐI',
        }));
      }

      toast.success('Đã từ chối địa điểm');

    } catch (error) {
      console.log(error);

      toast.error('Từ chối thất bại');
    }
  };

  useEffect(() => {
    if (slug) fetchDiaDiem();
  }, [slug]);

  const filteredLocations = useMemo(() => {
    const text = keyword.trim().toLowerCase();

    if (!text) return locations;

    return locations.filter((item) =>
      [
        item.name,
        item.type,
        item.city,
        item.area,
        item.level,
        item.price,
        item.statusLabel,
      ]
        .join(' ')
        .toLowerCase()
        .includes(text)
    );
  }, [keyword, locations]);

  const handleViewDetails = (item) => {
    setSelectedLocation(item);
    setIsModalOpen(true);
  };

  return (
    <div className="duyet-container">
      <div className="duyet-header">
        <h2 className="duyet-title">Duyệt địa điểm</h2>
        <button className="duyet-btn-muted">Tổng: {filteredLocations.length}</button>
      </div>

      <div className="duyet-search-section">
        <div className="duyet-input-wrapper">
          <Search size={18} className="duyet-icon-search" />
          <input
            type="text"
            placeholder="Tìm kiếm địa điểm..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
        </div>
      </div>

      <div className="duyet-table-scroll custom-scrollbar">
        <table className="duyet-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>ĐỊA ĐIỂM & HÌNH ẢNH</th>
              <th>VỊ TRÍ</th>
              <th>ĐỘ KHÓ / GIÁ</th>
              <th>TRẠNG THÁI</th>
              <th>THAO TÁC</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="duyet-empty">
                  Đang tải dữ liệu...
                </td>
              </tr>
            ) : filteredLocations.length === 0 ? (
              <tr>
                <td colSpan="6" className="duyet-empty">
                  Không có địa điểm
                </td>
              </tr>
            ) : (
              filteredLocations.map((item) => (
                <tr key={item._id}>
                  <td className="duyet-text-muted">{item.id}</td>

                  <td>
                    <div className="duyet-loc-cell">
                      <div className="duyet-img-group">
                        <div className="duyet-img-main">
                          <img src={item.image} alt={item.name} />
                        </div>

                        <div className="duyet-img-side">
                          <div className="duyet-img-sub">
                            <img src={item.images[1] || item.image} alt={item.name} />
                          </div>

                          <div className="duyet-img-sub duyet-more-count">
                            {item.images.length > 2 ? `+${item.images.length - 2}` : '+0'}
                          </div>
                        </div>
                      </div>

                      <div className="duyet-loc-info">
                        <div className="duyet-loc-name">{item.name}</div>
                        <div className="duyet-loc-type duyet-text-muted">
                          {item.type}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td>
                    <div className="duyet-flex-align">
                      <MapPin size={14} className="duyet-color-green" />
                      <span>{item.city}</span>
                    </div>
                  </td>

                  <td>
                    <div>
                      <div className="duyet-bold">{item.level}</div>
                      <div className="duyet-text-muted">{item.price}</div>
                    </div>
                  </td>

                  <td>
                    {item.status === 'da_duyet' ? (
                      <div className="duyet-status-approved">
                        <span className="duyet-dot-green"></span>
                        <span>ĐÃ DUYỆT</span>
                      </div>
                    ) : item.status === 'tu_choi' ? (
                      <div className="duyet-status-reject">
                        <span className="duyet-dot-red"></span>
                        <span>TỪ CHỐI</span>
                      </div>
                    ) : (
                      <div className="duyet-status-wait">
                        <span className="duyet-dot-amber"></span>
                        <span>CHỜ DUYỆT</span>
                      </div>
                    )}
                  </td>

                  <td>
                    <div className="duyet-actions">
                      <button
                        className="duyet-btn-approve"
                        onClick={() => handleApprove(item._id)}
                      >
                        DUYỆT
                      </button>

                      <button
                        className="duyet-btn-reject"
                        onClick={() => handleReject(item._id)}
                      >
                        TỪ CHỐI
                      </button>
                      <button
                        className="duyet-btn-view"
                        onClick={() => handleViewDetails(item)}
                      >
                        <Eye size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="duyet-pagination">
        <div className="duyet-text-muted">
          Hiển thị {filteredLocations.length} địa điểm
        </div>
      </div>

      <ModalChiTietDiaDiem
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        data={selectedLocation}
        handleApprove={handleApprove}
        handleReject={handleReject}
      />
    </div>
  );
};

const ModalChiTietDiaDiem = ({ isOpen, onClose, data, handleApprove, handleReject }) => {
  if (!isOpen || !data) return null;

  const images = Array.isArray(data.images) && data.images.length > 0
    ? data.images
    : [data.image || '/img/default-trekking.jpg'];

  const getStatus = () => {
    if (data.status === 'da_duyet') {
      return {
        text: 'Đã duyệt',
        className: 'modal-status-approved',
        icon: <CheckCircle size={16} />,
      };
    }

    if (data.status === 'tu_choi') {
      return {
        text: 'Từ chối',
        className: 'modal-status-reject',
        icon: <XCircle size={16} />,
      };
    }

    return {
      text: 'Chờ duyệt',
      className: 'modal-status-wait',
      icon: <Clock size={16} />,
    };
  };

  const status = getStatus();

  return (
    <div className="modal-dd-overlay"   onClick={onClose}>
      <div className="modal-dd-box" onClick={(e) => e.stopPropagation()}>
        <div className="modal-dd-header" >
          <div>
            <h2>{data.name || data.tenDiaDiem}</h2>
            <p>{data.description || data.moTa}</p>
          </div>

          <button className="modal-dd-close" style={{ backgroundColor: 'rgba(15, 23, 42, 0.55)' }} onClick={onClose}>
            <X size={22} />
          </button>
        </div>

        <div className="modal-dd-gallery">
          <div className="modal-dd-main-img">
            <img src={images[0]} alt={data.name} />
          </div>

          <div className="modal-dd-sub-imgs">
            {(images.length > 1 ? images.slice(1, 4) : images.slice(0, 1)).map(
              (img, index) => (
                <div className="modal-dd-sub-img" key={index}>
                  <img src={img} alt={`${data.name}-${index}`} />
                </div>
              )
            )}
          </div>
        </div>

        <div className="modal-dd-status-row">
          <div className={`modal-dd-status ${status.className}`}>
            {status.icon}
            <span>{status.text}</span>
          </div>
        </div>

        <div className="modal-dd-info-grid">
          <div className="modal-dd-info-card">
            <MapPin size={18} />
            <div>
              <span>Tỉnh / khu vực</span>
              <strong>{data.tinh || data.city || data.area}</strong>
            </div>
          </div>

          <div className="modal-dd-info-card">
            <Mountain size={18} />
            <div>
              <span>Độ khó</span>
              <strong>{data.doKho || data.level}</strong>
            </div>
          </div>

          <div className="modal-dd-info-card">
            <Ticket size={18} />
            <div>
              <span>Vé vào</span>
              <strong>{data.veVao || data.price}</strong>
            </div>
          </div>

          <div className="modal-dd-info-card">
            <Route size={18} />
            <div>
              <span>Quãng đường</span>
              <strong>{data.quangduong || 'Chưa cập nhật'}</strong>
            </div>
          </div>
        </div>

        <div className="modal-dd-section">
          <h3>Mô tả</h3>
          <p>{data.moTa || data.description || 'Chưa có mô tả'}</p>
        </div>

        <div className="modal-dd-section">
          <h3>Giới thiệu</h3>
          {Array.isArray(data.gioiThieu) && data.gioiThieu.length > 0 ? (
            data.gioiThieu.map((item, index) => <p key={index}>{item}</p>)
          ) : (
            <p>Chưa có giới thiệu chi tiết</p>
          )}
        </div>

        <div className="modal-dd-section">
          <h3>Đặc điểm địa danh</h3>
          <div className="modal-dd-tags">
            {Array.isArray(data.dacDiemDiaDanh) &&
              data.dacDiemDiaDanh.length > 0 ? (
              data.dacDiemDiaDanh.map((tag, index) => (
                <span key={index}>{tag}</span>
              ))
            ) : (
              <span>Chưa cập nhật</span>
            )}
          </div>
        </div>

        <div className="modal-dd-actions">
          <button
            className="modal-dd-btn-reject"
            onClick={() => handleReject(data._id)}
          >
            Từ chối
          </button>

          <button
            className="modal-dd-btn-approve"
            onClick={() => handleApprove(data._id)}
          >
            Duyệt địa điểm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContentDuyetDiaDiem;