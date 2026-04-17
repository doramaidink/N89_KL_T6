import React from 'react';
import SidebarAdmin from '../../UI/Quantriviens/SidebarAdmin';
import HeaderAdmin from '../../UI/Quantriviens/HeaderAdmin';
import ContentDonDangKy from '../../UI/Quantriviens/ContentDonDangKy';

const DonDangKy = () => {
  return (
    <div className="admin-page-layout"> 
      <SidebarAdmin />
      <div className="admin-main-view">
        <HeaderAdmin />
        <ContentDonDangKy />
      </div>
    </div>
  );
};

export default DonDangKy;