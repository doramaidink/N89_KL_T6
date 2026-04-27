import React, { useEffect, useState } from "react";

import SidebarTaikhoan from "./SidebarTaikhoan";

const ContentThongbao = ({ user }) => {


  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/thongbao?type=user")
      .then(res => res.json())
      .then(data => {
        console.log("NOTI:", data);
        setNotifications(data);
      });
  }, []);

  return (
    <div className="container-thongbao">
      <SidebarTaikhoan
        thongTin={user}
        handleDangXuat={() => {
          localStorage.removeItem("user");
          window.location.href = "/login";
        }}
        getImageSrc={(img) =>
          img ? `http://localhost:5000/${img}` : "/img/default.jpg"
        }
      />



      {/* CONTENT */}
      <div className="content-thongbao">

        <div className="card-thongbao">

          <div className="header-thongbao">
            <h3>🔔 Thư hệ thống</h3>
            <span>Xem tất cả</span>
          </div>

          {notifications.map(item => (
            <div className="item-noti-thongbao" key={item._id}>

              <div className="icon-thongbao green-thongbao">🔔</div>

              <div className="body-thongbao">
                <h4>{item.tieuDe}</h4>
                <p>{item.noiDung}</p>
                <span className="tag-thongbao">
                  {item.loaiThongBao === "khuyen_mai" && "Khuyến mãi"}
                  {item.loaiThongBao === "he_thong" && "Hệ thống"}
                  {item.loaiThongBao === "canh_bao" && "Cảnh báo"}
                </span>
              </div>

              <div className="time-thongbao">
                {new Date(item.createdAt).toLocaleString()}
              </div>

            </div>
          ))}

          <div className="more-thongbao">
            Xem các thông báo cũ hơn
          </div>

        </div>

      </div>

    </div>
  );
};

export default ContentThongbao;