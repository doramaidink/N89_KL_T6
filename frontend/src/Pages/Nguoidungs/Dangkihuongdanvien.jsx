import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import Footer from '../../UI/Nguoidungs/Footer'
import ContentDkHdv from '../../UI/Nguoidungs/ContentDkHdv'
import HeaderTaikhoan from '../../UI/Nguoidungs/Headers/HeaderTaikhoan';

 const Dangkihuongdanvien = () => {
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
        <HeaderTaikhoan user={user}/>
        <ContentDkHdv user={user}  />
        <Footer/>
    </div>
  )
}
export default Dangkihuongdanvien;
