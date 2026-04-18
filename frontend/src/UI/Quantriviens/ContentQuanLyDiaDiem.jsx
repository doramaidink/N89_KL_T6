import React, { useEffect, useMemo, useState } from 'react';
import { Search, Plus, Map, CheckCircle2, AlertTriangle, Edit3, Eye, Filter, Download } from 'lucide-react';
import { useParams } from 'react-router-dom';

const formatPrice = (value) => {
  if (value === null || value === undefined || value === '') return 'Miễn phí';
  const number = Number(value);
  if (Number.isNaN(number) || number <= 0) return 'Miễn phí';
  return `${number.toLocaleString('vi-VN')} VNĐ`;
};

const mapStatusLabel = (status) => {
  if (!status) return 'Đang hoạt động';

  const normalized = String(status).toLowerCase();

  if (
    normalized.includes('bao tri') ||
    normalized.includes('bảo trì') ||
    normalized.includes('maintenance')
  ) {
    return 'Đang bảo trì';
  }

  if (
    normalized.includes('an') ||
    normalized.includes('hidden') ||
    normalized.includes('inactive') ||
    normalized.includes('dung') ||
    normalized.includes('dừng')
  ) {
    return 'Đã xóa/Dừng hoạt động';
  }

  return 'Đang hoạt động';
};

