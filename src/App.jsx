import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/sidebar';
import Login from './auth/Login';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <Router>
      {isLoggedIn && <Sidebar />}
      <Routes>
        <Route path="/" element={isLoggedIn ? <Navigate to="/dashboard" /> : <Login onLogin={() => setIsLoggedIn(true)} />} />
        <Route path="/dashboard" element={isLoggedIn ? <h1>Dashboard Page</h1> : <Navigate to="/" />} />
         <Route path="/report" element={isLoggedIn ? <h1 className="p-4">Report Page</h1> : <Navigate to="/" />} />
        <Route path="/zonal-head" element={isLoggedIn ? <h1 className="p-4">Zonal Head Page</h1> : <Navigate to="/" />} />
        <Route path="/agent" element={isLoggedIn ? <h1 className="p-4">Agent Page</h1> : <Navigate to="/" />} />
        <Route path="/circle-officer" element={isLoggedIn ? <h1 className="p-4">Circle Officer Page</h1> : <Navigate to="/" />} />
        <Route path="/settings" element={isLoggedIn ? <h1 className="p-4">Settings Page</h1> : <Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;