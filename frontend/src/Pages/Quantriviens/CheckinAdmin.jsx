import React, { useState } from "react";
import SidebarAdmin from "../../UI/Quantriviens/SidebarAdmin";
import HeaderAdmin from "../../UI/Quantriviens/HeaderAdmin";
import ContentCheckinAdmin from "../../UI/Quantriviens/ContentCheckinAdmin";
import MapCheckin from "./MapCheckin";

const CheckinAdmin = () => {
    const [selected, setSelected] = useState(null);
    console.log("SELECTED:", selected);

    return (
        <div className="admin-page-layout">
            <SidebarAdmin />
            <div className="admin-main-view">
                <HeaderAdmin />

                {/* truyền setSelected xuống */}
                <ContentCheckinAdmin onSelect={setSelected} />

                {/* MAP */}
                {selected && (
                    <div className="map-wrapper">

                        {/* NÚT TẮT */}
                        <button
                            className="btn-close-map"
                            onClick={() => setSelected(null)}
                        >
                            ✖ Đóng bản đồ
                        </button>

                        <MapCheckin
                            checkinLocation={selected.checkinLocation}
                            checkoutLocation={selected.checkoutLocation}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default CheckinAdmin;