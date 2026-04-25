import React from 'react'
import Footer from '../../UI/Nguoidungs/Footer'
import ContentNhomchat from '../../UI/Nguoidungs/ContentNhomchat'
import HeaderChat from '../../UI/Nguoidungs/Headers/HeaderChat'
import HeaderDoitacChat from "../../UI/Doitacs/HeaderDoitacChat";

const Nhomchat = ({ user }) => {
  const isDoiTac = user?.vaiTro === "doiTac";
  return (
    <div>
      {isDoiTac ? (
        <HeaderDoitacChat user={user} />
      ) : (
        <HeaderChat user={user} />
      )}

      <ContentNhomchat user={user} />
      <Footer />
    </div>
  )
}
export default Nhomchat;
