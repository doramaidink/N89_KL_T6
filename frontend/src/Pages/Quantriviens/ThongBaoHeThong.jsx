import React from 'react';
import SidebarAdmin from '../../UI/Quantriviens/SidebarAdmin';
import HeaderAdmin from '../../UI/Quantriviens/HeaderAdmin';
import ContentThongBaoHeThong from '../../UI/Quantriviens/ContentThongBaoHeThong';

const ThongBaoHeThong = () => {
  return (
    <div className="admin-page-layout"> 
      <SidebarAdmin />
      <div className="admin-main-view">
        <HeaderAdmin />
        <ContentThongBaoHeThong />
      </div>
    </div>
  );
};

export default ThongBaoHeThong;