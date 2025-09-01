// src/auth/AuthContext.jsx

import React, { createContext, useContext, useState, useEffect } from "react";
import axiosInstance from './axiosInstance';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null);
  const [stateList, setStateList] = useState([]);
  const [loading, setLoading] = useState(true); // important
  const [latitude, setLatitude] = useState({
    lat: 25.356917,
    lng: 83.007167,
  });
  const [longitude, setLongitude] = useState(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const newPos = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          };
          setLatitude(newPos);
          setLongitude(newPos);
        },
        (err) => {
          console.error("Location error:", err);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    }
  }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");
    const storedRole = localStorage.getItem("role");

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
      setRole(storedRole);
    }

    setLoading(false); // finished initializing
  }, []);

  const logout = () => {
    setUser(null);
    setToken(null);
    setRole(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    window.location.reload();
  };

  useEffect(() => {
    getALLState();
  }, []);

  const getALLState = async () => {
    try {
      const response = await axiosInstance.get("/area/getAllStates");
      setStateList(response.data.stateList);
    } catch (error) {
      console.error("Error getting all states:", error);
    }
  };

const uploadImage = async (file) => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await axiosInstance.post("/auth/uploadImage", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`, // If your API needs authentication
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
};



  return (
    <AuthContext.Provider
      value={{
        user,
        logout,
        token,
        setUser,
        setToken,
        role,
        setRole,
        getALLState,
        stateList,
        loading,
        longitude, setLongitude,
        latitude, setLatitude,
        uploadImage
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
