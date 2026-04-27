import React, { useEffect, useState } from "react";
import Footer from "../../UI/Nguoidungs/Footer";
import HeaderTaikhoan from "../../UI/Nguoidungs/Headers/HeaderTaikhoan";
import ContentBaocao from "../../UI/Nguoidungs/ContentBaocao";

const Baocao = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser =
      JSON.parse(localStorage.getItem("user")) ||
      JSON.parse(localStorage.getItem("authUser")) ||
      JSON.parse(localStorage.getItem("currentUser"));

    if (savedUser) {
      setUser(savedUser);
    }
  }, []);

  return (
    <div>
      <HeaderTaikhoan user={user} />
      <ContentBaocao user={user} />
      <Footer />
    </div>
  );
};

export default Baocao;