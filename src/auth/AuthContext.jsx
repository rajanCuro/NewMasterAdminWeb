import React, { createContext, useContext, useState, useEffect } from "react";
import axiosInstance from './axiosInstance'
import axios from "axios";

// Create Context
const AuthContext = createContext();

// Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // store user info
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null);
  const [stateList, setStateList] = useState([]);


  // On mount, check if user exists in localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");
    setRole(localStorage.getItem('role'));

    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setToken(storedToken);
    }
  }, []);

  const logout = () => {
    setUser(null);
    setToken(null);
    setRole(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  useEffect(() => {
    getALLState()
  }, [])

  const getALLState = async () => {
    try {
      const response = await axiosInstance.get("/area/getAllStates");
      console.log("All states:", response.data);
      setStateList(response.data.stateList);
    } catch (error) {
      console.error("Error getting all states:", error);
    }
  };


  return (
    <AuthContext.Provider
      value={{ user, logout, token, setUser, setToken, role, setRole, getALLState, stateList }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom Hook for easy usage
export const useAuth = () => {
  return useContext(AuthContext);
};
