import React, { useEffect, useState } from 'react';
import AddUpdatePincode from './AddUpdatePincode';
import { FiEdit, FiTrash2, FiPlus, FiSearch } from "react-icons/fi";
import { MdOutlineGridView, MdOutlineList } from "react-icons/md";
import axiosInstance from '../../auth/axiosInstance';
import Swal from 'sweetalert2';
import Pagination from '../Pagination';

function Pincode() {
    const [pincodeAddModal, setPincodeAddModal] = useState(false);
    const [pincodes, setPincodes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editData, setEditData] = useState();
    const [searchQuery, setSearchQuery] = useState('');
    const [viewMode, setViewMode] = useState('table'); // 'table' or 'grid'

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [totalItems, setTotalItems] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const getAllPincode = async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.get(`/city-admin/getAllPinCodes?page=${currentPage}&pageSize=${itemsPerPage}`);
            console.log("API Response:", response.data);

            // Check if response.data has dtoList property and it's an array
            if (response.data && Array.isArray(response.data.dtoList)) {
                setPincodes(response.data.dtoList);
                setTotalItems(response.data.totalItems || response.data.dtoList.length);
                setTotalPages(response.data.totalPages || Math.ceil(response.data.dtoList.length / itemsPerPage));
            } else {
                console.error('Invalid data format:', response.data);
                setError('Invalid data format received from server');
                setPincodes([]);
                setTotalItems(0);
                setTotalPages(0);
            }
        } catch (error) {
            console.log('Error fetching pincodes:', error);
            setError('Failed to fetch pincodes');
            setPincodes([]);
            setTotalItems(0);
            setTotalPages(0);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getAllPincode();
    }, [currentPage, itemsPerPage]);

    const handleEdit = (data) => {
        setPincodeAddModal(true);
        setEditData(data);
    }

    const handleDeletePincode = async (id, pincode) => {
        Swal.fire({
            title: 'Confirm Deletion',
            text: `Are you sure you want to delete pincode ${pincode}?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axiosInstance.delete(`/city-admin/deletePinCode?id=${id}`);
                    Swal.fire({
                        icon: 'success',
                        title: 'Deleted!',
                        text: 'Pincode deleted successfully',
                        timer: 2000,
                        showConfirmButton: false
                    });
                    getAllPincode();
                } catch (error) {
                    console.error('Error deleting pincode:', error);
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: error.response?.data?.error || 'Failed to delete pincode',
                    });
                }
            }
        });
    };

    const filteredPincodes = pincodes.filter(pincode => 
        pincode.pinCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (pincode.city?.cityName || '').toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className='w-full px-4 py-6 flex flex-col bg-gray-50 min-h-screen'>
            <div className='flex flex-col sm:flex-row justify-between items-center mb-6'>
                <div>
                    <h1 className='text-2xl font-bold text-gray-800'>Pincode Management</h1>
                    <p className='text-sm text-gray-500 mt-1'>Manage all pincodes in your system</p>
                </div>
                <button
                    onClick={() => { setPincodeAddModal(true); setEditData(null) }}
                    className='bg-blue-600 cursor-pointer text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 transition-colors flex items-center shadow-md mt-4 sm:mt-0'
                >
                    <FiPlus className="w-5 h-5 mr-2" />
                    Add Pincode
                </button>
            </div>

            {/* Controls Section */}
            <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="relative w-full md:w-64">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FiSearch className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search pincodes or cities..."
                            className="pl-10 pr-4 py-2.5 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    
                    <div className="flex items-center gap-2 self-end">
                        <span className="text-sm text-gray-600">View:</span>
                        <button
                            onClick={() => setViewMode('table')}
                            className={`p-2 rounded-lg ${viewMode === 'table' ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:bg-gray-100'}`}
                            title="Table view"
                        >
                            <MdOutlineList className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:bg-gray-100'}`}
                            title="Grid view"
                        >
                            <MdOutlineGridView className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Pincodes Container */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden flex flex-col flex-grow">
                {loading ? (
                    <div className="flex justify-center items-center py-16 flex-grow">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                        <span className="ml-4 text-gray-600">Loading pincodes...</span>
                    </div>
                ) : error ? (
                    <div className="flex justify-center items-center py-16 flex-grow">
                        <div className="text-center">
                            <div className="text-red-500 text-lg mb-2">Error Loading Data</div>
                            <div className="text-gray-500 mb-4">{error}</div>
                            <button 
                                onClick={getAllPincode}
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Try Again
                            </button>
                        </div>
                    </div>
                ) : (
                    <>
                        {viewMode === 'table' ? (
                            <div className="flex flex-col flex-grow overflow-hidden">
                                <div className="overflow-auto flex-grow">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50 sticky top-0 z-10">
                                            <tr>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Sr. No
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Pincode
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    City
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Area (km²)
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Population
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Actions
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {filteredPincodes.length > 0 ? (
                                                filteredPincodes.map((pincode, index) => (
                                                    <tr key={pincode.id} className="hover:bg-gray-50 transition-colors">
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                            {(currentPage - 1) * itemsPerPage + index + 1}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                                {pincode.pinCode}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                            {pincode.city?.cityName || 'N/A'}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                            {pincode.areaInKm} km²
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                            {pincode.population.toLocaleString()}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                            <div className="flex items-center gap-2">
                                                                <button
                                                                    onClick={() => handleEdit(pincode)}
                                                                    className="text-blue-600 cursor-pointer hover:text-blue-800 p-1.5 rounded-md hover:bg-blue-100 transition-colors"
                                                                    title="Edit pincode"
                                                                >
                                                                    <FiEdit className="w-4 h-4" />
                                                                </button>
                                                                <button
                                                                    onClick={() => handleDeletePincode(pincode.id, pincode.pinCode)}
                                                                    className="text-red-600 cursor-pointer hover:text-red-800 p-1.5 rounded-md hover:bg-red-100 transition-colors"
                                                                    title="Delete pincode"
                                                                >
                                                                    <FiTrash2 className="w-4 h-4" />
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="6" className="px-6 py-8 text-center">
                                                        <div className="text-gray-500 mb-2">No pincodes found</div>
                                                        {searchQuery ? (
                                                            <p className="text-sm">Try adjusting your search query</p>
                                                        ) : (
                                                            <button
                                                                onClick={() => setPincodeAddModal(true)}
                                                                className="text-blue-600 hover:text-blue-800 font-medium"
                                                            >
                                                                Add your first pincode
                                                            </button>
                                                        )}
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Pagination */}
                                {filteredPincodes.length > 0 && (
                                    <div className="border-t border-gray-200 px-4 py-3 bg-white">
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
                        ) : (
                            // Grid View
                            <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {filteredPincodes.length > 0 ? (
                                    filteredPincodes.map((pincode, index) => (
                                        <div key={pincode.id} className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow">
                                            <div className="flex justify-between items-start mb-3">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                    {pincode.pinCode}
                                                </span>
                                                <div className="flex items-center gap-1">
                                                    <button
                                                        onClick={() => handleEdit(pincode)}
                                                        className="text-blue-600 cursor-pointer hover:text-blue-800 p-1.5 rounded-md hover:bg-blue-100 transition-colors"
                                                        title="Edit pincode"
                                                    >
                                                        <FiEdit className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeletePincode(pincode.id, pincode.pinCode)}
                                                        className="text-red-600 cursor-pointer hover:text-red-800 p-1.5 rounded-md hover:bg-red-100 transition-colors"
                                                        title="Delete pincode"
                                                    >
                                                        <FiTrash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                            <h3 className="font-medium text-gray-900 mb-1">{pincode.city?.cityName || 'N/A'}</h3>
                                            <div className="grid grid-cols-2 gap-2 mt-4 text-sm">
                                                <div>
                                                    <div className="text-gray-500">Area</div>
                                                    <div className="font-medium">{pincode.areaInKm} km²</div>
                                                </div>
                                                <div>
                                                    <div className="text-gray-500">Population</div>
                                                    <div className="font-medium">{pincode.population.toLocaleString()}</div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="col-span-full px-6 py-8 text-center">
                                        <div className="text-gray-500 mb-2">No pincodes found</div>
                                        {searchQuery ? (
                                            <p className="text-sm">Try adjusting your search query</p>
                                        ) : (
                                            <button
                                                onClick={() => setPincodeAddModal(true)}
                                                className="text-blue-600 hover:text-blue-800 font-medium"
                                            >
                                                Add your first pincode
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Add/Edit Pincode Modal */}
            {pincodeAddModal && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 transition-opacity duration-300"
                    onClick={() => { setPincodeAddModal(false); }}
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="bg-white rounded-xl shadow-lg w-full max-w-md transform transition-all duration-300 scale-100 max-h-[90vh] overflow-y-auto"
                    >
                        <div className="flex justify-between items-center border-b border-gray-200 p-5 sticky top-0 bg-white z-10">
                            <h2 className="text-xl font-semibold text-gray-800">
                                {editData ? 'Edit Pincode' : 'Add New Pincode'}
                            </h2>
                            <button
                                onClick={() => { setPincodeAddModal(false); }}
                                className="text-gray-400 hover:text-gray-600 text-2xl font-bold cursor-pointer transition-colors"
                            >
                                &times;
                            </button>
                        </div>
                        <div className="p-5">
                            <AddUpdatePincode
                                onClose={() => setPincodeAddModal(false)}
                                refresh={getAllPincode}
                                editData={editData}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Pincode;