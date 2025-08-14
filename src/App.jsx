import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/sidebar';
import Login from './auth/Login';
import Zonal from './pages/ZonalHead/Zonal';
import AgentList from './pages/Agent/AgentList';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [collapsed, setCollapsed] = useState(false); // Manage sidebar collapsed state

  // Function to toggle sidebar collapse state
  const toggleSidebar = () => setCollapsed(!collapsed);

  return (
    <Router>
      <div className="flex">
        {/* Pass collapsed state and toggle function to Sidebar */}
        {isLoggedIn && <Sidebar collapsed={collapsed} toggleSidebar={toggleSidebar} />}

        {/* Main content area with dynamic margin */}
        <main
          className={`flex-1 transition-all duration-300 ease-in-out  ${isLoggedIn ? (collapsed ? 'md:ml-20' : 'md:ml-64') : ''
            } ${isLoggedIn ? 'ml-0' : ''}`}
        >
          <Routes>
            <Route
              path="/"
              element={isLoggedIn ? <Navigate to="/dashboard" /> : <Login onLogin={() => setIsLoggedIn(true)} />}
            />
            <Route path="/dashboard" element={isLoggedIn ? <h1 className="p-4">Dashboard Page</h1> : <Navigate to="/" />} />
            <Route path="/report" element={isLoggedIn ? <h1 className="p-4">Report Page</h1> : <Navigate to="/" />} />
            <Route path="/zonal" element={isLoggedIn ? <Zonal /> : <Navigate to="/" />} />
            <Route path="/agent" element={isLoggedIn ? <AgentList/> : <Navigate to="/" />} />
            <Route
              path="/circle-officer"
              element={isLoggedIn ? <h1 className="p-4">Circle Officer Page</h1> : <Navigate to="/" />}
            />
            <Route path="/settings" element={isLoggedIn ? <h1 className="p-4">Settings Page</h1> : <Navigate to="/" />} />
          </Routes>
        </main> 
      </div>
    </Router>
  );
}

export default App;