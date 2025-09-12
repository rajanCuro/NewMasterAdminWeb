// src/components/Map/Map.jsx

import React, { useEffect, useRef, useState } from 'react';
import { GoogleMap, Marker, Polyline, useLoadScript } from '@react-google-maps/api';
import axiosInstance from '../../auth/axiosInstance';

const containerStyle = {
  width: '100%',
  height: '100%',
  borderRadius: '1rem',
};

function Map({ location, data }) {
  console.log("new Path", data);

  const [savedLocation] = useState({
    latitude: 25.3572815,
    longitude: 83.0106447,
  });

  const [path, setPath] = useState([]);

  const mapRef = useRef(null);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: 'AIzaSyArgNP_2JIkchiqTZQWA0lLNXjPi98X5Wk',
  });

  // 👉 Update path when "data" prop changes
  useEffect(() => {
    if (Array.isArray(data) && data.length > 0) {
      const newPath = data.map((point) => ({
        lat: point.latitude,
        lng: point.longitude,
      }));
      setPath(newPath);
    }
  }, [data]);

  // Optional: Append live location if available
  useEffect(() => {
    if (location?.latitude && location?.longitude) {
      setPath((prevPath) => [
        ...prevPath,
        { lat: location.latitude, lng: location.longitude },
      ]);
    }
  }, [location]);

  if (loadError) return <div>Error loading Google Maps</div>;
  if (!isLoaded) return <div>Loading Google Maps...</div>;

  const mapCenter = location
    ? { lat: location.latitude, lng: location.longitude }
    : (path.length > 0 ? path[0] : { lat: savedLocation.latitude, lng: savedLocation.longitude });

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={mapCenter}
      zoom={13}
      onLoad={(map) => (mapRef.current = map)}
    >
      {/* Start marker */}
      <Marker
        position={{
          lat: savedLocation.latitude,
          lng: savedLocation.longitude,
        }}
        label=""
      />

      {/* Current location marker */}
      {location && (
        <Marker
          position={{
            lat: location.latitude,
            lng: location.longitude,
          }}
          label=""
        />
      )}

      {/* Polyline */}
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
                  path: window.google?.maps.SymbolPath.FORWARD_OPEN_ARROW,
                  scale: 3,
                  strokeColor: '#0000FF',
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
