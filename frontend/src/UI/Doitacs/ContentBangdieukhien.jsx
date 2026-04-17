import React from "react";

const ContentBangdieukhien = () => {
    return (
      <div className="doitac-content-bangdieukhien">
        {/* TITLE */}
        <div className="doitac-title">
            <h2>Chào Minh Quang</h2>
            <p className="doitac-subtitle">
                Dưới đây là tổng quan về hoạt động kinh doanh của bạn hôm nay.
            </p>
        </div>
  
        {/* Stats Cards */}
        <div className="doitac-stats">
          <div className="doitac-card income-card">
            <div className="doitac-income-card-header">
              <p className="doitac-card-label">TỔNG THU NHẬP THÁNG NÀY</p>            
              <span className="doitac-card-growth">+12.5%</span>
            </div> 
            <h2 className="doitac-card-value">19.500.000 <span className="doitac-unit">VND</span></h2> 
            <div className="doitac-mini-chart">
              <div className="bar" style={{ height: '30%' }}></div>
              <div className="bar" style={{ height: '50%' }}></div>
              <div className="bar" style={{ height: '40%' }}></div>
              <div className="bar active" style={{ height: '90%' }}></div>
              <div className="bar" style={{ height: '65%' }}></div>
              <div className="bar" style={{ height: '45%' }}></div>
            </div>
          </div>
  
          <div className="doitac-card rating-card">
            <p className="doitac-card-label">ĐÁNH GIÁ</p>           
            <h2 className="doitac-card-value">4.9 <span className="doitac-stars">★★★★★</span></h2>                         
            <span className="doitac-card-rate">Dựa trên 128 lượt đánh giá</span>
            <div className="doitac-avatar-group">
              <img src="/img/user1.jpg" alt="user" />
              <img src="/img/user2.jpg" alt="user" />
              <img src="/img/user3.jpg" alt="user" />
              <div className="doitac-avatar-more">+12</div>
            </div>
          </div>
  
          <div className="doitac-card request-card">
            <div className="doitac-request-icon-box"> 
              <span className="doitac-icon">📋</span>
              <span className="doitac-request-text">Yêu cầu mới</span>            
            </div>
            <div className="doitac-request-main">
              <h2 className="doitac-card-value-orange" >08 <span className="doitac-status-tag-orange">Khẩn cấp</span></h2>             
            </div>
            <p className="doitac-card-subtext">Cần phản hồi trong 24h</p>
          </div>         
        </div>
  
        {/* Table */}
        <div className="doitac-table-container">
          <div className="doitac-table-header">
            <h3>Yêu cầu thuê gần đây</h3>
            <button className="btn-more">...</button>
          </div>

          <div className="doitac-table-yeucau">
            {/* Header */}
            <div className="doitac-row header-yeucau">
              <div>Khách hàng</div>
              <div>Vị trí</div>
              <div>Ngày đặt</div>
              <div>Trạng thái</div>           
              <div>Hành động</div>
            </div>        

            {/* Row 1 */}
            <div className="doitac-row-yeucau">
              <div className="user-info">
                <div className="user-avatar-small">AN</div>
                <span>An Nguyễn</span>
              </div>
              <div>Rừng Dâu, Sơn Trà, Đà Nẵng</div>
              <div>15/04/2024</div>          
              <div><span className="status-yeucau-pending">Đang chờ</span></div>
              <div><button className="btn-chitiet-yeucau">Chi tiết</button></div>
            </div>

            {/* Row 2 */}
            <div className="doitac-row-yeucau">
              <div className="user-info">
                <div className="user-avatar-small">TH</div>
                <span>Trần Hưng</span>
              </div>
              <div>Bãi Đá Đen, Đà Nẵng</div>
              <div>14/04/2024</div>          
              <div><span className="status-yeucau-done">Đã xác nhận</span></div>
              <div><button className="btn-chitiet-yeucau">Chi tiết</button></div>
            </div>            
          </div>
        </div>
      </div>
    );
  }

export default ContentBangdieukhien;