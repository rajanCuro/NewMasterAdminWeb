import React, { useState, useMemo, useCallback, useEffect } from "react";
import { FaSearch, FaSort, FaPlus, FaEdit, FaTrash, FaAmbulance } from "react-icons/fa";
import debounce from "lodash.debounce";
import Pagination from "../Pagination";
import axiosInstance from "../../auth/axiosInstance";
import Loader from "../Loader";
import NoDataPage from "../../NodataPage";

export default function AmbulanceTable({ id }) {
  const [ambulances, setAmbulances] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "ascending" });
  const [typeFilter, setTypeFilter] = useState("All");
  const [availabilityFilter, setAvailabilityFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [ambulanceToEdit, setAmbulanceToEdit] = useState(null);
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false); // Fixed: Added setError
  const [ambulanceToDelete, setAmbulanceToDelete] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true);
      // alert(id)
      const response = await axiosInstance.get(`/api/field-executive/getAgentStatistics/${id}`);
      setAmbulances(response.data.ambulances || []);
      console.log(response.data)
    } catch (error) {
      setError(true); // Fixed: Now setError is defined
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Extract all unique ambulance types
  const ambulanceTypes = useMemo(() => {
    return ["All", ...new Set(ambulances.map(ambulance => ambulance.type || "Unknown"))];
  }, [ambulances]);

  // Calculate ambulance statistics
  const ambulanceStats = useMemo(() => {
    const total = ambulances.length;
    const active = ambulances.filter(ambulance => ambulance.enabled).length;
    const inactive = total - active;
    const available = ambulances.filter(ambulance => ambulance.available).length;
    const occupied = total - available;

    return { total, active, inactive, available, occupied };
  }, [ambulances]);

  const debouncedSetSearchTerm = useCallback(debounce((value) => setSearchTerm(value), 300), []);

  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const filteredAmbulances = useMemo(() => {
    return ambulances
      .filter((ambulance) => {
        const matchesSearch =
          ambulance.ambulanceNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          ambulance.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          ambulance.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          ambulance.email?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesType = typeFilter === "All" || ambulance.type === typeFilter;
        const matchesAvailability = availabilityFilter === "All" ||
          (availabilityFilter === "Available" && ambulance.available) ||
          (availabilityFilter === "Occupied" && !ambulance.available);

        return matchesSearch && matchesType && matchesAvailability;
      })
      .sort((a, b) => {
        if (sortConfig.key) {
          // Handle null/undefined values in sorting
          const aValue = a[sortConfig.key] || "";
          const bValue = b[sortConfig.key] || "";

          if (aValue < bValue) {
            return sortConfig.direction === "ascending" ? -1 : 1;
          }
          if (aValue > bValue) {
            return sortConfig.direction === "ascending" ? 1 : -1;
          }
        }
        return 0;
      });
  }, [searchTerm, typeFilter, availabilityFilter, sortConfig, ambulances]);

  const paginatedAmbulances = filteredAmbulances.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getSortIcon = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === "ascending" ? "↑" : "↓";
    }
    return <FaSort className="ml-1" />;
  };

  const handleAddAmbulance = (newAmbulance) => {
    const ambulanceWithId = {
      id: ambulances.length > 0 ? Math.max(...ambulances.map(a => a.id)) + 1 : 1,
      ...newAmbulance
    };
    setAmbulances([...ambulances, ambulanceWithId]);
    setShowAddModal(false);
  };

  

  const handleDeleteAmbulance = () => {
    if (ambulanceToDelete) {
      setAmbulances(ambulances.filter(ambulance => ambulance.id !== ambulanceToDelete.id));
      setShowDeleteConfirm(false);
      setAmbulanceToDelete(null);
    }
  };

  const openEditModal = (ambulance) => {
    setAmbulanceToEdit(ambulance);
    setShowEditModal(true);
  };

  const openDeleteConfirm = (ambulance) => {
    setAmbulanceToDelete(ambulance);
    setShowDeleteConfirm(true);
  };

  if (loading) {
    return (
      <Loader />
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl text-red-500">Error loading ambulance data</div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-gray-50 h-screen overflow-y-auto w-full p-8">
        <div className="bg-white rounded-xl p-6 mb-6 shadow-sm">
          {/* Stats Cards Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
            {/* Total Ambulances Card */}
            <div className="bg-white rounded-lg shadow p-4 border-l-4 border-blue-500">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <FaAmbulance className="w-5 h-5 text-blue-500" />
                  </div>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-gray-500">Total Ambulances</h3>
                  <p className="text-xl font-semibold text-gray-900">{ambulanceStats.total}</p>
                </div>
              </div>
            </div>

            {/* Active Ambulances Card */}
            <div className="bg-white rounded-lg shadow p-4 border-l-4 border-green-500">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-gray-500">Active Ambulances</h3>
                  <p className="text-xl font-semibold text-gray-900">{ambulanceStats.active}</p>
                </div>
              </div>
            </div>

            {/* Inactive Ambulances Card */}
            <div className="bg-white rounded-lg shadow p-4 border-l-4 border-red-500">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                    <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-gray-500">Inactive Ambulances</h3>
                  <p className="text-xl font-semibold text-gray-900">{ambulanceStats.inactive}</p>
                </div>
              </div>
            </div>

            {/* Available Ambulances Card */}
            <div className="bg-white rounded-lg shadow p-4 border-l-4 border-purple-500">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                    <FaAmbulance className="w-5 h-5 text-purple-500" />
                  </div>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-gray-500">Available Ambulances</h3>
                  <p className="text-xl font-semibold text-gray-900">{ambulanceStats.available}</p>
                </div>
              </div>
            </div>

            {/* Occupied Ambulances Card */}
            <div className="bg-white rounded-lg shadow p-4 border-l-4 border-orange-500">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                    <FaAmbulance className="w-5 h-5 text-orange-500" />
                  </div>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-gray-500">Occupied Ambulances</h3>
                  <p className="text-xl font-semibold text-gray-900">{ambulanceStats.occupied}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Ambulance Management</h2>
              <p className="text-gray-600 mt-1">Manage and search ambulance fleet</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 mt-4 md:mt-0">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search ambulances..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full md:w-64"
                  onChange={(e) => debouncedSetSearchTerm(e.target.value)}
                  aria-label="Search ambulances by number, name, or email"
                />
              </div>              
            </div>
          </div>
          <div className="mb-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="w-full md:w-1/2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Type</label>
                <select
                  className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={typeFilter}
                  onChange={(e) => {
                    setTypeFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  aria-label="Filter ambulances by type"
                >
                  {ambulanceTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
              <div className="w-full md:w-1/2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Availability</label>
                <select
                  className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={availabilityFilter}
                  onChange={(e) => {
                    setAvailabilityFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  aria-label="Filter ambulances by availability"
                >
                  <option value="All">All</option>
                  <option value="Available">Available</option>
                  <option value="Occupied">Occupied</option>
                </select>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto rounded-lg shadow">
            <div className="max-h-[500px] overflow-y-auto">
              <table className="w-full">
                <thead className="bg-gray-100 sticky top-0 z-10">
                  <tr>
                    <th
                      className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort("ambulanceNumber")}
                      aria-sort={sortConfig.key === "ambulanceNumber" ? sortConfig.direction : "none"}
                    >
                      <div className="flex items-center">
                        Ambulance Number {getSortIcon("ambulanceNumber")}
                      </div>
                    </th>
                    <th
                      className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort("firstName")}
                      aria-sort={sortConfig.key === "firstName" ? sortConfig.direction : "none"}
                    >
                      <div className="flex items-center">
                        Driver Name {getSortIcon("firstName")}
                      </div>
                    </th>
                    <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th
                      className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort("type")}
                      aria-sort={sortConfig.key === "type" ? sortConfig.direction : "none"}
                    >
                      <div className="flex items-center">
                        Type {getSortIcon("type")}
                      </div>
                    </th>
                    <th
                      className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort("available")}
                      aria-sort={sortConfig.key === "available" ? sortConfig.direction : "none"}
                    >
                      <div className="flex items-center">
                        Status {getSortIcon("available")}
                      </div>
                    </th>
                    <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedAmbulances.map((ambulance) => (
                    <tr key={ambulance.id} className="hover:bg-blue-50 transition-colors duration-150">
                      <td className="p-4 font-medium text-gray-900">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                            <FaAmbulance className="text-blue-600" />
                          </div>
                          {ambulance.ambulanceNumber || "N/A"}
                        </div>
                      </td>
                      <td className="p-4 text-gray-600">
                        {ambulance.firstName} {ambulance.lastName}
                      </td>
                      <td className="p-4 text-blue-600 font-medium">
                        <div>{ambulance.mobileNumber || "N/A"}</div>
                        <div className="text-sm text-gray-500">{ambulance.email || "N/A"}</div>
                      </td>
                      <td className="p-4 text-gray-600">
                        <span className="bg-gray-100 px-2 py-1 rounded-md text-xs capitalize">
                          {ambulance.type || "Unknown"}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${ambulance.available
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                          }`}>
                          {ambulance.available ? 'Available' : 'Occupied'}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex space-x-2">
                          <button
                            className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors duration-150"
                            onClick={() => openEditModal(ambulance)}
                            aria-label={`Edit ${ambulance.ambulanceNumber}`}
                          >
                            <FaEdit />
                          </button>
                          <button
                            className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors duration-150"
                            onClick={() => openDeleteConfirm(ambulance)}
                            aria-label={`Delete ${ambulance.ambulanceNumber}`}
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {filteredAmbulances.length === 0 && (
            <NoDataPage/>
          )}

          {filteredAmbulances.length > 0 && (
            <div className="px-6 py-4 bg-white border-t border-gray-200">
              <Pagination
                currentPage={currentPage}
                totalItems={filteredAmbulances.length}
                itemsPerPage={itemsPerPage}
                onPageChange={setCurrentPage}
                onItemsPerPageChange={setItemsPerPage}
              />
            </div>
          )}
        </div>

        {/* Add Ambulance Modal */}
        

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && ambulanceToDelete && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-xl font-semibold text-gray-800">Confirm Deletion</h3>
              </div>
              <div className="p-6">
                <p className="text-gray-700 mb-4">
                  Are you sure you want to delete ambulance <span className="font-semibold">{ambulanceToDelete.ambulanceNumber}</span>? This action cannot be undone.
                </p>
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteAmbulance}
                    className="px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}