const ContentQuanLyDiaDiem = () => {
  const { slug } = useParams();

  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedProvince, setSelectedProvince] = useState('Tất cả Tỉnh/Thành');
  const [selectedStatus, setSelectedStatus] = useState('Tất cả Trạng thái');
  const [searchKeyword, setSearchKeyword] = useState('');

  useEffect(() => {
    const fetchQuanLyDiaDiem = async () => {
      try {
        setLoading(true);
        const res = await fetch(`http://localhost:5000/quantrivien/${slug}/quanlydiadiem`);
        const result = await res.json();

        if (!res.ok) {
          throw new Error(result.message || 'Không tải được dữ liệu địa điểm');
        }

        setLocations(Array.isArray(result.locations) ? result.locations : []);
      } catch (error) {
        console.log(error);
        setLocations([]);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchQuanLyDiaDiem();
    }
  }, [slug]);

  const provinceOptions = useMemo(() => {
    const unique = [...new Set(locations.map(item => item.area).filter(Boolean))];
    return ['Tất cả Tỉnh/Thành', ...unique];
  }, [locations]);

  const filteredLocations = useMemo(() => {
    let data = [...locations];

    if (selectedProvince !== 'Tất cả Tỉnh/Thành') {
      data = data.filter(item => item.area === selectedProvince);
    }

    if (selectedStatus !== 'Tất cả Trạng thái') {
      data = data.filter(item => item.status === selectedStatus);
    }

    if (searchKeyword.trim()) {
      const keyword = searchKeyword.trim().toLowerCase();
      data = data.filter(item =>
        (item.id || '').toLowerCase().includes(keyword) ||
        (item.name || '').toLowerCase().includes(keyword) ||
        (item.area || '').toLowerCase().includes(keyword)
      );
    }

    return data;
  }, [locations, selectedProvince, selectedStatus, searchKeyword]);

  const stats = useMemo(() => {
    const tongSoDiaDiem = locations.length;
    const dangHoatDong = locations.filter(item => item.status === 'Đang hoạt động').length;
    const daXoaDungHoatDong = locations.filter(item => item.status === 'Đã xóa/Dừng hoạt động').length;

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const moiTrongThang = locations.filter(item => {
      if (!item.createdAt) return false;
      const created = new Date(item.createdAt);
      return created.getMonth() === currentMonth && created.getFullYear() === currentYear;
    }).length;

    const prevMonthCount = locations.filter(item => {
      if (!item.createdAt) return false;
      const created = new Date(item.createdAt);
      const prev = new Date(currentYear, currentMonth - 1, 1);
      return created.getMonth() === prev.getMonth() && created.getFullYear() === prev.getFullYear();
    }).length;

    let percent = '+0%';
    if (prevMonthCount > 0) {
      const value = ((moiTrongThang - prevMonthCount) / prevMonthCount) * 100;
      percent = `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`;
    } else if (moiTrongThang > 0) {
      percent = '+100%';
    }

    return [
      {
        label: 'TỔNG SỐ ĐỊA ĐIỂM',
        value: tongSoDiaDiem.toLocaleString('vi-VN'),
        icon: <Map size={20} />,
        color: 'emerald'
      },
      {
        label: 'ĐANG HOẠT ĐỘNG',
        value: dangHoatDong.toLocaleString('vi-VN'),
        icon: <CheckCircle2 size={20} />,
        color: 'green'
      },
      {
        label: 'ĐÃ XÓA/DỪNG HOẠT ĐỘNG',
        value: daXoaDungHoatDong.toLocaleString('vi-VN'),
        icon: <AlertTriangle size={20} />,
        color: 'red'
      },
      {
        label: 'MỚI TRONG THÁNG',
        value: `+${moiTrongThang}`,
        sub: percent,
        color: 'emerald'
      },
    ];
  }, [locations]);

  return (
    <div className="quanlydiadiem-container">
      {/* Header Section */}
      <div className="qldd-header">
        <div className="qldd-header-left">
          <h2 className="qldd-title">Quản lý địa điểm</h2>
          <p className="qldd-subtitle">Quản trị danh mục các điểm đến trên toàn lãnh thổ Việt Nam</p>
        </div>
        <button className="qldd-btn-add">
          <Plus size={18} /> Thêm địa điểm mới
        </button>
      </div>

      {/* Stats Cards */}
      <div className="qldd-stats-grid">
        {stats.map((s, i) => (
          <div key={i} className={`qldd-stat-card border-${s.color}`}>
            <div className="qldd-stat-info">
              <div className="qldd-stat-label">{s.label}</div>
              <div className="qldd-stat-value">
                {s.value} {s.sub && <span className="qldd-stat-sub">{s.sub}</span>}
              </div>
            </div>
            {s.icon && <div className={`qldd-stat-icon text-${s.color}`}>{s.icon}</div>}
          </div>
        ))}
      </div>

      {/* Filter & Search Bar */}
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
            <option>Đang bảo trì</option>
            <option>Đã xóa/Dừng hoạt động</option>
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
          <button className="qldd-btn-icon"><Filter size={18} /></button>
          <button className="qldd-btn-icon"><Download size={18} /></button>
        </div>
      </div>

      {/* Table Section */}
      <div className="qldd-table-wrapper custom-scrollbar">
        <table className="qldd-table">
          <thead>
            <tr>
              <th style={{ width: '100px' }}>ID</th>
              <th>ĐỊA ĐIỂM</th>
              <th style={{ width: '120px' }}>KHU VỰC</th>
              <th style={{ width: '120px' }}>ĐỘ KHÓ</th>
              <th style={{ width: '140px' }}>GIÁ VÉ</th>
              <th style={{ width: '160px' }}>TRẠNG THÁI</th>
              <th style={{ width: '100px' }}>THAO TÁC</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '20px' }}>
                  Đang tải dữ liệu...
                </td>
              </tr>
            ) : filteredLocations.length > 0 ? (
              filteredLocations.map((loc) => (
                <tr key={loc.id}>
                  <td className="text-emerald font-bold">{loc.id}</td>
                  <td>
                    <div className="qldd-loc-cell">
                      <div
                        className="qldd-loc-img"
                        style={
                          loc.image
                            ? {
                                backgroundImage: `url(${loc.image})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center'
                              }
                            : {}
                        }
                      ></div>
                      <span className="qldd-loc-name">{loc.name}</span>
                    </div>
                  </td>
                  <td className="qldd-text-muted">{loc.area}</td>
                  <td>
                    <span className="qldd-badge-level">{loc.level}</span>
                  </td>
                  <td className="qldd-text-muted">{loc.price}</td>
                  <td>
                    <div className={`qldd-status status-${loc.status === 'Đang bảo trì' ? 'maintenance' : loc.status === 'Đã xóa/Dừng hoạt động' ? 'deleted' : 'active'}`}>
                      <span className="qldd-dot"></span> {loc.status}
                    </div>
                  </td>
                  <td>
                    <div className="qldd-actions">
                      <button className="qldd-action-btn"><Edit3 size={16} /></button>
                      <button className="qldd-action-btn"><Eye size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '20px' }}>
                  Không có dữ liệu địa điểm
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
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
    </div>
  );
};

export default ContentQuanLyDiaDiem;