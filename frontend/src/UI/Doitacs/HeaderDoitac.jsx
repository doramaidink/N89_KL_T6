import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Bell, Settings } from "lucide-react";

const HeaderDoitac = () => {
  const navigate = useNavigate();
  const { slug } = useParams();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const resolveImagePath = (path) => {
    if (!path) return "/img/doitac.jpg";
    if (path.startsWith("http://") || path.startsWith("https://")) return path;
    if (path.startsWith("/")) return path;
    return `/${path}`;
  };

  const handleSetting = () => {
    navigate(`/doitac/${slug}/hoso`);
  };

  return (
    <div className="header-doitac">
      <div className="header-doitac-left">
        <h3 className="brand-doitac">BACKPACKING VIETNAM</h3>
      </div>

      <div className="header-doitac-right">
        <button className="doitac-icon-header" type="button">
          <Bell size={22} />
        </button>

        <button className="doitac-icon-header" type="button" onClick={handleSetting}>
          <Settings size={22} />
        </button>

        <div className="doitac-profile">
          <img
            src={resolveImagePath(user.image)}
            className="avatar-doitac"
            alt="Avatar"
            onError={(e) => {
              e.currentTarget.src = "/img/doitac.jpg";
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default HeaderDoitac;