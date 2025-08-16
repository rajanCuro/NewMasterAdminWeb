import React, { useState, useEffect } from 'react';
import AddUpdate_CircleOfficer from './Add_Update_CircleOfficer';
import Pagination from '../Pagination';

function CircleOfficerList() {
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

  // Generate mock data
  useEffect(() => {
    setIsLoading(true);
    const mockData = Array.from({ length: 50 }, (_, i) => ({
      id: `CO-${1000 + i}`,
      circleName: `Circle ${i + 1}`,
      circleId: `CID-${2000 + i}`,
      created: new Date(Date.now() - Math.floor(Math.random() * 1000 * 60 * 60 * 24 * 30)).toLocaleDateString(),
      createdDate: new Date(Date.now() - Math.floor(Math.random() * 1000 * 60 * 60 * 24 * 30)),
      lastUpdated: new Date(Date.now() - Math.floor(Math.random() * 1000 * 60 * 60 * 24 * 7)).toLocaleDateString(),
      status: ['Pending', 'Verified', 'Rejected'][Math.floor(Math.random() * 3)],
      email: `officer${i + 1}@example.com`,
      phone: `+1${Math.floor(1000000000 + Math.random() * 9000000000)}`,
      role: ['admin', 'officer', 'manager'][Math.floor(Math.random() * 3)]
    }));
    
    setTimeout(() => {
      setCircleOfficers(mockData);
      setFilteredCircleOfficers(mockData);
      setIsLoading(false);
    }, 1000);
  }, []);

  // Apply filters
  useEffect(() => {
    let result = circleOfficers;

    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      result = result.filter(item =>
        item.circleName.toLowerCase().includes(term) ||
        item.circleId.toLowerCase().includes(term) ||
        item.email.toLowerCase().includes(term)
      );
    }

    if (filters.statusFilter !== 'all') {
      result = result.filter(item => item.status === filters.statusFilter);
    }

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

    setFilteredCircleOfficers(result);
    setCurrentPage(1); // Reset to first page when filters change
  }, [filters, circleOfficers]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleVerify = (id) => {
    setCircleOfficers(prev => prev.map(item => 
      item.id === id ? { ...item, status: 'Verified' } : item
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

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCircleOfficers = filteredCircleOfficers.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="min-h-screen main_bg">
      <div className="mw-full mx-auto px-4">
        {/* Header with Search */}
        <div className='flex flex-col px-2 md:flex-row justify-between items-center py-4 gap-4 sticky top-0 z-50 main_bg'>
          <h1 className="text-sm md:text-xl font-bold">Circle Officers Dashboard</h1>

          <div className="flex flex-col md:flex-row w-full md:w-auto gap-4">
            <div className="relative flex-grow max-w-md">
              <input
                type="search"
                placeholder="Search by name, ID or email..."
                className="w-full border border-gray-300 rounded-lg px-4 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                name="searchTerm"
                value={filters.searchTerm}
                onChange={handleFilterChange}
              />
              <button type="submit" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                  <path d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 0 0 1.48-5.34c-.47-2.78-2.79-5-5.59-5.34a6.505 6.505 0 0 0-7.27 7.27c.34 2.8 2.56 5.12 5.34 5.59a6.5 6.5 0 0 0 5.34-1.48l.27.28v.79l4.25 4.25c.41.41 1.08.41 1.49 0 .41-.41.41-1.08 0-1.49L15.5 14zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
            <button 
              onClick={handleAddCircle} 
              className='cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg whitespace-nowrap transition-colors'
            >
              Add Circle Officer
            </button>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-4 my-4 p-4 bg-gray-300 rounded-lg">
          <div className="flex items-center gap-2">
            <label htmlFor="statusFilter" className="text-sm">Status:</label>
            <select
              id="statusFilter"
              name="statusFilter"
              value={filters.statusFilter}
              onChange={handleFilterChange}
              className="bg-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Verified">Verified</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label htmlFor="dateFilter" className="text-sm">Created Date:</label>
            <input
              type="date"
              id="dateFilter"
              name="dateFilter"
              value={filters.dateFilter}
              onChange={handleFilterChange}
              className="bg-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            onClick={resetFilters}
            className="text-sm bg-red-300 hover:bg-red-500 cursor-pointer text-white px-3 py-1 rounded transition-colors"
          >
            Reset Filters
          </button>
        </div>

        {/* Table Container */}
        <div className="relative rounded-xl shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-300">
                <tr>
                  {['Circle Name', 'Circle ID', 'Created Date', 'Last Updated', 'Status', 'Actions'].map((header) => (
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
              <tbody className="divide-y divide-gray-300">
                {isLoading ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-4 text-center">
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
                    <td colSpan="6" className="px-6 py-4 text-center">
                      No data available
                    </td>
                  </tr>
                ) : (
                  currentCircleOfficers.map((circle) => (
                    <tr
                      key={circle.id}
                      className="hover:bg-gray-300/50 transition-colors duration-200"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {circle.circleName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {circle.circleId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {circle.created}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {circle.lastUpdated}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            circle.status === 'Verified'
                              ? 'bg-green-900/20 text-green-900'
                              : circle.status === 'Rejected'
                                ? 'bg-red-900/20 text-red-900'
                                : 'bg-yellow-900/20 text-yellow-900'
                          }`}
                        >
                          {circle.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex gap-2">
                        <button
                          onClick={() => handleVerify(circle.id)}
                          className="text-blue-400 hover:text-blue-300 transition-colors duration-200"
                          title="Verify"
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
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleEditCircle(circle)}
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
        </div>
        
        <Pagination
          currentPage={currentPage}
          totalItems={filteredCircleOfficers.length}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={setItemsPerPage}
        />
      </div>

      {/* Add/Edit Circle Modal */}
      {addCircleModal && (
        <div
          className="fixed inset-0 backdrop-brightness-50 flex items-center justify-center z-50"
          onClick={() => { setAddCircleModal(false); setEditData(null); }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="main_bg rounded-lg shadow-lg w-full max-w-md transform transition-all duration-300 scale-100 animate-modalFade p-6"
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
            <AddUpdate_CircleOfficer 
              Editdata={editData} 
              onClose={() => { setAddCircleModal(false); setEditData(null); }}
              onAdd={handleAddNewOfficer}
              onUpdate={handleUpdateOfficer}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default CircleOfficerList;