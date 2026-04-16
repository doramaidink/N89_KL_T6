import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

const ContentKhamphauser = ({ user }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [diaDiems, setDiaDiems] = useState([]);
  const [loading, setLoading] = useState(true);

  const [keyword, setKeyword] = useState(location.state?.keyword || "");
  const [selectedTinh, setSelectedTinh] = useState("");
  const [selectedDoKho, setSelectedDoKho] = useState("");
  const [selectedNganSach, setSelectedNganSach] = useState("");

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

  useEffect(() => {
    if (location.state?.keyword !== undefined) {
      setKeyword(location.state.keyword || "");
    }
  }, [location.state]);

  const danhSachTinh = useMemo(() => {
    const list = diaDiems.map((item) => item.tinh).filter(Boolean);
    return [...new Set(list)];
  }, [diaDiems]);

  const danhSachDoKho = useMemo(() => {
    const list = diaDiems.map((item) => item.doKho).filter(Boolean);
    return [...new Set(list)];
  }, [diaDiems]);

  const danhSachNganSach = useMemo(() => {
    const list = diaDiems.map((item) => item.veVao).filter(Boolean);
    return [...new Set(list)];
  }, [diaDiems]);

  const filteredDiaDiems = useMemo(() => {
    return diaDiems.filter((item) => {
      const keywordLower = keyword.toLowerCase().trim();

      const matchKeyword =
        !keywordLower ||
        item.tenDiaDiem?.toLowerCase().includes(keywordLower) ||
        item.tinh?.toLowerCase().includes(keywordLower) ||
        item.moTa?.toLowerCase().includes(keywordLower);

      const matchTinh = !selectedTinh || item.tinh === selectedTinh;
      const matchDoKho = !selectedDoKho || item.doKho === selectedDoKho;
      const matchNganSach = !selectedNganSach || item.veVao === selectedNganSach;

      return matchKeyword && matchTinh && matchDoKho && matchNganSach;
    });
  }, [diaDiems, keyword, selectedTinh, selectedDoKho, selectedNganSach]);

  const handleClearFilters = () => {
    setKeyword("");
    setSelectedTinh("");
    setSelectedDoKho("");
    setSelectedNganSach("");
  };

  const goToDetailUser = (slug) => {
    if (!user?.hoTen) return;
    navigate(`/${encodeURIComponent(user.hoTen)}/chitietdiadiemuser/${slug}`);
  };

  if (loading) {
    return <div className="khampha-loading">Đang tải dữ liệu...</div>;
  }

  return (
    <div className="khampha-wrapper">
      <div className="khampha-container">
        <section className="khampha-header">
          <h1>Khám Phá Địa Điểm</h1>
          <p>
            Tìm kiếm những hành trình băng rừng vượt biển, chinh phục những cung
            đường hoang sơ nhất Việt Nam cùng cộng đồng Backpacking.
          </p>

          <div className="khampha-search">
            <span className="search-icon">
              <i className="fa-solid fa-magnifying-glass"></i>
            </span>
            <input
              type="text"
              placeholder="Bạn muốn đi đâu?"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
          </div>

          <div className="khampha-filters">
            <select
              className="filter-select-khampha"
              value={selectedTinh}
              onChange={(e) => setSelectedTinh(e.target.value)}
            >
              <option value="">Tỉnh/Thành</option>
              {danhSachTinh.map((tinh, index) => (
                <option key={index} value={tinh}>
                  {tinh}
                </option>
              ))}
            </select>

            <select
              className="filter-select-khampha"
              value={selectedDoKho}
              onChange={(e) => setSelectedDoKho(e.target.value)}
            >
              <option value="">Độ khó</option>
              {danhSachDoKho.map((doKho, index) => (
                <option key={index} value={doKho}>
                  {doKho}
                </option>
              ))}
            </select>

            <select
              className="filter-select-khampha"
              value={selectedNganSach}
              onChange={(e) => setSelectedNganSach(e.target.value)}
            >
              <option value="">Ngân sách</option>
              {danhSachNganSach.map((veVao, index) => (
                <option key={index} value={veVao}>
                  {veVao}
                </option>
              ))}
            </select>

            <button
              type="button"
              className="clear-filter-btn"
              onClick={handleClearFilters}
            >
              Xóa bỏ lọc
            </button>
          </div>
        </section>

        <section className="khampha-grid">
          {filteredDiaDiems.map((item) => (
            <div
              key={item._id}
              className="khampha-card"
              onClick={() => goToDetailUser(item.slug)}
            >
              <div className="khampha-image-wrap">
                <img
                  src={item.image}
                  alt={item.tenDiaDiem}
                  className="khampha-image"
                />

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

                <p className="khampha-location">{item.tinh}</p>
                <p className="khampha-desc">{item.moTa}</p>

                <div className="khampha-bottom">
                  <div className="khampha-price">
                    <strong>{item.veVao}</strong>
                  </div>

                  <button
                    className="detail-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      goToDetailUser(item.slug);
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
          <div className="empty-khampha">Không tìm thấy địa điểm phù hợp.</div>
        )}
      </div>
    </div>
  );
};

export default ContentKhamphauser;