import React, { useEffect, useState } from "react";
import Footer from "../../UI/Nguoidungs/Footer";
import ContentHoadon from "../../UI/Nguoidungs/ContentHoadon";
import HeaderTaikhoan from "../../UI/Nguoidungs/Headers/HeaderTaikhoan";

const Hoadon = () => {
    const [user, setUser] = useState(null);
  
    useEffect(() => {
      const savedUser = JSON.parse(localStorage.getItem("user"));
      if (savedUser) {
        setUser(savedUser);
      }
    }, []);

  return (
    <div>
      <HeaderTaikhoan user={user} />
      <ContentHoadon user={user} setUser={setUser}  />
      <Footer />
    </div>
  );
};

export default Hoadon;