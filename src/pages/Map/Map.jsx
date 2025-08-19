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
        className="absolute top-4 right-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full shadow-lg transition-colors duration-200"
      >
        Add Address
      </button>

      {/* Branding Footer */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white/80 text-gray-800 text-sm font-semibold px-4 py-1 rounded-full shadow-md">
        Curo Map
      </div>

      {/* Address Modal */}
      {showAddressModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50  backdrop-brightness-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800">Add New Address</h3>
                <button
                  onClick={handleCloseModal}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <AddAddress
                initialPosition={selectedPosition || currentPosition}
                onClose={handleCloseModal}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}