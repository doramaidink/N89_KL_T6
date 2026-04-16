import React, { useEffect, useState } from "react";
import Footer from "../../UI/Nguoidungs/Footer";
import HeaderTaiKhoanKhamPha from "../../UI/Nguoidungs/Headers/HeaderTaiKhoankhampha";
import ContentDanhgia from "../../UI/Nguoidungs/ContentDanhgia";

const Danhgia = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser =
      JSON.parse(localStorage.getItem("user")) ||
      JSON.parse(localStorage.getItem("authUser")) ||
      JSON.parse(localStorage.getItem("currentUser"));

    if (savedUser) setUser(savedUser);
  }, []);

  return (
    <div>
      <HeaderTaiKhoanKhamPha user={user} />
      <ContentDanhgia user={user} canReview={true} />
      <Footer />
    </div>
  );
};

export default Danhgia;