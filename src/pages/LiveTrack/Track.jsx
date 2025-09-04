import React, { useEffect, useRef, useState } from 'react';
import { FaPhone, FaSync, FaClinicMedical, FaHospital, FaPills, FaPlus, FaMinus, FaMapMarkerAlt } from 'react-icons/fa';

// Dummy data for labs, hospitals, and pharmacies in Varanasi
const dummyPlaces = {
  laboratory: [
    { name: 'Varanasi Diagnostics', lat: 25.3176, lng: 82.9739 },
    { name: 'Ganga Pathology Lab', lat: 25.3105, lng: 82.9901 },
    { name: 'Shree Lab Services', lat: 25.3050, lng: 82.9650 },
  ],
  hospital: [
    { name: 'Heritage Hospital', lat: 25.3335, lng: 82.9810 },
    { name: 'Saranath Medical Center', lat: 25.3500, lng: 82.9700 },
    { name: 'Kashi Vishwanath Hospital', lat: 25.3100, lng: 83.0100 },
  ],
  pharmacy: [
    { name: 'MedPlus Varanasi', lat: 25.3200, lng: 82.9900 },
    { name: 'Apollo Pharmacy', lat: 25.3150, lng: 82.9750 },
    { name: 'Ganga Medical Store', lat: 25.3250, lng: 82.9850 },
  ],
};

// Generate Google Maps API script source
const generateMapSrc = () => {
  console.log('Environment variables:', import.meta.env); // Debug line
  const apiKey = import.meta.env.AIzaSyArgNP_2JIkchiqTZQWA0lLNXjPi98X5Wk || '';
  if (!apiKey) {
    console.error('Google Maps API key is missing. Please set AIzaSyArgNP_2JIkchiqTZQWA0lLNXjPi98X5Wk in your .env file at the project root.');
    return '';
  }
  return `https://maps.googleapis.com/maps/api/js?key=${apiKey}&loading=async&libraries=places`;
};

