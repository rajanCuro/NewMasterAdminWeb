import React, { useState, useEffect } from 'react';
import { RiSearchLine, RiFilterLine, RiCloseLine } from 'react-icons/ri';
import Add_Update_ZonalHead from './AddUpdateZonalHead';
import Pagination from '../Pagination';
import VIewZonal from './VIewZonal';

function ZonalHeadList() {
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
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedZonal, setSelectedZonal] = useState(null);

  // Generate mock data
  useEffect(() => {
    setIsLoading(true);
    const mockData = Array.from({ length: 50 }, (_, i) => ({
      id: `ZH-${1000 + i}`,
      name: `Zonal Head ${i + 1}`,
      email: `zonalhead${i + 1}@example.com`,
      phone: `+1 ${Math.floor(Math.random() * 900 + 100)}-${Math.floor(Math.random() * 900 + 100)}-${Math.floor(Math.random() * 9000 + 1000)}`,
      zoneName: `Zone ${['North', 'South', 'East', 'West', 'Central'][i % 5]}`,
      zoneId: `ZID-${2000 + i}`,
      created: new Date(Date.now() - Math.floor(Math.random() * 1000 * 60 * 60 * 24 * 30)).toLocaleDateString(),
      createdDate: new Date(Date.now() - Math.floor(Math.random() * 1000 * 60 * 60 * 24 * 30)),
      lastUpdated: new Date(Date.now() - Math.floor(Math.random() * 1000 * 60 * 60 * 24 * 7)).toLocaleDateString(),
      status: ['Pending', 'Verified', 'Rejected'][Math.floor(Math.random() * 3)],
      performance: ['Excellent', 'Good', 'Average', 'Needs Improvement'][Math.floor(Math.random() * 4)],
      agentsCount: Math.floor(Math.random() * 20) + 5
    }));
    setTimeout(() => {
      setZonalHeads(mockData);
      setFilteredZonalHeads(mockData);
      setIsLoading(false);
    }, 1000);
  }, []);

  // Apply filters
  useEffect(() => {
    let result = zonalHeads;

    // Search by name, ID, email or zone
    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      result = result.filter(item =>
        item.zoneName.toLowerCase().includes(term) ||
        item.zoneId.toLowerCase().includes(term) ||
        item.name.toLowerCase().includes(term) ||
        item.email.toLowerCase().includes(term)
      );
    }

    // Filter by status
    if (filters.statusFilter !== 'all') {
      result = result.filter(item => item.status === filters.statusFilter);
    }

    // Filter by date
    if (filters.dateFilter) {
      const filterDate = new Date(filters.dateFilter);
      result = result.filter(item => {
        const itemDate = new Date(item.createdDate);
        return (
          itemDate.getFullYear() === filterDate.getFullYear() &&
          itemDate.getMonth() === filterDate.getMonth() &&
          itemDate.getDate() === filterDate.getDate()
        );
      });
    }

    setFilteredZonalHeads(result);
    setCurrentPage(1);
  }, [filters, zonalHeads]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleStatusChange = (id, newStatus) => {
    setZonalHeads(prev =>
      prev.map(item =>
        item.id === id ? { ...item, status: newStatus, lastUpdated: new Date().toLocaleDateString() } : item
      )
    );
    setSelectedZonal(null);
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

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentZonalHead = filteredZonalHeads.slice(indexOfFirstItem, indexOfLastItem);
  const totalItems = filteredZonalHeads.length;

  // Status badge color
  const getStatusColor = (status) => {
    switch (status) {
      case "Verified":
        return "bg-green-100 text-green-800 border-green-200";
      case "Pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Rejected":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  // Performance indicator
  const getPerformanceColor = (performance) => {
    switch (performance) {
      case "Excellent":
        return "text-green-600 bg-green-50 border-green-200";
      case "Good":
        return "text-blue-600 bg-blue-50 border-blue-200";
      case "Average":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "Needs Improvement":
        return "text-red-600 bg-red-50 border-red-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white  px-6 py-4  sticky top-0 z-50">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="relative w-full md:max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <RiSearchLine className="text-gray-400" />
            </div>
            <input
              type="search"
              placeholder="Search zonal heads by name, ID, email or zone..."
              className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              name="searchTerm"
              value={filters.searchTerm}
              onChange={handleFilterChange}
            />
          </div>
          
          <div className="mt-4 md:mt-0">
            <button
              onClick={handleAddZonal}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg flex items-center gap-2 transition-colors shadow-sm"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
              Zonal Head
            </button>
          </div>
        </div>
      </div>
      {/* Zonal Heads Table */}
      <div className="px-6 py-4">
        <div className="bg-white rounded-lg shadow-xs border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Zonal Head</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Zone</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Agents</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Performance</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {isLoading ? (
                  <tr>
                    <td colSpan="8" className="px-6 py-8 text-center">
                      <div className="flex justify-center items-center">
                        <svg
                          className="animate-spin h-5 w-5 mr-3 text-blue-500"
                          viewBox="0 0 24 24"
                        >
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                        </svg>
                        Loading zonal heads...
                      </div>
                    </td>
                  </tr>
                ) : currentZonalHead.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="px-6 py-8 text-center">
                      <div className="flex flex-col items-center justify-center text-gray-500">
                        <svg className="w-16 h-16 mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        <p className="text-lg font-medium">No zonal heads found</p>
                        <p className="text-sm mt-1">Try adjusting your search or filter criteria</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  currentZonalHead.map((zonal, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{zonal.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{zonal.name}</div>
                        <div className="text-xs text-gray-500">{zonal.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{zonal.zoneName}</div>
                        <div className="text-xs text-gray-500">{zonal.zoneId}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {zonal.agentsCount} agents
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="relative inline-block">
                          <span
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedZonal(zonal.id === selectedZonal ? null : zonal.id);
                            }}
                            className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border cursor-pointer ${getStatusColor(zonal.status)}`}
                          >
                            {zonal.status}
                          </span>

                          {selectedZonal === zonal.id && (
                            <div className="absolute z-10 mt-1 w-32 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                              <div className="py-1">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleStatusChange(zonal.id, 'Verified');
                                  }}
                                  className={`block px-4 py-2 text-sm w-full text-left ${zonal.status === 'Verified'
                                    ? 'bg-green-100 text-green-900'
                                    : 'text-gray-700 hover:bg-gray-100'
                                    }`}
                                >
                                  Verified
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleStatusChange(zonal.id, 'Rejected');
                                  }}
                                  className={`block px-4 py-2 text-sm w-full text-left ${zonal.status === 'Rejected'
                                    ? 'bg-red-100 text-red-900'
                                    : 'text-gray-700 hover:bg-gray-100'
                                    }`}
                                >
                                  Rejected
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleStatusChange(zonal.id, 'Pending');
                                  }}
                                  className={`block px-4 py-2 text-sm w-full text-left ${zonal.status === 'Pending'
                                    ? 'bg-yellow-100 text-yellow-900'
                                    : 'text-gray-700 hover:bg-gray-100'
                                    }`}
                                >
                                  Pending
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2.5 py-1 text-xs font-medium rounded-full border ${getPerformanceColor(zonal.performance)}`}>
                          {zonal.performance}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{zonal.created}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleViewZonal(zonal)}
                            className="text-blue-600 hover:text-blue-800 p-1.5 rounded-md hover:bg-blue-100 transition-colors"
                            title="View details"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleEditZonal(zonal)}
                            className="text-green-600 hover:text-green-800 p-1.5 rounded-md hover:bg-green-100 transition-colors"
                            title="Edit zonal head"
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
        </div>
      </div>

      {/* Pagination */}
      <div className="px-6 py-4 bg-white border-t border-gray-200">
        <Pagination
          currentPage={currentPage}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={setItemsPerPage}
        />
      </div>

      {/* Add/Edit Zonal Head Modal */}
      {addZonalModal && (
        <div
          className="fixed inset-0 backdrop-brightness-50 flex items-center justify-center z-50 p-4"
          onClick={() => { setAddZonalModal(false); setEditData(null); }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-xl shadow-2xl w-full max-w-2xl transform transition-all duration-300 scale-100 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center border-b border-gray-200 p-6 sticky top-0 bg-white">
              <h2 className="text-xl font-semibold text-gray-800">
                {editData ? "Edit Zonal Head" : "Add New Zonal Head"}
              </h2>
              <button
                onClick={() => { setAddZonalModal(false); setEditData(null); }}
                className="text-gray-400 hover:text-gray-500 text-2xl font-bold cursor-pointer"
              >
                &times;
              </button>
            </div>
            <div className="p-6">
              <Add_Update_ZonalHead EditData={editData} onClose={() => setAddZonalModal(false)} />
            </div>
          </div>
        </div>
      )}

      {/* View Zonal Head Modal */}
      {viewZonalModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => { setViewZonalModal(false); setViewZonalModalData(null); }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-xl shadow-2xl w-full max-w-2xl transform transition-all duration-300 scale-100 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center border-b border-gray-200 p-6 sticky top-0 bg-white">
              <h2 className="text-xl font-semibold text-gray-800">Zonal Head Details</h2>
              <button
                onClick={() => { setViewZonalModal(false); setViewZonalModalData(null); }}
                className="text-gray-400 hover:text-gray-500 text-2xl font-bold cursor-pointer"
              >
                &times;
              </button>
            </div>
            <div className="p-6">
              <VIewZonal ViewData={viewZonalData} onClose={() => setViewZonalModal(false)} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ZonalHeadList;