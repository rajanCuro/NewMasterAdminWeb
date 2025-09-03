import React, { useState, useCallback, useEffect } from 'react';

const GoogleMapComponent = () => {
    const [map, setMap] = useState(null);
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [defaultCenter, setDefaultCenter] = useState({
        lat: 37.7749, // fallback (San Francisco)
        lng: -122.4194,
    });

    const defaultZoom = 12;

    // ✅ Get current location once when component mounts
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setDefaultCenter({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    });
                },
                (error) => {
                    console.error("Error getting location:", error);
                    // Fallback remains San Francisco if denied
                }
            );
        } else {
            console.error("Geolocation not supported by this browser.");
        }
    }, []);

    // Map configuration
    const mapContainerStyle = {
        width: '100%',
        height: '400px',
    };

    // Map event handlers
    const onLoad = useCallback((mapInstance) => {
        setMap(mapInstance);
    }, []);

    const onUnmount = useCallback(() => {
        setMap(null);
    }, []);

    const handleMarkerClick = (marker) => {
        setSelectedLocation(marker);
        if (map) {
            map.panTo(marker.position);
            map.setZoom(15);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;

        alert(`In a real application, this would search for: ${searchQuery}`);
        setSearchQuery('');
    };

    const generateMapSrc = () => {
        const apiKey = "AIzaSyArgNP_2JIkchiqTZQWA0lLNXjPi98X5Wk"; // ⬅️ Replace with your API key
        return `https://maps.googleapis.com/maps/api/js?key=${apiKey}&loading=async&libraries=places`;
    };

    return (
        <div className="min-h-[50vh] bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
            <div className="max-w-6xl mx-auto">
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <div className="p-6">
                        {/* Map Container */}
                        <div className="rounded-lg overflow-hidden shadow-md mb-6">
                            <div style={mapContainerStyle} id="map">
                                <iframe
                                    width="100%"
                                    height="100%"
                                    frameBorder="0"
                                    style={{ border: 0 }}
                                    src={`https://www.google.com/maps/embed/v1/view?key=AIzaSyArgNP_2JIkchiqTZQWA0lLNXjPi98X5Wk&center=${defaultCenter.lat},${defaultCenter.lng}&zoom=${defaultZoom}`}
                                    allowFullScreen
                                ></iframe>
                            </div>
                        </div>

                    
                        

                        {/* Selected Location Details */}
                        {selectedLocation && (
                            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                <h3 className="text-lg font-semibold text-blue-800">Selected Location</h3>
                                <p className="text-blue-700 font-medium mt-2">{selectedLocation.name}</p>
                                <p className="text-blue-600">{selectedLocation.description}</p>
                                <button
                                    onClick={() => setSelectedLocation(null)}
                                    className="mt-3 px-3 py-1 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors"
                                >
                                    Close
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Load Google Maps API script */}
            <script src={generateMapSrc()} async defer></script>
        </div>
    );
};

export default GoogleMapComponent;
