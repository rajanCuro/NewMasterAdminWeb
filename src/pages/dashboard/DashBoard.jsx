import React, { useEffect, useState } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
import { FaAmbulance, FaCapsules, FaHospital, FaUserMd, FaEye, FaTimes } from 'react-icons/fa';
import AddDoctor from '../Doctor/AddDoctor';
import AddAmbulance from '../Ambulance/AddAmbulance';
import AddPharmacy from '../Pharmacies/AddPharmacy';
import AddHospital from '../Hospitals/AddHospital';
import Ambulance from '../Ambulance/Ambulance';
import Doctor from '../Doctor/Doctor';
import Pharmacy from '../Pharmacies/Pharmacy';
import Hospital from '../Hospitals/Hospital';
import { useAuth } from '../../auth/AuthContext';
import axios from 'axios';
import CityOfficerDetail from '../CityOfficer/CityOfficerDetail'
import ViewDivisionDetails from '../Division/ViewDivisionDetails';
import { useNavigate } from 'react-router-dom';
import Loader from '../Loader';

// Register Chart.js components
ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

function Dashboard() {
  const [ambulanceModal, setAmbulanceModal] = useState(false);
  const [hospitalModal, setHospitalModal] = useState(false);
  const [pharmaciesModal, setPharmaciesModal] = useState(false);
  const [doctorModal, setDoctorModal] = useState(false);
  const [cityDetailModal, setCityDetailModal] = useState(false);
  const [divisionDetailModal, setDivisionDetailModal] = useState(false);
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedDivision, setSelectedDivision] = useState(null);
  const [totalCity, setTotalCity] = useState([]);
  const [totalDivision, setTotalDivision] = useState([]);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate()

  useEffect(() => {
    getAllDasboardData()
  }, [])

  const getAllDasboardData = async () => {
    try {
      const response = await axios.get(`http://192.168.1.14:8082/head_admin/getHeadOfficeStatistics`)
      setDashboardData(response.data);
      setTotalCity(response.data.totalCityAdminCount || [])
      setTotalDivision(response.data.totalDivisionAdmin || [])
      setLoading(false);
    } catch (error) {
      console.log(error)
      setLoading(false);
    }
  }

  // Calculate stats from actual data
  const activeCityAdmins = totalCity.filter(admin => admin.enabled).length;
  const inactiveCityAdmins = totalCity.length - activeCityAdmins;

  const activeDivisionAdmins = totalDivision.filter(admin => admin.enabled).length;
  const inactiveDivisionAdmins = totalDivision.length - activeDivisionAdmins;

  const stats = {
    totalCities: totalCity.length,
    totalDivisions: totalDivision.length,
    activeCityAdmins,
    inactiveCityAdmins,
    activeDivisionAdmins,
    inactiveDivisionAdmins,
    totalPopulation: totalCity.reduce((sum, admin) => sum + (admin.city?.populationInMillion || 0), 0),
  };

  // Bar chart data - using actual city populations
  const populationChartData = {
    labels: totalCity.map(admin => admin.city?.cityName || 'Unknown City'),
    datasets: [
      {
        label: 'Population (in millions)',
        data: totalCity.map(admin => admin.city?.populationInMillion || 0),
        backgroundColor: '#3B82F6',
        borderColor: '#2563EB',
        borderWidth: 1,
      },
    ],
  };

  // Pie chart data - using division areas
  const divisionAreaChartData = {
    labels: totalDivision.map(admin => admin.division?.zoneName || 'Unknown Division'),
    datasets: [
      {
        label: 'Area Distribution',
        data: totalDivision.map(admin => {
          // Extract numeric value from area string (e.g., "11491 square km" -> 11491)
          const areaString = admin.division?.area || '0 square km';
          const areaValue = parseInt(areaString.replace(/\D/g, '')) || 0;
          return areaValue;
        }),
        backgroundColor: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'],
        borderColor: ['#2563EB', '#059669', '#D97706', '#DC2626', '#7C3AED'],
        borderWidth: 1,
      },
    ],
  };

  const handleAmbulance = () => {
    setAmbulanceModal(true);
  }
  const handlePharmacy = () => {
    setPharmaciesModal(true);
  }
  const handleHospital = () => {
    setHospitalModal(true);
  }
  const handleDoctor = () => {
    setDoctorModal(true);
  }

  const handleViewCity = (cityAdmin) => {
    setSelectedCity(cityAdmin);
    setCityDetailModal(true);
  }

  const handleViewDivision = (divisionAdmin) => {
    setSelectedDivision(divisionAdmin);
    setDivisionDetailModal(true);
  }

  const closeModals = () => {
    setAmbulanceModal(false);
    setHospitalModal(false);
    setPharmaciesModal(false);
    setDoctorModal(false);
    setCityDetailModal(false);
    setDivisionDetailModal(false);
    setSelectedCity(null);
    setSelectedDivision(null);
  }

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        closeModals();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    // cleanup
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  if (loading) {
    return (
      <Loader/>
    );
  }

  return (
    <>
      {/* Header */}
      <div className="flex justify-between items-center mb-8 sticky top-0 bg-white px-2 py-2">
        <h1 className="text-lg md:text-xl font-bold ">Admin Dashboard</h1>

        <div className="flex items-center space-x-4">
          <button
            onClick={handleAmbulance}
            className="flex items-center cursor-pointer gap-2 px-4 py-2 rounded-lg text-white bg-red-600 hover:bg-red-700"
          >
            <FaAmbulance /> Ambulance
          </button>

          <button
            onClick={handlePharmacy}
            className="flex items-center cursor-pointer gap-2 px-4 py-2 rounded-lg text-white bg-green-600 hover:bg-green-700"
          >
            <FaCapsules /> Pharmacy
          </button>

          <button
            onClick={handleHospital}
            className="flex items-center cursor-pointer gap-2 px-4 py-2 rounded-lg text-white bg-blue-600 hover:bg-blue-700"
          >
            <FaHospital /> Hospital
          </button>

          <button
            onClick={handleDoctor}
            className="flex items-center cursor-pointer gap-2 px-4 py-2 rounded-lg text-white bg-purple-600 hover:bg-purple-700"
          >
            <FaUserMd /> Doctor
          </button>
        </div>
      </div>

      <div className="min-h-screen main_bg p-4">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="main_bg1 p-6 rounded-xl shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500">Total Cities</p>
                <h3 className="text-2xl font-bold">{stats.totalCities}</h3>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-2">Cities under administration</p>
          </div>

          <div className="main_bg1 p-6 rounded-xl shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500">Total Divisions</p>
                <h3 className="text-2xl font-bold">{stats.totalDivisions}</h3>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-2">Administrative divisions</p>
          </div>

          <div className="main_bg1 p-6 rounded-xl shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500">Active City Admins</p>
                <h3 className="text-2xl font-bold text-green-600">{stats.activeCityAdmins}</h3>
                <p className="text-sm text-red-500">Inactive: {stats.inactiveCityAdmins}</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <svg className="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-2">City administrator status</p>
          </div>

          <div className="main_bg1 p-6 rounded-xl shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500">Active Division Admins</p>
                <h3 className="text-2xl font-bold text-green-600">{stats.activeDivisionAdmins}</h3>
                <p className="text-sm text-red-500">Inactive: {stats.inactiveDivisionAdmins}</p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-full">
                <svg className="h-6 w-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-2">Division administrator status</p>
          </div>
        </div>

        {/* City Admins Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="main_bg1 p-6 rounded-xl shadow max-h-[50vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 onClick={() => navigate('/circle-officer')} className="text-xl font-semibold ">City Administrators</h2>
              <div className="flex items-center gap-2">
                <span className="text-green-600 text-sm font-medium">{stats.activeCityAdmins} Active</span>
                <span className="text-red-600 text-sm font-medium">{stats.inactiveCityAdmins} Inactive</span>
              </div>
            </div>
            <div className="space-y-4">
              {totalCity.map((admin) => (
                <div
                  key={admin.id}
                  className="flex items-center p-3 border rounded-lg hover:bg-gray-300 hover:cursor-pointer transition"
                  onClick={() => handleViewCity(admin)}
                >
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-blue-600 font-medium">
                      {admin.city?.cityName ? admin.city.cityName.split(' ').map((n) => n[0]).join('') : 'NA'}
                    </span>
                  </div>
                  <div className="ml-4 flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium text-gray-400">{admin.firstName} {admin.lastName}</h3>
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${admin.enabled ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                        {admin.enabled ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-sm text-gray-500">
                        {admin.city?.cityName || 'No city'} • Pop: {admin.city?.populationInMillion || 0}M
                      </p>
                      <button
                        className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewCity(admin);
                        }}
                      >
                        <FaEye className="mr-1" /> View
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Division Admins Section */}
          <div className="main_bg1 p-6 rounded-xl shadow  max-h-[50vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 onClick={() => navigate('/division_officier ')} className="text-xl font-semibold ">Division Administrators</h2>
              <div className="flex items-center gap-2">
                <span className="text-green-600 text-sm font-medium">{stats.activeDivisionAdmins} Active</span>
                <span className="text-red-600 text-sm font-medium">{stats.inactiveDivisionAdmins} Inactive</span>
              </div>
            </div>
            <div className="space-y-4">
              {totalDivision.map((admin) => (
                <div
                  key={admin.id}
                  className="flex items-center p-3 border rounded-lg hover:bg-gray-300 hover:cursor-pointer transition"
                  onClick={() => handleViewDivision(admin)}
                >
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                    <span className="text-purple-600 font-medium">
                      {admin.division?.zoneName ? admin.division.zoneName.split(' ').map((n) => n[0]).join('') : 'NA'}
                    </span>
                  </div>
                  <div className="ml-4 flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium text-gray-500">{admin.firstName} {admin.lastName}</h3>
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${admin.enabled ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                        {admin.enabled ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-sm text-gray-500">
                        {admin.division?.zoneName || 'No division'} • Districts: {admin.division?.noOfDistricts || 0}
                      </p>
                      <button
                        className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewDivision(admin);
                        }}
                      >
                        <FaEye className="mr-1" /> View
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Graphs Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="main_bg1 p-6 rounded-xl shadow">
            <h2 className="text-xl font-semibold  mb-4">City Population Distribution</h2>
            <div className="h-64">
              <Bar
                data={populationChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true,
                      title: {
                        display: true,
                        text: 'Population (Millions)',
                      },
                    },
                    x: {
                      title: {
                        display: true,
                        text: 'City',
                      },
                    },
                  },
                  plugins: {
                    legend: {
                      display: true,
                      position: 'top',
                    },
                    tooltip: {
                      enabled: true,
                    },
                  },
                }}
              />
            </div>
          </div>

          <div className="main_bg1 p-6 rounded-xl shadow">
            <h2 className="text-xl font-semibold  mb-4">Division Area Distribution</h2>
            <div className="h-64 flex items-center justify-center">
              <div className="w-full">
                <Pie
                  data={divisionAreaChartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'right',
                      },
                      tooltip: {
                        enabled: true,
                        callbacks: {
                          label: function (context) {
                            return `${context.label}: ${context.raw} sq km`;
                          }
                        }
                      },
                    },
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* City Detail Modal */}
      {cityDetailModal && selectedCity && (
        <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-brightness-50">
          <div className="relative bg-white rounded-lg shadow-xl max-w-7xl w-full max-h-[90vh] overflow-y-auto">
            <button
              onClick={closeModals}
              className="absolute cursor-pointer top-4 right-4 flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 text-gray-600 hover:bg-gray-300 hover:text-gray-800 transition"
            >
              <FaTimes />
            </button>
            <CityOfficerDetail ViewData={selectedCity} />
          </div>
        </div>
      )}

      {/* Division Detail Modal */}
      {divisionDetailModal && selectedDivision && (
        <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-brightness-50">
          <div className="relative bg-white rounded-lg shadow-xl max-w-7xl w-full max-h-[90vh] overflow-y-auto">
            <button
              onClick={closeModals}
              className="absolute cursor-pointer top-4 right-4 flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 text-gray-600 hover:bg-gray-300 hover:text-gray-800 transition"
            >
              <FaTimes />
            </button>
            <ViewDivisionDetails ViewData={selectedDivision} />
          </div>
        </div>
      )}

      {/* ambulance Modal */}
      {ambulanceModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-brightness-50">
          <div className="relative bg-red-50 rounded-lg shadow-xl max-w-full w-full h-screen overflow-y-auto">
            <button
              onClick={closeModals}
              className="absolute cursor-pointer top-4 right-4 flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 text-gray-600 hover:bg-gray-300 hover:text-gray-800 transition"
            >
              ✕
            </button>
            <div className="p-6">
              <Ambulance />
            </div>
          </div>
        </div>
      )}

      {/* doctor modal */}
      {doctorModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-brightness-50">
          <div className="relative bg-green-50 rounded-lg shadow-xl max-w-full w-full h-screen overflow-y-auto">
            <button
              onClick={closeModals}
              className="absolute z-70 cursor-pointer top-4 right-4 flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 text-gray-600 hover:bg-gray-300 hover:text-gray-800 transition"
            >
              ✕
            </button>
            <div className="p-6">
              <Doctor />
            </div>
          </div>
        </div>
      )}

      {/* pharmacy modal */}
      {pharmaciesModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-brightness-50">
          <div className="relative bg-blue-50 rounded-lg shadow-xl max-w-full w-full h-screen overflow-y-auto">
            <button
              onClick={closeModals}
              className="absolute cursor-pointer top-4 right-4 flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 text-gray-600 hover:bg-gray-300 hover:text-gray-800 transition"
            >
              ✕
            </button>
            <div className="p-6">
              <Pharmacy />
            </div>
          </div>
        </div>
      )}

      {/* hospitalModal */}
      {hospitalModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-brightness-50">
          <button
            onClick={closeModals}
            className="fixed top-0 right-0 z-50 flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 text-gray-600 hover:bg-gray-300 hover:text-gray-800 transition"
          >
            ✕
          </button>
          <div className="p-2 w-full">
            <Hospital />
          </div>
        </div>
      )}
    </>
  );
}

export default Dashboard;