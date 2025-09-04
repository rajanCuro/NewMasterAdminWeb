import React, { useState, useMemo, useCallback } from "react";
import { FaSearch, FaStar, FaMapMarkerAlt, FaPhone, FaSort, FaPlus, FaEdit, FaTrash, FaBed } from "react-icons/fa";
import debounce from "lodash.debounce";
import { hospitals as initialHospitals } from "./data.hospital";
import AddHospital from "./AddHospital";
import Pagination from "../Pagination";

export default function HospitalTable() {
  const [hospitals, setHospitals] = useState(initialHospitals);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "ascending" });
  const [locationFilter, setLocationFilter] = useState("All");
  const [specialtyFilter, setSpecialtyFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [hospitalToEdit, setHospitalToEdit] = useState(null);
  const [hospitalToDelete, setHospitalToDelete] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const locations = ["All", ...new Set(hospitals.map((hospital) => hospital.location))];

  // Calculate hospital statistics
  const hospitalStats = useMemo(() => {
    const total = hospitals.length;
    const active = hospitals.filter(hospital => hospital.status === "active").length;
    const inactive = total - active;
    
    // Calculate bed statistics
    let occupiedBeds = 0;
    let totalBeds = 0;
    
    hospitals.forEach(hospital => {
      if (hospital.beds) {
        occupiedBeds += hospital.beds.occupied || 0;
        totalBeds += hospital.beds.total || 0;
      }
    });
    
    const availableBeds = totalBeds - occupiedBeds;
    
    return { total, active, inactive, occupiedBeds, availableBeds, totalBeds };
  }, [hospitals]);

  // Extract all unique specialties from all hospitals
  const allSpecialties = useMemo(() => {
    const specialtiesSet = new Set();
    hospitals.forEach(hospital => {
      hospital.specialties.split(',').forEach(spec => {
        specialtiesSet.add(spec.trim());
      });
    });
    return ["All", ...Array.from(specialtiesSet).sort()];
  }, [hospitals]);

  const debouncedSetSearchTerm = useCallback(debounce((value) => setSearchTerm(value), 300), []);

  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const filteredHospitals = useMemo(() => {
    return hospitals
      .filter((hospital) => {
        const matchesSearch =
          hospital.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          hospital.specialties.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesLocation = locationFilter === "All" || hospital.location === locationFilter;

        // Check if hospital has the selected specialty
        const matchesSpecialty = specialtyFilter === "All" ||
          hospital.specialties.split(',').some(spec =>
            spec.trim().toLowerCase() === specialtyFilter.toLowerCase()
          );

        return matchesSearch && matchesLocation && matchesSpecialty;
      })
      .sort((a, b) => {
        if (sortConfig.key) {
          if (a[sortConfig.key] < b[sortConfig.key]) {
            return sortConfig.direction === "ascending" ? -1 : 1;
          }
          if (a[sortConfig.key] > b[sortConfig.key]) {
            return sortConfig.direction === "ascending" ? 1 : -1;
          }
        }
        return 0;
      });
  }, [searchTerm, locationFilter, specialtyFilter, sortConfig, hospitals]);

  const paginatedHospitals = filteredHospitals.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getSortIcon = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === "ascending" ? "↑" : "↓";
    }
    return <FaSort className="ml-1" />;
  };

  const handleAddHospital = (newHospital) => {
    const hospitalWithId = {
      id: hospitals.length > 0 ? Math.max(...hospitals.map(h => h.id)) + 1 : 1,
      ...newHospital
    };
    setHospitals([...hospitals, hospitalWithId]);
    setShowAddModal(false);
  };

  const handleEditHospital = (updatedHospital) => {
    setHospitals(hospitals.map(hospital =>
      hospital.id === updatedHospital.id ? updatedHospital : hospital
    ));
    setShowEditModal(false);
    setHospitalToEdit(null);
  };

  const handleDeleteHospital = () => {
    if (hospitalToDelete) {
      setHospitals(hospitals.filter(hospital => hospital.id !== hospitalToDelete.id));
      setShowDeleteConfirm(false);
      setHospitalToDelete(null);
    }
  };

  const openEditModal = (hospital) => {
    setHospitalToEdit(hospital);
    setShowEditModal(true);
  };

  const openDeleteConfirm = (hospital) => {
    setHospitalToDelete(hospital);
    setShowDeleteConfirm(true);
  };

  return (
    <>
      <div className="bg-gray-50 h-screen overflow-y-auto w-full p-4">
        <div className="bg-white rounded-xl p-6 mb-6 shadow-sm">
          {/* Stats Cards Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
            {/* Total Hospitals Card */}
            <div className="bg-white rounded-lg shadow p-4 border-l-4 border-blue-500">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-gray-500">Total Hospitals</h3>
                  <p className="text-xl font-semibold text-gray-900">{hospitalStats.total}</p>
                </div>
              </div>
            </div>

            {/* Active Hospitals Card */}
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
                  <h3 className="text-sm font-medium text-gray-500">Active Hospitals</h3>
                  <p className="text-xl font-semibold text-gray-900">{hospitalStats.active}</p>
                </div>
              </div>
            </div>

            {/* Inactive Hospitals Card */}
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
                  <h3 className="text-sm font-medium text-gray-500">Inactive Hospitals</h3>
                  <p className="text-xl font-semibold text-gray-900">{hospitalStats.inactive}</p>
                </div>
              </div>
            </div>

            {/* Occupied Beds Card */}
            <div className="bg-white rounded-lg shadow p-4 border-l-4 border-orange-500">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                    <FaBed className="w-5 h-5 text-orange-500" />
                  </div>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-gray-500">Occupied Beds</h3>
                  <p className="text-xl font-semibold text-gray-900">{hospitalStats.occupiedBeds}</p>
                </div>
              </div>
            </div>

            {/* Available Beds Card */}
            <div className="bg-white rounded-lg shadow p-4 border-l-4 border-purple-500">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                    <FaBed className="w-5 h-5 text-purple-500" />
                  </div>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-gray-500">Available Beds</h3>
                  <p className="text-xl font-semibold text-gray-900">{hospitalStats.availableBeds}</p>
                  <p className="text-xs text-gray-500">Total: {hospitalStats.totalBeds}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Hospital Directory</h2>
              <p className="text-gray-600 mt-1">Manage and search healthcare facilities</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 mt-4 md:mt-0">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search hospitals or specialties..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full md:w-64"
                  onChange={(e) => debouncedSetSearchTerm(e.target.value)}
                  aria-label="Search hospitals by name or specialties"
                />
              </div>
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
              >
                <FaPlus className="mr-2" />
                Add Hospital
              </button>
            </div>
          </div>

          <div className="mb-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="w-full md:w-1/2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Location</label>
                <select
                  className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={locationFilter}
                  onChange={(e) => {
                    setLocationFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  aria-label="Filter hospitals by location"
                >
                  {locations.map((location) => (
                    <option key={location} value={location}>
                      {location}
                    </option>
                  ))}
                </select>
              </div>
              <div className="w-full md:w-1/2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Specialty</label>
                <select
                  className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={specialtyFilter}
                  onChange={(e) => {
                    setSpecialtyFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  aria-label="Filter hospitals by specialty"
                >
                  {allSpecialties.map((specialty) => (
                    <option key={specialty} value={specialty}>
                      {specialty}
                    </option>
                  ))}
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
                      onClick={() => handleSort("name")}
                      aria-sort={sortConfig.key === "name" ? sortConfig.direction : "none"}
                    >
                      <div className="flex items-center">
                        Hospital Name {getSortIcon("name")}
                      </div>
                    </th>
                    <th
                      className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort("location")}
                      aria-sort={sortConfig.key === "location" ? sortConfig.direction : "none"}
                    >
                      <div className="flex items-center">
                        <FaMapMarkerAlt className="mr-1" /> Location {getSortIcon("location")}
                      </div>
                    </th>
                    <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Specialties
                    </th>
                    <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <FaPhone className="inline mr-1" /> Contact
                    </th>
                    <th
                      className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort("rating")}
                      aria-sort={sortConfig.key === "rating" ? sortConfig.direction : "none"}
                    >
                      <div className="flex items-center">
                        Rating {getSortIcon("rating")}
                      </div>
                    </th>
                    <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedHospitals.map((hospital) => (
                    <tr key={hospital.id} className="hover:bg-blue-50 transition-colors duration-150">
                      <td className="p-4 font-medium text-gray-900">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                            <span className="text-blue-600 font-bold">{hospital.name.charAt(0)}</span>
                          </div>
                          {hospital.name}
                        </div>
                      </td>
                      <td className="p-4 text-gray-600">
                        <div className="flex items-center">
                          <FaMapMarkerAlt className="text-gray-400 mr-1" />
                          {hospital.location}
                        </div>
                      </td>
                      <td className="p-4 text-gray-600 text-sm">
                        <div className="flex flex-wrap gap-1">
                          {hospital.specialties.split(",").map((spec, index) => (
                            <span key={index} className="bg-gray-100 px-2 py-1 rounded-md text-xs">
                              {spec.trim()}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="p-4 text-blue-600 font-medium">
                        {hospital.contact}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center">
                          <div className="flex text-yellow-400">
                            {[...Array(5)].map((_, i) => (
                              <FaStar
                                key={i}
                                className={i < Math.floor(hospital.rating || 0) ? "fill-current" : "text-gray-300"}
                                aria-hidden="true"
                              />
                            ))}
                          </div>
                          <span className="ml-2 text-gray-600 font-medium">
                            {(hospital.rating || 0).toFixed(1)}
                          </span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex space-x-2">
                          <button
                            className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors duration-150"
                            onClick={() => openEditModal(hospital)}
                            aria-label={`Edit ${hospital.name}`}
                          >
                            <FaEdit />
                          </button>
                          <button
                            className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors duration-150"
                            onClick={() => openDeleteConfirm(hospital)}
                            aria-label={`Delete ${hospital.name}`}
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

          {filteredHospitals.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <div className="mb-4">
                <svg className="inline-block h-16 w-16 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-700 mb-1">No hospitals found</h3>
              <p className="text-gray-500">Try adjusting your search or filter criteria</p>
            </div>
          )}

          {filteredHospitals.length > 0 && (
            <div className="px-6 py-4 bg-white border-t border-gray-200">
              <Pagination
                currentPage={currentPage}
                totalItems={filteredHospitals.length}
                itemsPerPage={itemsPerPage}
                onPageChange={setCurrentPage}
                onItemsPerPageChange={setItemsPerPage}
              />
            </div>
          )}
        </div>

        {/* Add Hospital Modal */}
        {showAddModal && (
          <div className="fixed inset-0 backdrop-brightness-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-5xl relative flex flex-col max-h-[90vh]">

              {/* Fixed Header */}
              <div className="p-4 border-b rounded-t-2xl border-gray-200 flex justify-between items-center sticky top-0 bg-white z-10">
                <h3 className="text-xl font-semibold text-gray-800">Add New Hospital</h3>
                <button
                  onClick={() => setShowAddModal(false)}
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
                <AddHospital
                  onSave={handleAddHospital}
                  onCancel={() => setShowAddModal(false)}
                />
              </div>
            </div>
          </div>
        )}


        {/* Edit Hospital Modal - You'll need to implement this similar to AddHospital */}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && hospitalToDelete && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-xl font-semibold text-gray-800">Confirm Deletion</h3>
              </div>
              <div className="p-6">
                <p className="text-gray-700 mb-4">
                  Are you sure you want to delete <span className="font-semibold">{hospitalToDelete.name}</span>? This action cannot be undone.
                </p>
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteHospital}
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