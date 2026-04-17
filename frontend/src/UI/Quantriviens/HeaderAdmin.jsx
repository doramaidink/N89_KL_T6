import React from 'react';

const HeaderAdmin = () => {
  return (
    <header className="admin-header">
      <div className="header-left">
        <h2 className="header-title">Backpacking Việt Nam</h2>
      </div>
      
      <div className="header-right">
        <div className="admin-info">
          <span className="admin-name">Admin</span>
          <span className="admin-role">Superuser</span>
        </div>
        <div className="admin-avatar-circle">
          AD
        </div>
      </div>
    </header>
  );
};

export default HeaderAdmin;