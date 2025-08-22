import React, { useState, useEffect } from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import AddAddress from "./AddAddress"; // Make sure this path is correct

export default function MyLocationMap() {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyDQhTx-hV6s2j1v9YL9ewHJwJpTiFhdj00",
  });

  const [currentPosition, setCurrentPosition] = useState({
    lat: 25.356917,
    lng: 83.007167,
  });
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const newPos = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          };
          setCurrentPosition(newPos);
          setSelectedPosition(newPos);
        },
        (err) => {
          console.error("Location error:", err);
          alert("Location access denied. Showing default location.");
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    }
  }, []);

  const handleMapClick = (e) => {
    const newPos = {
      lat: e.latLng.lat(),
      lng: e.latLng.lng(),
    };
    setSelectedPosition(newPos);
  };

  const handleAddAddress = () => {
    setShowAddressModal(true);
  };

  const handleCloseModal = () => {
    setShowAddressModal(false);
  };

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
          onClick={handleMapClick}
        >
          <Marker position={selectedPosition || currentPosition} />
        </GoogleMap>
      </div>

      {/* Add Address Button */}
      <button
        onClick={handleAddAddress}
        className="absolute top-4.5 right-15 bg-blue-600 hover:bg-blue-700 cursor-pointer text-white font-bold py-2 px-4 rounded-l-full shadow-lg transition-colors duration-200"
      >
        Add Address
      </button>

      {/* Branding Footer */}
      <div className="absolute bottom-3 left-18.5 transform -translate-x-1/2 bg-white text-gray-800 text-sm font-semibold px-4 py-1 rounded-full shadow-md">
        <span className="mapText"> Curo </span>Map
      </div>

      {/* Address Modal */}
      {showAddressModal && (
        <div>
          <AddAddress
            initialPosition={selectedPosition || currentPosition}
            onClose={handleCloseModal}
          />
        </div>
      )}
    </div>
  );
}