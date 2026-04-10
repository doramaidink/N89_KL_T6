import React from "react";

const ContentThongtinTK = () => {
  return (
    <div className="taikhoan-container">

      {/* LEFT SIDEBAR */}
      <div className="sidebar-taikhoan">

        <div className="profile-taikhoan">
          <img src="/img/anhgioithieu.jpg" />
          <div className="ten-taikhoan">
            <h4>Nguyễn Văn A</h4>
            <p>THÀNH VIÊN HẠNG VÀNG</p>
          </div>
        </div>

        <div className="menu-taikhoan">
          <div className="item-taikhoan active-taikhoan">Thông tin cá nhân</div>
          <div className="item-taikhoan">Thông báo</div>
          <div className="item-taikhoan">Lịch sử chuyến đi</div>
          <div className="item-taikhoan">Hóa đơn</div>
          <div className="item-taikhoan logout-taikhoan">Đăng xuất</div>
        </div>

      </div>

      {/* RIGHT CONTENT */}
      <div className="content-taikhoan">

        {/* SECTION 1 */}
        <div className="card-taikhoan">
           <div className="nhaptt-taikhoan">
            <img src="/img/doiten.png" alt="" />
          <h3> Đổi tên hiển thị</h3>
           </div>

          <input placeholder="Nguyễn Văn A" />
          <input type="password" placeholder="Mật khẩu xác nhận" />

          <button className="btn-primary-taikhoan">Cập nhật</button>
        </div>

        {/* SECTION 2 */}
        <div className="card-taikhoan">
          <div className="nhaptt-taikhoan">
            <img src="/img/dienthoai.png" alt="" />
            <h3>Thay đổi số điện thoại</h3>
          </div>

          <div className="row-taikhoan">
            <input placeholder="Nhập số điện thoại mới" />
            <button className="btn-small-taikhoan">Gửi mã</button>
          </div>

          <input placeholder="Nhập mã OTP" />

          <button className="btn-primary-taikhoan">
            Cập nhật số điện thoại
          </button>
        </div>

        {/* SECTION 3 */}
        <div className="card-taikhoan">
          <div className="nhaptt-taikhoan">
            <img src="/img/baomat.png" alt="" />
          <h3> Thay đổi mật khẩu</h3>
          </div>

          <input type="password" placeholder="Mật khẩu hiện tại" />
          <input type="password" placeholder="Mật khẩu mới" />
          <input type="password" placeholder="Xác nhận mật khẩu mới" />

          <div className="row-taikhoan">
            <button className="btn-primary-taikhoan">Lưu thay đổi</button>
            <button className="btn-outline-taikhoan">Hủy bỏ</button>
          </div>
        </div>

      </div>

    </div>
  );
};

export default ContentThongtinTK;