import React, { useState, useMemo } from 'react';
import {
    FiSearch,
    FiCheckCircle,
    FiXCircle,
    FiAlertCircle,
    FiTruck,
    FiPhone,
    FiMail,
    FiMapPin,
    FiUser,
    FiFilter,
    FiRefreshCw
} from 'react-icons/fi';

function AllAmbulance({ data }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
    const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'available', 'unavailable'

    const ambulances = data.ambulances || [];

    // Handle sorting
    const handleSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    // Sort and filter data
    const processedData = useMemo(() => {
        let result = [...ambulances];

        // Apply status filter
        if (statusFilter !== 'all') {
            result = result.filter(ambulance =>
                statusFilter === 'available' ? ambulance.available : !ambulance.available
            );
        }

        // Apply search filter
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            result = result.filter(ambulance =>
                ambulance.ambulanceNumber?.toLowerCase().includes(term) ||
                ambulance.firstName?.toLowerCase().includes(term) ||
                ambulance.lastName?.toLowerCase().includes(term) ||
                ambulance.email?.toLowerCase().includes(term) ||
                ambulance.mobileNumber?.includes(term)
            );
        }

        // Apply sorting
        if (sortConfig.key) {
            result.sort((a, b) => {
                let aValue = a[sortConfig.key];
                let bValue = b[sortConfig.key];

                // Handle different data types
                if (typeof aValue === 'string') aValue = aValue.toLowerCase();
                if (typeof bValue === 'string') bValue = bValue.toLowerCase();

                if (aValue < bValue) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (aValue > bValue) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        }

        return result;
    }, [ambulances, searchTerm, sortConfig, statusFilter]);

    // Reset filters
    const resetFilters = () => {
        setSearchTerm('');
        setStatusFilter('all');
        setSortConfig({ key: null, direction: 'ascending' });
    };

    if (!ambulances || ambulances.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center  bg-gray-50 p-6">
                <FiAlertCircle className="text-yellow-500 text-4xl mb-4" />
                <p className="text-gray-800 text-lg">No ambulance data available.</p>
            </div>
        );
    }

    return (
        <>
            <div>


                <div className="bg-white rounded-xl shadow-md p-4 md:p-2 mb-1">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-1">
                        <div className="relative flex-1 max-w-md">
                            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search ambulances..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 pr-4 py-2.5 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                            />
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3">
                            <div className="flex items-center">
                                <FiFilter className="text-gray-500 mr-2" />
                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                >
                                    <option value="all">All Status</option>
                                    <option value="available">Available</option>
                                    <option value="unavailable">Unavailable</option>
                                </select>
                            </div>

                            <button
                                onClick={resetFilters}
                                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                            >
                                <FiRefreshCw size={16} />
                                <span>Reset</span>
                            </button>
                        </div>
                    </div>

                    <div className="mb-4 flex justify-between items-center">
                        <p className="text-sm text-gray-600">
                            Showing {processedData.length} of {ambulances.length} ambulances
                        </p>
                    </div>

                    <div className="overflow-x-auto rounded-lg max-h-[50vh] hide-scrollbar">
                        <table className="min-w-full divide-y divide-gray-200 ">
                            <thead className="bg-gray-100">
                                <tr className='bg-gray-400 text-white'>
                                    <th
                                        className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer hover:bg-gray-200 transition"
                                    >
                                        <div className="flex items-center">
                                            <FiTruck className="mr-1.5" />
                                            <span>Ambulance No.</span>
                                        </div>
                                    </th>
                                    <th
                                        onClick={() => handleSort('firstName')}
                                        className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer hover:bg-gray-200 transition"
                                    >
                                        <div className="flex items-center">
                                            <FiUser className="mr-1.5" />
                                            <span>Driver</span>
                                        </div>
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                                        <div className="flex items-center">
                                            <FiPhone className="mr-1.5" />
                                            <span>Contact</span>
                                        </div>
                                    </th>
                                    
                                    <th

                                        className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer hover:bg-gray-200 transition"
                                    >
                                        Capacity
                                    </th>
                                    <th

                                        className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer hover:bg-gray-200 transition"
                                    >
                                        Status
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {processedData.map((ambulance, index) => (
                                    <tr key={ambulance.id || index} className="hover:bg-gray-50 transition">
                                        <td className="px-4 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                                    <FiTruck className="text-blue-600" />
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {ambulance.ambulanceNumber || 'N/A'}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        {ambulance.ambulanceModel || 'Model N/A'}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">
                                                {ambulance.firstName} {ambulance.lastName}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {ambulance.email}
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {ambulance.mobileNumber || 'N/A'}
                                        </td>
                                        {/* <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {ambulance.parkingLatitude && ambulance.parkingLongitude ? (
                                                <span>
                                                    {ambulance.parkingLatitude.toFixed(4)}, {ambulance.parkingLongitude.toFixed(4)}
                                                </span>
                                            ) : (
                                                'Location N/A'
                                            )}
                                        </td> */}
                                        <td className="px-4 py-4 whitespace-nowrap">
                                            <span className="px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
                                                {ambulance.capacity || 'N/A'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap">
                                            <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${ambulance.available
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-red-100 text-red-800'
                                                }`}>
                                                {ambulance.available ? (
                                                    <>
                                                        <FiCheckCircle className="mr-1.5" />
                                                        <span>Available</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <FiXCircle className="mr-1.5" />
                                                        <span>Unavailable</span>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {processedData.length === 0 && (
                            <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                                <FiSearch className="text-3xl mb-2" />
                                <p>No ambulances match your search criteria</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Statistics Cards */}
                {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center">
              <div className="rounded-lg bg-blue-100 p-3 mr-4">
                <FiTruck className="text-blue-600 text-xl" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Ambulances</p>
                <p className="text-2xl font-bold text-gray-800">{ambulances.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center">
              <div className="rounded-lg bg-green-100 p-3 mr-4">
                <FiCheckCircle className="text-green-600 text-xl" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Available</p>
                <p className="text-2xl font-bold text-gray-800">
                  {ambulances.filter(a => a.available).length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center">
              <div className="rounded-lg bg-red-100 p-3 mr-4">
                <FiXCircle className="text-red-600 text-xl" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Unavailable</p>
                <p className="text-2xl font-bold text-gray-800">
                  {ambulances.filter(a => !a.available).length}
                </p>
              </div>
            </div>
          </div>
        </div> */}
            </div>
        </>
    );
}

export default AllAmbulance;