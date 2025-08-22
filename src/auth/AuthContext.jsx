import React, { createContext, useContext, useState, useEffect } from "react";

// Create Context
const AuthContext = createContext();

// Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // store user info
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null);


  // On mount, check if user exists in localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setRole(parsedUser.role); // set role here after user is restored
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

  return (
    <AuthContext.Provider
      value={{ user, logout, token, setUser, setToken, role, setRole }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom Hook for easy usage
export const useAuth = () => {
  return useContext(AuthContext);
};
