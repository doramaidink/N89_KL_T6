import React, { useEffect, useState } from "react";
import Footer from '../../UI/Nguoidungs/Footer'
import HeaderTaikhoan from '../../UI/Nguoidungs/Headers/HeaderTaikhoan'
import ContentLichsuchuyendi from '../../UI/Nguoidungs/ContentLichsuchuyendi'

 const Lichsuchuyendi = () => {
  const [user, setUser] = useState(null);
  
    useEffect(() => {
      const savedUser = JSON.parse(localStorage.getItem("user"));
      if (savedUser) setUser(savedUser);
    }, []);
  return (
    <div>
        <HeaderTaikhoan user={user}/>
        <ContentLichsuchuyendi user={user}/>
        <Footer/>
    </div>
  )
}
export default Lichsuchuyendi;
