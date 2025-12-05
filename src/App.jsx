// src/App.jsx
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './auth/LoginWrap.jsx';
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
import NewRegistration from './components/CuroUsers.jsx';
import Sidebar from './components/sidebar.jsx'
import GetDistanceInfo from './pages/FieldExecutiveDistance/GetDistanceInfoExecutiveList.jsx';
import FileManager from './components/FileManager.jsx';
import Loader from './pages/Loader.jsx';
import HospitalList from './pages/Hospitals/HospitalList.jsx'
import AmbulanceList from './pages/Ambulance/AmbulanceLIst.jsx';
import PharmacyList from './pages/Pharmacies/PharmacyList.jsx'
import DoctorList from './pages/Doctor/DoctorList.jsx';
import Lablist from './pages/Lab/LabList.jsx'
import FeedBack from './components/FeedBack.jsx';


function App() {
  const [collapsed, setCollapsed] = useState(false);
  const { token, loading } = useAuth();

  const toggleSidebar = () => setCollapsed(!collapsed);

  // ⚠️ Confirm before closing or refreshing the browser tab
  // useEffect(() => {
  //   const handleBeforeUnload = (e) => {
  //     e.preventDefault();
  //     e.returnValue = ''; // Required for some browsers (like Chrome)
  //   };

  //   window.addEventListener('beforeunload', handleBeforeUnload);

  //   return () => {
  //     window.removeEventListener('beforeunload', handleBeforeUnload);
  //   };
  // }, []);

  if (loading) {
    return <Loader />
  }

  return (
    <Router>
      <div className="flex">
        {token && <Sidebar collapsed={collapsed} toggleSidebar={toggleSidebar} />}

        <main
          className={`flex-1 transition-all duration-300 ease-in-out ${token ? (collapsed ? 'md:ml-20' : 'md:ml-64') : ''} ${token ? 'ml-0' : ''}`}
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
              path="/division_officier"
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

            <Route
              path="/curo_users"
              element={
                <PrivateRoute>
                  <NewRegistration />
                </PrivateRoute>
              }
            />

            <Route
              path="/distance_info"
              element={
                <PrivateRoute>
                  <GetDistanceInfo />
                </PrivateRoute>
              }
            />

            <Route
              path="/file_manager"
              element={
                <PrivateRoute>
                  <FileManager />
                </PrivateRoute>
              }
            />
            <Route
              path="/hospitals"
              element={
                <PrivateRoute>
                  <HospitalList />
                </PrivateRoute>
              }
            />
            <Route
              path="/ambulances"
              element={
                <PrivateRoute>
                  <AmbulanceList />
                </PrivateRoute>
              }
            />
            <Route
              path="/pharmacies"
              element={
                <PrivateRoute>
                  <PharmacyList />
                </PrivateRoute>
              }
            />
            <Route
              path="/doctors"
              element={
                <PrivateRoute>
                  <DoctorList />
                </PrivateRoute>
              }
            />
            <Route
              path="/labs"
              element={
                <PrivateRoute>
                  <Lablist />
                </PrivateRoute>
              }
            />
            <Route path='/feedback' element={<FeedBack />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
