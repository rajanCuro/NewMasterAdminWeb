import React, { useState, useEffect } from "react";
import { RiSearchLine } from "react-icons/ri";
import { FiEdit } from "react-icons/fi";
import { FaCamera, FaEye } from "react-icons/fa";
import { MdTrackChanges } from "react-icons/md";
import AddUpdateFeildExecutive from "./AddUpdateFeildExecutive";
import Pagination from "../Pagination";
import ViewFeildExecutiveDetails from "./ViewFeildExecutiveDetails";
import Track from "../LiveTrack/Track";
import axiosInstance from "../../auth/axiosInstance";
import { useAuth } from "../../auth/AuthContext";
import Swal from "sweetalert2";

const FeildExecutiveList = () => {
  const { uploadImage, role } = useAuth();
  const [agents, setAgents] = useState([]);
  const [filteredAgents, setFilteredAgents] = useState([]);
  const [addAgentModal, setAddAgentModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [editData, setEditData] = useState(null);
  const [viewAgentModal, setViewAgentModal] = useState(false);
  const [viewAgentModalData, setViewAgentModalData] = useState(null);
  const [trackModal, setTrackModal] = useState(false);
  const [trackAgentData, setTrackAgentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [filters, setFilters] = useState({
    searchTerm: "",
    statusFilter: "all",
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

  // Filter agents based on filter criteria
  useEffect(() => {
    let result = agents;

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
      result = result.filter((agent) => agent.status === filters.statusFilter);
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

  // Action handlers
  const handleEdit = (agent) => {
    setAddAgentModal(true);
    setEditData(agent);
  };

  const handleViewAgent = (agent) => {
    setViewAgentModal(true);
    setViewAgentModalData(agent);
  };

  const handleTrackAgent = (agent) => {
    setTrackModal(true);
    setTrackAgentData(agent);
  };

  const handleCloseModal = () => {
    setViewAgentModalData(null);
    setAddAgentModal(false);
    setViewAgentModal(false);
    setTrackModal(false);
    setTrackAgentData(null);
    setEditData(null);
  };

  const handleDelete = async (agentId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        await axiosInstance.delete(`/city-admin/deleteFieldExecutive/${agentId}`);
        setAgents(agents.filter((agent) => agent.id !== agentId));
        Swal.fire("Deleted!", "Agent has been deleted.", "success");
      } catch (error) {
        console.error("Error deleting agent:", error);
        setError("Failed to delete agent. Please try again.");
        Swal.fire("Error", "Failed to delete agent.", "error");
      }
    }
  };

  const handleAddAgent = () => {
    setEditData(null);
    setAddAgentModal(true);
  };

  const handleAgentSaved = () => {
    getAllFieldExecutives();
    setEditData(null);
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
        const response = await axiosInstance.put(
          `/head_admin/toggleLockStatusUserById/${id}`
        );
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

          {role === "ROLE_ADMIN" || role === "ROLE_ZONE_ADMIN" ? (
            ""
          ) : (
            <div className="mt-4 md:mt-0">
              <button onClick={handleAddAgent} className="submit-btn">
                Add Field Executive
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Agents Table */}
      <div className="px-6 py-4 flex flex-col" style={{ height: "calc(106vh - 110px)" }}>
        <div className="bg-white rounded-lg shadow-xs border border-gray-200 overflow-hidden flex flex-col flex-grow">
          <div className="overflow-x-auto border border-gray-100 flex flex-col flex-grow">
            {error && <div className="text-red-500 text-center py-2">{error}</div>}
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-50 sticky top-0 z-10">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap"
                  >
                    Sr.No
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap"
                  >
                    Agent
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap"
                  >
                    Contact
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-8 text-center">
                      <div className="flex justify-center items-center">
                        <svg
                          className="animate-spin h-8 w-8 text-blue-500"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                      </div>
                    </td>
                  </tr>
                ) : currentAgents.length > 0 ? (
                  [...currentAgents].reverse().map((agent, index) => (
                    <tr
                      onDoubleClick={() => handleViewAgent(agent)}
                      key={agent.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="relative group h-12 w-12 mr-3">
                            {agent.profilePicture ? (
                              <img
                                src={agent.profilePicture}
                                alt={
                                  (agent.firstName?.charAt(0) || "") +
                                  (agent.lastName?.charAt(0) || "")
                                }
                                className="h-12 w-12 rounded-full object-cover"
                              />
                            ) : (
                              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">
                                {(agent.firstName?.charAt(0) || "") +
                                  (agent.lastName?.charAt(0) || "")}
                              </div>
                            )}
                            <div
                              className="absolute bottom-0 right-0 bg-black/60 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer"
                              onClick={() =>
                                document.getElementById(`fileInput-${agent.id}`).click()
                              }
                            >
                              <FaCamera size={14} className="text-white" />
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
                                  Swal.fire(
                                    "Error",
                                    "Failed to update profile picture.",
                                    "error"
                                  );
                                }
                              }}
                            />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {formatAgentName(agent)}
                            </div>
                            <div className="text-xs text-gray-500">{agent.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {agent.mobileNumber}
                      </td>
                      <td
                        onClick={() => handleStatusChange(agent.id)}
                        className="px-6 py-4 whitespace-nowrap cursor-pointer"
                      >
                        <span
                          className={`px-2.5 py-1 text-xs font-medium rounded-full border ${agent.accountNonLocked
                              ? "bg-green-200 text-green-600"
                              : "bg-red-500 text-white"
                            }`}
                        >
                          {agent.accountNonLocked ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleViewAgent(agent)}
                            className="text-blue-600 cursor-pointer hover:text-blue-800 p-1.5 rounded-md hover:bg-blue-100 transition-colors"
                            title="View agent"
                            aria-label="View agent"
                          >
                            <FaEye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleEdit(agent)}
                            className="text-green-600 cursor-pointer hover:text-green-800 p-1.5 rounded-md hover:bg-blue-100 transition-colors"
                            title="Edit agent"
                            aria-label="Edit agent"
                          >
                            <FiEdit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleTrackAgent(agent)}
                            className="text-purple-600 cursor-pointer hover:text-purple-800 p-1.5 rounded-md hover:bg-blue-100 transition-colors"
                            title="Track agent"
                            aria-label="Track agent"
                          >
                            <MdTrackChanges className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-8 text-center">
                      <div className="flex flex-col items-center justify-center text-gray-500">
                        <svg
                          className="w-16 h-16 mb-4 text-gray-300"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <p className="text-lg font-medium">No agents found</p>
                        <p className="text-sm mt-1">
                          Try adjusting your search or filter criteria
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
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
        </div>
      </div>

      {/* Add/Edit Agent Modal */}
      {addAgentModal && (
        <div
          className="fixed inset-0 backdrop-brightness-50 flex items-center justify-center z-70 p-4"
          onClick={handleCloseModal}
          role="dialog"
          aria-modal="true"
          aria-labelledby="add-edit-modal-title"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center border-b border-gray-200 p-6 sticky top-0 modal_header z-70">
              <h2 id="add-edit-modal-title" className="text-xl font-semibold">
                {editData ? "Edit Agent Details" : "Add New Agent"}
              </h2>
              <button
                onClick={handleCloseModal}
                className="text-gray-500 hover:text-red-500 text-2xl font-bold cursor-pointer"
                aria-label="Close modal"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="p-6">
              <AddUpdateFeildExecutive
                editData={editData}
                onClose={handleCloseModal}
                onSave={handleAgentSaved}
              />
            </div>
          </div>
        </div>
      )}

      {/* View Agent Modal */}
      {viewAgentModal && viewAgentModalData && (
        <div
          className="fixed inset-0 backdrop-brightness-50 flex items-center justify-center z-70"
          onClick={handleCloseModal}
          role="dialog"
          aria-modal="true"
          aria-labelledby="view-modal-title"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[95vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center border-b border-gray-200 p-6 sticky top-0 modal_header z-10">
              <h2 id="view-modal-title" className="text-xl font-semibold">
                Field Executive Details
              </h2>
              <button
                onClick={handleCloseModal}
                className="text-white hover:text-red-300 text-2xl font-bold cursor-pointer transition-colors"
                aria-label="Close modal"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="p-6">
              <ViewFeildExecutiveDetails
                ViewData={viewAgentModalData}
                onClose={handleCloseModal}
              />
            </div>
          </div>
        </div>
      )}

      {/* Track Agent Modal */}
      {trackModal && trackAgentData && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => {
            setTrackModal(false);
            setTrackAgentData(null);
          }}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="bg-white rounded-lg relative max-w-4xl w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => {
                setTrackModal(false);
                setTrackAgentData(null);
              }}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-3xl font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full"
              aria-label="Close modal"
            >
              &times;
            </button>
            <Track agentData={trackAgentData} />
          </div>
        </div>
      )}
    </div>
  );
};

export default FeildExecutiveList;