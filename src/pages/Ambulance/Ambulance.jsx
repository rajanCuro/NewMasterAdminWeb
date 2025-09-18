import React, { useEffect, useState } from 'react';
import { RiSearchLine, RiFilter3Line, RiArrowUpDownLine } from 'react-icons/ri';
import { IoIosClose } from 'react-icons/io';
import { FaAmbulance, FaGasPump, FaUser } from 'react-icons/fa';
import { MdDirectionsCar, MdEmail, MdPhone } from 'react-icons/md';
import axiosInstance from '../../auth/axiosInstance';

function Ambulance({ id }) {
  const [allAmbulance, setAllAmbulance] = useState([]);
  const [filteredAmbulances, setFilteredAmbulances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  
  // Filter states
  const [filters, setFilters] = useState({
    searchTerm: "",
    statusFilter: "all",
    availabilityFilter: "all",
    sortBy: "newest"
  });

  useEffect(() => {
    fetchData();
  }, [id]);

  useEffect(() => {
    let result = [...allAmbulance];
    
    // Apply search filter
    if (filters.searchTerm) {
      const searchTerm = filters.searchTerm.toLowerCase();
      result = result.filter(
        (ambulance) =>
          ambulance.firstName?.toLowerCase().includes(searchTerm) ||
          ambulance.lastName?.toLowerCase().includes(searchTerm) ||
          ambulance.email?.toLowerCase().includes(searchTerm) ||
          ambulance.id?.toString().includes(searchTerm) ||
          ambulance.mobileNumber?.toLowerCase().includes(searchTerm) ||
          ambulance.ambulanceNumber?.toLowerCase().includes(searchTerm) ||
          ambulance.ambulanceModel?.toLowerCase().includes(searchTerm)
      );
    }

    // Apply status filter
    if (filters.statusFilter !== "all") {
      const statusValue = filters.statusFilter === "active";
      result = result.filter((ambulance) => ambulance.accountNonLocked === statusValue);
    }

    // Apply availability filter
    if (filters.availabilityFilter !== "all") {
      const availabilityValue = filters.availabilityFilter === "available";
      result = result.filter((ambulance) => ambulance.available === availabilityValue);
    }

    // Apply sorting
    if (filters.sortBy === "newest") {
      result.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    } else if (filters.sortBy === "oldest") {
      result.sort((a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0));
    } else if (filters.sortBy === "name") {
      result.sort((a, b) => {
        const nameA = `${a.firstName || ""} ${a.lastName || ""}`.toLowerCase();
        const nameB = `${b.firstName || ""} ${b.lastName || ""}`.toLowerCase();
        return nameA.localeCompare(nameB);
      });
    } else if (filters.sortBy === "ambulanceNumber") {
      result.sort((a, b) => (a.ambulanceNumber || "").localeCompare(b.ambulanceNumber || ""));
    }

    setFilteredAmbulances(result);
  }, [filters, allAmbulance]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/api/field-executive/getAgentStatistics/${id}`);
      console.log(response.data.ambulances);
      setAllAmbulance(response.data.ambulances || []);
      setFilteredAmbulances(response.data.ambulances || []);
    } catch (error) {
      console.log(error);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const formatDriverName = (ambulance) => {
    return `${ambulance.firstName || ""} ${ambulance.lastName || ""}`.trim() || "Unknown Driver";
  };

  const getStatusBadge = (ambulance) => {
    if (ambulance.accountNonLocked) {
      return <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">Active</span>;
    } else {
      return <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">Inactive</span>;
    }
  };

  const getAvailabilityBadge = (ambulance) => {
    if (ambulance.available) {
      return <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">Available</span>;
    } else {
      return <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">Unavailable</span>;
    }
  };

  const getFuelTypeIcon = (fuelType) => {
    switch (fuelType?.toLowerCase()) {
      case 'petrol':
        return <span className="text-orange-500"><FaGasPump /></span>;
      case 'diesel':
        return <span className="text-gray-700"><FaGasPump /></span>;
      case 'cng':
        return <span className="text-green-500"><FaGasPump /></span>;
      case 'electric':
        return <span className="text-blue-500"><FaGasPump /></span>;
      default:
        return <span className="text-gray-400"><FaGasPump /></span>;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-500">Failed to load ambulance data.</p>
        <button 
          onClick={fetchData}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}    

      {/* Filters and Search */}
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <RiSearchLine className="text-gray-400 text-sm" />
            </div>
            <input
              type="search"
              placeholder="Search by driver name, ambulance number, email or phone..."
              className="w-full text-sm border border-gray-300 rounded-lg pl-9 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              name="searchTerm"
              value={filters.searchTerm}
              onChange={handleFilterChange}
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-1.5 px-3 py-2 text-sm border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              <RiFilter3Line className="text-sm" />
              Filters
            </button>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                <RiArrowUpDownLine className="text-gray-400 text-sm" />
              </div>
              <select
                className="text-sm border border-gray-300 rounded-lg pl-8 pr-8 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                name="sortBy"
                value={filters.sortBy}
                onChange={handleFilterChange}
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="name">Sort by Driver Name</option>
                <option value="ambulanceNumber">Sort by Ambulance No.</option>
              </select>
            </div>
          </div>
        </div>

        {/* Expanded Filters */}
        {showFilters && (
          <div className="mt-4 p-4 bg-white rounded-lg border border-gray-200 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Status</label>
              <select
                className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                name="statusFilter"
                value={filters.statusFilter}
                onChange={handleFilterChange}
              >
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Availability</label>
              <select
                className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                name="availabilityFilter"
                value={filters.availabilityFilter}
                onChange={handleFilterChange}
              >
                <option value="all">All</option>
                <option value="available">Available</option>
                <option value="unavailable">Unavailable</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={() => {
                  setFilters({
                    searchTerm: "",
                    statusFilter: "all",
                    availabilityFilter: "all",
                    sortBy: "newest"
                  });
                }}
                className="px-3 py-2 text-sm bg-gray-200 hover:bg-gray-300 rounded-lg text-gray-700"
              >
                Clear Filters
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Ambulance Table */}
      <div className="overflow-x-auto">
        {filteredAmbulances.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-500">No ambulances found.</p>
            {filters.searchTerm || filters.statusFilter !== "all" || filters.availabilityFilter !== "all" ? (
              <button
                onClick={() => {
                  setFilters({
                    searchTerm: "",
                    statusFilter: "all",
                    availabilityFilter: "all",
                    sortBy: "newest"
                  });
                }}
                className="mt-2 text-sm text-blue-600 hover:text-blue-800"
              >
                Clear filters to see all ambulances
              </button>
            ) : null}
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Driver & Ambulance
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ambulance Details
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Added On
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAmbulances.map((ambulance) => (
                <tr key={ambulance.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0">
                        {ambulance.profilePicture ? (
                          <img
                            src={ambulance.profilePicture}
                            alt={formatDriverName(ambulance)}
                            className="h-10 w-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">
                            <FaUser className="text-sm" />
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {formatDriverName(ambulance)}
                        </div>
                        <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                          <FaAmbulance className="text-gray-400" />
                          {ambulance.ambulanceNumber || "No number"}
                        </div>
                        <div className="text-xs text-gray-500">ID: {ambulance.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center text-sm text-gray-900">
                        <MdEmail className="mr-1.5 text-gray-400" size={14} />
                        <span className="truncate max-w-xs">{ambulance.email}</span>
                      </div>
                      <div className="flex items-center text-xs text-gray-500">
                        <MdPhone className="mr-1.5 text-gray-400" size={14} />
                        {ambulance.mobileNumber || "Not provided"}
                      </div>
                      <div className="flex items-center text-xs text-gray-500">
                        <MdPhone className="mr-1.5 text-gray-400" size={14} />
                        {ambulance.contactNumber || "No contact"}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center text-sm text-gray-900">
                        <MdDirectionsCar className="mr-1.5 text-gray-400" size={14} />
                        {ambulance.ambulanceModel || "No model"}
                      </div>
                      <div className="flex items-center text-xs text-gray-500">
                        {getFuelTypeIcon(ambulance.fuelType)}
                        <span className="ml-1.5">{ambulance.fuelType || "No fuel type"}</span>
                      </div>
                      <div className="text-xs text-gray-500">
                        Capacity: {ambulance.capacity || "N/A"}
                      </div>
                      <div className="text-xs text-gray-500">
                        Type: {ambulance.type || "N/A"}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col gap-2">
                      {getStatusBadge(ambulance)}
                      {getAvailabilityBadge(ambulance)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {ambulance.createdAt ? new Date(ambulance.createdAt).toLocaleDateString() : "N/A"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Results Count */}
      {filteredAmbulances.length > 0 && (
        <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            Showing {filteredAmbulances.length} of {allAmbulance.length} ambulances
          </p>
        </div>
      )}
    </div>
  );
}

export default Ambulance;