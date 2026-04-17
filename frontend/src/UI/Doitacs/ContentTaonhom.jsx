import React, { useState } from 'react';
import { MapPin, Users, ChevronDown, AlarmClock, Calendar, Info, ShieldAlert, ChevronRight, ChevronLeft, Plus, CheckCircle2, ShieldCheck, UserCheck, AlertCircle, PlusCircle } from 'lucide-react';

const ContentTaonhom = ({ onCancel }) => {
  const [currentStep, setCurrentStep] = useState(1);

  const handleClose = () => {
    setCurrentStep(1); 
    onCancel();
  };
  return (
    <div className="taonhom-overlay">
      <div className="taonhom-backdrop" onClick={onCancel}></div>
      {/* TITLE */}
      <div className="taonhom-card">
        <div className="taonhom-header">
          <h1>Tạo Nhóm Trekking Mới</h1>
          <p>Thiết lập thông tin nhóm và đảm bảo an toàn cho hành trình của bạn.</p>
          <div className="taonhom-stepper">
          <div className="stepper-line"></div>
          <div className="step-item">
            <div className={`step-circle ${currentStep >= 1 ? 'active' : ''}`}>1</div>
            <span className={`step-text ${currentStep >= 1 ? 'active' : ''}`}>Thông tin chung</span>
          </div>
          <div className="step-item">
            <div className={`step-circle ${currentStep >= 2 ? 'active' : ''}`}>2</div>
            <span className={`step-text ${currentStep >= 2 ? 'active' : ''}`}>Lịch trình</span>
          </div>
          <div className="step-item">
            <div className={`step-circle ${currentStep === 3 ? 'active' : ''}`}>3</div>
            <span className={`step-text ${currentStep === 3 ? 'active' : ''}`}>An toàn</span>
          </div>
          </div>
        </div>

        {/* CONTENT */}
        {currentStep === 1 && (
          <div className="step-1-content">
        <div className="taonhom-form-body">
        <div className="form-group">          
          <label>Địa điểm trekking</label>
          <div className="input-wrap-with-icons">
            <MapPin className="input-icon-start" size={18} />
            <input className="input-main input-padding-custom" value="Rừng Dầu Sơn Trà, Đà Nẵng"  readOnly />
            <span className="input-badge-end">CỐ ĐỊNH</span>
          </div>
        </div>
        <div className="form-group">
          <label>Tên nhóm</label>
          <input className="input-main" placeholder="Ví dụ: Chinh phục Rừng Dầu Cuối Tuần" />
        </div>
        <div className="grid-taonhom">         
          <div className="form-group">
            <label>Thời gian kết thúc dự kiến</label>
            <div className="input-wrap-with-icons">
              <AlarmClock className="input-icon-start" size={18} />
              <input 
                type="datetime-local" 
                className="input-main input-padding-left" 
              />
            </div>
            <p className="input-sub-text">
            * Hệ thống sẽ kích hoạt cảnh báo nếu bạn không check-out sau giờ này.
            </p>
          </div>
          <div className="form-group">
            <label>Ngày & Giờ khởi hành</label>
            <div className="input-wrap-with-icons">
              <Calendar className="input-icon-start" size={18} />
              <input 
                type="datetime-local" 
                className="input-main input-padding-left" 
              />
            </div>
          </div>
        </div>
        <div className="form-group">
          <label>Số lượng thành viên tối đa</label>
          <div className="grid-taonhom">
            <div className="input-wrap-with-icons">
              <Users className="input-icon-start" size={18} />
              <input 
                type="text" 
                className="input-main input-padding-left" 
                placeholder="Tối đa 20 người" 
              />
            </div>
            <div className="input-wrap-with-icons">
              <select className="input-main select-custom">
                <option>Trung bình (Có kinh nghiệm)</option>
                <option>Người mới bắt đầu</option>
                <option>Chuyên gia / Trợ lý</option>
              </select>
              <ChevronDown className="input-icon-end" size={18} />
            </div>
          </div>
        </div>
        <div className="info-box-blue">
          <Info size={20} color="#60a5fa" />
          <p className="info-text-blue">
            Lưu ý: Nhóm sẽ tự động giải tán và xóa dữ liệu sau 30 ngày kể từ ngày kết thúc chuyến đi để đảm bảo bảo mật dữ liệu.
          </p>
        </div>
        <div className="form-group">
          <label>Mô tả chuyến đi</label>
          <textarea 
            className="input-main textarea-custom" 
            placeholder="Chia sẻ về lịch trình cụ thể, vật dụng cần mang theo và các yêu cầu khác cho thành viên..."
            rows="4"
          ></textarea>
        </div>
        <div className="safety-box-orange">
          <div className="safety-header">
            <ShieldAlert color="#f97316" size={24} />
            <span className="safety-title">Cam kết An toàn & Hệ thống Cảnh báo Muộn</span>
          </div>
          <p className="safety-desc">
            Bằng việc tạo nhóm này, bạn đồng ý kích hoạt
            <span className="safety-system"> Hệ thống Giám sát Thông minh</span>. Nếu nhóm không hoàn tất check-out trước thời gian dự kiến 30 phút, hệ thống sẽ tự động gửi tin nhắn SOS cho đội cứu hộ tại địa phương và người thân liên hệ khẩn cấp.
          </p>
          <label className="checkbox-container">
            <input type="checkbox" className="hidden-checkbox"/>
            <span className="custom-checkmark"></span>
            <span className="checkbox-text">Tôi cam kết tuân thủ các quy trình an toàn và chấp nhận các điều khoản trên.</span>
          </label>
        </div>
        <div className="taonhom-footer">
          <button className="btn-huy" onClick={onCancel}>Hủy bỏ</button>
          <div className="footer-btns-right">
            <button className="btn-luu">Lưu bản nháp</button>
            <button className="btn-tiep" onClick={() => setCurrentStep(2)}>
              Tiếp theo: Thiết lập Lịch trình <ChevronRight size={18} />
            </button>
          </div>
        </div>
        </div>
      </div>     
    )}
    {currentStep === 2 && (
      <div className="step-2-content">
        <div className="taonhom-form-body timeline-box">
          <div className="timeline-header">
            <Calendar size={18} color="#d69e66" />
            <h3>Tập Trung</h3>
          </div>         
          <div className="timeline-item">
            <div className="timeline-line-vertical"></div>
            <div className="timeline-point"></div>            
            <div className="grid-taonhom">
               <div className="form-group">
                 <label>THỜI GIAN XUẤT PHÁT</label>
                 <input className="input-main" placeholder="VD: 08:00 AM" />
               </div>
               <div className="form-group">
                 <label>ĐỊA ĐIỂM / HOẠT ĐỘNG</label>
                 <input className="input-main" placeholder="Tập trung tại điểm ......" />
               </div>
            </div>
            <div className="form-group">
              <input className="input-main textarea-small" placeholder="Ghi chú:" />
            </div>
            <div className="timeline-point bottom-point"></div>
            <div className="form-group">
              <label>THỜI GIAN KẾT THÚC</label>
              <input className="input-main width-50" placeholder="VD: 05:00 PM" />
            </div>
          </div>
        </div>
        <div className="btn-add-day">
           <Plus size={24} color="#5a5a52" />
           <h4>Thêm Ngày mới</h4>
           <p>Mở rộng lịch trình cho chuyến đi dài ngày</p>
        </div>
        <div className="taonhom-footer">
          <button className="btn-back" onClick={() => setCurrentStep(1)}>
            <ChevronLeft size={18} /> Quay lại
          </button>
          <button className="btn-tiep" onClick={() => setCurrentStep(3)}>
            Tiếp theo: Thiết lập An toàn <ChevronRight size={18} />
          </button>
        </div>
      </div>
      )}
    {currentStep === 3 && (
      <div className="step-3-content">
        <div className="taonhom-header-step">
          <h2>Thiết lập An toàn & Xác minh</h2>
          <p>Đảm bảo an toàn cho tất cả thành viên trong suốt hành trình trekking.</p>
        </div>
        <div className="safety-section-dark">
          <div className="section-title-row">
            <ShieldCheck size={20} color="#10b981" />
            <span className="text-emerald">Cam kết an toàn</span>
          </div>   
        <div className="checkbox-list">
          <label className="checkbox-container">
            <input type="checkbox" className="hidden-checkbox" />
            <span className="custom-checkmark"></span>
            <span className="checkbox-label">Tôi đồng ý tuân thủ các giao thức an toàn và hướng dẫn của trưởng đoàn.</span>
          </label>      
          <label className="checkbox-container">
            <input type="checkbox" className="hidden-checkbox" />
            <span className="custom-checkmark"></span>
            <span className="checkbox-label">Tôi hiểu rõ các rủi ro địa hình và thời tiết có thể xảy ra trong chuyến đi.</span>
          </label>        
          <label className="checkbox-container">
            <input type="checkbox" className="hidden-checkbox" />
            <span className="custom-checkmark"></span>
            <span className="checkbox-label">Tôi cam kết thực hiện điểm danh (check-in/out) tại các trạm dừng đúng quy định.</span>
          </label>
        </div>
      </div>
    <div className="verification-box">
      <div className="verif-header">
        <div className="verif-info">
          <UserCheck size={22} color="#10b981" />
          <div>
            <h4>Xác minh nâng cao (Advanced Verification)</h4>
            <span className="verif-link">Bạn đã hoàn tất xác minh danh tính</span>
          </div>
        </div>
        <CheckCircle2 size={20} color="#10b981" />
      </div>
      <p className="verif-note">
        <strong>Lưu ý:</strong> Chuyến đi này yêu cầu <strong>tất cả thành viên</strong> phải có tích xanh xác minh danh tính để đảm bảo an toàn cộng đồng.
      </p>
    </div>
    <div className="emergency-contact">
      <h3>Thông tin liên hệ khẩn cấp</h3>
      <div className="grid-taonhom">
        <div className="form-group">
          <label>Họ và tên người thân</label>
          <input className="input-main" placeholder="Nguyễn Văn A" />
        </div>
        <div className="form-group">
          <label>Số điện thoại khẩn cấp</label>
          <input className="input-main" placeholder="0901 234 567" />
        </div>
      </div>
      <button className="btn-add-contact">
        <PlusCircle size={16} /> Thêm liên hệ khác
      </button>
    </div>
    <div className="reminder-box">
      <AlertCircle size={20} color="#d97706" />
      <p>
        <strong>Nhắc nhở:</strong> Nhóm sẽ tự động được đóng và dữ liệu liên lạc nội bộ sẽ được xóa sau 30 ngày kể từ khi chuyến đi kết thúc để bảo vệ quyền riêng tư.
      </p>
    </div>
    <div className="taonhom-footer">
      <button className="btn-back" onClick={() => setCurrentStep(2)}>
        Quay lại
      </button>
      <button className="btn-finish" onClick={handleClose}>
        Hoàn tất & Tạo Nhóm
      </button>
    </div>
  </div>
    )}
    </div>
    </div>
  );
};

export default ContentTaonhom;