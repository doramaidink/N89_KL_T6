import React, { useRef, useState, useEffect } from "react";
import { Camera, PlusCircle, X } from "lucide-react";

const ContentHoso = () => {
  const avatarInputRef = useRef(null);
  const locationInputRef = useRef(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [locationImages, setLocationImages] = useState([]);

  const handleFileChangeAvatar = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setAvatarPreview(imageUrl);
      console.log("File đã chọn:", file.name);
    }
  };
  const handleFileChangeLocation = (e) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const filesArray = Array.from(e.target.files);   
    const newPreviews = filesArray.map(file => {
      if (!file.type.startsWith('image/')) return null;     
      return {
        id: Math.random().toString(36).substring(2, 11),
        url: URL.createObjectURL(file)
      };
    }).filter(item => item !== null); 
    setLocationImages(prev => [...prev, ...newPreviews]);
    e.target.value = ""; 
  };

  useEffect(() => {
    return () => {
      locationImages.forEach(img => URL.revokeObjectURL(img.url));
    };
  }, [locationImages]);

  const removeImage = (id, url) => {
    URL.revokeObjectURL(url);
    setLocationImages(prev => prev.filter(img => img.id !== id));
  };
  return (
    <div className="doitac-content-hoso">
        <div className="hoso-edit-container">
        {/* TITLE */}
        <div className="hoso-title">
          <h2>Chỉnh sửa hồ sơ đối tác</h2>
          <p>Cập nhật thông tin cá nhân và chi tiết hướng dẫn của bạn để thu hút nhiều du khách hơn</p>
        </div>

        <div className="hoso-two-columns-layout">         
          <div className="hoso-column-left">
          {/* Ảnh đại diện */}
          <div className="hoso-edit-card avatar">
            <div className="avatar-edit-wrapper">
              <img src={avatarPreview || "/img/doitac.jpg"} alt="Avatar" />
              <button className="change-photo-overlay" onClick={() => avatarInputRef.current.click()}>
                <Camera size={20} />               
              </button>
              <input 
                type="file" 
                ref={avatarInputRef} 
                onChange={handleFileChangeAvatar} 
                hidden 
                accept="image/*" 
              />
            </div>
            <p className="avatar-hoso">Ảnh đại diện</p>
            <p className="avatar-hint">Định dạng JPG, PNG. Kích thước 400x400px.</p>
          </div>

          {/* Liên lạc */}
          <div className="hoso-edit-card">
            <div className="input-group-with-icon">             
              <label>Số CCCD</label>
              <div className="input-wrapper">
                <img src="/img/cccd.jpg" alt="CCCD" className="input-icon" />
                <input type="text" defaultValue="048201004567" />
              </div>
            </div>
            <div className="input-group-with-icon">             
              <label>Số điện thoại</label>
              <div className="input-wrapper">
                <img src="/img/dienthoai.jpg" alt="Sodienthoai" className="input-icon" />
                <input type="text" defaultValue="0905 123 456" />
              </div>
            </div>
          </div>
 
          {/* Mô tả */}
          <div className="hoso-edit-card">
            <div className="input-group">
              <label>Mô tả bản thân</label>
              <textarea rows="6" >Xin chào, mình là Nam. Mình yêu thích thiên nhiên và muốn mang đến cho du khách những trải nghiệm chân thực nhất về con người và cảnh vật Đà Nẵng.</textarea>
            </div>
          </div>
          </div>
         
          <div className="hoso-column-right">
          {/* Thông tin cá nhân */}
          <div className="hoso-edit-card">
            <div className="input-group">
              <label>Tên (Full Name)</label>
              <input type="text" defaultValue="Nguyễn Thành Nam" />
            </div>
            <div className="input-group">
              <label>Địa chỉ liên hệ</label>
              <input type="text" defaultValue="123 Nguyễn Văn Linh, Quận Hải Châu, Đà Nẵng" />
            </div>
            <div className="form-row">
              <div className="input-group">
                <label>Tỉnh thành đăng ký</label>
                <select>
                  <option>Đà Nẵng</option>
                  <option>Quảng Nam</option>
                  <option>Thừa Thiên Huế</option>
                </select>
              </div>
              <div className="input-group">
                <label>Số năm kinh nghiệm</label>
                <input type="number" defaultValue="5" />
              </div>
            </div>
          </div>

          {/* Nghiệp vụ */}
          <div className="hoso-edit-card">           
              <div className="input-group">
                <label>Địa điểm hướng dẫn</label>
                <input type="text" defaultValue="Rừng dâu, Bán đảo Sơn Trà, Đà Nẵng" />
              </div>
              <div className="form-row">
              <div className="input-group">
                <label>Mức giá (VND/Ngày)</label>
                <div className="input-with-suffix">
                  <input type="text" defaultValue="100,000" />
                  <span className="suffix">VNĐ</span>
                </div>                
              </div>
              <div className="input-group"> 
                <label>Ngôn ngữ sử dụng</label>
                <input type="text" defaultValue="Tiếng Việt, Tiếng Anh (IELTS 7.0)" />
              </div>
            </div>           
            <div className="input-group">
              <label>Kinh nghiệm</label>
              <textarea rows="3">Đã dẫn hơn 200 tour xuyên rừng tại Sơn Trà và các tour văn hóa Hội An.</textarea>
            </div>
            <div className="location-upload-wrapper">
              <div className="location-preview-list">
                {locationImages.map((img) => (
                  <div key={img.id} className="preview-card">
                  <img src={img.url} alt="Preview" />
                  <button 
                    type="button" 
                    className="delete-preview"
                    onClick={() => removeImage(img.id, img.url)}
                  >
                    <X size={14} />
                  </button>
                  </div>
                ))}
              </div>
              <div className="btn-add-location" onClick={() => locationInputRef.current.click()}>
                <div className="content-add-location">
                  <div className="plus-circle"><PlusCircle size={20} /></div>
                  <span> THÊM ĐỊA ĐIỂM HƯỚNG DẪN MỚI</span>
                </div>
                <input 
                  type="file" 
                  ref={locationInputRef} 
                  onChange={handleFileChangeLocation} 
                  hidden 
                  multiple 
                  accept="image/png, image/jpeg, image/jpg" 
                />
              </div>
            </div>          
          </div>
        </div>  
        </div>
            {/* Button */}
            <div className="hoso-actions">
              <button className="btn-cancel"> Hủy bỏ </button>
              <button className="btn-save"> Lưu thay đổi </button>
            </div>              
        </div>
    </div>
  );
};

export default ContentHoso;