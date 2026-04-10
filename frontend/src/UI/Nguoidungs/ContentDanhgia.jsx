import React from "react";

const ContentDanhgia = () => {
  return (
    <div className="danhgia">

      {/* HEADER */}
      <div className="header-danhgia">
        <div>
          <h2>Đánh giá từ cộng đồng</h2>
          <p>Chia sẻ trải nghiệm của bạn về Rừng Dừa Sơn Trà</p>
        </div>

        <button className="btn-write-danhgia">✍ Viết đánh giá</button>
      </div>

      {/* OVERVIEW */}
      <div className="overview-danhgia">
        <div className="score-danhgia">
          <h1>4.8</h1>
          <div className="stars-danhgia">★★★★★</div>
          <p>Dựa trên 128 lượt đánh giá</p>
        </div>

        <div className="bars-danhgia">
          <div><span>5</span><div className="bar-danhgia"><div style={{width:"72%"}}></div></div><span>72%</span></div>
          <div><span>4</span><div className="bar-danhgia"><div style={{width:"18%"}}></div></div><span>18%</span></div>
          <div><span>3</span><div className="bar-danhgia"><div style={{width:"6%"}}></div></div><span>6%</span></div>
          <div><span>2</span><div className="bar-danhgia"><div style={{width:"3%"}}></div></div><span>3%</span></div>
          <div><span>1</span><div className="bar-danhgia"><div style={{width:"1%"}}></div></div><span>1%</span></div>
        </div>
      </div>

      {/* FORM */}
      <div className="form-danhgia">
        <h3>📝 Đánh giá của bạn</h3>

        <div className="stars-input-danhgia">★★★★★</div>

        <textarea placeholder="Chia sẻ chi tiết về trải nghiệm của bạn..." />

        <div className="upload-danhgia">
          <p>📤 Nhấn để tải lên hoặc kéo thả ảnh</p>
        </div>

        <button className="btn-submit-danhgia">ĐĂNG ĐÁNH GIÁ</button>
      </div>

      {/* LIST */}
      <div className="list-danhgia-danhgia">

        {/* ITEM 1 */}
        <div className="item-danhgia">
          <div className="top-danhgia">
            <img src="/public/img/avatar.jpg" />
            <div>
              <h4>Nguyễn Minh Anh</h4>
              <span>6 tháng trước</span>
            </div>
            <div className="stars-danhgia">★★★★★</div>
          </div>

          <p>
            Rừng Dừa Sơn Trà mùa này thật sự rất đẹp. Không khí trong lành, mát mẻ...
          </p>

          <div className="images-danhgia">
            <img src="/img/forest.jpg" />
            <img src="/img/forest2.jpg" />
            <img src="/img/mountain.jpg" />
            <div className="more-danhgia">+2</div>
          </div>

          <div className="actions-danhgia">
            <span>👍 24 Thích</span>
            <span>💬 Chia sẻ</span>
            <span>🚩 Báo cáo</span>
          </div>
        </div>

        {/* ITEM 2 */}
        <div className="item-danhgia">
          <div className="top-danhgia">
            <img src="/img/avatar2.jpg" />
            <div>
              <h4>Lê Văn Hùng</h4>
              <span>8 tháng trước</span>
            </div>
            <div className="stars-danhgia">★★★★★</div>
          </div>

          <p>
            Địa điểm tuyệt vời để đi trekking cuối tuần. Yên tĩnh và rất mát.
          </p>

          <div className="actions-danhgia">
            <span>👍 12 Thích</span>
            <span>💬 Chia sẻ</span>
            <span>🚩 Báo cáo</span>
          </div>
        </div>

      </div>

    </div>
  );
};

export default ContentDanhgia;