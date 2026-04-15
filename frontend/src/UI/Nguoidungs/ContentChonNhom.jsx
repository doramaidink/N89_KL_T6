import React from "react";
import { useNavigate } from "react-router-dom";

const fakeGroups = [
  {
    id: 1,
    name: "Hành trình Fansipan 2024",
    desc: "Chinh phục nóc nhà Đông Dương",
    img: "/img/fansipan.jpg",
  },
  {
    id: 2,
    name: "Tà Năng - Phan Dũng",
    desc: "Cung trekking đẹp nhất Việt Nam",
    img: "/img/tanang.jpg",
  },
  {
    id: 3,
    name: "Bạch Mã Expedition",
    desc: "Khám phá rừng nguyên sinh",
    img: "/img/bachma.jpg",
  },
];

const ContentChonNhom = () => {
  const navigate = useNavigate();

  return (
    <div className="group-page">
      <div className="group-container">
        <h1 className="group-title">Chọn nhóm của bạn</h1>

        <div className="group-grid">
          {fakeGroups.map((g) => (
            <div className="group-card" key={g.id}>
              <img src={g.img} alt={g.name} />

              <div className="group-body">
                <h3>{g.name}</h3>
                <p>{g.desc}</p>

                <button
                  className="group-btn"
                  onClick={() => navigate("/thanhtoan")}
                >
                  Chọn nhóm
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ContentChonNhom;