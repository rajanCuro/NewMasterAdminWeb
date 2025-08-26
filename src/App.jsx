import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Login from './auth/Login';
import Zonal from './pages/Division/DivisionList.jsx';
import CityOfficerList from './pages/CityOfficer/CityOfficerList.jsx';
import DashBoard from './pages/dashboard/DashBoard';
import Map from './pages/Map/Map';
import {  useAuth } from './auth/AuthContext.jsx'
import Setting from './pages/Setting/Setting.jsx';
import Sidebar from './components/sidebar.jsx';
import Pincode from './pages/Pincode/Pincode.jsx';
import FeildExecutiveList from './pages/FeildExecutive/FeildExecutiveList.jsx';

function App() {
  const [collapsed, setCollapsed] = useState(false); // Manage sidebar collapsed state
  const { token,role } = useAuth(); 
  console.log('rolee:', role);  
  const toggleSidebar = () => setCollapsed(!collapsed);
  return ( 
      <Router>
        <div className="flex">
          {/* Pass collapsed state and toggle function to Sidebar */}
          {token && <Sidebar collapsed={collapsed} toggleSidebar={toggleSidebar} />}

          {/* Main content area with dynamic margin */}
          <main
            className={`flex-1 transition-all duration-300 ease-in-out  ${token ? (collapsed ? 'md:ml-20' : 'md:ml-64') : ''
              } ${token ? 'ml-0' : ''}`}
          >
            <Routes>
              <Route
                path="/"
                element={token ? <Navigate to="/dashboard" /> : <Login  />}
              />
              <Route path="/dashboard" element={token ? <DashBoard /> : <Navigate to="/" />} />
              <Route path="/report" element={token ? <h1 className="p-4">Report Page</h1> : <Navigate to="/" />} />
              <Route path="/zonal" element={token ? <Zonal /> : <Navigate to="/" />} />
              <Route path="/agent" element={token ? <FeildExecutiveList /> : <Navigate to="/" />} />
              <Route path='/pincode' element={token ? <Pincode/> : <Navigate to ='/'/>}/>
              <Route
                path="/circle-officer"
                element={token ? <CityOfficerList /> : <Navigate to="/" />}
              />
              <Route path="/curo_map" element={token ? <Map /> : <Navigate to="/" />} />
              <Route path="/setting" element={token ? <Setting /> : <Navigate to="/" />} />
            </Routes>
          </main>
        </div>
      </Router>
   
  );
}

export default App;