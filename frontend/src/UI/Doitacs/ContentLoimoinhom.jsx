import React, { useState } from "react";
import ContentTaonhom from './ContentTaonhom';
import { UserPlus, Check, X, MapPin, Calendar, Users, ShieldCheck, Zap, Search, Trees, Sparkles } from "lucide-react";

const ContentLoimoinhom = () => {  
  const [showAll, setShowAll] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const invitations = [
    {
      id: 1,
      title: "Chinh phục Đỉnh Lảo Thẩn",
      price: "2.500.000đ",
      location: "Y Tý, Lào Cai",
      date: "15/10 - 17/10",
      members: "08/10 Thành viên",
      sender: "Minh Hoàng & Nhóm bạn đại học",
      image: "/img/place1.jpg", 
      avatar: "/img/user1.jpg",
      isNew: true
    },
    {
      id: 2,
      title: "Khám phá Hang Én - Tú Làn",
      price: "5.200.000đ",
      location: "Quảng Bình",
      date: "22/10 - 25/10",
      members: "12/15 Thành viên",
      sender: "Thùy Linh & CLB Outdoor Sài Gòn",
      image: "/img/place2.jpg",
      avatar: "/img/user2.jpg"
    }
  ];

  return (
    <div className="loimoi-content">
      {isCreating && (
        <div className="taonhom-overlay">         
          <div className="taonhom-backdrop" onClick={() => setIsCreating(false)}></div>                
          <div className="taonhom-popup-container">
            <ContentTaonhom onCancel={() => setIsCreating(false)} />
          </div>
        </div>
      )}

      <div className="loimoi-header-main">
        {/* TITLE */}
        <div>
          <h2>Lời mời tham gia nhóm</h2>
          <p>Bạn có <span>4</span> lời mời mới từ các cộng đồng leo núi và trekking.</p>
        </div>
        <button className="btn-create-group" onClick={() => setIsCreating(true)}>
          <UserPlus size={18} /> Tạo nhóm mới
        </button>
      </div>        
      <div className="loimoi-grid">
        {/* DANH SÁCH LỜI MỜI */}
        <div className="loimoi-list">
          {invitations.map((item) => (
            <div className="invite-card" key={item.id}>
              <div className="invite-image">
                <img src={item.image} alt={item.title} />
                {item.isNew && <span className="badge-new">MỚI</span>}
              </div>
              <div className="invite-content">
                <div className="invite-title-row">
                  <h3>{item.title}</h3>
                  <span className="invite-price">{item.price}</span>
                </div>
                <div className="invite-meta">
                    <div className="meta-item">
                        <MapPin size={16} />
                        <span className="invite-location">{item.location}</span>
                    </div>
                    <div className="meta-item">
                        <Calendar size={16} />
                        <span className="invate-date">{item.date}</span>
                    </div>
                    <div className="meta-item">
                        <Users size={16} />
                        <span className="invite-members">{item.members}</span>
                    </div>
                </div>
                <div className="invite-sender">
                  <div className="sender-avatar">
                  <img src={item.avatar} alt="avatar" className="real-avatar" />
                  </div>
                  <div className="sender-info">
                    <label>LỜI MỜI TỪ</label>
                    <p>{item.sender}</p>
                  </div>
                </div>
                <div className="invite-actions">
                  <button className="btn-accept"><Check size={16} /> Chấp nhận</button>
                  <button className="btn-decline"><X size={16} /> Từ chối</button>
                </div>
              </div>
            </div>
          ))}
        </div> 

        {/* THỐNG KÊ & GỢI Ý */}
        <div className="loimoi-sidebar">
          <div className="stat-box">
            <h4>Thống kê tháng 10</h4>
            <div className="stat-row">
              <div className="stat-item">
                <label>LỜI MỜI MỚI</label>
                <div className="stat-value">12</div>
              </div>
              <div className="stat-item">
                <label>ĐÃ XÁC NHẬN</label>
                <div className="stat-value">04</div>
              </div>
            </div>
          </div>

          <div className="suggestion-box">
            <label className="suggest-label">Gợi ý cho bạn</label>
            <div className="suggest-item">
              <div className="suggest-icon"><ShieldCheck size={18} /></div>
              <div>
                <h5>Nâng cấp Hồ sơ Hướng dẫn...</h5>
                <p>Tăng 40% tỉ lệ nhận lời mời</p>
              </div>
            </div>
            <div className="suggest-item">
              <div className="suggest-icon blue"><Zap size={18} /></div>
              <div>
                <h5>Bật chế độ Sẵn sàng</h5>
                <p>Nhận thông báo tức thì khi có nhóm mới</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* DANH SÁCH NHÓM */}
      <div className="my-groups-section">
            <div className="section-header">
              <h3>Nhóm của tôi</h3>
              <button className="view-all" onClick={() => setShowAll(!showAll)}>
                {showAll ? "Thu gọn" : "Xem tất cả"}
              </button>
            </div>
            <div className="my-groups-grid">           
              <div className="group-mini-card">
               <div className="group-card-top">
               <div className="group-icon-circle">
                   <Search size={18} color="#10b981" />
                </div>
               <div className="group-title-area">
                   <h4>Khám Phá Hà Giang</h4>
                   <span className="badge-role leader">TRƯỞNG NHÓM</span>
                </div>
            </div>

           <div className="group-card-body">
                <p className="group-location">
                    <MapPin size={14} /> Đèo Mã Pì Lèng, Hà Giang
                </p>
                <div className="group-stat-row">
                    <div className="stat-info">
                        <label>Tiếp theo:</label>
                        <span>22/10 | 07:00</span>
                    </div>
                    </div>
                    <div className="stat-info">
                        <label>Thành viên:</label>
                        <span>12 người</span>
                    </div>               
            </div>
                <button className="btn-view-group">Xem chi tiết</button>
            </div>     

            <div className="group-mini-card">
            <div className="group-card-top">
            <div className="group-icon-circle">
                <Trees size={20} color="#10b981"/>
            </div>
            <div className="group-title-area">
                <h4>Cắm Trại Đà Lạt</h4>
                <span className="badge-role leader">THÀNH VIÊN</span>
            </div>
            </div>
            <div className="group-card-body">
                <p className="group-location"><MapPin size={14} /> Hồ Tuyền Lâm, Đà Lạt</p>
                <div className="group-stat-row">
                    <div className="stat-info">
                        <label>Tiếp theo:</label>
                        <span>25/10 | 16:00</span>
                    </div>
                </div>
                <div className="stat-info">
                    <label>Thành viên:</label>
                    <span>15 người</span>
                </div>
            </div>
                <button className="btn-view-group">Xem chi tiết</button>
            </div>

            {!showAll && (
          <div className="find-more-card">
            <div className="sparkle-icon-circle">
                <Sparkles size={28} />
            </div>
              <h4>Tìm kiếm thêm?</h4>
              <p>Khám phá hàng trăm nhóm khác đang chờ bạn.</p>
              <button 
                className="btn-view-all-community"
                onClick={() => setShowAll(true)} 
              >
                XEM TẤT CẢ CỘNG ĐỒNG
              </button>          
          </div>
        )}        
        </div>
        </div>       
    </div>
  );
};

export default ContentLoimoinhom;