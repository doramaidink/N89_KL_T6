import React, { useEffect, useState } from "react";
import { MapPin, Users, ShieldCheck } from "lucide-react";
import MapCheckin from "../../Pages/Quantriviens/MapCheckin";

function getDistance(lat1, lng1, lat2, lng2) {
    const R = 6371; // bán kính trái đất (km)
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) *
        Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
}

const ContentCheckinAdmin = ({ onSelect }) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selected, setSelected] = useState(null);

    useEffect(() => {
        fetch("http://localhost:5000/nhom/checkin-admin")
            .then(res => res.json())
            .then(res => {
                console.log("ADMIN DATA:", res);
                setData(res.data);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <div className="admin-checkin-container">Đang tải dữ liệu...</div>;
    }
    const sortedData = [...data].sort(
        (a, b) => new Date(b.checkinAt) - new Date(a.checkinAt)
    );

    return (
        <div className="admin-checkin-container">
            {/* HEADER */}
            <div className="checkin-header">
                <h2>Quản lý Check-in / Check-out</h2>
                <p>Theo dõi vị trí người dùng và hướng dẫn viên</p>
            </div>

            {/* STATS */}
            <div className="checkin-stats">
                <div className="stat-box">
                    <ShieldCheck size={20} />
                    <div>
                        <p>Hợp lệ</p>
                        <h3>
                            {
                                data.filter(i => {
                                    if (!i.checkinLocationUser || !i.checkinLocationHdv) return false;

                                    const distance = getDistance(
                                        i.checkinLocationUser.lat,
                                        i.checkinLocationUser.lng,
                                        i.checkinLocationHdv.lat,
                                        i.checkinLocationHdv.lng
                                    );

                                    return distance <= 0.5;
                                }).length
                            }
                        </h3>
                    </div>
                </div>

                <div className="stat-box warning">
                    <MapPin size={20} />
                    <div>
                        <p>Sai vị trí</p>
                        <h3>
                            {
                                data.filter(i => {
                                    if (!i.checkinLocation || !i.checkoutLocation) return false;

                                    const distance = getDistance(
                                        i.checkinLocation.lat,
                                        i.checkinLocation.lng,
                                        i.checkoutLocation.lat,
                                        i.checkoutLocation.lng
                                    );

                                    return distance > 0.5;
                                }).length
                            }
                        </h3>
                    </div>
                </div>

                <div className="stat-box">
                    <Users size={20} />
                    <div>
                        <p>Tổng lượt</p>
                        <h3>{data.length}</h3>
                    </div>
                </div>
            </div>

            {/* TABLE */}
            <div className="checkin-table">
                <table>
                    <thead>
                        <tr>
                            <th>ĐỊA ĐIỂM</th>
                            <th>NGƯỜI DÙNG</th>
                            <th>HDV</th>
                            <th>KHOẢNG CÁCH</th>
                            <th>TRẠNG THÁI</th>
                            <th>THỜI GIAN</th>
                        </tr>
                    </thead>

                    <tbody>
                        {sortedData.map((item) => {
                            const members = item.nhomId?.thanhVien || [];

                            // lấy user
                            const users = members.filter(
                                m => m.role === "thanh_vien" || m.role === "truong_nhom"
                            );

                            // lấy hdv
                            const hdv = members.find(m => m.role === "huong_dan_vien");
                            console.log("ITEM:", item);
                            console.log("DIA DIEM:", item.nhomId?.diaDiem);
                            const checkinTime = item.checkinAt
                                ? new Date(item.checkinAt).toLocaleTimeString()
                                : "-";

                            const checkoutTime = item.checkoutAt
                                ? new Date(item.checkoutAt).toLocaleTimeString()
                                : "Chưa checkout";

                            // tính khoảng cách
                            const distance =
                                item.checkinLocationUser && item.checkinLocationHdv
                                    ? getDistance(
                                        item.checkinLocationUser.lat,
                                        item.checkinLocationUser.lng,
                                        item.checkinLocationHdv.lat,
                                        item.checkinLocationHdv.lng
                                    )
                                    : 0;

                            const MAX_DISTANCE = 0.5; // km

                            const isUserCheckout = !!item.checkoutLocationUser;
                            const isHdvCheckout = !!item.checkoutLocationHdv; // nếu chưa có sẽ là false

                            const isValid =
                                isUserCheckout &&
                                isHdvCheckout &&
                                distance <= MAX_DISTANCE;

                            return (
                                <React.Fragment key={item._id}>

                                    {/* ROW */}
                                    <tr
                                        onClick={() =>
                                            setSelected(selected?._id === item._id ? null : item)
                                        }
                                    >
                                        <td>{item.nhomId?.diaDiem?.tenDiaDiem}</td>
                                        <td>
                                            {users.length > 0
                                                ? users.map(u => u.user?.hoTen).join(", ")
                                                : "Không có"}
                                        </td>
                                        <td>
                                            {hdv?.user?.hoTen || "Không có"}
                                        </td>

                                        <td className="distance">
                                            {distance.toFixed(2)} km
                                            <br />
                                            <small style={{ color: "#888" }}>
                                                {distance <= 0.5 ? "Trong phạm vi" : "Ngoài phạm vi"}
                                            </small>
                                        </td>

                                        <td>
                                            {item.status === "checking" && (
                                                <span className="status warning">🟡 Đang đi</span>
                                            )}

                                            {item.status === "done" && (
                                                isValid ? (
                                                    <span className="status ok">✔ Hợp lệ</span>
                                                ) : !isUserCheckout ? (
                                                    <span className="status warning">🟡 Chưa checkout</span>
                                                ) : !isHdvCheckout ? (
                                                    <span className="status warning">🔵 Chờ HDV</span>
                                                ) : (
                                                    <span className="status fail">❌ Sai vị trí</span>
                                                )
                                            )}
                                        </td>

                                        <td>
                                            {checkinTime} <br />
                                            {checkoutTime}
                                        </td>
                                    </tr>

                                    {/* MAP NGAY DƯỚI */}
                                    {selected?._id === item._id && (
                                        <tr>
                                            <td colSpan="6">
                                                <div className="map-wrapper">

                                                    <button
                                                        className="btn-close-map"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setSelected(null);
                                                        }}
                                                    >
                                                        Đóng
                                                    </button>



                                                    <MapCheckin

                                                        userCheckin={item.checkinLocationUser}
                                                        hdvCheckin={item.checkinLocationHdv}
                                                        userCheckout={item.checkoutLocationUser}
                                                        hdvCheckout={item.checkoutLocationHdv}
                                                    />

                                                </div>
                                            </td>
                                        </tr>
                                    )}

                                </React.Fragment>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ContentCheckinAdmin;