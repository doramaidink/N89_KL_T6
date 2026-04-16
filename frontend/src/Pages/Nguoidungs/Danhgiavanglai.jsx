import React from "react";
import Footer from "../../UI/Nguoidungs/Footer";
import HeaderKhamPha from "../../UI/Nguoidungs/Headers/HeaderKhamPha";
import ContentDanhgia from "../../UI/Nguoidungs/ContentDanhgia";

const DanhgiaKhach = () => {
  return (
    <div>
      <HeaderKhamPha />
      <ContentDanhgia user={null} canReview={false} />
      <Footer />
    </div>
  );
};

export default DanhgiaKhach;