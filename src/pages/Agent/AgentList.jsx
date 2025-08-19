import React, { useState, useEffect } from "react";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FiEdit } from "react-icons/fi";
import Add_Update_Agent from "./Add_Update_Agent";
import Pagination from "../Pagination";

const AgentList = () => {
  const [agents, setAgents] = useState([]);
  const [addAgentModal, setAddAgentModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
   const [itemsPerPage, setItemsPerPage] = useState(10);
   const [editData,setEditData] = useState('')


  // Initialize with sample data
  useEffect(() => {
    const baseAgents = [
      {
        id: 1,
        name: "John Doe",
        email: "john.doe@example.com",
        phone: "(123) 456-7890",
      },
      {
        id: 2,
        name: "Jane Smith",
        email: "jane.smith@example.com",
        phone: "(234) 567-8901",
      },
      {
        id: 3,
        name: "Robert Johnson",
        email: "robert.j@example.com",
        phone: "(345) 678-9012",
      },
      {
        id: 4,
        name: "Emily Davis",
        email: "emily.davis@example.com",
        phone: "(456) 789-0123",
      },
    ];

    // Generate 50 agents by repeating and modifying the pattern
    const fiftyAgents = Array.from({ length: 50 }, (_, i) => {
      const baseAgent = baseAgents[i % 4]; // Cycle through the 4 base agents
      const id = i + 1;

      return {
        id,
        name: `${baseAgent.name.split(' ')[0]} ${baseAgent.name.split(' ')[1]}${i < 4 ? '' : id}`, // Add ID to last name only for generated agents
        email: `${baseAgent.email.split('@')[0]}${i < 4 ? '' : id}@${baseAgent.email.split('@')[1]}`,
        phone: i < 4 ?
          baseAgent.phone :
          `(${Math.floor(100 + Math.random() * 900)}) ${Math.floor(100 + Math.random() * 900)}-${Math.floor(1000 + Math.random() * 9000)}`
      };
    });

    setAgents(fiftyAgents);
  }, []);

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentAgents = agents.slice(indexOfFirstItem, indexOfLastItem);

  // Action handlers
  const handleEdit = (agent) => {
    setAddAgentModal(true)
    setEditData(agent);
  };

  const handleDelete = (agentId) => {
    setAgents(agents.filter(agent => agent.id !== agentId));
    console.log("Delete agent:", agentId);
  };

  return (
    <div className="h-screen overflow-y-auto w-full mx-auto px-4 main_bg">
      <div className='flex flex-col md:flex-row justify-between items-center py-4 gap-4 main_bg sticky top-0 z-50'>
        <h1 className="text-sm md:text-xl font-bold">Agent List</h1>
        <div className="flex flex-col md:flex-row w-full md:w-auto gap-4">
          <div className="relative flex-grow max-w-md">
            <input
              type="search"
              placeholder="Search by name or ID..."
              className="w-full border border-gray-300 rounded-lg px-4 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
              name="searchTerm"
            // value={filters.searchTerm}
            // onChange={handleFilterChange}
            />
            <button type="submit" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                <path d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 0 0 1.48-5.34c-.47-2.78-2.79-5-5.59-5.34a6.505 6.505 0 0 0-7.27 7.27c.34 2.8 2.56 5.12 5.34 5.59a6.5 6.5 0 0 0 5.34-1.48l.27.28v.79l4.25 4.25c.41.41 1.08.41 1.49 0 .41-.41.41-1.08 0-1.49L15.5 14zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
          <button
            onClick={() => setAddAgentModal(true)}
            className='cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg whitespace-nowrap transition-colors'
          >
            Add Agent
          </button>
        </div>
      </div>

      <div className=" shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-300">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Phone</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-300">
            {currentAgents.map((agent) => (
              <tr key={agent.id} className="hover:bg-gray-300 hover:cursor-pointer">
                <td className="px-6 py-4 whitespace-nowrap text-sm">{agent.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{agent.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">{agent.email}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">{agent.phone}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => handleEdit(agent)}
                    className="text-green-600 hover:text-green-800 mr-3 hover:rounded-full hover:bg-green-300 p-2"
                  >
                    <FiEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(agent.id)}
                    className="text-red-600 hover:text-red-800 hover:rounded-full hover:bg-red-200 p-2"
                  >
                    <RiDeleteBin6Line />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination
        currentPage={currentPage}
        totalItems={agents.length}
        itemsPerPage={itemsPerPage}
        onPageChange={setCurrentPage}
        onItemsPerPageChange={setItemsPerPage}
      />
      {/* Add Agent Modal */}
      {addAgentModal && (
        <div
          className="fixed inset-0 backdrop-brightness-50 flex items-center justify-center z-50"
          onClick={() => setAddAgentModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-lg shadow-lg w-full max-w-md transform transition-all duration-300 scale-100 animate-modalFade p-6"
          >
            {/* Header */}
            <div className="flex justify-between items-center border-b border-gray-700 pb-3 mb-4">
              <h2 className="text-lg font-semibold ">Add New Agent</h2>
              <button
                onClick={() => setAddAgentModal(false)}
                className="text-red-400 hover:text-red-500 text-xl font-bold cursor-pointer"
              >
                &times;
              </button>
            </div>
            <Add_Update_Agent
              onClose={() => setAddAgentModal(false)}
              editData = {editData}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AgentList;