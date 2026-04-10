import React from "react";

const ContentHoadon = () => {
  return (
    <div className="page-hoadon">

      {/* SIDEBAR */}
      <div className="sidebar-hoadon">

        <div className="profile-hoadon">
          <img src="/img/avatar.jpg" />
          <h4>Nguyễn Văn A</h4>
          <span>THÀNH VIÊN HẠNG VÀNG</span>
        </div>

        <div className="menu-hoadon">
          <div className="item-hoadon">Thông tin cá nhân</div>
          <div className="item-hoadon">Thông báo</div>
          <div className="item-hoadon">Lịch sử chuyến đi</div>
          <div className="item-hoadon active">Hóa đơn</div>
          <div className="item-hoadon logout">Đăng xuất</div>
        </div>

      </div>

      {/* CONTENT */}
      <div className="content-hoadon">

        <h2>Hóa đơn</h2>
        <p className="sub-hoadon">
          Quản lý và theo dõi lịch sử giao dịch, tải xuống hóa đơn PDF.
        </p>

        {/* TABLE */}
        <div className="table-hoadon">

          {/* HEADER */}
          <div className="row header-hoadon">
            <div>Mã hóa đơn</div>
            <div>Ngày thanh toán</div>
            <div>Nội dung</div>
            <div>Số tiền</div>
            <div>Trạng thái</div>
            <div>Hành động</div>
          </div>

          {/* ROW 1 */}
          <div className="row-hoadon">
            <div>#INV-2024-001</div>
            <div>15/05/2024</div>
            <div>Thuê HDV Rừng Dừa - Đà Lạt</div>
            <div className="price-hoadon">1.200.000đ</div>
            <div><span className="status-hoadon success-hoadon">Đã thanh toán</span></div>
            <div><button className="btn-pdf-hoadon">PDF</button></div>
          </div>

          {/* ROW 2 */}
          <div className="row-hoadon">
            <div>#INV-2024-002</div>
            <div>12/05/2024</div>
            <div>Tour Trekking Tà Năng</div>
            <div className="price-hoadon">2.500.000đ</div>
            <div><span className="status-hoadon success-hoadon">Đã thanh toán</span></div>
            <div><button className="btn-pdf-hoadon">PDF</button></div>
          </div>

          {/* ROW 3 */}
          <div className="row-hoadon">
            <div>#INV-2024-003</div>
            <div>20/05/2024</div>
            <div>Dịch vụ thuê lều</div>
            <div className="price-hoadon">450.000đ</div>
            <div><span className="status-hoadon pending-hoadon">Chờ xử lý</span></div>
            <div><button className="btn-pdf-hoadon">PDF</button></div>
          </div>

          {/* ROW 4 */}
          <div className="row-hoadon">
            <div>#INV-2024-004</div>
            <div>05/05/2024</div>
            <div>Bảo hiểm du lịch</div>
            <div className="price-hoadon">300.000đ</div>
            <div><span className="status-hoadon success-hoadon">Đã thanh toán</span></div>
            <div><button className="btn-pdf-hoadon">PDF</button></div>
          </div>

        </div>

        {/* FOOTER */}
        <div className="footer-hoadon">
          <span>Hiển thị 1-4 trong 12 hóa đơn</span>

          <div className="pagination-hoadon">
            <button>{"<"}</button>
            <button className="active-hoadon">1</button>
            <button>2</button>
            <button>3</button>
            <button>{">"}</button>
          </div>
        </div>

      </div>

    </div>
  );
};

export default ContentHoadon;