import React from "react";
import { useNavigate } from "react-router-dom";

const HeaderLogin = () => {
  const navigate = useNavigate();
  return (
    <div className="header-login">
      <div className="logo-headerlogin"><img className="imglogo-headerlogin" src="/img/logo.jpeg" alt="notfound" /> <h1>Backpacking VietNam </h1></div>

      <div className="header-right">
        <button  onClick={() => navigate("/")} className="btn-home-headerlogin"><img className="img-dangky-headerlogin" src="/img/home.png" alt="" /> TRANG CHỦ</button>
      </div>
    </div>
  );
};

export default HeaderLogin;