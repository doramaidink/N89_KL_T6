import React from "react";
import { useNavigate } from "react-router-dom";

const HeaderThanhToan = () => {
  const navigate = useNavigate();

  return (
    <div className="header-login">
      <div className="logo-headerlogin">
        <img className="imglogo-headerlogin" src="/img/logo.jpeg" alt="logo" />
        <h1>Backpacking VietNam</h1>
      </div>

      <div className="header-right">
        <button onClick={() => navigate(-1)} className="btn-home-headerlogin">
          <img className="img-dangky-headerlogin" src="/img/back.png" alt="" />
          Back
        </button>
      </div>
    </div>
  );
};

export default HeaderThanhToan;