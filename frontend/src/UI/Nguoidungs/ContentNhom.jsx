//
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ContentNhom = ({ user }) => {

  const getImageUrl = (image) => {
    if (!image) return "/img/default-trekking.jpg";

    // Nếu là link full
    if (image.startsWith("http")) return image;

    // Nếu là path từ server
    const cleanPath = image.startsWith("/") ? image.slice(1) : image;

    return `http://localhost:5173/${cleanPath}`;
  };

  const [myGroups, setMyGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const handleNavigateToExplore = () => {
    if (user?.hoTen) {
      // Điều hướng theo định dạng: /tên-người-dùng/khamphauser
      navigate(`/${encodeURIComponent(user.hoTen)}/khamphauser`);
    } else {
      // Phòng hờ trường hợp không có tên người dùng thì về trang khám phá mặc định
      navigate('/khampha');
    }
  };

  // const getImageUrl = (image) => {
  //   if (!image) return "/img/default-trekking.jpg";

  //   // Nếu image là một chuỗi đường dẫn (vừa lấy từ database)
  //   if (typeof image === 'string') {
  //     if (image.startsWith("http")) return image;
  //     const cleanPath = image.startsWith('/') ? image.slice(1) : image;
  //     return `http://localhost:5000/${cleanPath}`;
  //   }
  //   return "/img/default-trekking.jpg";
  // };

  useEffect(() => {
    const fetchMyGroups = async () => {
      if (!user) return;
      try {
        // Gọi API lấy nhóm theo ID người dùng
        const res = await axios.get(`http://localhost:5000/nhom/user/${user.id || user._id}`);
        setMyGroups(res.data.nhoms);
      } catch (error) {
        console.error("Lỗi lấy danh sách nhóm của tôi:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMyGroups();
  }, [user]);

  if (loading) return <div className="loading">Đang tải danh sách nhóm...</div>;

  return (
    <div className="nhom">
      <div className="header-nhom">
        <h2>Group của tôi</h2>
        <p>Quản lý các nhóm trekking bạn đang tham gia. Kết nối cùng đồng đội cho những chuyến đi sắp tới.</p>
      </div>

      <div className="grid-nhom">
        {/* Nút Tạo Nhóm mới - Giữ nguyên logic UI của bạn */}
        <div className="create-card-nhom" onClick={handleNavigateToExplore}>
          <div className="plus-nhom">＋</div>
          <h3>Tạo Nhóm mới</h3>
          <p>Tìm địa điểm và tạo chuyến đi cùng bạn bè.</p>
        </div>
        {/* Hiển thị danh sách nhóm thực tế */}
        {myGroups.map((group) => {
          console.log("GROUP:", group);
          console.log("DIA DIEM:", group.diaDiem);

          return (
            <div className="card-nhom" key={group._id}>
              <div className="image-nhom">
                <img src={getImageUrl(group.diaDiem?.image)} alt={group.ten} />

                <span className={`badge ${group.nguoiTao.id === (user.id || user._id)
                    ? "leader"
                    : "active"
                  }`}>
                  {group.nguoiTao.id === (user.id || user._id)
                    ? "TRƯỞNG NHÓM"
                    : "ĐÃ THAM GIA"}
                </span>
              </div>

              <div className="info-nhom">
                <h3>{group.ten}</h3>
                <p>📍 {group.diaDiem?.tenDiaDiem || "Địa điểm chưa xác định"}</p>
                <p>👥 {group.thanhVien?.length || 0} thành viên</p>

                <button onClick={() => navigate(`/nhomchat/${group._id}`)}>
                  Vào nhóm →
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ContentNhom;