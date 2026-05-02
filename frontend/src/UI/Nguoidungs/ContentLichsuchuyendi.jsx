
import React, { useEffect, useState } from "react";
import SidebarTaikhoan from "./SidebarTaikhoan";

const ContentLichsuchuyendi = ({ user }) => {

  const [data, setData] = useState([]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    const userId = user?._id;

    if (!userId) return;

    fetch(`http://localhost:5000/nhom/lichsu/${userId}`)
      .then(res => res.json())
      .then(res => {
        console.log("LICH SU:", res);
        setData(res.data || []);
      });
  }, []);


  return (


    <div className="page-lichsu">

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

      {/* RIGHT CONTENT */}
      <div className="content-lichsu">

        <h2>Lịch sử chuyến đi</h2>
        <p className="sub-lichsu">
          Lưu giữ những kỷ niệm trên hành trình khám phá Việt Nam của bạn.
        </p>

        {/* CARD */}


        {data.map((item) => (
          <div className="card-lichsu" key={item._id}>

            <div className="left-lichsu">
              <div className="img-lichsu"></div>
            </div>

            <div className="center-lichsu">

              <span className="badge-lichsu done-lichsu">
                ĐÃ HOÀN THÀNH
              </span>

              <h3>{item.nhomId?.ten}</h3>

              <div className="meta-lichsu">
                <div className="meta-left-lichsu">
                  <p>
                    📅 Ngày đi: {new Date(item.checkinAt).toLocaleDateString()}
                  </p>
                  <p>
                    📍 Địa điểm: {item.nhomId?.diaDiem?.tenDiaDiem}
                  </p>
                </div>

                <div className="meta-right-lichsu">
                  <p>
                    👤 Hướng dẫn viên: {item.hdvId?.hoTen || "Không có"}
                  </p>
                  <p>⭐ Đánh giá: 5/5</p>
                </div>
              </div>

              <div className="action-lichsu">
                <button className="btn-gray-lichsu">Đã đánh giá</button>
                <button className="btn-dark-lichsu">Xem hóa đơn</button>
              </div>

            </div>

            <div className="right-lichsu">
              <div className="price-lichsu">
                <span>VND</span>
                <strong>3.200.000</strong>
              </div>
            </div>

          </div>
        ))}

      </div>

    </div>
  );
};

export default ContentLichsuchuyendi;