import React, { useEffect, useState } from 'react';
import HeaderTaikhoan from '../../UI/Nguoidungs/Headers/HeaderTaikhoan';
import Footer from '../../UI/Nguoidungs/Footer';
import ContentThongtinTK from '../../UI/Nguoidungs/ContentThongtinTK';

const Thongtintaikhoan = () => {
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
      <ContentThongtinTK user={user} setUser={setUser} />
      <Footer />
    </div>
  );
};

export default Thongtintaikhoan;