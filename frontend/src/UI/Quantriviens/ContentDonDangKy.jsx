import React, { useEffect, useMemo, useState } from 'react';
import {
  Search,
  Filter,
  Download,
  Users,
  FileText,
  Check,
  X,
  Eye,
  Phone,
  Mail,
  MapPin,
  Calendar,
  IdCard,
  Briefcase,
  Languages,
  BadgeDollarSign,
  Image as ImageIcon,
} from 'lucide-react';
import { useParams } from 'react-router-dom';


const API_URL = 'http://localhost:5000';

const getInitials = (name = '') => {
  return name
    .trim()
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(word => word[0]?.toUpperCase())
    .join('');
};

const getImageUrl = (image) => {
  if (!image) return '';
  if (image.startsWith('http')) return image;
  if (image.startsWith('/img')) return `${API_URL}${image}`;
  if (image.startsWith('img')) return `${API_URL}/${image}`;

  const clean = image.startsWith('/') ? image.slice(1) : image;
  return `${API_URL}/${clean}`;
};

const formatDate = (date) => {
  if (!date) return 'Chưa cập nhật';
  return new Date(date).toLocaleDateString('vi-VN');
};

const formatMoney = (value) => {
  const num = Number(value);
  if (!value || Number.isNaN(num) || num <= 0) return 'Chưa cập nhật';
  return `${num.toLocaleString('vi-VN')} VNĐ`;
};

