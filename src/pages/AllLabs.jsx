import React, { useState } from 'react';

function AllLabs({ data }) {
    const [filters, setFilters] = useState({
        status: 'all',
        search: ''
    });

    const handleFilterChange = (filterType, value) => {
        setFilters(prev => ({
            ...prev,
            [filterType]: value
        }));
    };

    // Filter labs based on current filters
    const filteredLabs = data.labs && data.labs.length > 0 ? data.labs.filter(lab => {
        // Status filter
        if (filters.status !== 'all') {
            const statusMatch = filters.status === 'active' ? lab.accountNonLocked : !lab.accountNonLocked;
            if (!statusMatch) return false;
        }

        // Search filter
        if (filters.search) {
            const searchTerm = filters.search.toLowerCase();
            const matchesLabName = lab.labName && lab.labName.toLowerCase().includes(searchTerm);
            const matchesEmail = lab.email && lab.email.toLowerCase().includes(searchTerm);
            const matchesLicense = lab.licenseNumber && lab.licenseNumber.toLowerCase().includes(searchTerm);

            if (!matchesLabName && !matchesEmail && !matchesLicense) return false;
        }

        return true;
    }) : [];

    return (
        <>
            <div className="">

                {/* Filter Controls */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>

                            <select
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={filters.status}
                                onChange={(e) => handleFilterChange('status', e.target.value)}
                            >
                                <option value="all">All Statuses</option>
                                <option value="active">Active</option>
                                <option value="locked">Locked</option>
                            </select>
                        </div>

                        <div>

                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search by name, email or license..."
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pl-10"
                                    value={filters.search}
                                    onChange={(e) => handleFilterChange('search', e.target.value)}
                                />
                                <svg className="w-5 h-5 absolute left-3 top-2.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                                </svg>
                            </div>
                        </div>

                        <div>
                            <div className="px-4 py-2 bg-gray-100 rounded-md">
                                <span className="text-gray-700">{filteredLabs.length} lab(s) found</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Labs Table */}
                {filteredLabs.length > 0 ? (
                    <div className="bg-white rounded-lg shadow-md overflow-hidden max-h-[50vh] overflow-y-auto">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr className='bg-gray-400 text-white'>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider">Lab Details</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider">Contact Information</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider">License & GST</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider">Status</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider">Created</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredLabs.map((lab, index) => (
                                        <tr key={index} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-10 w-10">
                                                        {lab.profilePicture ? (
                                                            <img className="h-10 w-10 rounded-full object-cover" src={lab.profilePicture} alt={lab.labName} />
                                                        ) : (
                                                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                                                <span className="text-blue-600 font-medium">{lab.labName ? lab.labName.charAt(0).toUpperCase() : 'L'}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900">{lab.labName || 'Unnamed Lab'}</div>
                                                        <div className="text-sm text-gray-500">{lab.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{lab.contactNumber || 'N/A'}</div>
                                                <div className="text-sm text-gray-500">{lab.mobileNumber || 'N/A'}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">License: {lab.licenseNumber || 'N/A'}</div>
                                                <div className="text-sm text-gray-500">GST: {lab.gstRegistrationNumber || 'N/A'}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${lab.accountNonLocked ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                    {lab.accountNonLocked ? 'Active' : 'Locked'}
                                                </span>
                                                <div className="text-xs text-gray-500 mt-1">
                                                    {lab.licenceVerified ? 'Verified' : 'Unverified'}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {new Date(lab.createdAt).toLocaleDateString()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white rounded-lg shadow-md p-12 text-center">
                        <svg className="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        <h3 className="mt-4 text-xl font-medium text-gray-700">No Labs Match Your Criteria</h3>
                        <p className="mt-2 text-gray-500">Try adjusting your filters to see more results.</p>
                    </div>
                )}
            </div>
        </>
    );
}

export default AllLabs;