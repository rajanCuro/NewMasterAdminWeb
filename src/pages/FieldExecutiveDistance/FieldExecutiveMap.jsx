// src/components/Map/Map.jsx

import React, { useEffect, useRef, useState } from 'react';
import { GoogleMap, Marker, Polyline, useLoadScript } from '@react-google-maps/api';

const containerStyle = {
    width: '100%',
    height: '100%',
    borderRadius: '1rem'
};

const fallbackCenter = { lat: 0, lng: 0 };

function Map({ location }) {
    const [savedLocation] = useState({
        latitude: 25.3572815,
        longitude: 83.0106447
    });

    const [path, setPath] = useState([
        {
            lat: 25.3572815,
            lng: 83.0106447
        }
    ]);

    const mapRef = useRef(null);

    // Load Google Maps
    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: 'AIzaSyArgNP_2JIkchiqTZQWA0lLNXjPi98X5Wk', // Use .env properly in Vite
    });

    // Update path with new location points
    useEffect(() => {
        if (location?.latitude && location?.longitude) {
            setPath((prevPath) => [
                ...prevPath,
                { lat: location.latitude, lng: location.longitude }
            ]);
        }
    }, [location]);

    if (loadError) return <div>Error loading Google Maps</div>;
    if (!isLoaded) return <div>Loading Google Maps...</div>;

    const mapCenter = location
        ? { lat: location.latitude, lng: location.longitude }
        : { lat: savedLocation.latitude, lng: savedLocation.longitude };

    return (
        <GoogleMap
            mapContainerStyle={containerStyle}
            center={mapCenter}
            zoom={13}
            onLoad={(map) => (mapRef.current = map)}
        >
            {/* Starting marker (savedLocation) */}
            <Marker
                position={{
                    lat: savedLocation.latitude,
                    lng: savedLocation.longitude
                }}
                label=""
            />

            {/* Current location marker */}
            {location && (
                <Marker
                    position={{
                        lat: location.latitude,
                        lng: location.longitude
                    }}
                    label=""
                />
            )}

            {/* Polyline path from savedLocation through all updates */}
            {path.length > 1 && (
                <Polyline
                    path={path}
                    options={{
                        strokeColor: '#0000FF',
                        strokeOpacity: 0.8,
                        strokeWeight: 4,
                        icons: [
                            {
                                icon: {
                                    path: window.google?.maps.SymbolPath.FORWARD_OPEN_ARROW, // sleeker open arrow
                                    scale: 3, // adjust size
                                    strokeColor: '#0000FF' // match your path color
                                },
                                offset: '100%',
                            },
                        ],

                    }}
                />
            )}
        </GoogleMap>
    );
}

export default React.memo(Map);
