import React, { useEffect, useState } from "react";
import { Eye, X } from "lucide-react";
import SidebarTaikhoan from "./SidebarTaikhoan";

const API = "http://localhost:5000";

const ContentHoadon = ({ user }) => {
  const [hoaDons, setHoaDons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedHoaDon, setSelectedHoaDon] = useState(null);

  const currentUser =
    user ||
    JSON.parse(localStorage.getItem("user")) ||
    JSON.parse(localStorage.getItem("nguoiDung"));

  const userId = currentUser?._id || currentUser?.id;

  const getImageSrc = (img) => {
    if (!img) return "/img/anhgioithieu.jpg";
    if (img.startsWith("http")) return img;
    if (img.startsWith("/uploads") || img.startsWith("/img")) {
      return `${API}${img}`;
    }
    return img;
  };

  const handleDangXuat = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("nguoiDung");
    window.location.href = "/dangnhap";
  };

  useEffect(() => {
    const fetchHoaDon = async () => {
      try {
        if (!userId) {
          setLoading(false);
          return;
        }

        const res = await fetch(`${API}/taikhoan/${userId}/hoadon`);
        const data = await res.json();

        if (res.ok) {
          setHoaDons(data.hoaDons || []);
        } else {
          console.log(data.message);
        }
      } catch (error) {
        console.log("Lỗi fetch hóa đơn:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHoaDon();
  }, [userId]);

  const formatMoney = (money) => {
    return Number(money || 0).toLocaleString("vi-VN") + "đ";
  };

  const formatDateTime = (date) => {
    if (!date) return "Chưa có";
    return new Date(date).toLocaleString("vi-VN");
  };

  const getStatusText = (status) => {
    switch (status) {
      case "paid":
        return "Đã thanh toán";
      case "pending":
        return "Chờ thanh toán";
      case "cancelled":
        return "Đã hủy";
      case "failed":
        return "Thất bại";
      default:
        return "Không rõ";
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "paid":
        return "success-hoadon";
      case "pending":
        return "pending-hoadon";
      case "cancelled":
        return "cancel-hoadon";
      case "failed":
        return "failed-hoadon";
      default:
        return "pending-hoadon";
    }
  };

  const getLoaiLoiMoiText = (loai) => {
    switch (loai) {
      case "co_nhom":
        return "Thanh toán tham gia nhóm có sẵn";
      case "tao_moi":
        return "Thanh toán tạo nhóm mới";
      default:
        return "Không rõ";
    }
  };

  const getNoiDung = (item) => {
    if (item.nhomId?.tenNhom) {
      return `Thanh toán nhóm ${item.nhomId.tenNhom}`;
    }

    if (item.doiTacId?.hoTen) {
      return `Thuê HDV ${item.doiTacId.hoTen}`;
    }

    if (item.guideName) {
      return `Thuê HDV ${item.guideName}`;
    }

    return item.loaiLoiMoi === "co_nhom"
      ? "Thanh toán lời mời tham gia nhóm"
      : "Thanh toán thuê hướng dẫn viên";
  };

  if (!userId) {
    return (
      <div className="taikhoan-container">
        <div className="content-hoadon">
          <h2>Hóa đơn</h2>
          <p>Vui lòng đăng nhập để xem hóa đơn.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="taikhoan-container">
      <SidebarTaikhoan
        thongTin={currentUser}
        handleDangXuat={handleDangXuat}
        getImageSrc={getImageSrc}
      />

      <div className="content-hoadon">
        <h2>Hóa đơn</h2>
        <p className="sub-hoadon">
          Quản lý và theo dõi lịch sử giao dịch của bạn.
        </p>

        <div className="table-hoadon">
          <div className="row header-hoadon">
            <div>Mã hóa đơn</div>
            <div>Ngày tạo</div>
            <div>Nội dung</div>
            <div>Số tiền</div>
            <div>Trạng thái</div>
            <div>Chi tiết</div>
          </div>

          {loading ? (
            <div className="empty-hoadon">Đang tải hóa đơn...</div>
          ) : hoaDons.length === 0 ? (
            <div className="empty-hoadon">Bạn chưa có hóa đơn nào.</div>
          ) : (
            hoaDons.map((item) => (
              <div className="row-hoadon" key={item._id}>
                <div>#{item.orderCode}</div>
                <div>{formatDateTime(item.createdAt)}</div>
                <div>{getNoiDung(item)}</div>
                <div className="price-hoadon">{formatMoney(item.amount)}</div>
                <div>
                  <span className={`status-hoadon ${getStatusClass(item.status)}`}>
                    {getStatusText(item.status)}
                  </span>
                </div>
                <div>
                  <button
                    className="btn-view-hoadon"
                    onClick={() => setSelectedHoaDon(item)}
                    title="Xem chi tiết hóa đơn"
                  >
                    <Eye size={18} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="footer-hoadon">
          <span>Hiển thị {hoaDons.length} hóa đơn</span>
        </div>
      </div>

      {selectedHoaDon && (
        <div className="modal-hoadon-overlay">
          <div className="modal-hoadon">
            <div className="modal-hoadon-header">
              <h3>Chi tiết hóa đơn</h3>
              <button
                className="modal-hoadon-close"
                onClick={() => setSelectedHoaDon(null)}
              >
                <X size={20} />
              </button>
            </div>

            <div className="modal-hoadon-body">
              <div className="detail-hoadon-row">
                <span>Mã hóa đơn</span>
                <b>#{selectedHoaDon.orderCode}</b>
              </div>

              <div className="detail-hoadon-row">
                <span>Nội dung</span>
                <b>{getNoiDung(selectedHoaDon)}</b>
              </div>

              <div className="detail-hoadon-row">
                <span>Số tiền</span>
                <b className="price-hoadon">
                  {formatMoney(selectedHoaDon.amount)}
                </b>
              </div>

              <div className="detail-hoadon-row">
                <span>Trạng thái</span>
                <b>{getStatusText(selectedHoaDon.status)}</b>
              </div>

              <div className="detail-hoadon-row">
                <span>Người thanh toán</span>
                <b>
                  {selectedHoaDon.nguoiGuiId?.hoTen ||
                    currentUser?.hoTen ||
                    "Chưa có"}
                </b>
              </div>

              <div className="detail-hoadon-row">
                <span>Email</span>
                <b>
                  {selectedHoaDon.nguoiGuiId?.email ||
                    currentUser?.email ||
                    "Chưa có"}
                </b>
              </div>

              <div className="detail-hoadon-row">
                <span>Số điện thoại</span>
                <b>
                  {selectedHoaDon.nguoiGuiId?.soDienThoai ||
                    currentUser?.soDienThoai ||
                    "Chưa có"}
                </b>
              </div>

              <div className="detail-hoadon-row">
                <span>Hướng dẫn viên</span>
                <b>
                  {selectedHoaDon.doiTacId?.hoTen ||
                    selectedHoaDon.guideName ||
                    "Chưa có"}
                </b>
              </div>

              <div className="detail-hoadon-row">
                <span>SĐT hướng dẫn viên</span>
                <b>{selectedHoaDon.doiTacId?.soDienThoai || "Chưa có"}</b>
              </div>

              <div className="detail-hoadon-row">
                <span>Loại lời mời</span>
                <b>{getLoaiLoiMoiText(selectedHoaDon.loaiLoiMoi)}</b>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentHoadon;