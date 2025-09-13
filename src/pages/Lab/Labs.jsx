import React, { useEffect, useState } from 'react';
import { RiSearchLine, RiFilter3Line, RiArrowUpDownLine } from 'react-icons/ri';
import { IoIosClose } from 'react-icons/io';
import axiosInstance from '../../auth/axiosInstance';

function Labs({ id }) {
    const [loading, setLoading] = useState(false);
    const [allLabs, setAllLabs] = useState([]);
    const [filteredLabs, setFilteredLabs] = useState([]);
    const [error, setError] = useState(false);
    const [showFilters, setShowFilters] = useState(false);
    
    // Filter states
    const [filters, setFilters] = useState({
        searchTerm: "",
        statusFilter: "all",
        sortBy: "newest"
    });

    useEffect(() => {
        fetchData();
    }, [id]);

    useEffect(() => {
        let result = [...allLabs];
        
        // Apply search filter
        if (filters.searchTerm) {
            const searchTerm = filters.searchTerm.toLowerCase();
            result = result.filter(
                (lab) =>
                    lab.labName?.toLowerCase().includes(searchTerm) ||
                    lab.firstName?.toLowerCase().includes(searchTerm) ||
                    lab.lastName?.toLowerCase().includes(searchTerm) ||
                    lab.email?.toLowerCase().includes(searchTerm) ||
                    lab.id?.toString().includes(searchTerm) ||
                    lab.mobileNumber?.toLowerCase().includes(searchTerm)
            );
        }

        // Apply status filter
        if (filters.statusFilter !== "all") {
            const statusValue = filters.statusFilter === "active";
            result = result.filter((lab) => lab.accountNonLocked === statusValue);
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
        }

        setFilteredLabs(result);
    }, [filters, allLabs]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.get(`/api/field-executive/getAgentStatistics/${id}`);
            setAllLabs(response.data.labs || []);
            setFilteredLabs(response.data.labs || []);
        } catch (error) {
            setError(true);
            console.error('Error fetching data:', error);
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

    const formatLabName = (lab) => {
        return `${lab.firstName || ""} ${lab.lastName || ""}`.trim() || lab.labName || "Unknown Lab";
    };

    const getStatusBadge = (lab) => {
        if (lab.accountNonLocked) {
            return <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">Active</span>;
        } else {
            return <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">Inactive</span>;
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
                <p className="text-red-500">Failed to load labs data.</p>
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
            <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800">Associated Labs</h2>
                <p className="text-gray-500 text-sm mt-1">Labs managed by this field executive</p>
            </div>

            {/* Filters and Search */}
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                <div className="flex flex-col md:flex-row gap-3">
                    <div className="relative flex-grow">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <RiSearchLine className="text-gray-400 text-sm" />
                        </div>
                        <input
                            type="search"
                            placeholder="Search labs by name, email, ID or phone..."
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
                                <option value="name">Sort by Name</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Expanded Filters */}
                {showFilters && (
                    <div className="mt-4 p-4 bg-white rounded-lg border border-gray-200 grid grid-cols-1 md:grid-cols-3 gap-4">
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

                        <div className="flex items-end">
                            <button
                                onClick={() => {
                                    setFilters({
                                        searchTerm: "",
                                        statusFilter: "all",
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

            {/* Labs Table */}
            <div className="overflow-x-auto">
                {filteredLabs.length === 0 ? (
                    <div className="p-8 text-center">
                        <p className="text-gray-500">No labs found.</p>
                        {filters.searchTerm || filters.statusFilter !== "all" ? (
                            <button
                                onClick={() => {
                                    setFilters({
                                        searchTerm: "",
                                        statusFilter: "all",
                                        sortBy: "newest"
                                    });
                                }}
                                className="mt-2 text-sm text-blue-600 hover:text-blue-800"
                            >
                                Clear filters to see all labs
                            </button>
                        ) : null}
                    </div>
                ) : (
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Lab
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Contact
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    License
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
                            {filteredLabs.map((lab) => (
                                <tr key={lab.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="h-10 w-10 flex-shrink-0">
                                                {lab.profilePicture ? (
                                                    <img
                                                        src={lab.profilePicture}
                                                        alt={formatLabName(lab)}
                                                        className="h-10 w-10 rounded-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">
                                                        {(lab.firstName?.charAt(0) || "") + (lab.lastName?.charAt(0) || "") || "L"}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {formatLabName(lab)}
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    {lab.labName && `(${lab.labName})`}
                                                </div>
                                                <div className="text-xs text-gray-500">ID: {lab.id}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex flex-col gap-1">
                                            <div className="text-sm text-gray-900">{lab.email}</div>
                                            <div className="text-xs text-gray-500">{lab.mobileNumber || "Not provided"}</div>
                                            <div className="text-xs text-gray-500">{lab.contactNumber || "No contact"}</div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex flex-col">
                                            <span className="text-xs text-gray-900">
                                                {lab.licenseNumber || "Not provided"}
                                            </span>
                                            <span className="text-xs text-gray-500">
                                                {lab.licenceVerified ? (
                                                    <span className="text-green-600">Verified</span>
                                                ) : (
                                                    <span className="text-yellow-600">Pending</span>
                                                )}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {getStatusBadge(lab)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {lab.createdAt ? new Date(lab.createdAt).toLocaleDateString() : "N/A"}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Results Count */}
            {filteredLabs.length > 0 && (
                <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
                    <p className="text-xs text-gray-500">
                        Showing {filteredLabs.length} of {allLabs.length} labs
                    </p>
                </div>
            )}
        </div>
    );
}

export default Labs;