import React, { useEffect, useState } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
import { FaAmbulance, FaCapsules, FaHospital, FaUserMd } from 'react-icons/fa';
import AddDoctor from '../Doctor/AddDoctor';
import AddAmbulance from '../Ambulance/AddAmbulance';
import AddPharmacy from '../Pharmacies/AddPharmacy';
import AddHospital from '../Hospitals/AddHospital';
import Ambulance from '../Ambulance/Ambulance';
import Doctor from '../Doctor/Doctor';
import Pharmacy from '../Pharmacies/Pharmacy';
import Hospital from '../Hospitals/Hospital';

// Register Chart.js components
ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

function Dashboard() {
  const [ambulanceModal, setAmbulanceModal] = useState(false);
  const [hospitalModal, setHospitalModal] = useState(false);
  const [pharmaciesModal, setPharmaciesModal] = useState(false);
  const [doctorModal, setDoctorModal] = useState(false);
  const [addAmbulanceModal, setAddAmbulanceModal] = useState(false);
  const [addHospitalModal, setAddHospitalModal] = useState(false);
  const [addPharmacyModal, setAddPharmacyModal] = useState(false);
  const [addDoctorModal, setAddDoctorModal] = useState(false);

  // Mock data (same as your original)
  const circleOfficers = [
    { id: 1, name: 'John Doe', zone: 'Zone A', status: 'Active', cases: 24, lastActive: '2 hours ago' },
    { id: 2, name: 'Jane Smith', zone: 'Zone B', status: 'Inactive', cases: 15, lastActive: '1 day ago' },
    { id: 3, name: 'Robert Johnson', zone: 'Zone C', status: 'Active', cases: 32, lastActive: '30 minutes ago' },
    { id: 4, name: 'Emily Davis', zone: 'Zone D', status: 'On Leave', cases: 8, lastActive: '3 days ago' },
  ];

  const zonalHeads = [
    { id: 1, name: 'Michael Wilson', region: 'North', status: 'Active', officers: 12, performance: 'Excellent' },
    { id: 2, name: 'Sarah Brown', region: 'South', status: 'Active', officers: 8, performance: 'Good' },
    { id: 3, name: 'David Miller', region: 'East', status: 'Inactive', officers: 10, performance: 'Average' },
    { id: 4, name: 'Lisa Taylor', region: 'West', status: 'Active', officers: 15, performance: 'Excellent' },
  ];

  const stats = {
    activeOfficers: 78,
    inactiveOfficers: 12,
    casesThisMonth: 245,
    casesLastMonth: 198,
    performanceTrend: [65, 59, 80, 81, 56, 55, 40, 72, 88, 76, 85, 92],
    caseDistribution: [35, 25, 20, 15, 5],
  };

  // Bar chart data
  const performanceChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Performance Trend (%)',
        data: stats.performanceTrend,
        backgroundColor: '#3B82F6',
        borderColor: '#2563EB',
        borderWidth: 1,
      },
    ],
  };

  // Pie chart data
  const caseDistributionChartData = {
    labels: ['Zone A', 'Zone B', 'Zone C', 'Zone D', 'Zone E'],
    datasets: [
      {
        label: 'Case Distribution',
        data: stats.caseDistribution,
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
  const closeModals = () => {
    setAmbulanceModal(false);
    setHospitalModal(false);
    setPharmaciesModal(false);
    setDoctorModal(false);
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
                <p className="text-gray-500">Active Officers</p>
                <h3 className="text-2xl font-bold">{stats.activeOfficers}</h3>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-2">+12% from last month</p>
          </div>

          <div className="main_bg1 p-6 rounded-xl shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500">Inactive Officers</p>
                <h3 className="text-2xl font-bold">{stats.inactiveOfficers}</h3>
              </div>
              <div className="bg-red-100 p-3 rounded-full">
                <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-2">-5% from last month</p>
          </div>

          <div className="main_bg1 p-6 rounded-xl shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500">Cases This Month</p>
                <h3 className="text-2xl font-bold">{stats.casesThisMonth}</h3>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-2">+24% from last month</p>
          </div>

          <div className="main_bg1 p-6 rounded-xl shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500">Avg. Resolution Time</p>
                <h3 className="text-2xl font-bold">3.2 days</h3>
              </div>
              <div className="bg-yellow-100 p-3 rounded-full">
                <svg className="h-6 w-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-2">-0.8 days from last month</p>
          </div>
        </div>

        {/* Circle Officers Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="main_bg1 p-6 rounded-xl shadow">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold ">Circle Officers</h2>
              <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">View All</button>
            </div>
            <div className="space-y-4">
              {circleOfficers.map((officer) => (
                <div key={officer.id} className="flex items-center p-3 border rounded-lg hover:bg-gray-300 hover:cursor-pointer transition">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-blue-600 font-medium">
                      {officer.name.split(' ').map((n) => n[0]).join('')}
                    </span>
                  </div>
                  <div className="ml-4 flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium text-gray-400">{officer.name}</h3>
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${officer.status === 'Active'
                          ? 'bg-green-100 text-green-800'
                          : officer.status === 'Inactive'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                          }`}
                      >
                        {officer.status}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-sm text-gray-500">
                        {officer.zone} • {officer.cases} cases
                      </p>
                      <p className="text-xs text-gray-400">Last active: {officer.lastActive}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Zonal Heads Section */}
          <div className="main_bg1 p-6 rounded-xl shadow">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold ">Zonal Heads</h2>
              <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">View All</button>
            </div>
            <div className="space-y-4">
              {zonalHeads.map((head) => (
                <div key={head.id} className="flex items-center p-3 border rounded-lg hover:bg-gray-300 hover:cursor-pointer transition">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                    <span className="text-purple-600 font-medium">
                      {head.name.split(' ').map((n) => n[0]).join('')}
                    </span>
                  </div>
                  <div className="ml-4 flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium text-gray-500">{head.name}</h3>
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${head.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}
                      >
                        {head.status}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-sm text-gray-500">
                        {head.region} Region • {head.officers} officers
                      </p>
                      <p className="text-xs text-gray-400">Performance: {head.performance}</p>
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
            <h2 className="text-xl font-semibold  mb-4">Performance Trend</h2>
            <div className="h-64">
              <Bar
                data={performanceChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true,
                      title: {
                        display: true,
                        text: 'Performance (%)',
                      },
                    },
                    x: {
                      title: {
                        display: true,
                        text: 'Month',
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
            <h2 className="text-xl font-semibold  mb-4">Case Distribution</h2>
            <div className="h-64 flex items-center justify-center">
              <div className="w-1/2">
                <Pie
                  data={caseDistributionChartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'right',
                      },
                      tooltip: {
                        enabled: true,
                      },
                    },
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

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
              className="absolute cursor-pointer top-4 right-4 flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 text-gray-600 hover:bg-gray-300 hover:text-gray-800 transition"
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
          <div className="relative bg-purple-50 rounded-lg shadow-xl max-w-full w-full h-screen overflow-y-auto">
            <button
              onClick={closeModals}
              className="absolute cursor-pointer top-4 right-4 flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 text-gray-600 hover:bg-gray-300 hover:text-gray-800 transition"
            >
              ✕
            </button>
            <div className="p-6">
              <Hospital />
            </div>
          </div>
        </div>
      )}



    </>
  );
}

export default Dashboard;