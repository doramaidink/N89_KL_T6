import React from 'react';

const HeaderAdmin = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  // Lấy tên hiển thị
  const name = user.hoTen || 'Admin';

  // Lấy chữ viết tắt avatar
  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="admin-header">
      <div className="header-left">
        <h2 className="header-title">Backpacking Việt Nam</h2>
      </div>

      <div className="header-right">
        <div className="admin-info">
          <span className="admin-name">{name}</span>
          <span className="admin-role">
            {user.vaiTro === 'quanTriVien' ? 'Admin' : 'User'}
          </span>
        </div>

        <div className="admin-avatar-circle">
          {getInitials(name)}
        </div>
      </div>
    </header>
  );
};

export default HeaderAdmin; 