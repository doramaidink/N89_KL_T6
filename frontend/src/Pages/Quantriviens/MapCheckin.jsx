import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

const MapCheckin = ({ userLocation, guideLocation }) => {
    const center = [
        userLocation?.lat || 21.0285,
        userLocation?.lng || 105.8542
    ];

    return (
        <MapContainer center={center} zoom={13} style={{ height: "400px", borderRadius: "12px" }}>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* USER */}
            {userLocation && (
                <Marker position={[userLocation.lat, userLocation.lng]}>
                    <Popup>Người dùng</Popup>
                </Marker>
            )}

            {/* HDV */}
            {guideLocation && (
                <Marker position={[guideLocation.lat, guideLocation.lng]}>
                    <Popup>Hướng dẫn viên</Popup>
                </Marker>
            )}
        </MapContainer>
    );
};

export default MapCheckin;