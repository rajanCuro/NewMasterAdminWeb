import React, { useState, useEffect } from "react";
import { RiSearchLine } from "react-icons/ri";
import { FiEdit } from "react-icons/fi";
import { FaEye } from "react-icons/fa";
import AddUpdateFeildExecutive from "./AddUpdateFeildExecutive";
import Pagination from "../Pagination";
import ViewFeildExecutiveDetails from "./ViewFeildExecutiveDetails";
import axiosInstance from "../../auth/axiosInstance";

const FeildExecutiveList = () => {
  const [agents, setAgents] = useState([]);
  const [filteredAgents, setFilteredAgents] = useState([]);
  const [addAgentModal, setAddAgentModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [editData, setEditData] = useState(null);
  const [viewAgentModal, setViewAgentModal] = useState(false);
  const [viewAgentModalData, setViewAgentModalData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [filters, setFilters] = useState({
    searchTerm: "",
    statusFilter: "all",
  });

  const getAllFieldExecutives = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/city-admin/getAllFieldExecutiveAddedByCityAdmin?page=${currentPage}&pageSize=${itemsPerPage}`);

      if (response.data && Array.isArray(response.data.dtoList)) {
        setAgents(response.data.dtoList);
        setFilteredAgents(response.data.dtoList);

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
  useEffect(() => {
    let result = agents;

    // Search filter
    if (filters.searchTerm) {
      const searchTerm = filters.searchTerm.toLowerCase();
      result = result.filter(agent =>
        agent.firstName?.toLowerCase().includes(searchTerm) ||
        agent.lastName?.toLowerCase().includes(searchTerm) ||
        agent.email?.toLowerCase().includes(searchTerm) ||
        agent.id?.toString().includes(searchTerm) ||
        agent.phoneNumber?.includes(searchTerm)
      );
    }

    // Status filter
    if (filters.statusFilter !== "all") {
      result = result.filter(agent => agent.status === filters.statusFilter);
    }

    setFilteredAgents(result);
    setCurrentPage(1); // Reset to first page when filters change
  }, [filters, agents]);

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

  const handleViewAgent = (agent) => {
    setViewAgentModal(true);
    setViewAgentModalData(agent);
  };

  const handleCloseModal = () => {
    setViewAgentModalData(null);
    setAddAgentModal(false);
    setViewAgentModal(false);
    setEditData(null);
  };

  const handleDelete = async (agentId) => {
    try {
      await axiosInstance.delete(`/city-admin/deleteFieldExecutive/${agentId}`);
      // Remove from local state
      setAgents(agents.filter(agent => agent.id !== agentId));
    } catch (error) {
      console.error('Error deleting agent:', error);
      setError('Failed to delete agent. Please try again.');
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

  // Status badge color
  const getStatusColor = (status) => {
    switch (status) {
      case "Verified":
      case "ACTIVE":
        return "bg-green-100 text-green-800 border-green-200";
      case "Pending":
      case "INACTIVE":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Rejected":
      case "REJECTED":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };
  const totalItems = filteredAgents.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentAgents = filteredAgents.slice(indexOfFirstItem, indexOfLastItem);

  // Format agent name
  const formatAgentName = (agent) => {
    return `${agent.firstName || ''} ${agent.lastName || ''}`.trim() || 'Unknown Agent';
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

          <div className="mt-4 md:mt-0">
            <button
              onClick={handleAddAgent}
              className="submit-btn"
            >
              Add FeildExecutive
            </button>
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
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Contact</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Status</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Created</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentAgents.length > 0 ? (
                  currentAgents.reverse().map((agent,index) => (
                    <tr onDoubleClick={() => handleViewAgent(agent)} key={agent.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{index+1}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{formatAgentName(agent)}</div>
                        <div className="text-xs text-gray-500">{agent.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{agent.phoneNumber}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2.5 py-1 text-xs font-medium rounded-full border ${getStatusColor(agent.status)}`}>
                          {agent.status || 'Unknown'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {agent.createdAt ? new Date(agent.createdAt).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleViewAgent(agent)}
                            className="text-blue-600 cursor-pointer hover:text-blue-800 p-1.5 rounded-md hover:bg-blue-100 transition-colors"
                            title="View agent"
                          >
                            <FaEye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleEdit(agent)}
                            className="text-green-600 cursor-pointer hover:text-green-800 p-1.5 rounded-md hover:bg-blue-100 transition-colors"
                            title="Edit agent"
                          >
                            <FiEdit className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center">
                      <div className="flex flex-col items-center justify-center text-gray-500">
                        <svg className="w-16 h-16 mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        <p className="text-lg font-medium">No agents found</p>
                        <p className="text-sm mt-1">Try adjusting your search or filter criteria</p>
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
          className="fixed inset-0 backdrop-brightness-50 flex items-center justify-center z-50 p-4"
          onClick={() => { setAddAgentModal(false) }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="flex justify-between items-center border-b border-gray-200 p-6 sticky top-0 bg-white">
              <h2 className="text-xl font-semibold text-gray-800">
                {editData ? "Edit Agent Details" : "Add New Agent"}
              </h2>
              <button
                onClick={() => { setAddAgentModal(false); }}
                className="text-gray-400 hover:text-gray-500 text-2xl font-bold cursor-pointer"
              >
                &times;
              </button>
            </div>

            {/* Agent Form */}
            <div className="p-6">
              <AddUpdateFeildExecutive
                editData={editData}
                onClose={() => setAddAgentModal(false)}
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
          onClick={() => {
            setViewAgentModal(false);
            setViewAgentModalData(null);
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[95vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center border-b border-gray-200 p-6 sticky top-0 bg-blue-700 text-white z-10">
              <h2 className="text-xl font-semibold">Field Executive Details</h2>
              <button
                onClick={() => {
                  setViewAgentModal(false);
                  setViewAgentModalData(null);
                }}
                className="text-white hover:text-red-300 text-2xl font-bold cursor-pointer transition-colors"
              >
                &times;
              </button>
            </div>
            <div className="p-6">
              <ViewFeildExecutiveDetails
                ViewData={viewAgentModalData}
                onClose={() => setViewAgentModal(false)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeildExecutiveList;