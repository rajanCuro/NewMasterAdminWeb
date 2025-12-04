// src/auth/AuthContext.jsx

import React, { createContext, useContext, useState, useEffect } from "react";
import axiosInstance from './axiosInstance';
import { IdCard } from "lucide-react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState("jhngyvygnvy");
  const [role, setRole] = useState(null);
  const [stateList, setStateList] = useState([]);
  const [loading, setLoading] = useState(true); // important
  const [submittedData, setSubmittedData] = useState(null)
  const [latitude, setLatitude] = useState({
    lat: ``,
    lng: ``,
  });
  const [longitude, setLongitude] = useState(null);
  const [forgetPassword, setForgetPassword] = useState(false)
  const [passwordSuccess, setPasswordSuccess] = useState(false)




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
        submittedData, setSubmittedData,
        forgetPassword, setForgetPassword,
        passwordSuccess, setPasswordSuccess
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
