import React from "react";
import { useNavigate } from "react-router-dom";
import { Bell, Settings } from "lucide-react";

const HeaderDoitac = () => {
    const navigate = useNavigate();
    const handleSetting = () => {
        navigate('/bangdieukhien');
    };
    return (
    <div className="header-doitac">
        <div className="header-doitac-left">
            <h3 className="brand-doitac">BACKPACKING VIETNAM</h3>            
        </div>
      
        <div className="header-doitac-right">
            <button className="doitac-icon-header">
                <Bell size={22} />
            </button>
            <button className="doitac-icon-header" onClick={handleSetting}>
                <Settings size={22} />
            </button>
            <div className="doitac-profile">           
                <img
                    src="/img/doitac.jpg"
                    className="avatar-doitac"
                    alt="Avatar"
                />
            </div>
        </div>
    </div>
  );
};

export default HeaderDoitac;