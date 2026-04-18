import React, { useEffect, useMemo, useState } from 'react';

const formatMoney = (value = 0) => {
  return Number(value || 0).toLocaleString('vi-VN') + 'đ';
};

const formatCompactMoney = (value = 0) => {
  const num = Number(value || 0);

  if (num >= 1_000_000_000) {
    return (num / 1_000_000_000).toFixed(2).replace(/\.00$/, '') + 'B';
  }

  if (num >= 1_000_000) {
    return (num / 1_000_000).toFixed(2).replace(/\.00$/, '') + 'M';
  }

  if (num >= 1_000) {
    return (num / 1_000).toFixed(2).replace(/\.00$/, '') + 'K';
  }

  return String(num);
};

const getInitials = (name = '') => {
  return name
    .trim()
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(item => item[0]?.toUpperCase())
    .join('');
};

const ContentThongKe = ({ slug }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState('');

  useEffect(() => {
    const fetchThongKe = async () => {
      try {
        setLoading(true);
        const res = await fetch(`http://localhost:5000/quantrivien/${slug}/thongke`);
        const result = await res.json();

        if (!res.ok) {
          throw new Error(result.message || 'Lỗi tải thống kê');
        }

        setData(result);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchThongKe();
    }
  }, [slug]);

  const maxRevenue = useMemo(() => {
    if (!data?.doanhThu7Ngay?.length) return 1;
    return Math.max(...data.doanhThu7Ngay.map(item => Number(item.doanhThu || 0)), 1);
  }, [data]);

  const filteredTransactions = useMemo(() => {
    if (!data?.giaoDichGanDay) return [];

    const key = keyword.trim().toLowerCase();
    if (!key) return data.giaoDichGanDay;

    return data.giaoDichGanDay.filter((item) => {
      const customer = (item.khachHang || '').toLowerCase();
      const service = (item.dichVu || '').toLowerCase();
      const status = (item.trangThai || '').toLowerCase();
      return customer.includes(key) || service.includes(key) || status.includes(key);
    });
  }, [data, keyword]);

  if (loading) {
    return <div className="content-container">Đang tải thống kê...</div>;
  }

  if (!data) {
    return <div className="content-container">Không có dữ liệu thống kê</div>;
  }

  return (
    <div className="content-container">
      {/* 1. TOP CARDS */}
      <div className="stats-grid">
        <div className="stat-card">
          <p className="stat-label">TỔNG NGƯỜI DÙNG</p>
          <div className="stat-value-group">
            <h2 className="stat-number">{data.cards?.tongNguoiDung || 0}</h2>
            <span className="stat-percent">
              {data.cards?.phanTramTangNguoiDung || '+0%'}
            </span>
          </div>
          <div className="stat-progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${data.cards?.tienDoNguoiDung || 0}%` }}
            ></div>
          </div>
        </div>

        <div className="stat-card">
          <p className="stat-label">ĐỐI TÁC HOẠT ĐỘNG</p>
          <div className="stat-value-group">
            <h2 className="stat-number">{data.cards?.tongDoiTac || 0}</h2>
            <span className="stat-percent">
              {data.cards?.phanTramTangDoiTac || '+0%'}
            </span>
          </div>
          <p className="stat-subtext">
            +{data.cards?.doiTacMoiTrongTuan || 0} đối tác mới trong tuần
          </p>
        </div>

        <div className="stat-card">
          <p className="stat-label">TỔNG SỐ TÀI KHOẢN ĐÃ KHÓA</p>
          <div className="stat-value-group">
            <h2 className="stat-number">{data.cards?.tongTaiKhoanDaKhoa || 0}</h2>
            <span style={{ fontSize: '18px' }}></span>
          </div>
          <p className="stat-subtext text-red">Vi phạm chính sách cộng đồng</p>
        </div>

        <div className="stat-card">
          <p className="stat-label">TỔNG ĐỐI TÁC DỪNG HỢP TÁC</p>
          <div className="stat-value-group">
            <h2 className="stat-number">{data.cards?.tongDoiTacDungHopTac || 0}</h2>
          </div>
          <p className="stat-subtext">Kể từ đầu năm {new Date().getFullYear()}</p>
        </div>
      </div>

      {/* 2. REVENUE CHART SECTION */}
      <div className="chart-section">
        <div className="chart-header">
          <div className="chart-title-area">
            <h3>Thống kê doanh thu</h3>
            <p className="sub-text">Hiệu suất 7 ngày vừa qua</p>
          </div>

          <div className="chart-actions">
            <div className="revenue-badge">
              <span className="rev-amount">
                {formatCompactMoney(data.tongDoanhThuThang || 0)}
              </span>
              <span className="rev-label">TỔNG THÁNG</span>
            </div>
          </div>
        </div>

        <div className="bar-chart-container">
          <div className="bar-chart-placeholder">
            {(data.doanhThu7Ngay || []).map((item, idx) => {
              const percent = `${Math.max((Number(item.doanhThu || 0) / maxRevenue) * 100, 10)}%`;

              return (
                <div key={idx} className="bar-group" title={`${item.ngay}: ${formatMoney(item.doanhThu)}`}>
                  <div
                    className="bar"
                    style={{
                      height: percent,
                      backgroundColor: item.active ? '#22c55e' : '#276749'
                    }}
                  ></div>
                  <span className="bar-day">{item.thu || item.ngay}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3. BOTTOM SECTION */}
      <div className="bottom-grid">
        {/* Giao dịch gần đây */}
        <div className="transactions-table">
          <div className="table-header">
            <h3>Giao dịch gần đây</h3>
            <button className="link-text-green">Xem tất cả</button>
          </div>

          <div className="search-box-container">
            <div className="search-icon">⌕</div>
            <input
              type="text"
              placeholder="Tìm kiếm dữ liệu..."
              className="table-search"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
          </div>

          <table className="custom-table">
            <thead>
              <tr>
                <th>KHÁCH HÀNG</th>
                <th>DỊCH VỤ</th>
                <th>NGÀY</th>
                <th>SỐ TIỀN</th>
                <th>TRẠNG THÁI</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((item, index) => (
                  <tr key={item._id || index}>
                    <td>
                      <div className="user-cell">
                        <div className="avatar-small bg-green-dark text-green-light">
                          {getInitials(item.khachHang || 'KH')}
                        </div>
                        <span>{item.khachHang || 'Không rõ'}</span>
                      </div>
                    </td>
                    <td>{item.dichVu || '---'}</td>
                    <td>{item.ngay || '---'}</td>
                    <td className="amount-text">{formatMoney(item.soTien || 0)}</td>
                    <td>
                      <div className="status-cell">
                        <span className="dot-success"></span>
                        <span className="status-text-green">
                          {item.trangThai || 'THÀNH CÔNG'}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>
                    Không có giao dịch nào
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Đối tác mới */}
        <div className="partners-list">
          <div className="table-header">
            <h3 className="section-title">Đối tác mới</h3>
          </div>

          <div className="partner-items-container">
            {(data.doiTacMoi || []).length > 0 ? (
              data.doiTacMoi.map((p, index) => (
                <div key={p._id || index} className="partner-item">
                  <div className="partner-info">
                    <div className="partner-logo">
                      <img
                        src={p.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(p.hoTen || 'DT')}&background=064e3b&color=fff`}
                        alt={p.hoTen}
                      />
                    </div>
                    <span className="partner-name">{p.hoTen}</span>
                  </div>

                  <button className="btn-action-circle">➜</button>
                </div>
              ))
            ) : (
              <p>Chưa có đối tác mới</p>
            )}
          </div>

          <button className="btn-full-width">
            XEM TẤT CẢ ĐỐI TÁC ({data.cards?.tongDoiTac || 0})
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContentThongKe;