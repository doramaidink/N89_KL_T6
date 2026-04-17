import React from "react";

const ContentGroupchat = () => {
  return (
    <div className="nhomchat">
      {/* ===== LEFT SIDEBAR ===== */}
      <div className="sidebar-nhomchat">
        <div className="header-sidebar-nhomchat">
          <div className="icon-group-nhomchat"></div>
          <div>
            <h3>Chinh phục Rừng dầu</h3>
            <span className="status-nhomchat">NHÓM ĐANG HOẠT ĐỘNG</span>
          </div>
        </div>

        <div className="section-nhomchat">
          <p className="title-nhomchat">THAO TÁC NHANH</p>
          <div className="item-nhomchat"><span></span><p>Mời thành viên</p></div>
          <div className="item-nhomchat"><span></span><p>Kho ảnh nhóm</p></div>
        </div>

        <div className="section-nhomchat">
          <p className="title-nhomchat">THÔNG TIN CHUYẾN ĐI</p>
          <div className="item-nhomchat"><span></span><p>Điểm hẹn</p></div>
          <div className="item-nhomchat"><span></span><p>Mô tả chuyến đi</p></div>
          <div className="item-nhomchat"><span></span><p>Cam kết</p></div>
        </div>
      </div>

      {/* ===== CHAT ===== */}
      <div className="chat-nhomchat">

        <div className="date-nhomchat">HÔM NAY</div>

        <div className="msg left-nhomchat">
          <img src="/img/user1.jpg" />
          <div>
            <p className="name-nhomchat">Minh Hoàng</p>
            <div className="bubble-nhomchat">
              Cho hỏi mình đi mấy tầm mấy km ha
            </div>
            <span className="time-nhomchat">14:20</span>
          </div>
        </div>

        <div className="msg right-nhomchat">
          <div className="bubble-nhomchat me">
            Chắc 10km á bạn
          </div>
          <span className="time-nhomchat">14:25</span>
        </div>

        <div className="msg left-nhomchat">
          <img src="/img/user2.jpg" />
          <div>
            <p className="name-nhomchat">Linh</p>
            <div className="bubble-nhomchat">
              Có ai đi sớm hơn không
            </div>
            <span className="time-nhomchat">14:27</span>
          </div>
        </div>

        {/* ===== INPUT CHAT ===== */}
        <div className="input-wrapper-nhomchat">
          <div className="input-nhomchat">
            <input placeholder="Message the trek group..." />
            <button>Gửi</button>
          </div>
        </div>

      </div>

      {/* ===== RIGHT PANEL ===== */}
      <div className="info-nhomchat">   

        <div className="box-nhomchat">
          <p className="title-box-nhomchat">THÔNG TIN HÀNH TRÌNH</p>

          <div className="trip-item-nhomchat">
            <div className="icon-nhomchat">🚌</div>
            <div>
              <p className="trip-title-nhomchat">ĐỊA ĐIỂM TẬP TRUNG</p>
              <h4>10h00</h4>
              <span>Trạm gác Sơn Trà, Đà Nẵng</span>
            </div>
          </div>

          <div className="trip-item-nhomchat">
            <div className="icon-nhomchat">🏁</div>
            <div>
              <p className="trip-title-nhomchat">ĐỊA ĐIỂM CHIA TAY</p>
              <h4>19h00</h4>
              <span>Trạm gác Sơn Trà, Đà Nẵng</span>
            </div>
          </div>
        </div>

        <div className="box-nhomchat">
          <p className="title-box-nhomchat">THÀNH VIÊN NHÓM (12)</p>

          <div className="member-nhomchat">
            <img src="/img/user1.jpg" />
            <div>
              <p>Linh</p>
              <span className="leader-nhomchat">Dẫn đoàn</span>
            </div>
            <span className="status-dot-nhomchat"></span>
          </div>

          <div className="member-nhomchat">
            <img src="/img/user2.jpg" />
            <div>
              <p>Minh Hoàng</p>
              <span>Đã xác minh</span>
            </div>
            <span className="status-dot-nhomchat"></span>
          </div>

        </div>

      </div>
    </div>
  );
};

export default ContentGroupchat;