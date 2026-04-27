import React, { useEffect, useState } from "react";
import Footer from '../../UI/Nguoidungs/Footer'
import ContentThongbao from '../../UI/Nguoidungs/ContentThongbao'
import HeaderTaikhoan from '../../UI/Nguoidungs/Headers/HeaderTaikhoan'

const Thongbao = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("user"));
    if (savedUser) setUser(savedUser);
  }, []);

  return (
    <div>
      <HeaderTaikhoan user={user} />
      <ContentThongbao user={user} />
      <Footer />
    </div>
  )
}
export default Thongbao;
