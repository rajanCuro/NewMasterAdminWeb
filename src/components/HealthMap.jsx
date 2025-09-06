import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Marker icons with strong Tailwind colors
const createIcon = (color) =>
  new L.Icon({
    iconUrl: `https://chart.googleapis.com/chart?chst=d_map_pin_icon&chld=hospital|${color}`,
    iconSize: [30, 40],
    iconAnchor: [15, 40],
    popupAnchor: [0, -35],
  });

// Entities mapped with strong, clear colors
const entities = [
  {
    id: 1,
    type: "Hospital",
    name: "Apollo Hospital",
    lat: 28.6139,
    lng: 77.209,
    color: "e11d48", // red-600
  },
  {
    id: 2,
    type: "Pharmacy",
    name: "MedPlus Pharmacy",
    lat: 19.076,
    lng: 72.8777,
    color: "16a34a", // green-600
  },
  {
    id: 3,
    type: "Doctor",
    name: "Dr. Sharma Clinic",
    lat: 12.9716,
    lng: 77.5946,
    color: "2563eb", // blue-600
  },
  {
    id: 4,
    type: "Ambulance",
    name: "Ambulance Service 24x7",
    lat: 22.5726,
    lng: 88.3639,
    color: "ea580c", // orange-600
  },
  {
    id: 5,
    type: "Lab",
    name: "Thyrocare Lab",
    lat: 13.0827,
    lng: 80.2707,
    color: "7c3aed", // violet-600
  },
  {
    id: 6,
    type: "Blood Bank",
    name: "Red Cross Blood Bank",
    lat: 26.9124,
    lng: 75.7873,
    color: "db2777", // pink-600
  },
];

export default function HealthMap() {
  const [mapType, setMapType] = useState("india");

  const indiaBounds = [
    [6.5546, 68.1114],
    [35.6745, 97.3956],
  ];
  const worldBounds = [
    [-90, -180],
    [90, 180],
  ];

  return (
    <div className="w-full h-screen p-4 flex flex-col gap-4 bg-gray-50">
      {/* Switch Buttons */}
      <div className="flex gap-3">
        <button
          onClick={() => setMapType("india")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
            mapType === "india"
              ? "bg-blue-600 text-white shadow-md"
              : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-100"
          }`}
        >
          India Map
        </button>
        <button
          onClick={() => setMapType("world")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
            mapType === "world"
              ? "bg-blue-600 text-white shadow-md"
              : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-100"
          }`}
        >
          World Map
        </button>
      </div>

      {/* Map */}
      <div className="flex-1 rounded-2xl overflow-hidden shadow-md">
        <MapContainer
          className="w-full h-full"
          bounds={mapType === "india" ? indiaBounds : worldBounds}
          zoom={mapType === "india" ? 4 : 2}
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="http://osm.org">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {entities.map((entity) => (
            <Marker
              key={entity.id}
              position={[entity.lat, entity.lng]}
              icon={createIcon(entity.color)}
            >
              <Tooltip direction="top" offset={[0, -20]} opacity={1}>
                <div className="text-xs leading-snug">
                  <span className="font-semibold">{entity.name}</span>
                  <br />
                  Type: {entity.type}
                  <br />
                  Lat: {entity.lat.toFixed(3)}, Lng: {entity.lng.toFixed(3)}
                </div>
              </Tooltip>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-red-600"></span> Hospital
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-green-600"></span> Pharmacy
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-blue-600"></span> Doctor
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-orange-600"></span> Ambulance
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-violet-600"></span> Lab
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-pink-600"></span> Blood Bank
        </div>
      </div>
    </div>
  );
}
