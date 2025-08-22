import React, { useState, useEffect } from 'react';
import { Loader2, MapPin, Map } from "lucide-react";


function AddAddress({ initialPosition, onClose }) {
  const [address, setAddress] = useState({
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showMap, setShowMap] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState(initialPosition || null);

  // Initialize map when component mounts
  useEffect(() => {
    if (showMap && selectedPosition) {
      initMap();
    }
  }, [showMap]);

  useEffect(() => {
    if (initialPosition) {
      setSelectedPosition(initialPosition);
      fetchAddressFromCoordinates(initialPosition.lat, initialPosition.lng);
    }
  }, [initialPosition]);

  const [pressedKey, setPressedKey] = useState("");

  useEffect(() => {
    const handleKeyDown = (event) => {
      setPressedKey(event.key); // store the pressed key
      console.log("Key pressed:", event.key);
    };

    window.addEventListener("keydown", handleKeyDown);

    // cleanup
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAddress(prev => ({
      ...prev,
      [name]: value
    }));
  };
  if (pressedKey === 'Escape') {
    onClose()
  }

  const fetchAddressFromCoordinates = async (lat, lng) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      );
      const data = await response.json();
      console.log(data)

      if (data.error) {
        throw new Error(data.error);
      }

      setAddress({
        street: [data.address.road, data.address.house_number].filter(Boolean).join(' ') || '',
        city: data.address.city || data.address.town || data.address.village || '',
        state: data.address.state || data.address.region || '',
        postalCode: data.address.postcode || '',
        country: data.address.country || ''
      });
    } catch (err) {
      setError('Failed to fetch address details. Please enter manually.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }

    setIsFetchingLocation(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        setSelectedPosition(coords);
        fetchAddressFromCoordinates(coords.lat, coords.lng);
        setIsFetchingLocation(false);
      },
      (err) => {
        setError('Location access denied. Please enable location services or enter manually.');
        setIsFetchingLocation(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const initMap = () => {
    // Check if map script is already loaded
    if (window.L) {
      createMap();
      return;
    }

    // Load Leaflet CSS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.7.1/dist/leaflet.css';
    link.integrity = 'sha512-xodZBNTC5n17Xt2atTPuE1HxjVMSvLVW9ocqUKLsCC5CXdbqCmblAshOMAS6/keqq/sMZMZ19scR4PsZChSR7A==';
    link.crossOrigin = '';
    document.head.appendChild(link);

    // Load Leaflet JS
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.7.1/dist/leaflet.js';
    script.integrity = 'sha512-XQoYMqMTK8LvdxXYG3nZ448hOEQiglfqkJs1NOQV44cWnUrBc8PkAOcXy20w0vlaXaVUearIOBhiXZ5V3ynxwA==';
    script.crossOrigin = '';
    script.async = true;
    script.onload = () => createMap();
    document.head.appendChild(script);
  };

  const createMap = () => {
    const { L } = window;
    if (!L) return;

    // Create map centered on selected position or default location
    const mapCenter = selectedPosition || { lat: 40.7128, lng: -74.0060 }; // Default to New York
    const map = L.map('map-container').setView([mapCenter.lat, mapCenter.lng], 13);

    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Add marker if we have a selected position
    let marker = null;
    if (selectedPosition) {
      marker = L.marker([selectedPosition.lat, selectedPosition.lng]).addTo(map);
    }

    // Add click event to map
    map.on('click', (e) => {
      const { lat, lng } = e.latlng;
      setSelectedPosition({ lat, lng });

      // Remove existing marker
      if (marker) {
        map.removeLayer(marker);
      }

      // Add new marker
      marker = L.marker([lat, lng]).addTo(map);

      // Fetch address for clicked location
      fetchAddressFromCoordinates(lat, lng);
    });

    // Store map instance for cleanup
    window.addressMap = map;
  };

  const handleMapSelection = () => {
    setShowMap(true);
    // Clean up any existing map
    if (window.addressMap) {
      window.addressMap.remove();
      window.addressMap = null;
    }
  };

  const handleCloseMap = () => {
    setShowMap(false);
    // Clean up map
    if (window.addressMap) {
      window.addressMap.remove();
      window.addressMap = null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Validate required fields
      if (!address.street || !address.city || !address.country) {
        throw new Error('Please fill in all required fields');
      }

      // Here you would typically send the address data to your backend
      console.log('Address submitted:', address);

      setSuccess('Address saved successfully!');
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      setError(err.message || 'Failed to save address');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 backdrop-brightness-50 flex items-center justify-center p-2 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl h-full max-h-[90vh] overflow-hidden flex flex-col lg:flex-row">
        <div className={`w-full ${showMap ? 'lg:w-1/2' : 'lg:w-full'} p-6 overflow-y-auto`}>
          <div className="mb-6 flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800">Add New Address</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-2">
            <div className="flex flex-row justify-center items-center gap-2">
              {/* Current Location Button */}
              <button
                type="button"
                onClick={fetchCurrentLocation}
                disabled={isFetchingLocation}
                className={`flex-1 flex items-center justify-center space-x-3 px-4 py-3 rounded-xl transition-all ${isFetchingLocation
                  ? "bg-blue-100 text-blue-600"
                  : "bg-blue-50 hover:bg-blue-100 text-blue-600 hover:shadow-sm"
                  }`}
              >
                {isFetchingLocation ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span className="font-medium">Detecting your location...</span>
                  </>
                ) : (
                  <>
                    <MapPin className="h-5 w-5" />
                    <span className="font-medium">Use Current Location</span>
                  </>
                )}
              </button>

              {/* Map Selection Button */}
              <button
                type="button"
                onClick={handleMapSelection}
                className="flex-1 flex items-center justify-center space-x-3 px-4 py-3 rounded-xl bg-green-50 hover:bg-green-100 text-green-600 hover:shadow-sm transition-all"
              >
                <Map className="h-5 w-5" />
                <span className="font-medium">Select Location on Map</span>
              </button>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-500">We'll automatically fill your address details</p>
            </div>

            {error && (
              <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-lg">
                <div className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <span>{error}</span>
                </div>
              </div>
            )}

            {success && (
              <div className="p-4 bg-green-50 border-l-4 border-green-500 text-green-700 rounded-lg">
                <div className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>{success}</span>
                </div>
              </div>
            )}

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="street">
                  Street Address <span className="text-red-500">*</span>
                </label>
                <input
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  type="text"
                  id="street"
                  name="street"
                  value={address.street}
                  onChange={handleInputChange}
                  placeholder="123 Main St"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="city">
                    City <span className="text-red-500">*</span>
                  </label>
                  <input
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    type="text"
                    id="city"
                    name="city"
                    value={address.city}
                    onChange={handleInputChange}
                    placeholder="New York"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="state">
                    State/Province
                  </label>
                  <input
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    type="text"
                    id="state"
                    name="state"
                    value={address.state}
                    onChange={handleInputChange}
                    placeholder="NY"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="postalCode">
                    Postal Code
                  </label>
                  <input
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    type="text"
                    id="postalCode"
                    name="postalCode"
                    value={address.postalCode}
                    onChange={handleInputChange}
                    placeholder="10001"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="country">
                    Country <span className="text-red-500">*</span>
                  </label>
                  <input
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    type="text"
                    id="country"
                    name="country"
                    value={address.country}
                    onChange={handleInputChange}
                    placeholder="United States"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col-reverse sm:flex-row justify-end space-y-1 space-y-reverse sm:space-y-0 sm:space-x-3 pt-14">
              <button
                type="button"
                onClick={onClose}
                className="cancle-btn"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className={`submit-btn   ${isLoading ? 'cursor-not-allowed' : ''
                  }`}
               >
                {isLoading ? (
                  <span className="flex items-center justify-center cursor-not-allowed">                   
                    Saving...
                  </span>
                ) : 'Save Address'}
              </button>
            </div>
          </form>
        </div>

        {showMap && (
          <div className="w-full lg:w-1/2 relative">
            <button
              onClick={handleCloseMap}
              className="absolute top-4 right-4 z-10 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-colors"
              aria-label="Close map"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div id="map-container" className="h-full w-full"></div>
            <div className="absolute bottom-4 left-0 right-0 mx-auto bg-white p-4 rounded-lg shadow-md max-w-xs text-center z-10">
              <p className="text-sm text-gray-700 font-medium">Click on the map to select your address</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AddAddress;