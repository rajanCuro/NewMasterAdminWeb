import React, { useState, useEffect } from 'react';
import AddUpdateCityOfficer from './AddUpdateCityOfficer';
import Pagination from '../Pagination';
import { RiSearchLine } from 'react-icons/ri';
import { GrFormView } from "react-icons/gr";
import CityOfficerDetail from './CityOfficerDetail';
import axiosInstance from '../../auth/axiosInstance';
import { useAuth } from '../../auth/AuthContext';

function CircleOfficerList() {
  const { stateList } = useAuth();
  const [circleOfficers, setCircleOfficers] = useState([]);
  const [filteredCircleOfficers, setFilteredCircleOfficers] = useState([]);
  const [addCircleModal, setAddCircleModal] = useState(false);
  const [editData, setEditData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    searchTerm: '',
    statusFilter: 'all',
    dateFilter: ''
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [detailModal, setDetailModal] = useState(false);
  const [viewCircleData, setViewCircleData] = useState(null);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Apply filters
  useEffect(() => {
    let result = circleOfficers;

    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      result = result.filter(item =>
        (item.firstName && item.firstName.toLowerCase().includes(term)) ||
        (item.lastName && item.lastName.toLowerCase().includes(term)) ||
        (item.email && item.email.toLowerCase().includes(term)) ||
        (item.mobileNumber && item.mobileNumber.toLowerCase().includes(term))
      );
    }

    if (filters.statusFilter !== 'all') {
      result = result.filter(item => {
        if (filters.statusFilter === 'active') {
          return item.enabled === true;
        } else if (filters.statusFilter === 'inactive') {
          return item.enabled === false;
        }
        return false;
      });
    }

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

    setFilteredCircleOfficers(result);
    setCurrentPage(1); // Reset to first page when filters change
  }, [filters, circleOfficers]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleVerify = (id) => {
    setCircleOfficers(prev => prev.map(item =>
      item.id === id ? { ...item, enabled: true } : item
    ));
  };

  const resetFilters = () => {
    setFilters({
      searchTerm: '',
      statusFilter: 'all',
      dateFilter: ''
    });
  };

  const handleAddCircle = () => {
    setEditData(null);
    setAddCircleModal(true);
  };

  const handleEditCircle = (data) => {
    setEditData(data);
    setAddCircleModal(true);
  };

  const handleAddNewOfficer = (newOfficer) => {
    setCircleOfficers(prev => [...prev, newOfficer]);
    setAddCircleModal(false);
  };

  const handleUpdateOfficer = (updatedOfficer) => {
    setCircleOfficers(prev => prev.map(item =>
      item.id === updatedOfficer.id ? updatedOfficer : item
    ));
    setAddCircleModal(false);
    setEditData(null);
  };

  const getAllCityAdmin = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get(`/division_admin/getAllCityAdmins?page=${currentPage}&pageSize=${itemsPerPage}`);
      console.log('All city admins:', response.data);
      if (response.data && response.data.dtoList) {
        setCircleOfficers(response.data.dtoList);
        setTotalItems(response.data.totalItems);
        setTotalPages(response.data.totalPages);
      } else {
        setCircleOfficers([]);
      }
    } catch (error) {
      console.log('Error fetching city admins:', error);
      setCircleOfficers([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getAllCityAdmin();
  }, [currentPage, itemsPerPage]);

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCircleOfficers = filteredCircleOfficers.slice(indexOfFirstItem, indexOfLastItem);

  const handleOpen = (data) => {
    setDetailModal(true);
    setViewCircleData(data);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusText = (enabled) => {
    return enabled ? 'Active' : 'Inactive';
  };

  return (
    <div className="min-h-screen main_bg">
      <div className="w-full mx-auto">
        {/* Header with Search */}
        <div className="sticky top-0 z-50 bg-white border-b-gray-100 px-4 py-3">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

            {/* Search */}
            <div className="relative w-full md:max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <RiSearchLine className="text-gray-400" />
              </div>
              <input
                type="search"
                placeholder="Search officers by name, email or phone..."
                className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                name="searchTerm"
                value={filters.searchTerm}
                onChange={handleFilterChange}
              />
            </div>

            {/* Status Filter */}
            <div className="w-full md:w-auto">
              <select
                name="statusFilter"
                value={filters.statusFilter}
                onChange={handleFilterChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            {/* Action */}
            <button
              onClick={handleAddCircle}
              className="submit-btn"
            >
              + Circle Officer
            </button>
          </div>
        </div>

        {/* Table Container */}
        <div className="px-6 py-4 flex flex-col" style={{ height: 'calc(107vh - 115px)' }}>
          <div className="bg-white rounded-lg shadow-xs border border-gray-200 overflow-hidden flex flex-col flex-grow">
            <div className="overflow-x-auto border border-gray-100 flex flex-col flex-grow">
              <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-gray-300 sticky top-0 z-10">
                  <tr>
                    {['Sr.No', 'City Admin', 'Phone', 'City', 'Created Date', 'Status', 'Actions'].map((header) => (
                      <th
                        key={header}
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-300 overflow-y-auto flex-grow">
                  {isLoading ? (
                    <tr>
                      <td colSpan="7" className="px-6 py-4 text-center">
                        <div className="flex justify-center items-center">
                          <svg
                            className="animate-spin h-5 w-5 mr-3 text-blue-500"
                            viewBox="0 0 24 24"
                          >
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                          </svg>
                          Loading...
                        </div>
                      </td>
                    </tr>
                  ) : currentCircleOfficers.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="px-6 py-4 text-center">
                        No data available
                      </td>
                    </tr>
                  ) : (
                    currentCircleOfficers.reverse().map((officer, index) => (
                      <tr onDoubleClick={() => handleOpen(officer)}
                        key={officer.id}
                        className="hover:bg-gray-300/50 transition-colors duration-200"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">{index + 1}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {officer.profilePicture && officer.profilePicture !== 'NA' ? (
                              <img
                                src={officer.profilePicture}
                                alt={officer.name}
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
                              <div className="text-sm font-medium text-gray-900">{officer.firstName} {officer.lastName}</div>
                              <div className="text-xs text-gray-500">{officer.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {officer.mobileNumber}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {officer.city?.cityName || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {formatDate(officer.createdAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${officer.enabled
                              ? 'bg-green-300 text-green-900'
                              : 'bg-red-900/20 text-red-900'
                              }`}
                          >
                            {getStatusText(officer.enabled)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex gap-2">
                          <button
                            onClick={() => handleOpen(officer)}
                            className="text-blue-400 hover:text-blue-300 transition-colors duration-200"
                            title="View Details"
                          >
                            <GrFormView size={28} />
                          </button>
                          <button
                            onClick={() => handleEditCircle(officer)}
                            className="cursor-pointer text-green-400 hover:text-green-300 transition-colors duration-200"
                            title="Edit"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                              />
                            </svg>
                          </button>
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
      </div>

      {/* Add/Edit Circle Modal */}
      {addCircleModal && (
        <div
          className="fixed inset-0 backdrop-brightness-50 flex items-center justify-center z-50"
          onClick={() => { setAddCircleModal(false); setEditData(null); }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="main_bg rounded-lg shadow-lg w-full max-w-2xl transform transition-all duration-300 scale-100 animate-modalFade p-4"
          >
            <div className="flex justify-between items-center border-b pb-3 mb-4">
              <h2 className="text-lg font-semibold">
                {editData ? "Update Circle Officer" : "Add New Circle Officer"}
              </h2>
              <button
                onClick={() => { setAddCircleModal(false); setEditData(null); }}
                className="text-gray-500 hover:text-red-500 text-2xl font-bold cursor-pointer"
              >
                &times;
              </button>
            </div>
            <AddUpdateCityOfficer
              Editdata={editData}
              onClose={() => { setAddCircleModal(false); setEditData(null); }}
              onAdd={handleAddNewOfficer}
              onUpdate={handleUpdateOfficer}
              refresh={getAllCityAdmin}
            />
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {
        detailModal && (
          <div
            className="fixed inset-0 backdrop-brightness-50 flex items-center justify-center z-70"
            onClick={() => setDetailModal(false)}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[95vh] overflow-y-auto hide-scrollbar transform transition-all duration-300 scale-100"
            >
              <div className="flex justify-between items-center border-b border-gray-200 p-6 sticky top-0 bg-blue-700 text-white z-10">
                <h2 className="text-xl font-semibold">Circle Officer Details</h2>
                <button
                  onClick={() => setDetailModal(false)}
                  className="text-white hover:text-red-300 text-2xl font-bold cursor-pointer transition-colors"
                >
                  &times;
                </button>
              </div>
              <div className="p-6">
                <CityOfficerDetail ViewData={viewCircleData} onClose={() => setDetailModal(false)} />
              </div>
            </div>
          </div>
        )
      }
    </div>
  );
}

export default CircleOfficerList;