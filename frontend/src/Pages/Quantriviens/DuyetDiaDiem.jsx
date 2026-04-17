import React from 'react';
import SidebarAdmin from '../../UI/Quantriviens/SidebarAdmin';
import HeaderAdmin from '../../UI/Quantriviens/HeaderAdmin';
import ContentDuyetDiaDiem from '../../UI/Quantriviens/ContentDuyetDiaDiem';

const DuyetDiaDiem = () => {
  return (
    <div className="admin-page-layout"> 
      <SidebarAdmin />
      <div className="admin-main-view">
        <HeaderAdmin />
        <ContentDuyetDiaDiem />
      </div>
    </div>
  );
};

export default DuyetDiaDiem;