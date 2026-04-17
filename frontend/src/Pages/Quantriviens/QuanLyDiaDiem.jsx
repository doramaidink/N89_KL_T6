import React from 'react';
import SidebarAdmin from '../../UI/Quantriviens/SidebarAdmin';
import HeaderAdmin from '../../UI/Quantriviens/HeaderAdmin';
import ContentQuanLyDiaDiem from '../../UI/Quantriviens/ContentQuanLyDiaDiem';

const QuanLyDiaDiem = () => {
  return (
    <div className="admin-page-layout"> 
      <SidebarAdmin />
      <div className="admin-main-view">
        <HeaderAdmin />
        <ContentQuanLyDiaDiem />
      </div>
    </div>
  );
};

export default QuanLyDiaDiem;