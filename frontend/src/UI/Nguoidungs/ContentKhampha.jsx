import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ContentKhampha = () => {
  const navigate = useNavigate();

  const [diaDiems, setDiaDiems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState("");
  const [selectedKhuVuc, setSelectedKhuVuc] = useState("Tất cả");

  useEffect(() => {
    const fetchDiaDiems = async () => {
      try {
        const res = await axios.get("http://localhost:5000/khampha");
        setDiaDiems(res.data.diaDiems || []);
      } catch (error) {
        console.error("Lỗi lấy dữ liệu khám phá:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDiaDiems();
  }, []);

  const danhSachKhuVuc = useMemo(() => {
    const khuVucs = diaDiems.map((item) => item.khuVuc).filter(Boolean);
    return ["Tất cả", ...new Set(khuVucs)];
  }, [diaDiems]);

  const filteredDiaDiems = useMemo(() => {
    return diaDiems.filter((item) => {
      const matchKeyword =
        item.tenDiaDiem?.toLowerCase().includes(keyword.toLowerCase()) ||
        item.khuVuc?.toLowerCase().includes(keyword.toLowerCase()) ||
        item.moTa?.toLowerCase().includes(keyword.toLowerCase());

      const matchKhuVuc =
        selectedKhuVuc === "Tất cả" || item.khuVuc === selectedKhuVuc;

      return matchKeyword && matchKhuVuc;
    });
  }, [diaDiems, keyword, selectedKhuVuc]);

  if (loading) {
    return <div className="khampha-loading">Đang tải dữ liệu...</div>;
  }

  return (
    <div className="khampha-wrapper">
      <div className="khampha-container">
        <section className="khampha-header">
          <h1>Khám Phá Địa Điểm</h1>
          <p>
            Tìm kiếm những hành trình bằng rừng vượt biển, chinh phục những cung
            đường hoang sơ nhất Việt Nam cùng cộng đồng Backpacking.
          </p>

          <div className="khampha-search">
            <input
              type="text"
              placeholder="Bạn muốn đi đâu? (Ví dụ: K50, Cù Lao Xanh, Sơn Đoòng...)"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
          </div>

          <div className="khampha-filters">
            {danhSachKhuVuc.map((khuVuc, index) => (
              <button
                key={index}
                className={selectedKhuVuc === khuVuc ? "active-filter" : ""}
                onClick={() => setSelectedKhuVuc(khuVuc)}
              >
                {khuVuc}
              </button>
            ))}
          </div>
        </section>

        <section className="khampha-grid">
          {filteredDiaDiems.map((item) => (
            <div
              key={item._id}
              className="khampha-card"
              onClick={() => navigate(`/chitietdiadiem/${item.slug}`)}
            >
              <div className="khampha-image-wrap">
                <img src={item.image} alt={item.tenDiaDiem} className="khampha-image" />

                <button
                  className="heart-btn"
                  onClick={(e) => e.stopPropagation()}
                >
                  ♡
                </button>

                <div className="khampha-tags">
                  {item.dacDiemDiaDanh?.slice(0, 2).map((tag, index) => (
                    <span key={`${item._id}-${index}`}>{tag}</span>
                  ))}
                </div>
              </div>

              <div className="khampha-info">
                <div className="khampha-title-row">
                  <h3>{item.tenDiaDiem}</h3>
                  <span className="khampha-rating">★ 4.8</span>
                </div>

                <p className="khampha-location">{item.khuVuc}</p>
                <p className="khampha-desc">{item.moTa}</p>

                <div className="khampha-bottom">
                  <div className="khampha-price">
                    <strong>{item.veVao}</strong>
                  </div>

                  <button
                    className="detail-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/chitietdiadiem/${item.slug}`);
                    }}
                  >
                    Chi tiết
                  </button>
                </div>
              </div>
            </div>
          ))}
        </section>

        {filteredDiaDiems.length === 0 && (
          <div className="empty-khampha">
            Không tìm thấy địa điểm phù hợp.
          </div>
        )}

        <div className="pagination-khampha">
          <button className="page-btn active-page">1</button>
          <button className="page-btn">2</button>
          <button className="page-btn">3</button>
          <button className="page-btn">...</button>
          <button className="page-btn">12</button>
        </div>
      </div>
    </div>
  );
};

export default ContentKhampha;