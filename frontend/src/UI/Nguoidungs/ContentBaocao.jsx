import React, { useEffect, useState } from "react";

const ContentBaocao = ({ user }) => {
  const [loaiBaoCao, setLoaiBaoCao] = useState("An toàn hành trình");
  const [viTri, setViTri] = useState("");
  const [moTa, setMoTa] = useState("");
  const [hinhAnh, setHinhAnh] = useState(null);
  const [baoCaos, setBaoCaos] = useState([]);
  const [loading, setLoading] = useState(false);
  const loaiBaoCaoList = [
    "An toàn hành trình",
    "Gian lận",
    "Lừa đảo",
    "Quấy rối",
    "Chương trình khuyến mãi",
    "Thanh toán",
    "Đóng góp ý kiến",
    "Khiếu nại",
    "Khác"
  ];

  const hoTen = user?.hoTen || "";

  const getImageUrl = (image) => {
    if (!image) return "";
    if (image.startsWith("http")) return image;
    return `http://localhost:5000${image}`;
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("vi-VN");
  };

  const renderTrangThai = (trangThai) => {
    if (trangThai === "da_giai_quyet") {
      return <span className="status-baocao done-baocao">ĐÃ GIẢI QUYẾT</span>;
    }

    if (trangThai === "tu_choi") {
      return <span className="status-baocao reject-baocao">TỪ CHỐI</span>;
    }

    return <span className="status-baocao pending-baocao">ĐANG XỬ LÝ</span>;
  };

  const fetchBaoCao = async () => {
    if (!hoTen) return;

    try {
      const res = await fetch(
        `http://localhost:5000/homeuser/${encodeURIComponent(hoTen)}/baocao`
      );

      const data = await res.json();

      if (res.ok) {
        setBaoCaos(data.baoCaos || []);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchBaoCao();
  }, [hoTen]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!hoTen) {
      alert("Bạn cần đăng nhập để gửi báo cáo");
      return;
    }

    if (!moTa.trim()) {
      alert("Vui lòng nhập mô tả báo cáo");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("loaiBaoCao", loaiBaoCao);
      formData.append("viTri", viTri);
      formData.append("moTa", moTa);

      if (hinhAnh) {
        formData.append("hinhAnh", hinhAnh);
      }

      const res = await fetch(
        `http://localhost:5000/homeuser/${encodeURIComponent(hoTen)}/baocao`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Gửi báo cáo thất bại");
        return;
      }

      alert("Gửi báo cáo thành công");

      setLoaiBaoCao("An toàn hành trình");
      setViTri("");
      setMoTa("");
      setHinhAnh(null);

      await fetchBaoCao();
    } catch (error) {
      console.log(error);
      alert("Lỗi khi gửi báo cáo");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="baocao">
      <div className="header-baocao">
        <h2>Báo cáo</h2>
        <p>Gửi phản hồi của bạn về các vấn đề gặp phải trên hành trình.</p>
      </div>

      <form className="form-baocao" onSubmit={handleSubmit}>
        <h3>➕ Tạo báo cáo mới</h3>

        <div className="row-baocao">
          <div className="field-baocao">
            <label>Loại báo cáo</label>
            <select
              value={loaiBaoCao}
              onChange={(e) => setLoaiBaoCao(e.target.value)}
            >
              {loaiBaoCaoList.map((item, index) => (
                <option key={index} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div className="field-baocao">
            <label>Vị trí nếu có</label>
            <input
              value={viTri}
              onChange={(e) => setViTri(e.target.value)}
              placeholder="Ví dụ: Đèo Hải Vân, Đà Nẵng"
            />
          </div>
        </div>

        <div className="field-baocao">
          <label>Mô tả chi tiết</label>
          <textarea
            value={moTa}
            onChange={(e) => setMoTa(e.target.value)}
            placeholder="Vui lòng mô tả chi tiết vấn đề bạn đang gặp phải..."
          />
        </div>

        <label className="upload-baocao">
          <p>
            📤 Kéo thả hoặc <span>nhấn để tải lên</span>
          </p>
          <small>Hỗ trợ PNG, JPG tối đa 5MB</small>

          <input
            type="file"
            accept="image/png,image/jpeg,image/jpg"
            hidden
            onChange={(e) => setHinhAnh(e.target.files[0])}
          />

          {hinhAnh && <strong>{hinhAnh.name}</strong>}
        </label>

        <button className="btn-submit-baocao" disabled={loading}>
          {loading ? "Đang gửi..." : "Gửi báo cáo"}
        </button>
      </form>

      <div className="table-baocao">
        <h3>Lịch sử gửi báo cáo</h3>

        <table>
          <thead>
            <tr>
              <th>Mã báo cáo</th>
              <th>Ngày gửi</th>
              <th>Loại</th>
              <th>Vị trí</th>
              <th>Ảnh</th>
              <th>Trạng thái</th>
              <th>Phản hồi QTV</th>
            </tr>
          </thead>

          <tbody>
            {baoCaos.length === 0 ? (
              <tr>
                <td colSpan="7">Bạn chưa gửi báo cáo nào.</td>
              </tr>
            ) : (
              baoCaos.map((item) => (
                <tr key={item._id}>
                  <td>#{item._id.slice(-6).toUpperCase()}</td>
                  <td>{formatDate(item.createdAt)}</td>
                  <td>{item.loaiBaoCao}</td>
                  <td>{item.viTri || "Không có"}</td>
                  <td>
                    {item.hinhAnh ? (
                      <a
                        href={getImageUrl(item.hinhAnh)}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Xem ảnh
                      </a>
                    ) : (
                      "Không có"
                    )}
                  </td>
                  <td>{renderTrangThai(item.trangThai)}</td>
                  <td>{item.phanHoiAdmin || "Chưa có"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ContentBaocao;