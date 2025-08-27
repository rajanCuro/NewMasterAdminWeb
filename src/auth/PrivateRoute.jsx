

import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";


const PrivateRoute = ({ children }) => {
  const { token, loading } = useAuth();

  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

  return token ? children : <Navigate to="/" replace />;
};

export default PrivateRoute;
