import React, { useState } from "react";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FiEdit } from "react-icons/fi";
import AddAgent from "./AddAgent";


const AgentList = () => {
  // Sample agent data
  const agents = [
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
  const [addAgentModal,setAddAgentModal] = useState(false);

  // Action handlers
  const handleEdit = (agentId) => {
    console.log("Edit agent:", agentId);
    // Add your edit logic here
  };

  const handleDelete = (agentId) => {
    console.log("Delete agent:", agentId);
    // Add your delete logic here
  };

  return (
    <div className="w-full mx-auto px-4">
      <div className='flex flex-col md:flex-row justify-between items-center py-4 gap-4 sticky top-0 z-50'>
          <h1 className="text-sm md:text-xl font-bold">Agent List</h1>

          <div className="flex flex-col md:flex-row w-full md:w-auto gap-4">
            <div className="relative flex-grow max-w-md">
              <input
                type="search"
                placeholder="Search by name or ID..."
                className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            <button onClick={() => setAddAgentModal(true)} className=' cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg whitespace-nowrap transition-colors'>
              Add Agent
            </button>
          </div>
        </div>
      
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {agents.map((agent) => (
              <tr key={agent.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{agent.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{agent.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{agent.email}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{agent.phone}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => handleEdit(agent.id)}
                    className="text-indigo-600 hover:text-indigo-900 mr-3 cursor-pointer"
                  >
                    <FiEdit/>
                  </button>
                  <button
                    onClick={() => handleDelete(agent.id)}
                    className="text-red-600 hover:text-red-900 cursor-pointer"
                  >
                    <RiDeleteBin6Line/>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
       {/* Add Zonal Modal */}
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
            <div className="flex justify-between items-center border-b pb-3 mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Add New Agent</h2>
              <button
                onClick={() => setAddAgentModal(false)}
                className="text-gray-500 hover:text-red-500 text-xl font-bold cursor-pointer"
              >
                &times;
              </button>
            </div>
            <AddAgent onClose={() => setAddAgentModal(false)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default AgentList;