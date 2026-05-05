import React, { useRef } from "react";
import { useLocation } from "react-router-dom";

const SidebarTaikhoan = ({ thongTin, handleDangXuat, getImageSrc }) => {
    const uploadInputRef = useRef();
    const location = useLocation();

    return (
        <div className="sidebar-taikhoan">
            <div className="profile-taikhoan">
                <div className="avatar-box-taikhoan">
                    <img
                        src={getImageSrc(thongTin?.image)}
                        alt="avatar"
                        className="avatar-img-taikhoan"
                    />

                    <button
                        type="button"
                        className="avatar-plus-btn"
                        onClick={() => uploadInputRef.current?.click()}
                        title="Thay đổi avatar"
                    >
                        +
                    </button>
                </div>

                <div className="ten-taikhoan">
                    <h4>{thongTin?.hoTen || "Người dùng"}</h4>
                    <p>THÀNH VIÊN HẠNG VÀNG</p>
                </div>
            </div>

            <div className="menu-taikhoan">
                <div
                    className={`item-taikhoan ${location.pathname === "/thongtintaikhoan" ? "active-taikhoan" : ""}`}
                    onClick={() => (window.location.href = "/thongtintaikhoan")}
                >
                    Thông tin cá nhân
                </div>

                <div
                    className={`item-taikhoan ${location.pathname === "/thongbao" ? "active-taikhoan" : ""}`}
                    onClick={() => (window.location.href = "/thongbao")}
                >
                    Thông báo
                </div>

                <div
                    className={`item-taikhoan ${location.pathname === "/lichsuchuyendi" ? "active-taikhoan" : ""}`}
                    onClick={() => (window.location.href = "/lichsuchuyendi")}
                >
                    Lịch sử chuyến đi
                </div>
                <div
                    className={`item-taikhoan ${location.pathname.includes("hoadon") ? "active-taikhoan" : ""}`}
                      onClick={() => (window.location.href = "/hoadon")}
                >
                    Hóa đơn
                </div>

                <div
                    className="item-taikhoan logout-taikhoan"
                    onClick={handleDangXuat}
                >
                    Đăng xuất
                </div>
            </div>
        </div>
    );
};

export default SidebarTaikhoan;