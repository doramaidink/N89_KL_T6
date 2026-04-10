import React from "react";

const ContentBaocao = () => {
  return (
    <div className="baocao">

      {/* HEADER */}
      <div className="header-baocao">
        <h2>Báo cáo</h2>
        <p>Gửi phản hồi của bạn về các vấn đề gặp phải trên hành trình.</p>
      </div>

      {/* FORM */}
      <div className="form-baocao">
        <h3>➕ Tạo báo cáo mới</h3>

        <div className="row-baocao">
          <div className="field-baocao">
            <label>Loại báo cáo</label>
            <select>
              <option>An toàn hành trình</option>
              <option>Gian lận</option>
              <option>Khác</option>
            </select>
          </div>

          <div className="field-baocao">
            <label>Vị trí (nếu có)</label>
            <input placeholder="Ví dụ: Đèo Hải Vân, Đà Nẵng" />
          </div>
        </div>

        <div className="field-baocao">
          <label>Mô tả chi tiết</label>
          <textarea placeholder="Vui lòng mô tả chi tiết vấn đề bạn đang gặp phải..." />
        </div>

        {/* UPLOAD */}
        <div className="upload-baocao">
          <p>📤 Kéo thả hoặc <span>nhấn để tải lên</span></p>
          <small>Hỗ trợ PNG, JPG (tối đa 5MB)</small>
        </div>

        <button className="btn-submit-baocao">Gửi báo cáo</button>
      </div>

      {/* TABLE */}
      <div className="table-baocao">
        <h3>Lịch sử gửi báo cáo</h3>

        <table>
          <thead>
            <tr>
              <th>Mã báo cáo</th>
              <th>Ngày gửi</th>
              <th>Trạng thái</th>
              <th>Chi tiết</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>#RP-56214</td>
              <td>14/10/2023</td>
              <td><span className="status-baocao pending-baocao">ĐANG XỬ LÝ</span></td>
              <td>👁</td>
            </tr>

            <tr>
              <td>#RP-88722</td>
              <td>02/10/2023</td>
              <td><span className="status-baocao done-baocao">ĐÃ GIẢI QUYẾT</span></td>
              <td>👁</td>
            </tr>
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default ContentBaocao;