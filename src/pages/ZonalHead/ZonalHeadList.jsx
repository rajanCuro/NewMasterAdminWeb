import React, { useState, useEffect } from 'react';
import AddZonalHead from './AddZonalHead';
import EditZonal from './EditZonal';

function ZonalHeadList() {
  const [zonalHeads, setZonalHeads] = useState([]);
  const [filteredZonalHeads, setFilteredZonalHeads] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [addZonalModal, setAddZonalModal] = useState(false);
  const [editData, setEditData] = useState(null);
  const [EditZonalModal, setEditZonalModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    searchTerm: '',
    statusFilter: 'all',
    dateFilter: ''
  });
  const itemsPerPage = 10;

  // Generate mock data
  useEffect(() => {
    setIsLoading(true);
    const mockData = Array.from({ length: 50 }, (_, i) => ({
      id: `ZH-${1000 + i}`,
      zoneName: `Zone ${i + 1}`,
      zoneId: `ZID-${2000 + i}`,
      created: new Date(Date.now() - Math.floor(Math.random() * 1000 * 60 * 60 * 24 * 30)).toLocaleDateString(),
      createdDate: new Date(Date.now() - Math.floor(Math.random() * 1000 * 60 * 60 * 24 * 30)), // For proper date comparison
      lastUpdated: new Date(Date.now() - Math.floor(Math.random() * 1000 * 60 * 60 * 24 * 7)).toLocaleDateString(),
      status: ['Pending', 'Verified', 'Rejected'][Math.floor(Math.random() * 3)],
    }));
    setTimeout(() => {
      setZonalHeads(mockData);
      setFilteredZonalHeads(mockData);
      setIsLoading(false);
    }, 1000); // Simulate API delay
  }, []);

  // Apply filters
  useEffect(() => {
    let result = zonalHeads;

    // Search by name or ID
    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      result = result.filter(item =>
        item.zoneName.toLowerCase().includes(term) ||
        item.zoneId.toLowerCase().includes(term)
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
    setCurrentPage(1); // Reset to first page when filters change
  }, [filters, zonalHeads]);

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredZonalHeads.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredZonalHeads.length / itemsPerPage);

  const paginate = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleVerify = (id) => {
    console.log(`Verify zonal head with ID: ${id}`);
    // Add verification logic here
  };

  const resetFilters = () => {
    setFilters({
      searchTerm: '',
      statusFilter: 'all',
      dateFilter: ''
    });
  };

  const handleAddZonal = () => {
    setAddZonalModal(true);
  };

  const handleEditZonal = (data) => {
    setEditData(data)
    setEditData(data);
    setEditZonalModal(true);
  };

  return (
    <div className="min-h-screen main_bg">
      <div className="mw-full mx-auto px-4">
        {/* Header with Search */}
        <div className='flex flex-col md:flex-row justify-between items-center py-4 gap-4 sticky top-0 z-50 main_bg'>
          <h1 className="text-sm md:text-xl font-bold text-white">Zonal Heads Dashboard</h1>

          <div className="flex flex-col md:flex-row w-full md:w-auto gap-4">
            <div className="relative flex-grow max-w-md">
              <input
                type="search"
                placeholder="Search by name or ID..."
                className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            <button onClick={handleAddZonal} className=' cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg whitespace-nowrap transition-colors'>
              Add Zonal Head
            </button>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-4 my-4 p-4 bg-gray-800 rounded-lg">
          <div className="flex items-center gap-2">
            <label htmlFor="statusFilter" className="text-sm text-gray-300">Status:</label>
            <select
              id="statusFilter"
              name="statusFilter"
              value={filters.statusFilter}
              onChange={handleFilterChange}
              className="bg-gray-700 text-white rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Verified">Verified</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label htmlFor="dateFilter" className="text-sm text-gray-300">Created Date:</label>
            <input
              type="date"
              id="dateFilter"
              name="dateFilter"
              value={filters.dateFilter}
              onChange={handleFilterChange}
              className="bg-gray-700 text-white rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            onClick={resetFilters}
            className="text-sm bg-gray-600 hover:bg-gray-500 text-white px-3 py-1 rounded transition-colors"
          >
            Reset Filters
          </button>
        </div>

        {/* Table Container */}
        <div className="relative bg-gray-800 rounded-xl shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-800">
                <tr>
                  {['Zone Name', 'Zone ID', 'Created Date', 'Last Updated', 'Status', 'Actions'].map((header) => (
                    <th
                      key={header}
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {isLoading ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-4 text-center text-gray-400">
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
                ) : currentItems.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-4 text-center text-gray-400">
                      No data available
                    </td>
                  </tr>
                ) : (
                  currentItems.map((zonal, index) => (
                    <tr
                      key={index}
                      className="hover:bg-gray-700/50 transition-colors duration-200"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                        {zonal.zoneName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {zonal.zoneId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {zonal.created}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {zonal.lastUpdated}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${zonal.status === 'Verified'
                            ? 'bg-green-900/30 text-green-400'
                            : zonal.status === 'Rejected'
                              ? 'bg-red-900/30 text-red-400'
                              : 'bg-yellow-900/30 text-yellow-400'
                            }`}
                        >
                          {zonal.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex gap-2">
                        <button
                          onClick={() => handleVerify(zonal.id)}
                          className="text-blue-400 hover:text-blue-300 transition-colors duration-200"
                          title="View"
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
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleEditZonal(zonal)}
                          className="text-green-400 hover:text-green-300 transition-colors duration-200"
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

        {/* Pagination */}
        {!isLoading && filteredZonalHeads.length > 0 && (
          <div className="mt-6 pb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-gray-300">
              Showing{' '}
              <span className="font-medium text-white">{indexOfFirstItem + 1}</span> to{' '}
              <span className="font-medium text-white">
                {Math.min(indexOfLastItem, filteredZonalHeads.length)}
              </span>{' '}
              of <span className="font-medium text-white">{filteredZonalHeads.length}</span> entries
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${currentPage === 1
                  ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
              >
                Previous
              </button>
              <div className="flex gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .slice(
                    Math.max(0, currentPage - 3),
                    Math.min(totalPages, currentPage + 2)
                  )
                  .map((page) => (
                    <button
                      key={page}
                      onClick={() => paginate(page)}
                      className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors duration-200 ${currentPage === page
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600'
                        }`}
                    >
                      {page}
                    </button>
                  ))}
              </div>
              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${currentPage === totalPages
                  ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add Zonal Modal */}
      {addZonalModal && (
        <div
          className="fixed inset-0 backdrop-brightness-50 flex items-center justify-center z-50"
          onClick={() => setAddZonalModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-lg shadow-lg w-full max-w-md transform transition-all duration-300 scale-100 animate-modalFade p-6"
          >
            {/* Header */}
            <div className="flex justify-between items-center border-b pb-3 mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Add New Zonal Head</h2>
              <button
                onClick={() => setAddZonalModal(false)}
                className="text-gray-500 hover:text-red-500 text-xl font-bold"
              >
                &times;
              </button>
            </div>
            <AddZonalHead onClose={() => setAddZonalModal(false)} />
          </div>
        </div>
      )}

      {/* edit Zonal Modal */}
      {EditZonalModal && (
        <div
          className="fixed inset-0 backdrop-brightness-50 flex items-center justify-center z-50"
          onClick={() => setEditZonalModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-lg shadow-lg w-full max-w-md transform transition-all duration-300 scale-100 animate-modalFade p-6"
          >
            {/* Header */}
            <div className="flex justify-between items-center border-b pb-3 mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Update Zonal Head</h2>
              <button
                onClick={() => setEditZonalModal(false)}
                className="text-gray-500 hover:text-red-500 text-xl font-bold"
              >
                &times;
              </button>
            </div>
            <EditZonal onClose={() => setEditZonalModal(false)} data={editData} />
          </div>
        </div>
      )}
    </div>
  );
}

export default ZonalHeadList;