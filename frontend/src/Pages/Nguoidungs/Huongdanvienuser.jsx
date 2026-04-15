import React, { useEffect, useState } from 'react';
import Header from '../../UI/Nguoidungs/Headers/HeaderTaiKhoanHuongDanVien';
import Footer from '../../UI/Nguoidungs/Footer';
import ContentHuongdanvien from '../../UI/Nguoidungs/ContentHuongdanvien';

const Huongdanvienuser = () => {
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
      <Header user={user} />
      <ContentHuongdanvien user={user} />
      <Footer />
    </div>
  );
};

export default Huongdanvienuser;