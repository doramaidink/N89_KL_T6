import React from 'react'
import Footer from '../../UI/Nguoidungs/Footer' 
import ContentNhomchat from '../../UI/Nguoidungs/ContentNhomchat'
import HeaderChat from '../../UI/Nguoidungs/Headers/HeaderChat'

 const Nhomchat = ({ user }) => {
  return (
    <div>
        <HeaderChat user={user}/>
        <ContentNhomchat user={user}/>
        <Footer/>
    </div>
  )
}
export default Nhomchat;
