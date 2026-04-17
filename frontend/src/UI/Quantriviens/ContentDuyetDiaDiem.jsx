import React, { useState } from 'react'; 
import { Search, MapPin, Eye } from 'lucide-react';
import ModalChiTietDiaDiem from '../../UI/Quantriviens/ModalChiTietDiaDiem';

const ContentDuyetDiaDiem = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);

  const data = [
    { id: '#LOC-10245', name: 'Rừng Dâu Sơn Trà', type: 'Khu nghỉ dưỡng & Cắm trại', city: 'Đà Nẵng', pInit: 'ST', pName: 'Sơn Trà Eco Hub', pColor: '#065f46', more: true, hideReject: false, description: 'Khu vực cắm trại tự nhiên với view biển Sơn Trà cực đẹp...' },
    { id: '#LOC-10246', name: 'Đỉnh Gió', type: 'Điểm tham quan & Checkin', city: 'Sa Pa', pInit: 'SV', pName: 'Sapa Village Tour', pColor: '#4c1d95', more: false, description: 'Đỉnh núi cao nhất khu vực với sương mù bao phủ quanh năm.' },
    { id: '#LOC-10247', name: 'Thác K50', type: 'Vườn quốc gia', city: 'Thanh Hóa', pInit: 'PL', pName: 'Pù Luông Retreat', pColor: '#3f3f46', more: false, description: 'Vẻ đẹp hoang sơ giữa đại ngàn Tây Nguyên.' },
    { id: '#LOC-10248', name: 'Thác Bản Giốc Camping', type: 'Khu cắm trại ven thác', city: 'Cao Bằng', pInit: 'CB', pName: 'Cao Bằng Adventure', pColor: '#064e3b', more: false, description: 'Trải nghiệm cắm trại ngay bên cạnh một trong những thác nước đẹp nhất thế giới.' },
  ];

  const handleViewDetails = (item) => {
    setSelectedLocation(item);
    setIsModalOpen(true);
  };

  return (
    <div className="duyet-container">
      <div className="duyet-header">
        <h2 className="duyet-title">Duyệt địa điểm</h2>
        <button className="duyet-btn-muted">Đã từ chối</button>
      </div>

      <div className="duyet-search-section">
        <div className="duyet-input-wrapper">
          <Search size={18} className="duyet-icon-search" />
          <input type="text" placeholder="Tìm kiếm địa điểm, đối tác..." />
        </div>
      </div>

      <div className="duyet-table-scroll custom-scrollbar">
        <table className="duyet-table">
          <thead>
            <tr>
              <th style={{ width: '80px' }}>ID</th>
              <th>ĐỊA ĐIỂM & HÌNH ẢNH</th>
              <th style={{ width: '130px' }}>VỊ TRÍ</th>
              <th style={{ width: '220px' }}>ĐỐI TÁC GỬI</th>
              <th style={{ width: '140px' }}>TRẠNG THÁI</th>
              <th style={{ width: '180px' }}>THAO TÁC</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.id}>
                <td className="duyet-text-muted">{item.id}</td>
                <td>
                  <div className="duyet-loc-cell">
                    <div className="duyet-img-group">
                      
                      <div className="duyet-img-main">
                      </div>
                      <div className="duyet-img-side">
                        <div className="duyet-img-sub">
                        </div>
                        <div className="duyet-img-sub duyet-more-count">
                        </div>
                      </div>
                    </div>
                    <div className="duyet-loc-info">
                      <div className="duyet-loc-name">{item.name}</div>
                      <div className="duyet-loc-type duyet-text-muted">{item.type}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <div className="duyet-flex-align">
                    <MapPin size={14} className="duyet-color-green" />
                    <span>{item.city}</span>
                  </div>
                </td>
                <td>
                  <div className="duyet-flex-align">
                    <div className="duyet-avatar" style={{ backgroundColor: item.pColor }}>{item.pInit}</div>
                    <span className="duyet-p-name">{item.pName}</span>
                  </div>
                </td>
                <td>
                  <div className="duyet-status-wait">
                    <span className="duyet-dot-amber"></span>
                    <span>CHỜ DUYỆT</span>
                  </div>
                </td>
                <td>
                  <div className="duyet-actions">
                    <button className="duyet-btn-approve">DUYỆT</button>
                    {!item.hideReject && <button className="duyet-btn-reject">TỪ CHỐI</button>}
                    <button 
                      className="duyet-btn-view" 
                      onClick={() => handleViewDetails(item)}
                    >
                      <Eye size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>


      <div className="duyet-pagination">
        <div className="duyet-text-muted" style={{ fontSize: '13px' }}>Hiển thị 1 - 4 của 300 địa điểm</div>
        <div className="duyet-page-btns">
          <button className="duyet-page-nav">{'<'}</button>
          <button className="duyet-page-num active">1</button>
          <button className="duyet-page-num">2</button>
          <button className="duyet-page-num">3</button>
          <span className="duyet-text-muted">...</span>
          <button className="duyet-page-num">15</button>
          <button className="duyet-page-nav">{'>'}</button>
        </div>
      </div>

      <ModalChiTietDiaDiem 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        data={selectedLocation} 
      />
    </div>
  );
};

export default ContentDuyetDiaDiem;