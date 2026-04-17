import React from 'react';
import SidebarAdmin from '../../UI/Quantriviens/SidebarAdmin';
import HeaderAdmin from '../../UI/Quantriviens/HeaderAdmin';
import ContentThongKe from '../../UI/Quantriviens/ContentThongKe';

const Thongke = () => {
  return (
    <div className="admin-page-layout"> 
      <SidebarAdmin />
      <div className="admin-main-view">
        <HeaderAdmin />
        <ContentThongKe />
      </div>
    </div>
  );
};

export default Thongke;