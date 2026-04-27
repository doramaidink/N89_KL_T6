import React, { useRef } from "react";

const SidebarTaikhoan = ({ thongTin, handleDangXuat, getImageSrc }) => {
    const uploadInputRef = useRef();

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
                    className="item-taikhoan"
                    onClick={() => (window.location.href = "/thongtintaikhoan")}
                >
                    Thông tin cá nhân
                </div>

                <div
                    className="item-taikhoan active-taikhoan"
                    onClick={() => (window.location.href = "/thongbao")}
                >
                    Thông báo
                </div>

                <div className="item-taikhoan">Lịch sử chuyến đi</div>
                <div className="item-taikhoan">Hóa đơn</div>

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