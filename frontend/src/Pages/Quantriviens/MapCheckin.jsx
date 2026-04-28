import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    iconUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const MapCheckin = ({ checkinLocation, checkoutLocation }) => {
    const center = [
        checkinLocation?.lat || 21.0285,
        checkinLocation?.lng || 105.8542
    ];

    return (
        <MapContainer
            key={center.join(",")}
            center={center}
            zoom={15}
            style={{ height: "400px", width: "100%" }}
        >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

            {/* Checkin */}
            {checkinLocation && (
                <Marker position={[checkinLocation.lat, checkinLocation.lng]}>
                    <Popup>Check-in</Popup>
                </Marker>
            )}

            {/* Checkout */}
            {checkoutLocation && (
                <Marker position={[checkoutLocation.lat, checkoutLocation.lng]}>
                    <Popup>Check-out</Popup>
                </Marker>
            )}
        </MapContainer>
    );
};

export default MapCheckin;