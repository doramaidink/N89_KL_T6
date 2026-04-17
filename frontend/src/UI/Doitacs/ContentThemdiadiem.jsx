import React, { useState, useRef } from "react";
import { Save, X, MapPin, Info, FileText, Plus, Upload, Image as ImageIcon } from "lucide-react";

const ContentThemdiadiem = () => {
  const [tags, setTags] = useState([
    { id: 1, label: "Trong rừng", icon: "🌲", active: true },
    { id: 2, label: "Không thu phí", icon: "💸", active: true },
    { id: 3, label: "Dễ tiếp cận", icon: "🚶", active: false },
    { id: 4, label: "Gần nguồn nước", icon: "💧", active: false },
  ]);

  const [newTagInput, setNewTagInput] = useState("");

  const handleAddTag = () => {
    if (newTagInput.trim() !== "") {
      const newTag = {
        id: Date.now(),
        label: newTagInput,
        icon: <MapPin size={14} />,
        active: false
      };
      setTags([...tags, newTag]);
      setNewTagInput("");
    }
  };

  const [selectedTags, setSelectedTags] = useState([1, 2]);

  const toggleTag = (id) => {
    setTags(prevTags => 
      prevTags.map(tag => 
        tag.id === id ? { ...tag, active: !tag.active } : tag
      )
    );
  };

  const [images, setImages] = useState([
    { id: "img1", url: "/img/place1.jpg" }, 
    { id: "img2", url: "/img/place2.jpg" }
  ]);

  const fileInputRef = useRef(null);

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImgs = files.map(file => ({
      id: Math.random().toString(36).substring(2, 9),
      url: URL.createObjectURL(file)
    }));
    setImages(prev => [...prev, ...newImgs]);
    e.target.value = null; 
  };

  const handleRemoveImage = (id) => {
    setImages(images.filter(img => img.id !== id));
  };

  return (
    <div className="doitac-content-them">
      <div className="them-header">
        {/* TITLE */}
        <div className="them-title">
          <h2>Thêm địa điểm mới</h2>
          <p>Chia sẻ những tọa độ trekking và cắm trại bí mật của bạn với cộng đồng.</p>
        </div>
        {/* Button */}
        <div className="them-actions">
          <button className="btn-cancel-them"> Hủy bỏ</button>
          <button className="btn-save-them"><Save size={18} /> Lưu địa điểm</button>
        </div>
      </div>

      <div className="them-grid-layout">      
        <div className="them-column-left">
          {/* Thông tin cơ bản */}
          <div className="them-box">
            <h4 className="box-label-green"><MapPin size={16} /> THÔNG TIN CƠ BẢN</h4>
            <div className="input-group">
              <label>TÊN ĐỊA ĐIỂM</label>
              <input type="text" placeholder="VD: Đỉnh Bàn Cờ, Hang Én..." />
            </div>
            <div className="form-row">
              <div className="input-group">
                <label>KHU VỰC</label>
                <div className="input-with-icon">
                  <MapPin size={16} className="inner-icon" />
                  <input type="text" placeholder="Sơn Trà, Đà Nẵng" />
                </div>
              </div>
              <div className="input-group">
                <label>ĐỘ KHÓ</label>
                <select>
                  <option>Dễ</option>
                  <option>Trung bình</option>
                  <option>Khó</option>
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="input-group">
                <label>QUÃNG ĐƯỜNG (NẾU CÓ)</label>
                <input type="text" placeholder="VD: 5km trekking" />
              </div>
              <div className="input-group">
                <label>VÉ VÀO (NẾU CÓ)</label>
                <input type="text" placeholder="VD: 20.000đ hoặc Miễn phí" />
              </div>
            </div>
          </div>

          {/* Mô tả chi tiết */}
          <div className="them-box">
            <h4 className="box-label-green"><FileText size={16} /> MÔ TẢ CHI TIẾT</h4>
            <textarea rows="6" placeholder="Chia sẻ kinh nghiệm di chuyển, thời điểm đẹp nhất, và những lưu ý quan trọng..."></textarea>
          </div>

          {/* Giới thiệu */}
          <div className="them-box">
            <h4 className="box-label-green"><Info size={16} /> GIỚI THIỆU</h4>
            <textarea rows="4" placeholder="Giới thiệu ngắn gọn về địa điểm..."></textarea>
          </div>
        </div>

        <div className="them-column-right">
          {/* Đặc điểm địa danh */}
          <div className="them-box">
            <h4 className="box-label-green">🛠 ĐẶC ĐIỂM ĐỊA DANH</h4>
            <div className="tag-container">
              {tags.map(tag => (
                <button key={tag.id} className={`tag-item ${tag.active ? 'active' : ''}`} onClick={() => toggleTag(tag.id)}>
                  {tag.icon}
                  <span>{tag.label}</span>
                </button>
              ))}
            </div>
            <div className="add-tag-wrapper">            
              <button className="btn-add-tag">
                <Plus size={18} className="add-icon"/>
              </button>
              <input 
                type="text" 
                placeholder="Thêm đặc điểm mới..." 
                value={newTagInput}
                onChange={(e) => setNewTagInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
              />
            </div>
          </div>

          {/* Tải lên hình ảnh */}
          <div className="upload-section">
            <button className="upload-main-dropzone" onClick={() => fileInputRef.current.click()}>
              <Upload size={32} className="upload-icon" />
              <p>Tải lên hình ảnh thực tế</p>
              <span>Kéo thả hoặc nhấn để chọn file (JPG, PNG tối đa 10MB)</span>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleImageUpload} 
                hidden 
                multiple 
                accept="image/*" 
              />
            </button>
            <div className="upload-preview-grid">
              {images.map(img => (
                <div key={img.id} className="preview-item">
                  <img src={img.url} alt="Preview" />
                  <button type="button" className="btn-remove-image" onClick={() => handleRemoveImage(img.id)}>
                    <X size={12} />
                  </button>
                </div>
              ))}
              <div className="preview-item add-more-img">
                <ImageIcon size={24} />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* FOOTER */}
      <div className="them-footer-info">
        <div>
          <span>🛡️ Thông tin bảo mật </span>
          <span>🕒 Tự động lưu 2 phút trước</span>
        </div>
        <div> 
          <span>POWERED BY BACKPACKING VIETNAM DATA ENGINE</span>
        </div>
      </div>
    </div>
  );
};

export default ContentThemdiadiem;