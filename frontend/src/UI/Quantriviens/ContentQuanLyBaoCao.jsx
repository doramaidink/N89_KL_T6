import React, { useEffect, useMemo, useState } from "react";
import { Search, Filter } from "lucide-react";

const ContentQuanLyBaoCao = () => {
  const [reports, setReports] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [filterType, setFilterType] = useState("Tất cả");
  const [filterStatus, setFilterStatus] = useState("Tất cả");
  const [loading, setLoading] = useState(false);

  const getAdmin = () => {
    return (
      JSON.parse(localStorage.getItem("admin")) ||
      JSON.parse(localStorage.getItem("quanTriVien")) ||
      JSON.parse(localStorage.getItem("user"))
    );
  };

  const getImageUrl = (image) => {
    if (!image) return "";
    if (image.startsWith("http")) return image;
    return `http://localhost:5000${image}`;
  };

  const fetchReports = async () => {
    try {
      setLoading(true);

      const admin = getAdmin();

      if (!admin?.slug) {
        console.log("Không tìm thấy slug admin trong localStorage");
        return;
      }

      const res = await fetch(
        `http://localhost:5000/quantrivien/${encodeURIComponent(
          admin.slug
        )}/quanlybaocao`
      );

      const data = await res.json();

      if (res.ok) {
        setReports(data.reports || []);
      } else {
        alert(data.message || "Không lấy được danh sách báo cáo");
      }
    } catch (error) {
      console.log(error);
      alert("Lỗi khi tải danh sách báo cáo");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const stats = useMemo(() => {
    const total = reports.length;
    const processing = reports.filter((r) => r.status === "ĐANG XỬ LÝ").length;
    const done = reports.filter((r) => r.status === "ĐÃ XỬ LÝ").length;
    const rejected = reports.filter((r) => r.status === "TỪ CHỐI").length;

    return [
      {
        label: "TỔNG BÁO CÁO",
        value: total,
        sub: "Tất cả báo cáo đã gửi",
        color: "green",
      },
      {
        label: "CHƯA / ĐANG XỬ LÝ",
        value: processing,
        sub: "Cần quản trị viên kiểm tra",
        color: "red",
      },
      {
        label: "ĐÃ HOÀN THÀNH",
        value: done,
        sub: "Báo cáo đã được xử lý",
        color: "emerald",
      },
      {
        label: "TỪ CHỐI",
        value: rejected,
        sub: "Báo cáo không hợp lệ",
        color: "gray",
      },
    ];
  }, [reports]);

  const filteredReports = useMemo(() => {
    return reports.filter((r) => {
      const keyword = searchText.toLowerCase().trim();

      const matchSearch =
        !keyword ||
        r.id?.toLowerCase().includes(keyword) ||
        r.user?.toLowerCase().includes(keyword) ||
        r.email?.toLowerCase().includes(keyword) ||
        r.type?.toLowerCase().includes(keyword) ||
        r.desc?.toLowerCase().includes(keyword);

      const matchType = filterType === "Tất cả" || r.type === filterType;
      const matchStatus =
        filterStatus === "Tất cả" || r.status === filterStatus;

      return matchSearch && matchType && matchStatus;
    });
  }, [reports, searchText, filterType, filterStatus]);

  const uniqueTypes = useMemo(() => {
    const types = reports.map((r) => r.type).filter(Boolean);
    return ["Tất cả", ...new Set(types)];
  }, [reports]);

  const getTypeClass = (type) => {
    const text = String(type || "").toLowerCase();

    if (
      text.includes("an toàn") ||
      text.includes("lừa đảo") ||
      text.includes("quấy rối")
    ) {
      return "danger";
    }

    if (text.includes("thanh toán") || text.includes("gian lận")) {
      return "tech";
    }

    return "idea";
  };

  const getStatusClass = (status) => {
    if (status === "ĐÃ XỬ LÝ") return "done";
    if (status === "TỪ CHỐI") return "reject";
    return "processing";
  };

  return (
    <div className="quanlybaocao-container">
      <h2 className="quanlybaocao-title">Quản lý Báo cáo & Sự cố</h2>

      <p className="quanlybaocao-subtitle">
        Hệ thống xử lý sự cố dành cho cộng đồng Backpacking Vietnam.
        Quản trị viên có thể xem, lọc và phản hồi các báo cáo từ người dùng.
      </p>

      <div className="quanlybaocao-stats-grid">
        {stats.map((s, i) => (
          <div key={i} className="quanlybaocao-card">
            <div className="quanlybaocao-card-label">{s.label}</div>
            <div className="quanlybaocao-card-value">{s.value}</div>
            <div className={`quanlybaocao-card-sub text-${s.color}`}>
              {s.sub}
            </div>
          </div>
        ))}
      </div>

      <div className="quanlybaocao-filter-bar">
        <div className="quanlybaocao-filter-group">
          <div className="quanlybaocao-select-box">
            <label>PHÂN LOẠI:</label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              {uniqueTypes.map((type) => (
                <option key={type}>{type}</option>
              ))}
            </select>
          </div>

          <div className="quanlybaocao-select-box">
            <label>TRẠNG THÁI:</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option>Tất cả</option>
              <option>ĐANG XỬ LÝ</option>
              <option>ĐÃ XỬ LÝ</option>
              <option>TỪ CHỐI</option>
            </select>
          </div>

          <button className="quanlybaocao-btn-apply" onClick={fetchReports}>
            <Filter size={14} /> Làm mới
          </button>
        </div>

        <div className="quanlybaocao-search-wrapper">
          <Search size={16} className="quanlybaocao-search-icon" />
          <input
            type="text"
            placeholder="Tìm kiếm báo cáo..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>
      </div>

      <div className="quanlybaocao-table-wrapper custom-scrollbar">
        <table className="quanlybaocao-table">
          <thead>
            <tr>
              <th style={{ width: "100px" }}>MÃ</th>
              <th style={{ width: "220px" }}>NGƯỜI DÙNG</th>
              <th style={{ width: "150px" }}>PHÂN LOẠI</th>
              <th style={{ width: "140px" }}>TRẠNG THÁI</th>
              <th>MÔ TẢ</th>
              <th style={{ width: "90px" }}>ẢNH</th>
              <th style={{ width: "120px" }}>THAO TÁC</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7">Đang tải dữ liệu...</td>
              </tr>
            ) : filteredReports.length === 0 ? (
              <tr>
                <td colSpan="7">Không có báo cáo nào.</td>
              </tr>
            ) : (
              filteredReports.map((r) => (
                <tr key={r._id}>
                  <td className="text-emerald font-bold">{r.id}</td>

                  <td>
                    <div className="quanlybaocao-user-cell">
                      <div className="quanlybaocao-user-avatar">
                        {r.user
                          ?.split(" ")
                          .filter(Boolean)
                          .slice(0, 2)
                          .map((x) => x[0]?.toUpperCase())
                          .join("") || "ND"}
                      </div>

                      <div className="quanlybaocao-user-info">
                        <div className="quanlybaocao-user-name">{r.user}</div>
                        <div className="quanlybaocao-user-email">
                          {r.email || "Chưa có email"}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td>
                    <span
                      className={`quanlybaocao-badge-type type-${getTypeClass(
                        r.type
                      )}`}
                    >
                      • {r.type}
                    </span>
                  </td>

                  <td>
                    <span
                      className={`quanlybaocao-status-text status-${getStatusClass(
                        r.status
                      )}`}
                    >
                      • {r.status}
                    </span>
                  </td>

                  <td className="quanlybaocao-desc-cell">{r.desc}</td>

                  <td>
                    {r.image ? (
                      <a
                        href={getImageUrl(r.image)}
                        target="_blank"
                        rel="noreferrer"
                        className="quanlybaocao-link-img"
                      >
                        Xem
                      </a>
                    ) : (
                      "Không có"
                    )}
                  </td>

                  <td>
                    <button className="quanlybaocao-btn-reply">
                      PHẢN HỒI
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="quanlybaocao-footer">
        <div className="quanlybaocao-footer-info">
          Hiển thị {filteredReports.length} trong số {reports.length} báo cáo
        </div>
      </div>
    </div>
  );
};

export default ContentQuanLyBaoCao;