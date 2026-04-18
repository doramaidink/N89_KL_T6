import React, { useEffect, useMemo, useState } from 'react';
import { Search, Filter, Download, Users, FileText, Check, X } from 'lucide-react';
import { useParams } from 'react-router-dom';

const getInitials = (name = '') => {
  return name
    .trim()
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(word => word[0]?.toUpperCase())
    .join('');
};

const ContentDonDangKy = () => {
  const { slug } = useParams();

  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState('');

  useEffect(() => {
    const fetchDonDangKy = async () => {
      try {
        setLoading(true);
        const res = await fetch(`http://localhost:5000/quantrivien/${slug}/dondangky`);
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

    if (slug) {
      fetchDonDangKy();
    }
  }, [slug]);

  const filteredApplicants = useMemo(() => {
    if (!keyword.trim()) return applicants;

    const key = keyword.trim().toLowerCase();
    return applicants.filter((item) =>
      (item.id || '').toLowerCase().includes(key) ||
      (item.name || '').toLowerCase().includes(key) ||
      (item.email || '').toLowerCase().includes(key) ||
      (item.city || '').toLowerCase().includes(key)
    );
  }, [applicants, keyword]);

  const stats = useMemo(() => {
    const tongUngVien = applicants.length;
    const choDuyet = applicants.filter(item => item.status === 'CHỜ DUYỆT').length;

    return [
      { label: 'TỔNG ỨNG VIÊN', value: tongUngVien.toLocaleString('vi-VN'), icon: <Users size={24} />, color: 'emerald' },
      { label: 'CHỜ DUYỆT', value: choDuyet.toLocaleString('vi-VN'), icon: <FileText size={24} />, color: 'red' },
    ];
  }, [applicants]);

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
            <button className="ddk-icon-btn"><Filter size={18} /></button>
            <button className="ddk-icon-btn"><Download size={18} /></button>
          </div>
        </div>

        <div className="ddk-table-wrapper custom-scrollbar">
          <table className="ddk-table">
            <thead>
              <tr>
                <th style={{ width: '100px' }}>ID</th>
                <th>HỌ TÊN ỨNG VIÊN</th>
                <th style={{ width: '150px' }}>TỈNH THÀNH</th>
                <th style={{ width: '150px' }}>KINH NGHIỆM</th>
                <th style={{ width: '150px' }}>TRẠNG THÁI</th>
                <th style={{ width: '150px' }}>HÀNH ĐỘNG</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>
                    Đang tải dữ liệu...
                  </td>
                </tr>
              ) : filteredApplicants.length > 0 ? (
                filteredApplicants.map((item) => (
                  <tr key={item.id}>
                    <td className="ddk-id-cell">{item.id}</td>
                    <td>
                      <div className="ddk-user-info">
                        <div className="ddk-avatar">
                          {item.avatar || getInitials(item.name)}
                        </div>
                        <div>
                          <div className="ddk-name">{item.name}</div>
                          <div className="ddk-email">{item.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="ddk-text-light">{item.city}</td>
                    <td className="ddk-text-light">{item.exp}</td>
                    <td>
                      <span className="ddk-status-badge">
                        <span className="ddk-dot"></span> {item.status}
                      </span>
                    </td>
                    <td>
                      <div className="ddk-actions">
                        <button className="btn-view-cv">Xem CV</button>
                        <button className="btn-action-ok"><Check size={14} /></button>
                        <button className="btn-action-no"><X size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>
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
        <span className="ddk-secure"><span className="ddk-dot-small"></span> NETWORK SECURE</span>
      </div>
    </div>
  );
};

export default ContentDonDangKy;