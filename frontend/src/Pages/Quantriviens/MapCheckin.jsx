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

const MapCheckin = ({
    userCheckin,
    hdvCheckin,
    userCheckout,
    hdvCheckout
}) => {

    const center = [
        userCheckin?.lat || 21.0285,
        userCheckin?.lng || 105.8542
    ];

    return (
        <MapContainer
            key={center.join(",")}
            center={center}
            zoom={15}
            style={{ height: "400px", width: "100%" }}
        >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

            {/* USER CHECKIN */}
            {userCheckin && !userCheckout && (
                <Marker position={[userCheckin.lat, userCheckin.lng]}>
                    <Popup>User Check-in</Popup>
                </Marker>
            )}

            {/* HDV CHECKIN */}
            {hdvCheckin && !hdvCheckout && (
                <Marker position={[hdvCheckin.lat, hdvCheckin.lng]}>
                    <Popup>HDV Check-in</Popup>
                </Marker>
            )}
            {/* USER CHECKOUT */}
            {userCheckout && (
                <Marker position={[userCheckout.lat, userCheckout.lng]}>
                    <Popup>User Check-out</Popup>
                </Marker>
            )}

            {/* HDV CHECKOUT */}
            {hdvCheckout && (
                <Marker position={[hdvCheckout.lat, hdvCheckout.lng]}>
                    <Popup>HDV Check-out</Popup>
                </Marker>
            )}

            {/* USER CHECKOUT
            {userCheckout && (
                <Marker position={[userCheckout.lat, userCheckout.lng]}>
                    <Popup>User Check-out</Popup>
                </Marker>
            )} */}

            {/* HDV CHECKOUT
            {hdvCheckout && (
                <Marker position={[hdvCheckout.lat, hdvCheckout.lng]}>
                    <Popup>HDV Check-out</Popup>
                </Marker>
            )} */}
        </MapContainer>
    );
};

export default MapCheckin;