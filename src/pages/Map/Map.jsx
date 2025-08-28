import React, { useState, useEffect } from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import AddAddress from "./AddAddress"; // Make sure this path is correct
import { useAuth } from "../../auth/AuthContext";

export default function MyLocationMap() {
  const {latitude,longitude, setLongitude} = useAuth();
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyDQhTx-hV6s2j1v9YL9ewHJwJpTiFhdj00",
  });
   const [showAddressModal, setShowAddressModal] = useState(false);

  const handleMapClick = (e) => {
    const newPos = {
      lat: e.latLng.lat(),
      lng: e.latLng.lng(),
    };
    setLongitude(newPos);
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
          center={latitude}
          zoom={15}
          onClick={handleMapClick}
        >
          <Marker position={longitude || latitude} />
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
            initialPosition={longitude || latitude}
            onClose={handleCloseModal}
          />
        </div>
      )}
    </div>
  );
}