function Track() {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const [markers, setMarkers] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [error, setError] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [currentLocationMarker, setCurrentLocationMarker] = useState(null);
  const [isLocating, setIsLocating] = useState(false);
  const [isMapInitialized, setIsMapInitialized] = useState(false);

  // Initialize the map and add markers for all place types
  useEffect(() => {
    const loadMapScript = () => {
      if (window.google && window.google.maps) {
        initializeMap();
        return;
      }

      const mapSrc = generateMapSrc();
      if (!mapSrc) {
        setError('Google Maps API key is missing. Please set VITE_GOOGLE_MAPS_API_KEY in your .env file at the project root.');
        return;
      }

      const existingScript = document.querySelector(`script[src="${mapSrc}"]`);
      if (existingScript) {
        existingScript.addEventListener('load', initializeMap);
        return;
      }

      const script = document.createElement('script');
      script.src = mapSrc;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        if (window.google && window.google.maps) {
          initializeMap();
        } else {
          setError('Google Maps API loaded but window.google.maps is undefined. Check your API key restrictions.');
        }
      };
      script.onerror = () => setError('Failed to load Google Maps API script. Check your API key or network connection.');
      document.body.appendChild(script);

      return () => {
        script.remove();
      };
    };

    const initializeMap = () => {
      try {
        if (!window.google || !window.google.maps) {
          setError('Google Maps API not available. Ensure the API script loaded correctly.');
          return;
        }

        const googleMap = new window.google.maps.Map(mapRef.current, {
          center: { lat: 25.3176, lng: 82.9739 },
          zoom: 13,
          zoomControl: false,
        });

        mapInstanceRef.current = googleMap;
        setIsMapInitialized(true); // Mark map as initialized

        new window.google.maps.Marker({
          position: { lat: 25.3176, lng: 82.9739 },
          map: googleMap,
          title: 'Agent Location',
          icon: {
            url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
            scaledSize: new window.google.maps.Size(32, 32),
          },
        });

        addAllMarkers(googleMap);
      } catch (err) {
        setError('Error initializing map: ' + err.message);
      }
    };

    const addAllMarkers = (googleMap) => {
      markers.forEach(marker => marker.setMap(null));
      const newMarkers = [];

      const markerColors = {
        laboratory: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png',
        hospital: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
        pharmacy: 'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png',
      };

      Object.entries(dummyPlaces).forEach(([type, places]) => {
        places.forEach(place => {
          const marker = new window.google.maps.Marker({
            position: { lat: place.lat, lng: place.lng },
            map: googleMap,
            title: place.name,
            icon: {
              url: markerColors[type],
              scaledSize: new window.google.maps.Size(32, 32),
            },
          });

          marker.addListener('click', () => {
            setSelectedPlace({ ...place, type });
          });

          newMarkers.push(marker);
        });
      });

      setMarkers(newMarkers);
    };

    loadMapScript();

    // Retry loading the script every 5 seconds if it fails initially
    const retryInterval = setInterval(() => {
      if (!mapInstanceRef.current) {
        console.log('Retrying map script load...');
        loadMapScript();
      } else {
        clearInterval(retryInterval);
      }
    }, 5000);

    return () => clearInterval(retryInterval);
  }, []);

  // Zoom in function
  const zoomIn = () => {
    if (mapInstanceRef.current) {
      const currentZoom = mapInstanceRef.current.getZoom();
      mapInstanceRef.current.setZoom(currentZoom + 1);
    }
  };

  // Zoom out function
  const zoomOut = () => {
    if (mapInstanceRef.current) {
      const currentZoom = mapInstanceRef.current.getZoom();
      mapInstanceRef.current.setZoom(currentZoom - 1);
    }
  };

  // Get current location
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser.');
      return;
    }

    if (!mapInstanceRef.current) {
      setError('Map is not initialized yet. Please wait or check your API key.');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        setCurrentLocation(pos);

        if (currentLocationMarker) {
          currentLocationMarker.setMap(null);
        }

        const marker = new window.google.maps.Marker({
          position: pos,
          map: mapInstanceRef.current,
          title: 'Your Current Location',
          icon: {
            url: 'http://maps.google.com/mapfiles/ms/icons/purple-dot.png',
            scaledSize: new window.google.maps.Size(40, 40),
          },
          animation: window.google.maps.Animation.BOUNCE,
        });

        setCurrentLocationMarker(marker);

        mapInstanceRef.current.setCenter(pos);
        mapInstanceRef.current.setZoom(15);

        setIsLocating(false);
      },
      (error) => {
        setError('Error getting your location: ' + error.message);
        setIsLocating(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  };

  // Refresh map function
  const refreshMap = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setCenter({ lat: 25.3176, lng: 82.9739 });
      mapInstanceRef.current.setZoom(13);
      addAllMarkers(mapInstanceRef.current);
    } else {
      setError('Map is not initialized. Please check your API key or network connection.');
    }
  };

  // Get icon based on place type
  const getIcon = (type) => {
    switch (type) {
      case 'laboratory':
        return <FaClinicMedical className="text-green-500" />;
      case 'hospital':
        return <FaHospital className="text-red-500" />;
      case 'pharmacy':
        return <FaPills className="text-yellow-500" />;
      default:
        return <FaClinicMedical />;
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <div className="w-full bg-white rounded-xl shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Healthcare Facilities Map - Varanasi</h1>

        <div className="mb-4 flex flex-wrap gap-4">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-green-500 rounded-full mr-2"></div>
            <span className="text-sm">Laboratories</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-red-500 rounded-full mr-2"></div>
            <span className="text-sm">Hospitals</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-yellow-500 rounded-full mr-2"></div>
            <span className="text-sm">Pharmacies</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-blue-500 rounded-full mr-2"></div>
            <span className="text-sm">Agent</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-purple-500 rounded-full mr-2"></div>
            <span className="text-sm">Your Location</span>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <div className="relative">
          <div
            ref={mapRef}
            className="w-full h-96 rounded-lg mb-6"
          />
          <div className="absolute top-2 right-2 flex flex-col gap-2">
            <button
              onClick={zoomIn}
              disabled={!isMapInitialized}
              className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
              title="Zoom In"
            >
              <FaPlus />
            </button>
            <button
              onClick={zoomOut}
              disabled={!isMapInitialized}
              className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
              title="Zoom Out"
            >
              <FaMinus />
            </button>
            <button
              onClick={getCurrentLocation}
              disabled={isLocating || !isMapInitialized}
              className="bg-purple-500 text-white p-2 rounded-lg hover:bg-purple-600 transition-colors disabled:opacity-50"
              title="Find My Location"
            >
              <FaMapMarkerAlt />
            </button>
          </div>
        </div>

        {currentLocation && (
          <div className="bg-purple-50 p-4 rounded-lg shadow-sm mb-4 border-l-4 border-purple-500">
            <h2 className="text-lg font-semibold text-gray-700 mb-2 flex items-center">
              <FaMapMarkerAlt className="text-purple-500 mr-2" />
              Your Current Location
            </h2>
            <p className="text-gray-600">
              <span className="font-medium">Latitude:</span> {currentLocation.lat.toFixed(6)}
            </p>
            <p className="text-gray-600">
              <span className="font-medium">Longitude:</span> {currentLocation.lng.toFixed(6)}
            </p>
          </div>
        )}

        {selectedPlace && (
          <div className="bg-gray-50 p-4 rounded-lg shadow-sm mb-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-2 flex items-center">
              {getIcon(selectedPlace.type)}
              <span className="ml-2">Location Details</span>
            </h2>
            <p className="text-gray-600">
              <span className="font-medium">Name:</span> {selectedPlace.name}
            </p>
            <p className="text-gray-600">
              <span className="font-medium">Type:</span> {selectedPlace.type}
            </p>
            <p className="text-gray-600">
              <span className="font-medium">Latitude:</span> {selectedPlace.lat.toFixed(4)}
            </p>
            <p className="text-gray-600">
              <span className="font-medium">Longitude:</span> {selectedPlace.lng.toFixed(4)}
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-green-50 p-4 rounded-lg shadow-sm border-l-4 border-green-500">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Laboratories</h3>
            <p className="text-2xl font-bold text-green-700">{dummyPlaces.laboratory.length}</p>
          </div>
          <div className="bg-red-50 p-4 rounded-lg shadow-sm border-l-4 border-red-500">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Hospitals</h3>
            <p className="text-2xl font-bold text-red-700">{dummyPlaces.hospital.length}</p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg shadow-sm border-l-4 border-yellow-500">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Pharmacies</h3>
            <p className="text-2xl font-bold text-yellow-700">{dummyPlaces.pharmacy.length}</p>
          </div>
        </div>

        <div className="mt-6 flex space-x-4">
          <button className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors flex items-center">
            <FaPhone className="mr-2" />
            Contact Support
          </button>
          <button
            onClick={refreshMap}
            disabled={!isMapInitialized}
            className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50 flex items-center"
          >
            <FaSync className="mr-2" />
            Refresh Map
          </button>
        </div>
      </div>
    </div>
  );
}

export default Track;