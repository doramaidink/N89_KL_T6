import React from "react";
import ContentNhom from "../../UI/Nguoidungs/ContentNhom";
import Footer from "../../UI/Nguoidungs/Footer";
import HeaderTaikhoan from "../../UI/Nguoidungs/Headers/HeaderTaikhoan";

const Nhom = () => {
  return (
    <div>
      <HeaderTaikhoan />
      <ContentNhom />
      <Footer/>
    </div>
  );
};

export default Nhom;