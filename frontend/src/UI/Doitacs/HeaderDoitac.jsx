import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Bell, Settings } from "lucide-react";

const HeaderDoitac = () => {
  const navigate = useNavigate();
  const { slug } = useParams();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".noti-wrapper")) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);
  useEffect(() => {
    fetch("http://localhost:5000/thongbao?type=doitac")
      .then(res => res.json())
      .then(data => {
        console.log("DOITAC NOTI:", data);
        setNotifications(data);
      });
  }, []);


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
        <div className="noti-wrapper">
          <button
            className="doitac-icon-header"
            type="button"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            <Bell size={22} />
            {notifications.length > 0 && (
              <span className="noti-badge">
                {notifications.length}
              </span>
            )}

          </button>
          {showDropdown && (
            <div className="noti-dropdown">
              {notifications.length === 0 ? (
                <p>Không có thông báo</p>
              ) : (
                notifications.map((item) => (
                  <div key={item._id} className="noti-item">

                    <div className="noti-row">

                      {/* ICON */}
                      <div className={`noti-icon ${item.loaiThongBao}`}>
                        🔔
                      </div>

                      {/* CONTENT */}
                      <div className="noti-content">
                        <strong>{item.tieuDe}</strong>
                        <p>{item.noiDung}</p>

                        {/* TAG */}
                        <span className={`noti-tag ${item.loaiThongBao}`}>
                          {item.loaiThongBao === "khuyen_mai" && "Khuyến mãi"}
                          {item.loaiThongBao === "he_thong" && "Hệ thống"}
                          {item.loaiThongBao === "canh_bao" && "Cảnh báo"}
                        </span>

                        <small>
                          {new Date(item.createdAt).toLocaleString()}
                        </small>
                      </div>

                    </div>

                  </div>
                ))
              )}
            </div>
          )}
        </div>
        {/*
        <button className="doitac-icon-header" type="button" onClick={handleSetting}>
          <Settings size={22} />
        </button>
        */}
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
