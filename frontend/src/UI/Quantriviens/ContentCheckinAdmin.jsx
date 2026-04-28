import React, { useEffect, useState } from "react";
import { MapPin, Users, ShieldCheck } from "lucide-react";

const ContentCheckinAdmin = ({ onSelect }) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // 🔥 Tạm fake data (sau này thay API)
        setTimeout(() => {
            setData([
                {
                    id: 1,
                    nhom: "Chinh phục Fansipan",
                    user: "Nguyễn Văn A",
                    hdv: "Trần Văn B",
                    distance: 0.02,
                    status: "valid",
                    time: "14:20 27/04/2026",
                    userLocation: { lat: 21.028, lng: 105.85 },
                    guideLocation: { lat: 21.029, lng: 105.851 }
                },
                {
                    id: 2,
                    nhom: "Khám phá Đà Lạt",
                    user: "Lê Thị C",
                    hdv: "Phạm Văn D",
                    distance: 1.2,
                    status: "invalid",
                    time: "14:30 27/04/2026",
                    userLocation: { lat: 21.03, lng: 105.86 },
                    guideLocation: { lat: 21.05, lng: 105.9 }
                },
            ]);
            setLoading(false);
        }, 500);
    }, []);

    if (loading) {
        return <div className="admin-checkin-container">Đang tải dữ liệu...</div>;
    }

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
                        <h3>{data.filter(i => i.status === "valid").length}</h3>
                    </div>
                </div>

                <div className="stat-box warning">
                    <MapPin size={20} />
                    <div>
                        <p>Sai vị trí</p>
                        <h3>{data.filter(i => i.status === "invalid").length}</h3>
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
                            <th>NHÓM</th>
                            <th>NGƯỜI DÙNG</th>
                            <th>HDV</th>
                            <th>KHOẢNG CÁCH</th>
                            <th>TRẠNG THÁI</th>
                            <th>THỜI GIAN</th>
                        </tr>
                    </thead>

                    <tbody>
                        {data.map((item) => (
                            <tr key={item.id} onClick={() => onSelect(item)}>
                                <td>{item.nhom}</td>
                                <td>{item.user}</td>
                                <td>{item.hdv}</td>

                                <td>
                                    <span className="distance">
                                        {item.distance} km
                                    </span>
                                </td>

                                <td>
                                    {item.status === "valid" ? (
                                        <span className="status ok">✔ Hợp lệ</span>
                                    ) : (
                                        <span className="status fail">❌ Sai vị trí</span>
                                    )}
                                </td>

                                <td>{item.time}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ContentCheckinAdmin;