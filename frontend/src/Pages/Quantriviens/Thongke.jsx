import React from 'react';
import { useParams } from 'react-router-dom';
import SidebarAdmin from '../../UI/Quantriviens/SidebarAdmin';
import HeaderAdmin from '../../UI/Quantriviens/HeaderAdmin';
import ContentThongKe from '../../UI/Quantriviens/ContentThongKe';

const Thongke = () => {
  const { slug } = useParams();

  return (
    <div className="admin-page-layout">
      <SidebarAdmin />
      <div className="admin-main-view">
        <HeaderAdmin />
        <ContentThongKe slug={slug} />
      </div>
    </div>
  );
};
export default Thongke;