import React, { useState, useEffect } from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";

export default function MyLocationMap() {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyDQhTx-hV6s2j1v9YL9ewHJwJpTiFhdj00",
  });

  const [currentPosition, setCurrentPosition] = useState({
    lat: 25.356917,
    lng: 83.007167,
  });

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setCurrentPosition({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
        },
        (err) => {
          console.error("Location error:", err);
          alert("Location access denied. Showing default location.");
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    }
  }, []);

  if (loadError) return <p>❌ Map cannot be loaded: {loadError.message}</p>;
  if (!isLoaded) return <p>Loading map...</p>;

  return (
    <div className="relative p-2">
      {/* Map Container */}
      <div className="w-full h-screen rounded-2xl shadow-lg overflow-hidden">
        <GoogleMap
          mapContainerClassName="w-full h-full"
          center={currentPosition}
          zoom={15}
        >
          <Marker position={currentPosition} />
        </GoogleMap>
      </div>

      {/* Branding Footer */}
      <div className="absolute bottom-4 left-15 transform -translate-x-1/2 bg-white/80 text-gray-800 text-sm font-semibold px-4 py-1 rounded-full shadow-md">
        Curo Map
      </div>
    </div>
  );
}
