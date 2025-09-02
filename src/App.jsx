import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './auth/Login';
import Zonal from './pages/Division/DivisionList.jsx';
import CityOfficerList from './pages/CityOfficer/CityOfficerList.jsx';
import DashBoard from './pages/dashboard/DashBoard';
import Map from './pages/Map/Map';
import { useAuth } from './auth/AuthContext.jsx';
import Setting from './pages/Setting/Setting.jsx';
import Pincode from './pages/Pincode/Pincode.jsx';
import FeildExecutiveList from './pages/FeildExecutive/FeildExecutiveList.jsx';
import City from './pages/CreatCity/AllCity.jsx';
import Division from './pages/CreatDivision/AllDivision.jsx';
import PrivateRoute from './auth/PrivateRoute';
import NewRegistration from './components/NewRegistration.jsx';
import Sidebar from './components/sidebar.jsx';

function App() {
  const [collapsed, setCollapsed] = useState(false);
  const { token, loading } = useAuth();

  const toggleSidebar = () => setCollapsed(!collapsed);

  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <Router>
      <div className="flex">
        {token && <Sidebar collapsed={collapsed} toggleSidebar={toggleSidebar} />}

        <main
          className={`flex-1 transition-all duration-300 ease-in-out ${
            token ? (collapsed ? 'md:ml-20' : 'md:ml-64') : ''
          } ${token ? 'ml-0' : ''}`}
        >
          <Routes>
            <Route path="/" element={token ? <Navigate to="/dashboard" replace /> : <Login />} />

            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <DashBoard />
                </PrivateRoute>
              }
            />

            <Route
              path="/report"
              element={
                <PrivateRoute>
                  <h1 className="p-4">Report Page</h1>
                </PrivateRoute>
              }
            />

            <Route
              path="/zonal"
              element={
                <PrivateRoute>
                  <Zonal />
                </PrivateRoute>
              }
            />

            <Route
              path="/agent"
              element={
                <PrivateRoute>
                  <FeildExecutiveList />
                </PrivateRoute>
              }
            />

            <Route
              path="/pincode"
              element={
                <PrivateRoute>
                  <Pincode />
                </PrivateRoute>
              }
            />

            <Route
              path="/circle-officer"
              element={
                <PrivateRoute>
                  <CityOfficerList />
                </PrivateRoute>
              }
            />

            <Route
              path="/curo_map"
              element={
                <PrivateRoute>
                  <Map />
                </PrivateRoute>
              }
            />

            <Route
              path="/setting"
              element={
                <PrivateRoute>
                  <Setting />
                </PrivateRoute>
              }
            />

            <Route
              path="/all_cities"
              element={
                <PrivateRoute>
                  <City />
                </PrivateRoute>
              }
            />

            <Route
              path="/all_division"
              element={
                <PrivateRoute>
                  <Division />
                </PrivateRoute>
              }
            />
            <Route path='regi' element={<PrivateRoute><NewRegistration/></PrivateRoute>}/>
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
