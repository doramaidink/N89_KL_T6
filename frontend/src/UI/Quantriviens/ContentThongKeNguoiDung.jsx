import React, { useEffect, useMemo, useState } from 'react';
import { NavLink, useParams } from 'react-router-dom';
import { Search, Plus, Users, Handshake } from 'lucide-react';

const getInitials = (name = '') => {
  return name
    .trim()
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(word => word[0]?.toUpperCase())
    .join('');
};

const ContentThongKeNguoiDung = () => {
  const { slug } = useParams();

  const [data, setData] = useState({
    chartData: [],
    tongNguoiDung: 0,
    tongDoiTacHoatDong: 0,
    tongDichVuDangCungCap: 0,
    phanTramTangNguoiDung: '+0%',
    accounts: [],
  });

  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('tatca');
  const [keyword, setKeyword] = useState('');

  useEffect(() => {
    const fetchThongKeNguoiDung = async () => {
      try {
        setLoading(true);
        const res = await fetch(`http://localhost:5000/quantrivien/${slug}/thongkenguoidung`);
        const result = await res.json();

        if (!res.ok) {
          throw new Error(result.message || 'Không tải được dữ liệu tài khoản');
        }

        setData({
          chartData: result.chartData || [],
          tongNguoiDung: result.tongNguoiDung || 0,
          tongDoiTacHoatDong: result.tongDoiTacHoatDong || 0,
          tongDichVuDangCungCap: result.tongDichVuDangCungCap || 0,
          phanTramTangNguoiDung: result.phanTramTangNguoiDung || '+0%',
          accounts: result.accounts || [],
        });
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchThongKeNguoiDung();
    }
  }, [slug]);

  const filteredAccounts = useMemo(() => {
    let list = [...data.accounts];

    if (activeTab === 'nguoidung') {
      list = list.filter(item => item.type === 'NGƯỜI DÙNG');
    }

    if (activeTab === 'doitac') {
      list = list.filter(item => item.type === 'ĐỐI TÁC');
    }

    if (keyword.trim()) {
      const lowerKeyword = keyword.trim().toLowerCase();
      list = list.filter(item =>
        (item.name || '').toLowerCase().includes(lowerKeyword) ||
        (item.email || '').toLowerCase().includes(lowerKeyword)
      );
    }

    return list;
  }, [data.accounts, activeTab, keyword]);

  const maxChartValue = useMemo(() => {
    if (!data.chartData.length) return 1;
    return Math.max(...data.chartData.map(item => item.value || 0), 1);
  }, [data.chartData]);

  if (loading) {
    return <div className="user-stats-container">Đang tải dữ liệu...</div>;
  }

  return (
    <div className="user-stats-container">
      {/* 1. Dashboard Overview */}
      <div className="user-overview-grid">
        {/* Khối biểu đồ bên trái */}
        <div className="chart-main-card">
          <div className="chart-header-inline">
            <div className="title-group">
              <h3>Thống kê</h3>
              <p className="sub-text">Số lượng tài khoản mới đăng ký qua các tháng</p>
            </div>
            <div className="legend-item">
              <span className="dot-legend"></span>
              <span>Người dùng mới</span>
            </div>
          </div>

          <div className="user-bar-chart">
            {data.chartData.map((item, idx) => {
              const percent = `${Math.max(((item.value || 0) / maxChartValue) * 100, 8)}%`;

              return (
                <div key={idx} className="user-bar-group">
                  <div className="bar-track">
                    <div
                      className={`user-bar ${item.active ? 'active-bar' : ''}`}
                      style={{ height: percent }}
                      title={`${item.m}: ${item.value}`}
                    ></div>
                  </div>
                  <span className="bar-month">{item.m}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Khối 2 Card nhỏ bên phải */}
        <div className="side-stats-column">
          <div className="small-stat-card">
            <div className="card-top">
              <span className="card-label">TỔNG NGƯỜI DÙNG</span>
              <Users size={18} className="text-emerald" />
            </div>
            <div className="card-body">
              <h2 className="main-number">{data.tongNguoiDung.toLocaleString('vi-VN')}</h2>
              <p className="trend-text">
                {data.phanTramTangNguoiDung}{' '}
                <span className="zinc-text">so với tháng trước</span>
              </p>
            </div>
          </div>

          <div className="small-stat-card">
            <div className="card-top">
              <span className="card-label">ĐỐI TÁC ĐANG HOẠT ĐỘNG</span>
              <Handshake size={18} className="text-emerald" />
            </div>
            <div className="card-body">
              <h2 className="main-number">{data.tongDoiTacHoatDong.toLocaleString('vi-VN')}</h2>
              <p className="trend-text">
                ⓘ Đang cung cấp {data.tongDichVuDangCungCap.toLocaleString('vi-VN')} dịch vụ
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Account List Section */}
      <div className="account-list-section">
        <div className="list-header">
          <h3>Danh sách tài khoản</h3>
          <div className="header-actions">
            <div className="tab-buttons">
              <button
                className={`tab-btn ${activeTab === 'tatca' ? 'active' : ''}`}
                onClick={() => setActiveTab('tatca')}
              >
                Tất cả
              </button>
              <button
                className={`tab-btn ${activeTab === 'nguoidung' ? 'active' : ''}`}
                onClick={() => setActiveTab('nguoidung')}
              >
                Người dùng
              </button>
              <button
                className={`tab-btn ${activeTab === 'doitac' ? 'active' : ''}`}
                onClick={() => setActiveTab('doitac')}
              >
                Đối tác
              </button>
            </div>

            <NavLink to="/dangki" className="btn-create-acc">
              <button className="btn-create-acc">
                <Plus size={15} /> Tạo Tài khoản
              </button>
            </NavLink>
          </div>
        </div>

        <div className="search-bar-wrapper">
          <Search size={18} className="search-icon-inner" />
          <input
            type="text"
            placeholder="Tìm kiếm tài khoản theo tên hoặc email..."
            className="user-search-input"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
        </div>

        <div className="table-responsive">
          <table className="user-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>TÊN NGƯỜI DÙNG</th>
                <th>LOẠI TÀI KHOẢN</th>
                <th>TRẠNG THÁI</th>
                <th>NGÀY THAM GIA</th>
                <th>THAO TÁC</th>
              </tr>
            </thead>
            <tbody>
              {filteredAccounts.length > 0 ? (
                filteredAccounts.map((acc, idx) => (
                  <tr key={acc.id || idx}>
                    <td className="zinc-text">{acc.id}</td>
                    <td>
                      <div className="user-info-cell">
                        <div className={`avatar-box ${acc.type === 'ĐỐI TÁC' ? 'bg-partner' : 'bg-user'}`}>
                          {acc.avatar || getInitials(acc.name)}
                        </div>
                        <div className="name-email">
                          <span className="user-name-txt">{acc.name}</span>
                          <span className="user-email-txt">{acc.email}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={`badge-type ${acc.type === 'ĐỐI TÁC' ? 'type-partner' : 'type-user'}`}>
                        {acc.type}
                      </span>
                    </td>
                    <td>
                      <div className="status-cell">
                        <span className={`status-dot ${acc.status === 'Hoạt động' ? 'dot-active' : 'dot-locked'}`}></span>
                        <span className={acc.status === 'Hoạt động' ? 'text-active' : 'text-locked'}>
                          {acc.status}
                        </span>
                      </div>
                    </td>
                    <td className="zinc-text">{acc.date}</td>
                    <td>
                      <button className="btn-detail-link">Xem chi tiết</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>
                    Không có dữ liệu tài khoản
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ContentThongKeNguoiDung;