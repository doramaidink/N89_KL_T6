import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import ContentChitietyeucau from "./ContentChitietyeucau";

const formatMoney = (n = 0) => Number(n || 0).toLocaleString("vi-VN");

const ContentBangdieukhien = () => {

  const [loiMoi, setLoiMoi] = useState([]);
  useEffect(() => {
    const fetchLoiMoi = async () => {
      try {
        const user = getUser();
        const doiTacId = user?.doiTacId;

        if (!doiTacId) return;

        const res = await fetch(
          `http://localhost:5000/loimoi?doiTacId=${doiTacId}`
        );

        const data = await res.json();

        setLoiMoi(data.loiMois || []);
      } catch (err) {
        console.log(err);
      }
    };

    fetchLoiMoi();
  }, []);

  const [selectedRequest, setSelectedRequest] = useState(null);
  // const { slug } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const getUser = () => {
    return (
      JSON.parse(localStorage.getItem("user")) ||
      JSON.parse(localStorage.getItem("nguoiDung")) ||
      JSON.parse(localStorage.getItem("account"))
    );
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = getUser();

        console.log("USER DEBUG:", user);

        const userId = user?._id || user?.id;

        if (!userId) {
          setError("Bạn chưa đăng nhập");
          return;
        }

        const res = await fetch(`http://localhost:5000/doitac/${userId}/dashboard`);
        const result = await res.json();

        console.log("DASHBOARD DATA:", result);

        if (!res.ok) {
          setError(result.message || "Lỗi lấy dashboard");
          return;
        }

        setData(result);

      } catch (err) {
        console.log(err);
        setError("Lỗi kết nối server");
      }
    };

    fetchData();
  }, []);

  const maxChart = useMemo(() => {
    if (!data?.miniChart?.length) return 1;
    return Math.max(...data.miniChart.map(x => x.value || 0), 1);
  }, [data]);

  // ❗ hiển thị lỗi
  if (error) {
    return (
      <div className="doitac-content-bangdieukhien">
        <h3 style={{ color: "red" }}>{error}</h3>
      </div>
    );
  }

  if (!data) return <div className="doitac-content-bangdieukhien">Đang tải...</div>;

  return (
    <div className="doitac-content-bangdieukhien">
      <div className="doitac-title">
        <h2>Chào {data.doiTac?.hoTen || "Đối tác"}</h2>
        <p className="doitac-subtitle">
          Dưới đây là tổng quan về hoạt động kinh doanh của bạn hôm nay.
        </p>
      </div>

      <div className="doitac-stats">
        <div className="doitac-card income-card">
          <div className="doitac-income-card-header">
            <p className="doitac-card-label">TỔNG THU NHẬP THÁNG NÀY</p>
            <span className="doitac-card-growth">Thực tế</span>
          </div>
          <h2 className="doitac-card-value">
            {formatMoney(data.stats?.tongThuNhapThang)} <span className="doitac-unit">VND</span>
          </h2>
          <div className="doitac-mini-chart">
            {(data.miniChart || []).map((item, idx) => {
              const h = `${Math.max((item.value / maxChart) * 100, 10)}%`;
              return <div key={idx} className={`bar ${idx === data.miniChart.length - 1 ? "active" : ""}`} style={{ height: h }}></div>;
            })}
          </div>
        </div>

        <div className="doitac-card rating-card">
          <p className="doitac-card-label">ĐÁNH GIÁ</p>
          <h2 className="doitac-card-value">
            {data.stats?.diemTrungBinh || 0} <span className="doitac-stars">★★★★★</span>
          </h2>
          <span className="doitac-card-rate">Dựa trên {data.stats?.tongDanhGia || 0} lượt đánh giá</span>
        </div>

        <div className="doitac-card request-card">
          <div className="doitac-request-icon-box">
            <span className="doitac-icon">📋</span>
            <span className="doitac-request-text">Yêu cầu mới</span>
          </div>
          <div className="doitac-request-main">
            <h2 className="doitac-card-value-orange">
              {String(data.stats?.yeuCauMoi || 0).padStart(2, "0")}
            </h2>
          </div>
          <p className="doitac-card-subtext">Cần phản hồi trong 24h</p>
        </div>
      </div>

      <div className="doitac-table-container">
        <div className="doitac-table-header">
          <h3>Yêu cầu thuê gần đây</h3>
          {/*
          <button className="btn-more">...</button>
          */}
        </div>

        <div className="doitac-table-yeucau">
          <div className="doitac-row header-yeucau">
            <div>Khách hàng</div>
            <div>Vị trí</div>
            <div>Ngày đặt</div>
            <div>Trạng thái</div>
            <div>Hành động</div>
          </div>

          {(loiMoi || []).length === 0 ? (
            <div className="empty-state">
              📭 Không có yêu cầu thuê gần đây
            </div>
          ) : (
            [...loiMoi]
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
              .map((item) => {
                const khachHang = item.nhomId?.nguoiTao?.hoTen || "Không rõ";
                const viTri = item.nhomId?.diaDiem?.tenDiaDiem || "Không rõ";
                const ngayDat = item.createdAt
                  ? new Date(item.createdAt).toLocaleDateString("vi-VN")
                  : "Không rõ";

                return (
                  <div className="doitac-row-yeucau" key={item._id}>
                    <div>{khachHang}</div>
                    <div>{viTri}</div>
                    <div>{ngayDat}</div>
                    <div>
                      <span className="status-yeucau-pending">
                        Lời mời
                      </span>
                    </div>
                    <div>
                      <button
                        className="btn-chitiet-yeucau"
                        onClick={() => setSelectedRequest(item)}
                      >
                        Chi tiết
                      </button>
                    </div>
                  </div>
                );
              })
          )}
        </div>
        {selectedRequest && (
          <ContentChitietyeucau
            request={selectedRequest}
            onClose={() => setSelectedRequest(null)}
          />
        )}
      </div>

    </div>
  );
};

export default ContentBangdieukhien;