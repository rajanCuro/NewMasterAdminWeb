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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
