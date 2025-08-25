import React, { useState } from "react";
import { FaAmbulance, FaSearch, FaFilter, FaPlus, FaSync, FaUserMd, FaPhone, FaCarSide, FaIdCard, FaEdit } from "react-icons/fa";
import { FaBedPulse } from "react-icons/fa6";
import AddAmbulance from "./AddAmbulance";

const generateAmbulances = () => {
  const types = ["Basic Life Support", "Advanced Life Support"];
  const statuses = ["available", "on-duty", "unavailable"];
  const ambulances = [];

  for (let i = 1; i <= 50; i++) {
    const type = types[i % 2];
    const status = statuses[i % 3];

    ambulances.push({
      ambulanceId: `AMB${1000 + i}`,
      vehicleDetails: {
        registrationNumber: `MH12AB${1000 + i}`,
        vehicleType: type,
        model: `Tata Winger ${2020 + (i % 4)}`,
        capacity: i % 2 === 0 ? "4 patients" : "2 patients"
      },
      driverDetails: {
        name: `Driver ${i}`,
        phone: `+91-90000${i.toString().padStart(4, "0")}`,
        license: `DL${10000 + i}`
      },
      availabilityStatus: status,
      lastMaintenance: `2023-${(i % 12) + 1}-${(i % 28) + 1}`
    });
  }

  return ambulances;
};

const AmbulanceList = () => {
  const ambulanceData = generateAmbulances();
  const [ambulanceModal, setAmbulanceModal] = useState(false);
  const [editingAmbulance, setEditingAmbulance] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Open modal for adding a new ambulance
  const openAddModal = () => {
    setEditingAmbulance(null);
    setAmbulanceModal(true);
  };

  // Open modal for editing an existing ambulance
  const openEditModal = (ambulance) => {
    setEditingAmbulance(ambulance);
    setAmbulanceModal(true);
  };

  // Close modal and reset editing state
  const closeModal = () => {
    setAmbulanceModal(false);
    setEditingAmbulance(null);
  };

  // Filter and search logic
  const filteredAmbulances = ambulanceData.filter(amb => {
    const matchesSearch =
      amb.ambulanceId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      amb.vehicleDetails.registrationNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      amb.driverDetails.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      amb.driverDetails.phone.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "all" || amb.availabilityStatus === statusFilter;
    const matchesType = typeFilter === "all" || amb.vehicleDetails.vehicleType === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredAmbulances.length / itemsPerPage);
  const currentAmbulances = filteredAmbulances.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Status badge component
  const StatusBadge = ({ status }) => {
    const statusConfig = {
      available: { color: "bg-green-100 text-green-800", text: "Available" },
      "on-duty": { color: "bg-yellow-100 text-yellow-800", text: "On Duty" },
      unavailable: { color: "bg-red-100 text-red-800", text: "Unavailable" }
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusConfig[status].color}`}>
        {statusConfig[status].text}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-gray-800 flex items-center">
              <FaAmbulance className="mr-3 text-blue-600" />
              Ambulance Management
            </h1>
            <button
              onClick={openAddModal}
              className="bg-blue-600 cursor-pointer hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center">
              <FaPlus className="mr-2" />
              Add Ambulance
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
                  <FaAmbulance size={20} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Ambulances</p>
                  <p className="text-2xl font-bold">{ambulanceData.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
                  <FaCarSide size={20} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Available</p>
                  <p className="text-2xl font-bold">
                    {ambulanceData.filter(a => a.availabilityStatus === "available").length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-yellow-100 text-yellow-600 mr-4">
                  <FaUserMd size={20} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">On Duty</p>
                  <p className="text-2xl font-bold">
                    {ambulanceData.filter(a => a.availabilityStatus === "on-duty").length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-red-100 text-red-600 mr-4">
                  <FaPhone size={20} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Unavailable</p>
                  <p className="text-2xl font-bold">
                    {ambulanceData.filter(a => a.availabilityStatus === "unavailable").length}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow mb-6 p-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by ID, registration, driver name or phone..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex items-center">
                <FaFilter className="text-gray-400 mr-2" />
                <select
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All Statuses</option>
                  <option value="available">Available</option>
                  <option value="on-duty">On Duty</option>
                  <option value="unavailable">Unavailable</option>
                </select>
              </div>

              <select
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
              >
                <option value="all">All Types</option>
                <option value="Basic Life Support">Basic Life Support</option>
                <option value="Advanced Life Support">Advanced Life Support</option>
              </select>

              <button 
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("all");
                  setTypeFilter("all");
                }}
                className="bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-lg flex items-center"
              >
                <FaSync className="mr-1" />
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ambulance ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vehicle Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Driver Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Maintenance
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentAmbulances.map((amb) => (
                  <tr key={amb.ambulanceId} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <FaAmbulance className="text-blue-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{amb.ambulanceId}</div>
                          <div className="text-sm text-gray-500">{amb.vehicleDetails.registrationNumber}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{amb.vehicleDetails.vehicleType}</div>
                      <div className="text-sm text-gray-500">{amb.vehicleDetails.model}</div>
                      <div className="text-sm text-gray-500">Capacity: {amb.vehicleDetails.capacity}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center">
                          <FaUserMd className="text-gray-600 text-xs" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{amb.driverDetails.name}</div>
                          <div className="text-sm text-gray-500 flex items-center">
                            <FaPhone className="mr-1 text-xs" />
                            {amb.driverDetails.phone}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center">
                            <FaIdCard className="mr-1 text-xs" />
                            {amb.driverDetails.license}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {amb.lastMaintenance}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={amb.availabilityStatus} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button 
                        onClick={() => openEditModal(amb)}
                        className="text-blue-600 hover:text-blue-900 mr-3 flex items-center"
                      >
                        <FaEdit className="mr-1" />
                        Edit
                      </button>
                      <button className="text-red-600 hover:text-red-900">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{" "}
                  <span className="font-medium">
                    {Math.min(currentPage * itemsPerPage, filteredAmbulances.length)}
                  </span>{" "}
                  of <span className="font-medium">{filteredAmbulances.length}</span> results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${currentPage === 1 ? "text-gray-300" : "text-gray-500 hover:bg-gray-50"
                      }`}
                  >
                    Previous
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${currentPage === page
                        ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
                        : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                        }`}
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${currentPage === totalPages ? "text-gray-300" : "text-gray-500 hover:bg-gray-50"
                      }`}
                  >
                    Next
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>
        
        {/* Ambulance Modal */}
        {ambulanceModal && (
          <div className="fixed inset-0 backdrop-brightness-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-5xl relative flex flex-col max-h-[90vh]">
              {/* Fixed Header */}
              <div className="p-4 border-b rounded-t-2xl border-gray-200 flex justify-between items-center sticky top-0 bg-white z-10">
                <h3 className="text-xl font-semibold text-gray-800">
                  {editingAmbulance ? "Edit Ambulance" : "Add New Ambulance"}
                </h3>
                <button
                  onClick={closeModal}
                  className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-colors duration-150"
                  aria-label="Close modal"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="overflow-y-auto p-6">
                <AddAmbulance 
                  ambulanceData={editingAmbulance} 
                  isEditing={!!editingAmbulance}
                  onClose={closeModal}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AmbulanceList;