import React from 'react';
import SidebarAdmin from '../../UI/Quantriviens/SidebarAdmin';
import HeaderAdmin from '../../UI/Quantriviens/HeaderAdmin';
import ContentThongKeNguoiDung from '../../UI/Quantriviens/ContentThongKeNguoiDung';

const ThongKeNguoiDung = () => {
  return (
    <div className="admin-page-layout"> 
      <SidebarAdmin />
      <div className="admin-main-view">
        <HeaderAdmin />
        <ContentThongKeNguoiDung />
      </div>
    </div>
  );
};

export default ThongKeNguoiDung;