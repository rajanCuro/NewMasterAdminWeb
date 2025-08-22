import React from 'react';
import { FaSearch } from 'react-icons/fa';
import {
    FiX,
    FiPhone,
    FiMail,
    FiUser,
    FiCalendar,
    FiMap,
    FiActivity,
    FiCheckCircle,
    FiXCircle,
    FiHome,
    FiPlusCircle
} from 'react-icons/fi';

function ViewAgentDetails({ data, onClose }) {
    // Dummy data for hospitals, labs, and pharmacies
    const agentStats = {
        totalHospitals: 12,
        activeHospitals: 9,
        totalLabs: 8,
        activeLabs: 7,
        totalPharmacies: 15,
        activePharmacies: 14
    };

    // Sample lists for each category
    const hospitals = [
        { id: 1, name: 'City General Hospital', status: 'Active' },
        { id: 2, name: 'Community Health Center', status: 'Active' },
        { id: 3, name: 'Metropolitan Hospital', status: 'Inactive' }
    ];

    const labs = [
        { id: 1, name: 'Diagnostic Lab Center', status: 'Active' },
        { id: 2, name: 'Precision Testing Lab', status: 'Active' }
    ];

    const pharmacies = [
        { id: 1, name: 'MediQuick Pharmacy', status: 'Active' },
        { id: 2, name: 'HealthPlus Drugstore', status: 'Active' },
        { id: 3, name: 'Community Pharmacy', status: 'Active' }
    ];

    return (
        <div className="fixed inset-0 backdrop-brightness-50 flex items-center justify-center p-4 z-80">
            <div className="bg-white rounded-xl shadow-2xl max-w-full w-full max-h-[90vh] overflow-y-auto hide-scrollbar ">
                {/* Header */}
                <div className="flex justify-between items-center text-white p-4 border-b border-gray-200 sticky top-0 bg-blue-700 rounded-t-xl">
                    <h2 className="text-2xl font-bold ">Agent Details</h2>
                    <button
                        onClick={onClose}
                        className="cursor-pointer duration-300 hover:text-gray-700 transition-colors p-1 rounded-full hover:bg-gray-100"
                    >
                        <FiX size={24} />
                    </button>
                </div>

                {/* Main Content */}
                <div className="p-6">
                    {/* Agent Profile Section */}
                    <div className="flex flex-col md:flex-row gap-6 mb-8">
                        <div className="flex-shrink-0">
                            <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center">
                                <FiUser size={40} className="text-blue-600" />
                            </div>
                        </div>

                        <div className="flex-1">
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">{data.name}</h3>
                            <div className="flex flex-wrap gap-4 mb-4">
                                <div className={`px-3 py-1 rounded-full text-sm font-medium ${data.status === 'Verified'
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-yellow-100 text-yellow-800'
                                    }`}>
                                    {data.status}
                                </div>
                                <div className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                                    {data.zone}
                                </div>
                                <div className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                                    {data.performance}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex items-center text-gray-600">
                                    <FiMail className="mr-2 text-blue-500" />
                                    <span>{data.email}</span>
                                </div>
                                <div className="flex items-center text-gray-600">
                                    <FiPhone className="mr-2 text-green-500" />
                                    <span>{data.phone}</span>
                                </div>
                                <div className="flex items-center text-gray-600">
                                    <FiCalendar className="mr-2 text-purple-500" />
                                    <span>Joined: {data.createdAt}</span>
                                </div>
                                <div className="flex items-center text-gray-600">
                                    <FiMap className="mr-2 text-orange-500" />
                                    <span>{data.zone}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Statistics Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                            <div className="flex items-center justify-between mb-2">
                                <h4 className="font-semibold text-blue-800">Hospitals</h4>
                                <FiHome className="text-blue-600" />
                            </div>
                            <div className="text-2xl font-bold text-blue-700">{agentStats.totalHospitals}</div>
                            <div className="text-sm text-blue-600">
                                {agentStats.activeHospitals} Active • {agentStats.totalHospitals - agentStats.activeHospitals} Inactive
                            </div>
                        </div>

                        <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                            <div className="flex items-center justify-between mb-2">
                                <h4 className="font-semibold text-green-800">Labs</h4>
                                <FiActivity className="text-green-600" />
                            </div>
                            <div className="text-2xl font-bold text-green-700">{agentStats.totalLabs}</div>
                            <div className="text-sm text-green-600">
                                {agentStats.activeLabs} Active • {agentStats.totalLabs - agentStats.activeLabs} Inactive
                            </div>
                        </div>

                        <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                            <div className="flex items-center justify-between mb-2">
                                <h4 className="font-semibold text-purple-800">Pharmacies</h4>
                                <FiPlusCircle className="text-purple-600" />
                            </div>
                            <div className="text-2xl font-bold text-purple-700">{agentStats.totalPharmacies}</div>
                            <div className="text-sm text-purple-600">
                                {agentStats.activePharmacies} Active • {agentStats.totalPharmacies - agentStats.activePharmacies} Inactive
                            </div>
                        </div>
                    </div>

                    {/* Facilities Lists */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Hospitals List */}
                        <div className="border border-gray-200 rounded-lg p-4">
                            <div className='flex justify-between items-center gap-4 mb-3'>
                                <h4 className="font-semibold text-gray-800 flex items-center whitespace-nowrap ">
                                    <FiHome className="mr-2 text-blue-500" />
                                    Hospitals ({hospitals.length})
                                </h4>
                                <div className="relative w-full max-w-s">
                                    <FaSearch size={10} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="search"
                                        placeholder="Search..."
                                        className="w-full  pl-10 pr-4 py-1 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                {hospitals.map(hospital => (
                                    <div key={hospital.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                        <span className="text-sm text-gray-700">{hospital.name}</span>
                                        {hospital.status === 'Active' ? (
                                            <FiCheckCircle className="text-green-500" />
                                        ) : (
                                            <FiXCircle className="text-red-500" />
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Labs List */}
                        <div className="border border-gray-200 rounded-lg p-4">
                            <div className='flex justify-between items-center gap-4 mb-3'>
                                <h4 className="font-semibold text-gray-800 flex items-center whitespace-nowrap ">
                                    <FiActivity className="mr-2 text-green-500" />
                                    Labs ({labs.length})
                                </h4>
                                <div className="relative w-full max-w-s">
                                    <FaSearch size={10} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="search"
                                        placeholder="Search..."
                                        className="w-full  pl-10 pr-4 py-1 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                {labs.map(lab => (
                                    <div key={lab.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                        <span className="text-sm text-gray-700">{lab.name}</span>
                                        {lab.status === 'Active' ? (
                                            <FiCheckCircle className="text-green-500" />
                                        ) : (
                                            <FiXCircle className="text-red-500" />
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Pharmacies List */}
                        <div className="border border-gray-200 rounded-lg p-4">
                            <div className='flex justify-between items-center gap-4 mb-3'>
                                <h4 className="font-semibold text-gray-800 flex items-center whitespace-nowrap ">
                                    <FiPlusCircle className="mr-2 text-purple-500" />
                                    Pharmacies ({pharmacies.length})
                                </h4>
                                <div className="relative w-full max-w-s">
                                    <FaSearch  size={10} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="search"
                                        placeholder="Search..."
                                        className="w-full  pl-8 pr-4 py-1 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                {pharmacies.map(pharmacy => (
                                    <div key={pharmacy.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                        <span className="text-sm text-gray-700">{pharmacy.name}</span>
                                        {pharmacy.status === 'Active' ? (
                                            <FiCheckCircle className="text-green-500" />
                                        ) : (
                                            <FiXCircle className="text-red-500" />
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-gray-200 bg-gray-50 rounded-b-xl flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ViewAgentDetails;