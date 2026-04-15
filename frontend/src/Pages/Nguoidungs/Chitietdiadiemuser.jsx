import React, { useEffect, useState } from 'react';
import Footer from '../../UI/Nguoidungs/Footer'
import Headerkhampha from '../../UI/Nguoidungs/Headers/HeaderTaiKhoankhampha'
import ContentChitietdiadiem from '../../UI/Nguoidungs/ContentChitietdiadiem'

 const Chitietdiadiem = () => {
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
        <Headerkhampha user={user}/>
        <ContentChitietdiadiem user={user}/>
        <Footer/>
    </div>
  )
}
export default Chitietdiadiem;
