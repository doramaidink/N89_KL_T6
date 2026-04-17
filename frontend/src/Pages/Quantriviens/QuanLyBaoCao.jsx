import React from 'react';
import SidebarAdmin from '../../UI/Quantriviens/SidebarAdmin';
import HeaderAdmin from '../../UI/Quantriviens/HeaderAdmin';
import ContentQuanLyBaoCao from '../../UI/Quantriviens/ContentQuanLyBaoCao';

const QuanLyBaoCao = () => {
  return (
    <div className="admin-page-layout"> 
      <SidebarAdmin />
      <div className="admin-main-view">
        <HeaderAdmin />
        <ContentQuanLyBaoCao />
      </div>
    </div>
  );
};

export default QuanLyBaoCao;