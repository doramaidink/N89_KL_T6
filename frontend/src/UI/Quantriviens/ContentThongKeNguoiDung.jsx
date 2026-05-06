import React, { useEffect, useMemo, useState } from 'react';
import { NavLink, useParams } from 'react-router-dom';
import {
  Search,
  Plus,
  Users,
  Handshake,
  X,
  Mail,
  Phone,
  Calendar,
  Shield,
  UserRound,
  AlertTriangle,
  FileCheck,
  Clock,
} from 'lucide-react';

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

  if (image.startsWith('/img')) {
    return `${API_URL}${image}`;
  }

  if (image.startsWith('img')) {
    return `${API_URL}/${image}`;
  }

  const clean = image.startsWith('/') ? image.slice(1) : image;

  return `${API_URL}/${clean}`;
};

const formatDate = (date) => {
  if (!date) return 'Chưa cập nhật';

  return new Date(date).toLocaleDateString('vi-VN');
};

const formatDateTime = (date) => {
  if (!date) return 'Chưa cập nhật';

  return new Date(date).toLocaleString('vi-VN');
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

  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const fetchThongKeNguoiDung = async () => {
      try {
        setLoading(true);

        const res = await fetch(
          `http://localhost:5000/quantrivien/${slug}/thongkenguoidung`
        );

        const result = await res.json();

        if (!res.ok) {
          throw new Error(result.message || 'Không tải được dữ liệu');
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

    return Math.max(
      ...data.chartData.map(item => item.value || 0),
      1
    );
  }, [data.chartData]);

  const openDetail = (user) => {
    setSelectedUser(user);
    setDetailOpen(true);
  };

  const closeDetail = () => {
    setSelectedUser(null);
    setDetailOpen(false);
  };

  if (loading) {
    return (
      <div className="user-stats-container">
        Đang tải dữ liệu...
      </div>
    );
  }

  return (
    <div className="user-stats-container">
      <div className="user-overview-grid">
        <div className="chart-main-card">
          <div className="chart-header-inline">
            <div className="title-group">
              <h3>Thống kê</h3>

              <p className="sub-text">
                Số lượng tài khoản mới đăng ký qua các tháng
              </p>
            </div>

            <div className="legend-item">
              <span className="dot-legend"></span>
              <span>Người dùng mới</span>
            </div>
          </div>

          <div className="user-bar-chart">
            {data.chartData.map((item, idx) => {
              const percent = `${Math.max(
                ((item.value || 0) / maxChartValue) * 100,
                8
              )}%`;

              return (
                <div key={idx} className="user-bar-group">
                  <div className="bar-track">
                    <div
                      className={`user-bar ${
                        item.active ? 'active-bar' : ''
                      }`}
                      style={{ height: percent }}
                    ></div>
                  </div>

                  <span className="bar-month">{item.m}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="side-stats-column">
          <div className="small-stat-card">
            <div className="card-top">
              <span className="card-label">
                TỔNG NGƯỜI DÙNG
              </span>

              <Users size={18} className="text-emerald" />
            </div>

            <div className="card-body">
              <h2 className="main-number">
                {data.tongNguoiDung.toLocaleString('vi-VN')}
              </h2>

              <p className="trend-text">
                {data.phanTramTangNguoiDung}{' '}
                <span className="zinc-text">
                  so với tháng trước
                </span>
              </p>
            </div>
          </div>

          <div className="small-stat-card">
            <div className="card-top">
              <span className="card-label">
                ĐỐI TÁC ĐANG HOẠT ĐỘNG
              </span>

              <Handshake size={18} className="text-emerald" />
            </div>

            <div className="card-body">
              <h2 className="main-number">
                {data.tongDoiTacHoatDong.toLocaleString('vi-VN')}
              </h2>

              <p className="trend-text">
                ⓘ Đang cung cấp{' '}
                {data.tongDichVuDangCungCap.toLocaleString('vi-VN')}{' '}
                dịch vụ
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="account-list-section">
        <div className="list-header">
          <h3>Danh sách tài khoản</h3>

          <div className="header-actions">
            <div className="tab-buttons">
              <button
                className={`tab-btn ${
                  activeTab === 'tatca' ? 'active' : ''
                }`}
                onClick={() => setActiveTab('tatca')}
              >
                Tất cả
              </button>

              <button
                className={`tab-btn ${
                  activeTab === 'nguoidung' ? 'active' : ''
                }`}
                onClick={() => setActiveTab('nguoidung')}
              >
                Người dùng
              </button>

              <button
                className={`tab-btn ${
                  activeTab === 'doitac' ? 'active' : ''
                }`}
                onClick={() => setActiveTab('doitac')}
              >
                Đối tác
              </button>
            </div>

            <NavLink to="/dangki">
              <button className="btn-create-acc">
                <Plus size={15} />
                Tạo tài khoản
              </button>
            </NavLink>
          </div>
        </div>

        <div className="search-bar-wrapper">
          <Search size={18} className="search-icon-inner" />

          <input
            type="text"
            placeholder="Tìm kiếm tài khoản..."
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
                    <td className="zinc-text">
                      {acc.id}
                    </td>

                    <td>
                      <div className="user-info-cell">
                        {acc.image ? (
                          <img
                            src={getImageUrl(acc.image)}
                            alt={acc.name}
                            className="user-avatar-image"
                          />
                        ) : (
                          <div
                            className={`avatar-box ${
                              acc.type === 'ĐỐI TÁC'
                                ? 'bg-partner'
                                : 'bg-user'
                            }`}
                          >
                            {acc.avatar || getInitials(acc.name)}
                          </div>
                        )}

                        <div className="name-email">
                          <span className="user-name-txt">
                            {acc.name}
                          </span>

                          <span className="user-email-txt">
                            {acc.email}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td>
                      <span
                        className={`badge-type ${
                          acc.type === 'ĐỐI TÁC'
                            ? 'type-partner'
                            : 'type-user'
                        }`}
                      >
                        {acc.type}
                      </span>
                    </td>

                    <td>
                      <div className="status-cell">
                        <span
                          className={`status-dot ${
                            acc.status === 'Hoạt động'
                              ? 'dot-active'
                              : 'dot-locked'
                          }`}
                        ></span>

                        <span
                          className={
                            acc.status === 'Hoạt động'
                              ? 'text-active'
                              : 'text-locked'
                          }
                        >
                          {acc.status}
                        </span>
                      </div>
                    </td>

                    <td className="zinc-text">
                      {acc.date}
                    </td>

                    <td>
                      <button
                        className="btn-detail-link"
                        onClick={() => openDetail(acc)}
                      >
                        Xem chi tiết
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    style={{
                      textAlign: 'center',
                      padding: '20px',
                    }}
                  >
                    Không có dữ liệu tài khoản
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <UserDetailModal
        open={detailOpen}
        data={selectedUser}
        onClose={closeDetail}
      />
    </div>
  );
};

const UserDetailModal = ({ open, data, onClose }) => {
  if (!open || !data) return null;

  const avatarUrl = getImageUrl(data.image);

  return (
    <div
      className="user-detail-overlay"
      onClick={onClose}
    >
      <div
        className="user-detail-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="user-detail-close"
          onClick={onClose}
        >
          <X size={22} />
        </button>

        <div className="user-detail-header">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={data.hoTen || data.name}
              className="user-detail-avatar-img"
            />
          ) : (
            <div className="user-detail-avatar">
              {data.avatar ||
                getInitials(data.hoTen || data.name)}
            </div>
          )}

          <div>
            <h2>{data.hoTen || data.name}</h2>

            <p>{data.email}</p>

            <div className="user-detail-badges">
              <span
                className={`user-role-badge ${data.vaiTro}`}
              >
                {data.type}
              </span>

              <span
                className={
                  data.status === 'Hoạt động'
                    ? 'user-status-active'
                    : 'user-status-locked'
                }
              >
                {data.status}
              </span>
            </div>
          </div>
        </div>

        <div className="user-detail-grid">
          <DetailItem
            icon={<UserRound size={18} />}
            label="Họ tên"
            value={data.hoTen || data.name}
          />

          <DetailItem
            icon={<Mail size={18} />}
            label="Email"
            value={data.email}
          />

          <DetailItem
            icon={<Phone size={18} />}
            label="Số điện thoại"
            value={data.soDienThoai}
          />

          <DetailItem
            icon={<Calendar size={18} />}
            label="Ngày sinh"
            value={formatDate(data.ngaysinh)}
          />

          <DetailItem
            icon={<Shield size={18} />}
            label="Vai trò"
            value={data.vaiTro}
          />

          <DetailItem
            icon={<Shield size={18} />}
            label="Trạng thái"
            value={data.trangThai}
          />

          <DetailItem
            icon={<FileCheck size={18} />}
            label="Đồng ý điều khoản"
            value={
              data.daDongYDieuKhoan
                ? 'Đã đồng ý'
                : 'Chưa đồng ý'
            }
          />

          <DetailItem
            icon={<Clock size={18} />}
            label="Ngày tham gia"
            value={formatDateTime(data.createdAt)}
          />

          <DetailItem
            icon={<FileCheck size={18} />}
            label="Phiên bản điều khoản"
            value={data.phienBanDieuKhoan}
          />

          <DetailItem
            icon={<Clock size={18} />}
            label="Thời điểm đồng ý"
            value={formatDateTime(
              data.thoiDiemDongYDieuKhoan
            )}
          />

          <DetailItem
            icon={<AlertTriangle size={18} />}
            label="Số lần vi phạm"
            value={String(data.soLanViPham || 0)}
          />

          <DetailItem
            icon={<AlertTriangle size={18} />}
            label="Lý do khóa"
            value={data.lyDoKhoa || 'Không có'}
          />
        </div>

        <div className="user-detail-section">
          <h3>Danh sách vi phạm</h3>

          {Array.isArray(data.danhSachViPham) &&
          data.danhSachViPham.length > 0 ? (
            <div className="user-violation-list">
              {data.danhSachViPham.map(
                (item, index) => (
                  <div
                    className="user-violation-card"
                    key={index}
                  >
                    <div>
                      <strong>
                        {item.loai ||
                          'Không rõ loại'}
                      </strong>

                      <span>
                        {item.mucDo || 'nhe'}
                      </span>
                    </div>

                    <p>
                      {item.noiDung ||
                        'Không có nội dung'}
                    </p>

                    <small>
                      {formatDateTime(item.thoiGian)}
                    </small>
                  </div>
                )
              )}
            </div>
          ) : (
            <p className="user-no-violation">
              Người dùng chưa có vi phạm nào
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

const DetailItem = ({ icon, label, value }) => (
  <div className="user-detail-item">
    {icon}

    <div>
      <span>{label}</span>
      <strong>{value || 'Chưa cập nhật'}</strong>
    </div>
  </div>
);

export default ContentThongKeNguoiDung;