import React, { useState, useEffect } from "react";
import { RiDeleteBin6Line, RiFilterLine, RiSearchLine } from "react-icons/ri";
import { FiEdit, FiPlus } from "react-icons/fi";
import Add_Update_Agent from "./AddUpdateAgent";
import Pagination from "../Pagination";

const AgentList = () => {
  const [agents, setAgents] = useState([]);
  const [filteredAgents, setFilteredAgents] = useState([]);
  const [addAgentModal, setAddAgentModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [editData, setEditData] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  // Filter state
  const [filters, setFilters] = useState({
    searchTerm: "",
    statusFilter: "all",
    dateFilter: ""
  });

  // Initialize with sample data
  useEffect(() => {
    const baseAgents = [
      {
        id: 1,
        name: "John Doe",
        email: "john.doe@example.com",
        phone: "(123) 456-7890",
        status: "Verified",
        zone: "North Zone",
        performance: "Excellent",
        createdAt: "2023-05-15"
      },
      {
        id: 2,
        name: "Jane Smith",
        email: "jane.smith@example.com",
        phone: "(234) 567-8901",
        status: "Pending",
        zone: "South Zone",
        performance: "Good",
        createdAt: "2023-06-20"
      },
      {
        id: 3,
        name: "Robert Johnson",
        email: "robert.j@example.com",
        phone: "(345) 678-9012",
        status: "Rejected",
        zone: "East Zone",
        performance: "Average",
        createdAt: "2023-07-10"
      },
      {
        id: 4,
        name: "Emily Davis",
        email: "emily.davis@example.com",
        phone: "(456) 789-0123",
        status: "Verified",
        zone: "West Zone",
        performance: "Excellent",
        createdAt: "2023-08-05"
      },
    ];

    // Generate 50 agents by repeating and modifying the pattern
    const fiftyAgents = Array.from({ length: 50 }, (_, i) => {
      const baseAgent = baseAgents[i % 4];
      const id = i + 1;
      const statusOptions = ["Pending", "Verified", "Rejected"];
      const performanceOptions = ["Excellent", "Good", "Average", "Needs Improvement"];
      const zoneOptions = ["North Zone", "South Zone", "East Zone", "West Zone", "Central Zone"];

      const randomStatus = statusOptions[Math.floor(Math.random() * statusOptions.length)];
      const randomPerformance = performanceOptions[Math.floor(Math.random() * performanceOptions.length)];
      const randomZone = zoneOptions[Math.floor(Math.random() * zoneOptions.length)];

      // Generate a random date within the past year
      const randomDate = new Date();
      randomDate.setDate(randomDate.getDate() - Math.floor(Math.random() * 365));

      return {
        id,
        name: `${baseAgent.name.split(' ')[0]} ${baseAgent.name.split(' ')[1]}${i < 4 ? '' : id}`,
        email: `${baseAgent.email.split('@')[0]}${i < 4 ? '' : id}@${baseAgent.email.split('@')[1]}`,
        phone: i < 4 ? baseAgent.phone : `(${Math.floor(100 + Math.random() * 900)}) ${Math.floor(100 + Math.random() * 900)}-${Math.floor(1000 + Math.random() * 9000)}`,
        status: i < 4 ? baseAgent.status : randomStatus,
        performance: i < 4 ? baseAgent.performance : randomPerformance,
        zone: i < 4 ? baseAgent.zone : randomZone,
        createdAt: i < 4 ? baseAgent.createdAt : randomDate.toISOString().split('T')[0]
      };
    });

    setAgents(fiftyAgents);
    setFilteredAgents(fiftyAgents);
  }, []);

  // Filter agents based on filter criteria
  useEffect(() => {
    let result = agents;

    // Search filter
    if (filters.searchTerm) {
      const searchTerm = filters.searchTerm.toLowerCase();
      result = result.filter(agent =>
        agent.name.toLowerCase().includes(searchTerm) ||
        agent.email.toLowerCase().includes(searchTerm) ||
        agent.id.toString().includes(searchTerm) ||
        agent.zone.toLowerCase().includes(searchTerm)
      );
    }

    // Status filter
    if (filters.statusFilter !== "all") {
      result = result.filter(agent => agent.status === filters.statusFilter);
    }

    // Date filter
    if (filters.dateFilter) {
      result = result.filter(agent => agent.createdAt === filters.dateFilter);
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

 

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentAgents = filteredAgents.slice(indexOfFirstItem, indexOfLastItem);

  // Action handlers
  const handleEdit = (agent) => {
    setAddAgentModal(true);
    setEditData(agent);
  };

  const handleDelete = (agentId) => {
    setAgents(agents.filter(agent => agent.id !== agentId));
  };

  // Status badge color
  const getStatusColor = (status) => {
    switch (status) {
      case "Verified":
        return "bg-green-100 text-green-800 border-green-200";
      case "Pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Rejected":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  // Performance indicator
  const getPerformanceColor = (performance) => {
    switch (performance) {
      case "Excellent":
        return "text-green-600 bg-green-50 border-green-200";
      case "Good":
        return "text-blue-600 bg-blue-50 border-blue-200";
      case "Average":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "Needs Improvement":
        return "text-red-600 bg-red-50 border-red-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
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
              placeholder="Search agents by name, ID, email or zone..."
              className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              name="searchTerm"
              value={filters.searchTerm}
              onChange={handleFilterChange}
            />
          </div>
        
          <div className="mt-4 md:mt-0">
            <button
              onClick={() => {
                setEditData(null);
                setAddAgentModal(true);
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg flex items-center gap-2 w-full md:w-auto justify-center transition-colors shadow-sm"
            >
              <FiPlus className="w-4 h-4" />
              Agent
            </button>
          </div>
        </div>
      </div>

      

      {/* Agents Table */}
      <div className="px-6 py-4">
        <div className="bg-white rounded-lg shadow-xs border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Agent</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Zone</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Performance</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentAgents.length > 0 ? (
                  currentAgents.map((agent) => (
                    <tr key={agent.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{agent.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{agent.name}</div>
                        <div className="text-xs text-gray-500">{agent.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{agent.phone}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{agent.zone}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2.5 py-1 text-xs font-medium rounded-full border ${getStatusColor(agent.status)}`}>
                          {agent.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2.5 py-1 text-xs font-medium rounded-full border ${getPerformanceColor(agent.performance)}`}>
                          {agent.performance}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{agent.createdAt}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEdit(agent)}
                            className="text-blue-600 hover:text-blue-800 p-1.5 rounded-md hover:bg-blue-100 transition-colors"
                            title="Edit agent"
                          >
                            <FiEdit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(agent.id)}
                            className="text-red-600 hover:text-red-800 p-1.5 rounded-md hover:bg-red-100 transition-colors"
                            title="Delete agent"
                          >
                            <RiDeleteBin6Line className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="px-6 py-8 text-center">
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
        </div>
      </div>

      {/* Pagination */}
      <div className="px-6 py-4 bg-white border-t border-gray-200">
        <Pagination
          currentPage={currentPage}
          totalItems={filteredAgents.length}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={setItemsPerPage}
        />
      </div>

      {/* Add/Edit Agent Modal */}
      {addAgentModal && (
        <div
          className="fixed inset-0 backdrop-brightness-50 flex items-center justify-center z-50 p-4"
          onClick={() => setAddAgentModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-xl shadow-2xl w-full max-w-2xl transform transition-all duration-300 scale-100 max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="flex justify-between items-center border-b border-gray-200 p-6 sticky top-0 bg-white">
              <h2 className="text-xl font-semibold text-gray-800">
                {editData ? "Edit Agent Details" : "Add New Agent"}
              </h2>
              <button
                onClick={() => setAddAgentModal(false)}
                className="text-gray-400 hover:text-gray-500 text-2xl font-bold cursor-pointer"
              >
                &times;
              </button>
            </div>

            {/* Agent Form */}
            <div className="p-6">
              <Add_Update_Agent
                onClose={() => setAddAgentModal(false)}
                editData={editData}
                onSave={(newAgent) => {
                  if (editData) {
                    // Update existing agent
                    setAgents(agents.map(agent =>
                      agent.id === editData.id ? { ...agent, ...newAgent } : agent
                    ));
                  } else {
                    // Add new agent
                    const newId = Math.max(...agents.map(a => a.id)) + 1;
                    setAgents([...agents, { ...newAgent, id: newId }]);
                  }
                  setAddAgentModal(false);
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AgentList;