const ContentDonDangKy = () => {
  const { slug } = useParams();

  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState('');
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [cvOpen, setCvOpen] = useState(false);

  const fetchDonDangKy = async () => {
    try {
      setLoading(true);

      const res = await fetch(`${API_URL}/quantrivien/${slug}/dondangky`);
      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || 'Không tải được hồ sơ đăng ký');
      }

      setApplicants(Array.isArray(result.applicants) ? result.applicants : []);
    } catch (error) {
      console.log(error);
      setApplicants([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (slug) fetchDonDangKy();
  }, [slug]);

  const filteredApplicants = useMemo(() => {
    if (!keyword.trim()) return applicants;

    const key = keyword.trim().toLowerCase();

    return applicants.filter((item) =>
      (item.id || '').toLowerCase().includes(key) ||
      (item.name || '').toLowerCase().includes(key) ||
      (item.email || '').toLowerCase().includes(key) ||
      (item.phone || '').toLowerCase().includes(key) ||
      (item.city || '').toLowerCase().includes(key) ||
      (item.soCCCD || '').toLowerCase().includes(key)
    );
  }, [applicants, keyword]);

  const stats = useMemo(() => {
    const tongUngVien = applicants.length;
    const choDuyet = applicants.filter(item => item.status === 'CHỜ DUYỆT').length;
    const daDuyet = applicants.filter(item => item.status === 'ĐÃ DUYỆT').length;

    return [
      {
        label: 'TỔNG ỨNG VIÊN',
        value: tongUngVien.toLocaleString('vi-VN'),
        icon: <Users size={24} />,
        color: 'emerald',
      },
      {
        label: 'CHỜ DUYỆT',
        value: choDuyet.toLocaleString('vi-VN'),
        icon: <FileText size={24} />,
        color: 'red',
      },
      {
        label: 'ĐÃ DUYỆT',
        value: daDuyet.toLocaleString('vi-VN'),
        icon: <Check size={24} />,
        color: 'emerald',
      },
    ];
  }, [applicants]);

  const openCv = (item) => {
    setSelectedApplicant(item);
    setCvOpen(true);
  };

  const closeCv = () => {
    setSelectedApplicant(null);
    setCvOpen(false);
  };

  const handleApprove = async (id) => {
    const ok = window.confirm('Duyệt hồ sơ này và chuyển tài khoản thành đối tác?');
    if (!ok) return;

    try {
      const res = await fetch(`${API_URL}/quantrivien/${slug}/dondangky/${id}/duyet`, {
        method: 'PATCH',
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || 'Duyệt hồ sơ thất bại');
      }

      setApplicants((prev) =>
        prev.map((item) =>
          item._id === id
            ? {
                ...item,
                trangThaiHoSo: 'da_duyet',
                status: 'ĐÃ DUYỆT',
                userRole: 'doiTac',
                ngayDuyet: new Date().toISOString(),
              }
            : item
        )
      );

      if (selectedApplicant?._id === id) {
        setSelectedApplicant((prev) => ({
          ...prev,
          trangThaiHoSo: 'da_duyet',
          status: 'ĐÃ DUYỆT',
          userRole: 'doiTac',
          ngayDuyet: new Date().toISOString(),
        }));
      }

      alert('Đã duyệt hồ sơ và chuyển tài khoản thành đối tác');
    } catch (error) {
      console.log(error);
      alert(error.message || 'Duyệt hồ sơ thất bại');
    }
  };

  const handleRejectDelete = async (id) => {
    const ok = window.confirm('Từ chối và xóa hồ sơ này?');
    if (!ok) return;

    try {
      const res = await fetch(`${API_URL}/quantrivien/${slug}/dondangky/${id}/tuchoi`, {
        method: 'DELETE',
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || 'Xóa hồ sơ thất bại');
      }

      setApplicants((prev) => prev.filter((item) => item._id !== id));

      if (selectedApplicant?._id === id) {
        closeCv();
      }

      alert('Đã từ chối và xóa hồ sơ');
    } catch (error) {
      console.log(error);
      alert(error.message || 'Xóa hồ sơ thất bại');
    }
  };

  return (
    <div className="dondangky-container">
      <div className="ddk-stats-row">
        {stats.map((s, i) => (
          <div key={i} className="ddk-stat-card">
            <div className="ddk-stat-content">
              <div className="ddk-stat-label">{s.label}</div>
              <div className="ddk-stat-value">{s.value}</div>
            </div>

            <div className={`ddk-stat-icon-wrapper bg-${s.color}`}>
              {s.icon}
            </div>
          </div>
        ))}
      </div>

      <div className="ddk-search-bar">
        <div className="ddk-search-wrapper">
          <Search size={18} className="ddk-search-icon" />

          <input
            type="text"
            placeholder="Tìm kiếm hồ sơ ứng viên..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
        </div>
      </div>

      <div className="ddk-table-box">
        <div className="ddk-table-header">
          <div className="ddk-table-title">
            <h3>Danh sách hồ sơ ứng tuyển</h3>
            <span>Cập nhật theo dữ liệu hệ thống</span>
          </div>

          <div className="ddk-table-actions">
            <button className="ddk-icon-btn">
              <Filter size={18} />
            </button>

            <button className="ddk-icon-btn">
              <Download size={18} />
            </button>
          </div>
        </div>

        <div className="ddk-table-wrapper custom-scrollbar">
          <table className="ddk-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>HỌ TÊN ỨNG VIÊN</th>
                <th>TỈNH THÀNH</th>
                <th>KINH NGHIỆM</th>
                <th>TRẠNG THÁI</th>
                <th>HÀNH ĐỘNG</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="ddk-empty">
                    Đang tải dữ liệu...
                  </td>
                </tr>
              ) : filteredApplicants.length > 0 ? (
                filteredApplicants.map((item) => (
                  <tr key={item._id}>
                    <td className="ddk-id-cell">{item.id}</td>

                    <td>
                      <div className="ddk-user-info">
                        {item.image ? (
                          <img
                            className="ddk-avatar-img"
                            src={getImageUrl(item.image)}
                            alt={item.name}
                          />
                        ) : (
                          <div className="ddk-avatar">
                            {item.avatar || getInitials(item.name)}
                          </div>
                        )}

                        <div>
                          <div className="ddk-name">{item.name}</div>
                          <div className="ddk-email">{item.email || item.phone}</div>
                        </div>
                      </div>
                    </td>

                    <td className="ddk-text-light">{item.city}</td>
                    <td className="ddk-text-light">{item.exp}</td>

                    <td>
                      <span
                        className={`ddk-status-badge ${
                          item.status === 'ĐÃ DUYỆT'
                            ? 'status-ok'
                            : item.status === 'TỪ CHỐI'
                            ? 'status-no'
                            : 'status-wait'
                        }`}
                      >
                        <span className="ddk-dot"></span>
                        {item.status}
                      </span>
                    </td>

                    <td>
                      <div className="ddk-actions">
                        <button className="btn-view-cv" onClick={() => openCv(item)}>
                          <Eye size={14} />
                          Xem CV
                        </button>

                        <button
                          className="btn-action-ok"
                          onClick={() => handleApprove(item._id)}
                          disabled={item.status === 'ĐÃ DUYỆT'}
                        >
                          <Check size={14} />
                        </button>

                        <button
                          className="btn-action-no"
                          onClick={() => handleRejectDelete(item._id)}
                        >
                          <X size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="ddk-empty">
                    Không có hồ sơ đăng ký nào
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="ddk-table-footer">
          <div className="ddk-footer-info">
            Hiển thị {filteredApplicants.length > 0 ? 1 : 0}-{filteredApplicants.length} trong số {applicants.length} hồ sơ
          </div>

          <div className="ddk-pagination">
            <button className="ddk-page-nav">{'<'}</button>
            <button className="ddk-page-num active">1</button>
            <button className="ddk-page-nav">{'>'}</button>
          </div>
        </div>
      </div>

      <div className="ddk-system-footer">
        <span>SYSTEM ENGINE V4.0.2</span>
        <span className="ddk-secure">
          <span className="ddk-dot-small"></span>
          NETWORK SECURE
        </span>
      </div>

      <CvModal
        open={cvOpen}
        data={selectedApplicant}
        onClose={closeCv}
        onApprove={handleApprove}
        onRejectDelete={handleRejectDelete}
      />
    </div>
  );
};

const CvModal = ({ open, data, onClose, onApprove, onRejectDelete }) => {
  if (!open || !data) return null;

  return (
    <div className="ddk-cv-overlay" onClick={onClose}>
      <div className="ddk-cv-modal" onClick={(e) => e.stopPropagation()}>
        <button className="ddk-cv-close" onClick={onClose}>
          <X size={22} />
        </button>

        <div className="ddk-cv-header">
          <div className="ddk-cv-profile">
            {data.image ? (
              <img src={getImageUrl(data.image)} alt={data.hoTen} />
            ) : (
              <div className="ddk-cv-avatar">
                {data.avatar || getInitials(data.hoTen)}
              </div>
            )}

            <div>
              <h2>{data.hoTen}</h2>
              <p>{data.tinhDangKy}</p>
              <span
                className={`ddk-cv-status ${
                  data.status === 'ĐÃ DUYỆT'
                    ? 'ok'
                    : data.status === 'TỪ CHỐI'
                    ? 'no'
                    : 'wait'
                }`}
              >
                {data.status}
              </span>
            </div>
          </div>
        </div>

        <div className="ddk-cv-grid">
          <InfoItem icon={<Mail size={17} />} label="Email tài khoản" value={data.email} />
          <InfoItem icon={<Phone size={17} />} label="Số điện thoại" value={data.soDienThoai} />
          <InfoItem icon={<IdCard size={17} />} label="Số CCCD" value={data.soCCCD} />
          <InfoItem icon={<Calendar size={17} />} label="Ngày sinh" value={formatDate(data.ngaySinh)} />
          <InfoItem icon={<MapPin size={17} />} label="Địa chỉ hiện tại" value={data.diaChi} />
          <InfoItem icon={<MapPin size={17} />} label="Quê quán" value={data.queQuan} />
          <InfoItem icon={<Briefcase size={17} />} label="Số năm kinh nghiệm" value={`${data.soNamKinhNghiem || 0} năm`} />
          <InfoItem icon={<BadgeDollarSign size={17} />} label="Giá thuê mặc định" value={formatMoney(data.giaThue)} />
        </div>

        <Section title="Giới thiệu bản thân">
          <p>{data.gioiThieuBanThan || 'Chưa cập nhật'}</p>
        </Section>

        <Section title="Kỹ năng đặc biệt">
          <TagList data={data.kyNangDacBiet} />
        </Section>

        <Section title="Ngôn ngữ hỗ trợ">
          <TagList data={data.ngonNguHoTro} icon={<Languages size={14} />} />
        </Section>

        <Section title="Kinh nghiệm">
          <p>{data.kinhNghiem || 'Chưa cập nhật'}</p>
        </Section>

        <Section title="Địa điểm & giá cả">
          {Array.isArray(data.diaDiemGiaCa) && data.diaDiemGiaCa.length > 0 ? (
            <div className="ddk-cv-place-list">
              {data.diaDiemGiaCa.map((item, index) => (
                <div className="ddk-cv-place-card" key={index}>
                  <div>
                    <strong>{item.diaDiem?.tenDiaDiem || 'Chưa rõ địa điểm'}</strong>
                    <p>{item.diaDiem?.khuVuc || item.diaDiem?.tinh || ''}</p>
                  </div>

                  <div>
                    <span>{formatMoney(item.mucGia)}</span>
                    <p>{item.kinhNghiem || 'Chưa có kinh nghiệm riêng'}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>Chưa đăng ký địa điểm hướng dẫn</p>
          )}
        </Section>

        <Section title="Hình ảnh & giấy tờ">
          <div className="ddk-cv-doc-grid">
            <DocPreview title="CCCD mặt trước" image={data.anhCCCDMatTruoc} />
            <DocPreview title="CCCD mặt sau" image={data.anhCCCDMatSau} />
            <DocPreview title="Ảnh khuôn mặt" image={data.anhKhuonMat} />
            <DocPreview title="Lý lịch tư pháp" image={data.lyLichTuPhap} />
          </div>
        </Section>

        <div className="ddk-cv-actions">
          <button className="ddk-cv-btn-reject" onClick={() => onRejectDelete(data._id)}>
            <X size={16} />
            Từ chối & xóa hồ sơ
          </button>

          <button
            className="ddk-cv-btn-approve"
            onClick={() => onApprove(data._id)}
            disabled={data.status === 'ĐÃ DUYỆT'}
          >
            <Check size={16} />
            Duyệt hồ sơ
          </button>
        </div>
      </div>
    </div>
  );
};

const InfoItem = ({ icon, label, value }) => (
  <div className="ddk-cv-info-item">
    {icon}
    <div>
      <span>{label}</span>
      <strong>{value || 'Chưa cập nhật'}</strong>
    </div>
  </div>
);

const Section = ({ title, children }) => (
  <div className="ddk-cv-section">
    <h3>{title}</h3>
    {children}
  </div>
);

const TagList = ({ data = [], icon }) => {
  let list = data;

  if (typeof data === 'string') {
    list = data
      .split(',')
      .map((x) => x.trim())
      .filter(Boolean);
  }

  if (!Array.isArray(list) || list.length === 0) {
    return <p>Chưa cập nhật</p>;
  }

  return (
    <div className="ddk-cv-tags">
      {list.map((item, index) => (
        <span key={index}>
          {icon}
          {item}
        </span>
      ))}
    </div>
  );
};

const DocPreview = ({ title, image }) => {
  const url = getImageUrl(image);

  return (
    <div className="ddk-cv-doc-card">
      <div className="ddk-cv-doc-title">
        <ImageIcon size={15} />
        {title}
      </div>

      {url ? (
        image?.toLowerCase?.().endsWith('.pdf') ? (
          <a href={url} target="_blank" rel="noreferrer">
            Xem file PDF
          </a>
        ) : (
          <img src={url} alt={title} />
        )
      ) : (
        <p>Chưa có</p>
      )}
    </div>
  );
};

export default ContentDonDangKy;