import React, { useMemo } from "react";
import ContentNhom from "../../UI/Nguoidungs/ContentNhom";
import Footer from "../../UI/Nguoidungs/Footer";
import HeaderChat from "../../UI/Nguoidungs/Headers/HeaderChat";


const Nhom = ( ) => {
  const user = useMemo(() => {
    const userData = localStorage.getItem("user");
    return userData ? JSON.parse(userData) : null;
  }, []);
  return (
    <div>
      <HeaderChat user={user} />
      <ContentNhom user={user} />
      <Footer />
    </div>
  );
};

export default Nhom;