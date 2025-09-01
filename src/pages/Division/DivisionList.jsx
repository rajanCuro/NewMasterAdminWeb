// ZonalHeadList.js
import React, { useState, useEffect } from 'react';
import { RiSearchLine } from 'react-icons/ri';
import Pagination from '../Pagination';
import ViewDivisionDetails from './ViewDivisionDetails';
import AddUpdateDivision from './AddUpdateDivision';
import axiosInstance from '../../auth/axiosInstance';
import { useAuth } from '../../auth/AuthContext';
import Swal from 'sweetalert2';

function DivisionList() {
  const { getALLState } = useAuth();
  const [zonalHeads, setZonalHeads] = useState([]);
  const [filteredZonalHeads, setFilteredZonalHeads] = useState([]);
  const [addZonalModal, setAddZonalModal] = useState(false);
  const [viewZonalModal, setViewZonalModal] = useState(false);
  const [viewZonalData, setViewZonalModalData] = useState(null);
  const [editData, setEditData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    searchTerm: '',
    statusFilter: 'all',
    dateFilter: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedZonal, setSelectedZonal] = useState(null);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Fetch data from API
  useEffect(() => {
    getAllDivisions();
    getALLState();
  }, [currentPage, itemsPerPage]);

  const getAllDivisions = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get(`/head_admin/getAllDivisionAdmins?page=${currentPage}&pageSize=${itemsPerPage}`
      );

      console.log("All divisions:", response.data);

      if (response.data && response.data.code === "200") {
        setTotalItems(response.data.totalItems);
        setTotalPages(response.data.totalPages);

        // Use the data directly without reversing to maintain proper pagination order
        setZonalHeads(response.data.dtoList || []);
        setFilteredZonalHeads(response.data.dtoList || []);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      console.log("Error getting all divisions:", error);
      Swal.fire("Error", "Failed to load division admins", "error");
    } finally {
      setIsLoading(false);
    }
  };

  // Apply filters
  useEffect(() => {
    let result = zonalHeads;

    // Search by name, ID, email or division name
    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      result = result.filter(item => {
        // Check if the item has division data and search in division name
        const divisionName = item.division?.zoneName?.toLowerCase() || "";
        const firstName = item.firstName?.toLowerCase() || "";
        const lastName = item.lastName?.toLowerCase() || "";
        const fullName = `${firstName} ${lastName}`;
        const email = item.email?.toLowerCase() || "";
        const id = item.id?.toString().toLowerCase() || "";

        return (
          divisionName.includes(term) ||
          id.includes(term) ||
          fullName.includes(term) ||
          firstName.includes(term) ||
          lastName.includes(term) ||
          email.includes(term)
        );
      });
    }

    // Filter by status
    if (filters.statusFilter !== 'all') {
      result = result.filter(item => item.status === filters.statusFilter);
    }

    // Filter by date
    if (filters.dateFilter) {
      const filterDate = new Date(filters.dateFilter);
      result = result.filter(item => {
        const itemDate = new Date(item.createdAt);
        return (
          itemDate.getFullYear() === filterDate.getFullYear() &&
          itemDate.getMonth() === filterDate.getMonth() &&
          itemDate.getDate() === filterDate.getDate()
        );
      });
    }

    setFilteredZonalHeads(result);
  }, [filters, zonalHeads]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      // Update status via API
      const enabled = newStatus === 'Verified';
      await axiosInstance.put(`/head_admin/updateDivisionAdminStatus/${id}`, { enabled });

      // Update local state
      setZonalHeads(prev =>
        prev.map(item =>
          item.id === id ? {
            ...item,
            status: newStatus,
            enabled: enabled,
            lastUpdated: new Date().toLocaleDateString()
          } : item
        )
      );

      setSelectedZonal(null);
      Swal.fire("Success", "Status updated successfully", "success");
    } catch (error) {
      console.error("Error updating status:", error);
      Swal.fire("Error", "Failed to update status", "error");
    }
  };

  const resetFilters = () => {
    setFilters({
      searchTerm: '',
      statusFilter: 'all',
      dateFilter: ''
    });
  };

  const handleAddZonal = () => {
    setEditData(null);
    setAddZonalModal(true);
  };

  const handleEditZonal = (data) => {
    setEditData(data);
    setAddZonalModal(true);
  };

  const handleViewZonal = (data) => {
    setViewZonalModal(true);
    setViewZonalModalData(data);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setSelectedZonal(null);
    };
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white px-6 py-4 sticky top-0 z-30">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="relative w-full md:max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <RiSearchLine className="text-gray-400" />
            </div>
            <input
              type="search"
              placeholder="Search division admins by name, email or division"
              className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              name="searchTerm"
              value={filters.searchTerm}
              onChange={handleFilterChange}
            />
          </div>

          <div className="mt-4 md:mt-0">
            <button
              onClick={handleAddZonal}
              className="submit-btn flex justify-center items-center"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
              Division
            </button>
          </div>
        </div>
      </div>

      {/* Zonal Heads Table Container */}
      <div className="px-6 py-4 flex flex-col" style={{ height: 'calc(106vh - 110px)' }}>
        <div className="bg-white rounded-lg shadow-xs border border-gray-200 overflow-hidden flex flex-col flex-grow">
          <div className="overflow-x-auto border border-gray-100 flex flex-col flex-grow">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-50 sticky top-0 z-10">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sr.No</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Division Admin</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Division</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200 overflow-y-auto">
                {isLoading ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-8 text-center">
                      <div className="flex justify-center items-center">
                        <svg
                          className="animate-spin h-5 w-5 mr-3 text-blue-500"
                          viewBox="0 0 24 24"
                        >
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                        </svg>
                        Loading division admins...
                      </div>
                    </td>
                  </tr>
                ) : filteredZonalHeads.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-8 text-center">
                      <div className="flex flex-col items-center justify-center text-gray-500">
                        <svg className="w-16 h-16 mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        <p className="text-lg font-medium">No division admins found</p>
                        <p className="text-sm mt-1">Try adjusting your search or filter criteria</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  [...filteredZonalHeads].map((zonal, index) => (

                    <tr onDoubleClick={() => handleViewZonal(zonal)} key={zonal.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{index+1}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {zonal.profilePicture && zonal.profilePicture !== 'NA' ? (
                            <img
                              src={zonal.profilePicture}
                              alt={zonal.name}
                              className="h-10 w-10 rounded-full object-cover mr-3"
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                              <span className="text-blue-600 font-medium">
                                {zonal.firstName?.charAt(0)}{zonal.lastName?.charAt(0)}
                              </span>
                            </div>
                          )}
                          <div>
                            <div className="text-sm font-medium text-gray-900">{zonal.firstName} {zonal.lastName}</div>
                            <div className="text-xs text-gray-500">{zonal.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{zonal.division?.zoneName || "N/A"}</div>
                        <div className="text-xs text-gray-500">ID: {zonal.division?.id || "N/A"}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 rounded-full  text-sm ${zonal.accountNonExpired ? "bg-green-200 text-green-600" : "bg-red-500"
                            }`}
                        >
                          {zonal.accountNonExpired ? "Active" : "Inactive"}
                        </span>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {zonal.mobileNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {new Date(zonal.createdAt).toLocaleString()}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleViewZonal(zonal)}
                            className="text-blue-600 cursor-pointer hover:text-blue-800 p-1.5 rounded-md hover:bg-blue-100 transition-colors"
                            title="View details"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleEditZonal(zonal)}
                            className="text-green-600 cursor-pointer hover:text-green-800 p-1.5 rounded-md hover:bg-green-100 transition-colors"
                            title="Edit division admin"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Fixed Pagination at Bottom */}
          <div className="sticky bottom-0 bg-white border-t border-gray-200 px-4 py-3">
            <Pagination
              currentPage={currentPage}
              totalItems={totalItems}
              totalPages={totalPages}
              itemsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
              onItemsPerPageChange={setItemsPerPage}
            />
          </div>
        </div>
      </div>

      {/* Add/Edit Division Admin Modal */}
      {addZonalModal && (
        <div
          className="fixed inset-0 backdrop-brightness-50 flex items-center justify-center z-50 p-4"
          onClick={() => { setAddZonalModal(false); setEditData(null); }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-xl shadow-2xl w-full max-w-4xl transform transition-all duration-300 scale-100 max-h-[95vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center border-b border-gray-200 p-6 sticky top-0 bg-white">
              <h2 className="text-xl font-semibold text-gray-800">
                {editData ? "Edit Division Admin" : "Add New Division Admin"}
              </h2>
              <button
                onClick={() => { setAddZonalModal(false); setEditData(null); }}
                className="text-gray-400 hover:text-gray-500 text-2xl font-bold cursor-pointer"
              >
                &times;
              </button>
            </div>
            <div className="p-6">
              <AddUpdateDivision
                EditData={editData}
                onClose={() => {
                  setAddZonalModal(false);
                  setEditData(null);
                  getAllDivisions(); // Refresh data after adding/editing
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* View Division Modal */}
      {viewZonalModal && (
        <div
          className="fixed inset-0 backdrop-brightness-50 flex items-center justify-center z-70"
          onClick={() => { setViewZonalModal(false); setViewZonalModalData(null); }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[95vh] overflow-y-auto hide-scrollbar transform transition-all duration-300 scale-100"
          >
            <div className="flex justify-between items-center border-b border-gray-200 p-6 sticky top-0 bg-blue-700 text-white z-10">
              <h2 className="text-xl font-semibold">Division Admin Details</h2>
              <button
                onClick={() => { setViewZonalModal(false); setViewZonalModalData(null); }}
                className="text-white hover:text-red-300 text-2xl font-bold cursor-pointer transition-colors"
              >
                &times;
              </button>
            </div>
            <div className="p-6">
              <ViewDivisionDetails ViewData={viewZonalData} onClose={() => setViewZonalModal(false)} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DivisionList;