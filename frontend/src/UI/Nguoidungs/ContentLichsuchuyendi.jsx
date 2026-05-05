
import React, { useEffect, useState } from "react";
import SidebarTaikhoan from "./SidebarTaikhoan";
import { useNavigate } from "react-router-dom";

const ContentLichsuchuyendi = ({ user }) => {

  const [data, setData] = useState([]);
  //chuyển đánh giá
  const navigate = useNavigate();

  const [showAll, setShowAll] = useState(false);

  const sortedData = [...data].sort(
    (a, b) => new Date(b.checkinAt) - new Date(a.checkinAt)
  );

  const displayData = showAll ? sortedData : sortedData.slice(0, 3);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));

    console.log("USER LOCAL:", userData);

    const userId = userData?._id || userData?.id;

    if (!userId) {
      console.log("❌ KHÔNG CÓ USER ID");
      return;
    }

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

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>

          <div>
            <h2>Lịch sử chuyến đi</h2>
            <p className="sub-lichsu">
              Lưu giữ những kỷ niệm trên hành trình khám phá Việt Nam của bạn.
            </p>
          </div>

          {data.length > 3 && (
            <button
              onClick={() => setShowAll(!showAll)}
              style={{
                border: "1px solid #00d084",
                background: "transparent",
                color: "#00d084",
                padding: "6px 12px",
                borderRadius: "8px",
                cursor: "pointer"
              }}
            >
              {showAll ? "Thu gọn" : "Xem tất cả"}
            </button>
          )}

        </div>

        {/* CARD */}


        {displayData.map((item) => {
          console.log("IMG RAW:", item.nhomId?.diaDiem?.image);

          const img = item.nhomId?.diaDiem?.image;

          // Fix URL ảnh (5000 -> 5173 nếu cần)
          const imageUrl = img
            ? img.includes("localhost:5000")
              ? img.replace("localhost:5000", "localhost:5173")
              : img
            : "/img/default.jpg";

          return (
            <div className="card-lichsu" key={item._id}>

              {/* LEFT - IMAGE */}
              <div className="left-lichsu">
                <img
                  src={imageUrl}
                  alt={item.nhomId?.ten}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/img/default.jpg";
                  }}
                />
              </div>

              {/* CENTER */}
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
                  <button
                    className="btn-green-lichsu"
                    onClick={() =>
                      navigate(`/chitietdiadiem/${item.nhomId?.diaDiem?.slug}/danhgia`)
                    }
                  >
                    Đánh giá
                  </button>
                  <button className="btn-dark-lichsu">Xem hóa đơn</button>
                </div>

              </div>

              {/* RIGHT - PRICE */}
              <div className="right-lichsu">
                <div className="price-lichsu">
                  <span>VND</span>
                  <strong>
                    {item.amount
                      ? item.amount.toLocaleString("vi-VN")
                      : "0"}
                  </strong>
                </div>
              </div>

            </div>
          );
        })}

      </div>

    </div>
  );
};

export default ContentLichsuchuyendi;