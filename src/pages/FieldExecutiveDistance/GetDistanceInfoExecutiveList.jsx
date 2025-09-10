import React, { useState, useEffect, use } from "react";
import { RiSearchLine } from "react-icons/ri";
import { FiEdit } from "react-icons/fi";
import { FaCamera, } from "react-icons/fa";
import Swal from "sweetalert2";
import { useAuth } from "../../auth/AuthContext";
import axiosInstance from "../../auth/axiosInstance";
import DistanceInfo from "./DistanceInfo";
import { GiPathDistance } from "react-icons/gi";
import NoDataPage from "../../NodataPage";

const GetDistanceInfo = () => {
    const { uploadImage, role } = useAuth();
    const [agents, setAgents] = useState([]);
    const [currentAgents, setCurrentAgents] = useState([])
    const [loading, setLoading] = useState(false)
    const [FieldExecutiveInfoModal, setFieldExecutiveInfoModal] = useState(false)
    const [viewData, setViewData] = useState(null)



    const [filters, setFilters] = useState({
        searchTerm: "",
        statusFilter: "all",
    });

    const getAllFieldExecutives = async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.get(`/city-admin/getAllFieldExecutiveAddedByCityAdmin`);
            console.log("xcvb", response)

            if (response.data && Array.isArray(response.data.dtoList)) {
                setCurrentAgents(response.data.dtoList);

            }

        } catch (error) {
            console.error('Error fetching agents:', error);
        } finally {
            setLoading(false);
        }
    }; useEffect(() => {
        getAllFieldExecutives();
    }, []);

    // Filter agents based on filter criteria


    // Handle filter changes
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Action handlers
    const handleEdit = (agent) => {
        setAddAgentModal(true);
        setEditData(agent);
    };

    const handleViewExecutiveInfoModal = (agent) => {
        setFieldExecutiveInfoModal(true);
        setViewData(agent);
    };





    // Format agent name
    const formatAgentName = (agent) => {
        return `${agent.firstName || ''} ${agent.lastName || ''}`.trim() || 'Unknown Agent';
    };

    const updateProfilePic = async (id, imageUrl) => {
        try {
            await axiosInstance.put(`/auth/updateProfilePic?url=${imageUrl}&id=${id}`);
            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'Profile picture updated successfully'
            })
            getAllFieldExecutives();
        } catch (error) {
            console.error("Error updating profile picture:", error);
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
                const response = await axiosInstance.put(`/head_admin/toggleLockStatusUserById/${id}`);

                Swal.fire({
                    icon: "success",
                    title: "Success",
                    text: response.data.message || "Status updated successfully",
                });

                getAllFieldExecutives();
            }
        } catch (error) {
            console.error("Error updating status:", error);
            Swal.fire("Error", "Failed to update status", "error");
        }
    };


    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white px-4 py-4 z-50 sticky top-0">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div className="relative w-full md:max-w-md">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <RiSearchLine className="text-gray-400" />
                        </div>
                        <input
                            type="search"
                            placeholder="Search agents by name, ID, email or phone..."
                            className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            name="searchTerm"
                            value={filters.searchTerm}
                            onChange={handleFilterChange}
                        />
                    </div>
                </div>
            </div>

            {/* Agents Table */}
            <div className="px-6 py-4 flex flex-col" style={{ height: 'calc(106vh - 110px)' }}>
                <div className="bg-white rounded-lg shadow-xs border border-gray-200 overflow-hidden flex flex-col flex-grow">
                    <div className="overflow-x-auto border border-gray-100 flex flex-col flex-grow">
                        <table className="min-w-full divide-y divide-gray-700">
                            <thead className="bg-gray-50 sticky top-0 z-10">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Sr.No</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Agent</th>
                                    {/* <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Contact</th> */}
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Status</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {currentAgents.length > 0 ? (
                                    currentAgents.reverse().map((agent, index) => (
                                        <tr onDoubleClick={() => handleViewExecutiveInfoModal(agent)} key={agent.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{index + 1}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    {/* Avatar wrapper */}
                                                    <div className="relative group h-12 w-12 mr-3">
                                                        {agent.profilePicture ? (
                                                            <img
                                                                src={agent.profilePicture}
                                                                alt={(agent.firstName?.charAt(0) || '') + (agent.lastName?.charAt(0) || '')}
                                                                className="h-12 w-12 rounded-full object-cover"
                                                            />
                                                        ) : (
                                                            <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">
                                                                {(agent.firstName?.charAt(0) || '') + (agent.lastName?.charAt(0) || '')}
                                                            </div>
                                                        )}

                                                        {/* Camera overlay */}
                                                        <div
                                                            className="absolute bottom-0 right-0 bg-black/60 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer"
                                                            onClick={() => document.getElementById(`fileInput-${agent.id}`).click()}
                                                        >
                                                            <FaCamera size={14} className="text-white" />
                                                        </div>

                                                        {/* Hidden file input */}
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
                                                                    await updateProfilePic(agent.id, imageUrl); // <-- fixed from "officer.id"
                                                                } catch (err) {
                                                                    console.error("Error updating profile image:", err);
                                                                }
                                                            }}
                                                        />
                                                    </div>

                                                    {/* Agent info */}
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-900">{formatAgentName(agent)}</div>
                                                        <div className="text-xs text-gray-500">{agent.email}</div>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{agent.mobileNumber}</td> */}
                                            <td onClick={() => handleStatusChange(agent.id)} className="px-6 py-4 whitespace-nowrap cursor-pointer">
                                                <span className={`px-2.5 py-1 text-xs font-medium rounded-full border ${agent.accountNonLocked ? "bg-green-200 text-green-600" : "bg-red-500"}`}>
                                                    {agent.accountNonLocked ? 'Active' : 'Inactive'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => handleViewExecutiveInfoModal(agent)}
                                                        className="text-blue-600 cursor-pointer hover:text-blue-800 p-1.5 rounded-md hover:bg-blue-100 transition-colors"
                                                        title="View agent"
                                                    >
                                                        <GiPathDistance className="w-10 h-10 bg-blue-100 p-1 rounded-md" />
                                                    </button>

                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-8 text-center">
                                            <NoDataPage />
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
                {FieldExecutiveInfoModal && (
                    <div
                        className="fixed inset-0 backdrop-brightness-50 flex items-center justify-center z-50 p-4"
                        onClick={() => setFieldExecutiveInfoModal(false)}
                    >
                        <div
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white rounded-xl shadow-2xl w-full max-w-full  h-screen overflow-y-auto"
                        >
                            {/* Header */}
                            <div className="flex justify-between items-center border-b border-gray-200 p-6 sticky top-0 modal_header">
                                <h1 className=" text-lg font-bold">Field Executive</h1>
                                <button
                                    onClick={() => setFieldExecutiveInfoModal(false)}
                                    className="text-gray-50 hover:text-gray-100 text-2xl font-bold cursor-pointer"
                                >
                                    &times;
                                </button>
                            </div>
                            <div>
                                <DistanceInfo data={viewData} />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default GetDistanceInfo;