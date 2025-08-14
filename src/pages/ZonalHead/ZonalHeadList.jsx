import React, { useState, useEffect } from 'react';

function ZonalHeadList() {
  const [zonalHeads, setZonalHeads] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const itemsPerPage = 10;

  // Generate mock data
  useEffect(() => {
    setIsLoading(true);
    const mockData = Array.from({ length: 50 }, (_, i) => ({
      id: `ZH-${1000 + i}`,
      zoneName: `Zone ${i + 1}`,
      zoneId: `ZID-${2000 + i}`,
      created: new Date(Date.now() - Math.floor(Math.random() * 1000 * 60 * 60 * 24 * 30)).toLocaleDateString(),
      lastUpdated: new Date(Date.now() - Math.floor(Math.random() * 1000 * 60 * 60 * 24 * 7)).toLocaleDateString(),
      status: ['Pending', 'Verified', 'Rejected'][Math.floor(Math.random() * 3)],
    }));
    setTimeout(() => {
      setZonalHeads(mockData);
      setIsLoading(false);
    }, 1000); // Simulate API delay
  }, []);

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = zonalHeads.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(zonalHeads.length / itemsPerPage);

  const paginate = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const handleVerify = (id) => {
    console.log(`Verify zonal head with ID: ${id}`);
    // Add verification logic here
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="mw-full mx-auto">
        <div className='flex justify-between items-center  py-1 gap-2  '>
          <h1 className="text-xl font-bold mb-1 w-full md:w-1/2  ">Zonal Heads Dashboard</h1>
          <div className="search-container w-full md:w-1/2   ">
            <input 
              type="search"
              placeholder="Search..."
              className="search-input"
            />
            <button type="submit" className="search-button">
              <svg className="search-icon" viewBox="0 0 24 24">
                <path d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 0 0 1.48-5.34c-.47-2.78-2.79-5-5.59-5.34a6.505 6.505 0 0 0-7.27 7.27c.34 2.8 2.56 5.12 5.34 5.59a6.5 6.5 0 0 0 5.34-1.48l.27.28v.79l4.25 4.25c.41.41 1.08.41 1.49 0 .41-.41.41-1.08 0-1.49L15.5 14zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
              </svg>
            </button>
          </div>
          <button className='add_button'>Add Zonal</button>
        </div>

        {/* Table Container */}
        <div className="relative bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-xl overflow-hidden">
          <div className="max-h-[calc(100vh-130px)] overflow-y-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-800 sticky top-0 z-10">
                <tr>
                  {['Zone Name', 'Zone ID', 'Created Date', 'Last Updated', 'Status', 'Actions'].map((header) => (
                    <th
                      key={header}
                      scope="col"
                      className="px-6 py-4 text-left text-sm font-semibold text-gray-200 uppercase tracking-wider"
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
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleVerify(zonal.id)}
                          disabled={zonal.status === 'Verified'}
                          className={`mr-3 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${zonal.status === 'Verified'
                            ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                            : 'bg-blue-600 hover:bg-blue-700 text-white'
                            }`}
                        >
                          {zonal.status === 'Verified' ? 'Verified' : 'Verify'}
                        </button>
                        <button className="text-gray-400 hover:text-white transition-colors duration-200">
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
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination - Fixed at Bottom */}
        {!isLoading && (
          <div className="fixed bottom-0 left-0 right-0 bg-gray-800/80 backdrop-blur-sm border-t border-gray-700 py-4">
            <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
              <div className="text-sm text-gray-300">
                Showing{' '}
                <span className="font-medium text-white">{indexOfFirstItem + 1}</span> to{' '}
                <span className="font-medium text-white">
                  {Math.min(indexOfLastItem, zonalHeads.length)}
                </span>{' '}
                of <span className="font-medium text-white">{zonalHeads.length}</span> entries
              </div>
              <div className="flex items-center space-x-2">
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
                <div className="flex space-x-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .slice(
                      Math.max(0, currentPage - 3),
                      Math.min(totalPages, currentPage + 2)
                    )
                    .map((page) => (
                      <button
                        key={page}
                        onClick={() => paginate(page)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${currentPage === page
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
          </div>
        )}
      </div>
    </div>
  );
}

export default ZonalHeadList;