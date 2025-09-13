import React, { useState, useEffect } from "react";
import { RiSearchLine, RiFilter3Line } from "react-icons/ri";
import { FiEdit } from "react-icons/fi";
import { FaCamera, FaEye, FaPhone, FaUser } from "react-icons/fa";
import { MdOutlineMailOutline, MdTrackChanges, MdMoreVert } from "react-icons/md";
import { IoIosCopy, IoIosClose } from "react-icons/io";
import axiosInstance from "../../auth/axiosInstance";
import { useAuth } from "../../auth/AuthContext";
import Swal from "sweetalert2";
import Loader from "../Loader";
import Pagination from "../Pagination";
import Pharmacy from "./Pharmacy";
const FeildExecutiveList = () => {
    const { uploadImage, role } = useAuth();
    const [agents, setAgents] = useState([]);
    const [filteredAgents, setFilteredAgents] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showFilters, setShowFilters] = useState(false);
    const [actionMenu, setActionMenu] = useState(null);
    const [hospitalModal, setHospitalModal] = useState(false)

    const [filters, setFilters] = useState({
        searchTerm: "",
        statusFilter: "all",
        sortBy: "newest"
    });

    const getAllFieldExecutives = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await axiosInstance.get(
                `/city-admin/getAllFieldExecutiveAddedByCityAdmin?page=${currentPage}&pageSize=${itemsPerPage}`
            );

            if (response.data && Array.isArray(response.data.dtoList)) {
                setAgents(response.data.dtoList);
                setFilteredAgents(response.data.dtoList);
            } else {
                setError("No agents found in the response.");
            }
        } catch (error) {
            console.error("Error fetching agents:", error);
            setError("Failed to fetch agents. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getAllFieldExecutives();
    }, [currentPage, itemsPerPage]);

    // Filter and sort agents based on filter criteria
    useEffect(() => {
        let result = [...agents];

        if (filters.searchTerm) {
            const searchTerm = filters.searchTerm.toLowerCase();
            result = result.filter(
                (agent) =>
                    agent.firstName?.toLowerCase().includes(searchTerm) ||
                    agent.lastName?.toLowerCase().includes(searchTerm) ||
                    agent.email?.toLowerCase().includes(searchTerm) ||
                    agent.id?.toString().includes(searchTerm) ||
                    agent.phoneNumber?.toLowerCase().includes(searchTerm)
            );
        }

        if (filters.statusFilter !== "all") {
            const statusValue = filters.statusFilter === "active";
            result = result.filter((agent) => agent.accountNonLocked === statusValue);
        }

        // Sort results
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

        setFilteredAgents(result);
        setCurrentPage(1);
    }, [filters, agents]);

    // Handle filter changes
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters((prev) => ({
            ...prev,
            [name]: value,
        }));
    };


    const totalItems = filteredAgents.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentAgents = filteredAgents.slice(indexOfFirstItem, indexOfLastItem);

    const formatAgentName = (agent) => {
        return `${agent.firstName || ""} ${agent.lastName || ""}`.trim() || "Unknown Agent";
    };

    const updateProfilePic = async (id, imageUrl) => {
        try {
            await axiosInstance.put(`/auth/updateProfilePic?url=${imageUrl}&id=${id}`);
            Swal.fire({
                icon: "success",
                title: "Success",
                text: "Profile picture updated successfully",
            });
            getAllFieldExecutives();
        } catch (error) {
            console.error("Error updating profile picture:", error);
            Swal.fire("Error", "Failed to update profile picture.", "error");
        }
    };

    const handleStatusChange = async (id) => {
        try {
            const result = await Swal.fire({
                title: "Are you sure?",
                text: "Do you want to change this user's status?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, change it!",
                cancelButtonText: "Cancel",
            });

            if (result.isConfirmed) {
                // 👇 Show loading dialog
                Swal.fire({
                    title: "Please wait...",
                    text: "Updating status...",
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                    didOpen: () => {
                        Swal.showLoading(); // show loader spinner
                    },
                });

                // 👇 Perform the API call
                const response = await axiosInstance.put(
                    `/head_admin/toggleLockStatusUserById/${id}`
                );

                // ✅ Close the loading modal
                Swal.close();

                // ✅ Show success message
                Swal.fire({
                    icon: "success",
                    title: "Success",
                    text: response.data.message || "Status updated successfully",
                });

                // ✅ Refresh data
                getAllFieldExecutives();
            }
        } catch (error) {
            console.error("Error updating status:", error);

            // Close any loading modals (if still open)
            Swal.close();

            // Show error message
            Swal.fire("Error", "Failed to update status", "error");
        }

        // Always close action menu
        setActionMenu(null);
    };


    const handleCopyEmail = async (email) => {
        try {
            await navigator.clipboard.writeText(email);
            Swal.fire({
                icon: 'success',
                title: 'Copied!',
                text: 'Email address copied to clipboard',
                toast: true,
                position: 'top-right',
                showConfirmButton: false,
                timer: 2000
            });
        } catch (err) {
            console.error("Failed to copy email:", err);
            Swal.fire({
                icon: 'error',
                title: 'Failed to copy',
                text: 'Could not copy email address',
                toast: true,
                position: 'top-right',
                showConfirmButton: false,
                timer: 2000
            });
        }
    };

    const handleCopyMobile = async (mobile) => {
        try {
            await navigator.clipboard.writeText(mobile);
            Swal.fire({
                icon: 'success',
                title: 'Copied!',
                text: 'Phone number copied to clipboard',
                toast: true,
                position: 'top-right',
                showConfirmButton: false,
                timer: 2000
            });
        } catch (err) {
            console.error("Failed to copy mobile:", err);
            Swal.fire({
                icon: 'error',
                title: 'Failed to copy',
                text: 'Could not copy phone number',
                toast: true,
                position: 'top-right',
                showConfirmButton: false,
                timer: 2000
            });
        }
    };

    const toggleActionMenu = (id, e) => {
        e.stopPropagation();
        setActionMenu(actionMenu === id ? null : id);
    };

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = () => {
            setActionMenu(null);
        };

        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    const [ids, setIds] = useState(null)
    const handleViewHospital = (id) => {
        setIds(id)
        setHospitalModal(true)
    }

    const closeModal = () => {
        setIds(null)
        setHospitalModal(false)
    }

    return (
        <div className="flex flex-col h-full">
            {/* Header */}
            <div className="bg-white px-6 py-5 border-b border-gray-200">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-800">Field Executives</h1>
                        <p className="text-gray-500 mt-1">Manage your team of field executives</p>
                    </div>

                    {role !== "ROLE_ADMIN" && role !== "ROLE_ZONE_ADMIN" && (
                        <button
                            className="mt-4 md:mt-0 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-5 rounded-lg transition-colors flex items-center"
                        >
                            <FaUser className="mr-2" />
                            Add Field Executive
                        </button>
                    )}
                </div>
            </div>

            {/* Filters and Search */}
            <div className="px-6 py-5 bg-white border-b border-gray-200">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-grow">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <RiSearchLine className="text-gray-400" />
                        </div>
                        <input
                            type="search"
                            placeholder="Search by name, ID, email or phone..."
                            className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            name="searchTerm"
                            value={filters.searchTerm}
                            onChange={handleFilterChange}
                        />
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                        >
                            <RiFilter3Line />
                            Filters
                        </button>

                        <select
                            className="border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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

                {/* Expanded Filters */}
                {showFilters && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                            <select
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-gray-700"
                            >
                                Clear Filters
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Stats Bar */}
            <div className="px-6 py-4 bg-white border-b border-gray-200">
                <div className="flex flex-wrap gap-6">
                    <div className="flex items-center">
                        <div className="bg-blue-100 p-2 rounded-lg">
                            <FaUser className="text-blue-600" />
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-gray-500">Total Executives</p>
                            <p className="text-lg font-semibold">{agents.length}</p>
                        </div>
                    </div>

                    <div className="flex items-center">
                        <div className="bg-green-100 p-2 rounded-lg">
                            <FaUser className="text-green-600" />
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-gray-500">Active</p>
                            <p className="text-lg font-semibold">{agents.filter(a => a.accountNonLocked).length}</p>
                        </div>
                    </div>

                    <div className="flex items-center">
                        <div className="bg-red-100 p-2 rounded-lg">
                            <FaUser className="text-red-600" />
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-gray-500">Inactive</p>
                            <p className="text-lg font semibold">{agents.filter(a => !a.accountNonLocked).length}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Agents Table Container with Scroll */}
            <div className="flex-1 px-6 py-4 overflow-hidden">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden h-full flex flex-col">
                    <div className="overflow-y-auto flex-1">
                        {loading ? (
                            <div className="flex items-center justify-center h-64">
                                <Loader />
                            </div>
                        ) : error ? (
                            <div className="flex items-center justify-center h-64">
                                <div className="text-center text-gray-500">
                                    <p className="text-lg">{error}</p>
                                </div>
                            </div>
                        ) : filteredAgents.length === 0 ? (
                            <div className="flex items-center justify-center h-64">
                                <div className="text-center text-gray-500">
                                    <p className="text-lg">No field executives found</p>
                                    <p className="text-sm">Try adjusting your search criteria</p>
                                </div>
                            </div>
                        ) : (
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50 sticky top-0 z-10">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Executive
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Contact
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Added On
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {currentAgents.map((agent) => (
                                        <tr
                                            onClick={() => handleViewHospital(agent.id)}
                                            key={agent.id}
                                            className="hover:bg-gray-50 transition-colors cursor-pointer"
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="relative group h-10 w-10 flex-shrink-0">
                                                        {agent.profilePicture ? (
                                                            <img
                                                                src={agent.profilePicture}
                                                                alt={formatAgentName(agent)}
                                                                className="h-10 w-10 rounded-full object-cover"
                                                            />
                                                        ) : (
                                                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">
                                                                {(agent.firstName?.charAt(0) || "") + (agent.lastName?.charAt(0) || "") || "U"}
                                                            </div>
                                                        )}
                                                        <div
                                                            className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                document.getElementById(`fileInput-${agent.id}`).click();
                                                            }}
                                                        >
                                                            <FaCamera size={12} className="text-white" />
                                                        </div>
                                                        <input
                                                            id={`fileInput-${agent.id}`}
                                                            type="file"
                                                            accept="image/*"
                                                            className="hidden"
                                                            onChange={async (e) => {
                                                                const file = e.target.files[0];
                                                                if (!file) return;
                                                                try {
                                                                    const result = await uploadImage(file);
                                                                    const imageUrl = result.imageUrl || result.url;
                                                                    await updateProfilePic(agent.id, imageUrl);
                                                                } catch (err) {
                                                                    console.error("Error updating profile image:", err);
                                                                    Swal.fire("Error", "Failed to update profile picture.", "error");
                                                                }
                                                            }}
                                                        />
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {formatAgentName(agent)}
                                                        </div>
                                                        <div className="text-xs text-gray-500">ID: {agent.id}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex flex-col gap-1">
                                                    <div className="flex items-center text-sm text-gray-700">
                                                        <MdOutlineMailOutline size={14} className="mr-1.5 text-gray-400" />
                                                        <span className="truncate max-w-xs">{agent.email}</span>
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleCopyEmail(agent.email);
                                                            }}
                                                            className="ml-1.5 text-gray-400 hover:text-gray-600"
                                                        >
                                                            <IoIosCopy size={14} />
                                                        </button>
                                                    </div>
                                                    <div className="flex items-center text-sm text-gray-700">
                                                        <FaPhone size={12} className="mr-1.5 text-gray-400" />
                                                        <span>{agent.mobileNumber || "Not provided"}</span>
                                                        {agent.mobileNumber && (
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleCopyMobile(agent.mobileNumber);
                                                                }}
                                                                className="ml-1.5 text-gray-400 hover:text-gray-600"
                                                            >
                                                                <IoIosCopy size={14} />
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleStatusChange(agent.id);
                                                    }}
                                                    className="inline-flex items-center cursor-pointer"
                                                >
                                                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${agent.accountNonLocked
                                                        ? "bg-green-100 text-green-800"
                                                        : "bg-red-100 text-red-800"
                                                        }`}
                                                    >
                                                        {agent.accountNonLocked ? "Active" : "Inactive"}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {agent.createdAt ? new Date(agent.createdAt).toLocaleDateString() : "N/A"}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium relative">
                                                <button
                                                    onClick={(e) => toggleActionMenu(agent.id, e)}
                                                    className="inline-flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-700"
                                                >
                                                    <MdMoreVert size={18} />
                                                </button>

                                                {actionMenu === agent.id && (
                                                    <div className="absolute right-6 z-10 mt-1 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-100">
                                                        <div className="py-1">
                                                            <button
                                                                className="group flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                                            >
                                                                <FaEye className="mr-3 text-gray-400 group-hover:text-gray-500" size={14} />
                                                                View Details
                                                            </button>

                                                            {/* <button
                                                                className="group flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                                            >
                                                                <MdTrackChanges className="mr-3 text-gray-400 group-hover:text-gray-500" size={14} />
                                                                Track
                                                            </button> */}
                                                        </div>
                                                        <div className="py-1">
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleStatusChange(agent.id);
                                                                }}
                                                                className="group flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                                            >
                                                                <span className={`mr-3 h-2 w-2 rounded-full ${agent.accountNonLocked ? "bg-red-500" : "bg-green-500"
                                                                    }`}></span>
                                                                {agent.accountNonLocked ? "Deactivate" : "Activate"}
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>

                    {/* Pagination */}
                    {filteredAgents.length > 0 && (
                        <div className="px-6 py-4 bg-white border-t border-gray-200">
                            <Pagination
                                currentPage={currentPage}
                                totalItems={totalItems}
                                totalPages={totalPages}
                                itemsPerPage={itemsPerPage}
                                onPageChange={setCurrentPage}
                                onItemsPerPageChange={setItemsPerPage}
                            />
                        </div>
                    )}
                </div>
            </div>
            {hospitalModal && (
                <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-brightness-50">
                    <button
                        onClick={closeModal}
                        className="fixed top-0 bg-red-500 right-0 z-50 flex items-center justify-center w-8 h-8 rounded-full  text-gray-50 cursor-pointer hover:bg-gray-300 hover:text-gray-800 transition"
                    >
                        ✕
                    </button>
                    <div className="p-2 w-full">
                        {/* <Hospital /> */}
                        <Pharmacy id={ids} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default FeildExecutiveList;