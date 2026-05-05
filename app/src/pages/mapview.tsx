import {
  GoogleMap,
  LoadScript,
  Marker,
} from "@react-google-maps/api";
import { useRef, useState } from "react";

const containerStyle = {
  width: "100%",
  height: "400px",
};

type LatLng = {
  lat: number;
  lng: number;
};

const DEFAULT_CENTER: LatLng = {
  lat: 19.0760,
  lng: 72.8777,
};

const Map = () => {
  const mapRef = useRef<google.maps.Map | null>(null);
  const [markerPosition, setMarkerPosition] =
    useState<LatLng>(DEFAULT_CENTER);
  const onLoad = (map: google.maps.Map) => {
    mapRef.current = map;
  };

  const moveToLocation = (location: LatLng) => {
    setMarkerPosition(location);

    if (mapRef.current) {
      mapRef.current.panTo(location);
      mapRef.current.setZoom(15);
    }
  };
  const handleMyLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        moveToLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      () => alert("Location permission denied")
    );
  };

  const handleClientLocation = () => {
    moveToLocation({
      lat: 28.6139,
      lng: 77.2090,
    });
  };

  return (
    <div className="p-4 bg-[#121212] text-white">

      <div className="flex gap-4 mb-4">.
        <button
          onClick={handleMyLocation}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md"
        >
          My Current Location
        </button>

        <button
          onClick={handleClientLocation}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md"
        >
          Client Current Location
        </button>
      </div>

      {/* 🔹 MAP */}
      <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={markerPosition}
          zoom={12}
          onLoad={onLoad}
        >
          <Marker position={markerPosition} />
        </GoogleMap>
      </LoadScript>
    </div>
  );
};

export default Map;
