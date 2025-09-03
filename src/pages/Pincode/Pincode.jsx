import React, { useEffect, useState } from 'react';
import AddUpdatePincode from './AddUpdatePincode';
import { FiEdit } from "react-icons/fi";
import { FaEye } from "react-icons/fa";
import axiosInstance from '../../auth/axiosInstance';
import Swal from 'sweetalert2';
import Pagination from '../Pagination';

function Pincode() {
    const [pincodeAddModal, setPincodeAddModal] = useState(false);
    const [pincodes, setPincodes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editData, setEditData] = useState();

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

    const handleDeletePincode = async (id) => {
        const truncateText = (text, wordLimit) => {
            const words = text.split(' ');
            if (words.length > wordLimit) {
                return words.slice(0, wordLimit).join(' ') + ']';
            }
            return text;
        };
        try {
            const response = await axiosInstance.delete(`/city-admin/deletePinCode?id=${id}`)
            Swal.fire({
                icon: 'success',
                title: 'delete',
                text: 'Pincode delete successfully'
            });
            // Refresh the list after deletion
            getAllPincode();
        } catch (error) {
            console.error('Error deleting pincode:', error);
            Swal.fire({
                icon: 'error',
                title: truncateText(error.response?.data?.error || '', 8)
            });
        }
    };

    return (
        <div className='w-full px-4 py-6 md:px-4 flex flex-col' style={{ minHeight: 'calc(107.5vh - 2rem)' }}>
            <div className='flex flex-col sm:flex-row justify-between items-center mb-6'>
                <h1 className='text-2xl font-bold text-gray-800 mb-4 sm:mb-0'>Pincode Management</h1>
                <button
                    onClick={() => { setPincodeAddModal(true); setEditData(null) }}
                    className='bg-blue-600 cursor-pointer text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center'
                >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                    </svg>
                    Add Pincode
                </button>
            </div>

            {/* Pincodes Table Container */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col flex-grow">
                {loading ? (
                    <div className="flex justify-center items-center py-12 flex-grow">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                        <span className="ml-4 text-gray-600">Loading pincodes...</span>
                    </div>
                ) : (
                    <div className="flex flex-col flex-grow overflow-hidden">
                        {/* Scrollable table container */}
                        <div className="overflow-auto flex-grow">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50 sticky top-0 z-10">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                                            Sr. No
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                                            Pincode
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                                            City
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                                            Area (km²)
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                                            Population
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {pincodes.length > 0 ? (
                                        pincodes.map((pincode, index) => (
                                            <tr key={pincode.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                    {(currentPage - 1) * itemsPerPage + index + 1}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">
                                                    {pincode.pinCode}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {pincode.city?.cityName || 'N/A'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {pincode.areaInKm} km²
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {pincode.population}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <div className="flex items-center gap-2">
                                                        {/* <button
                                                            className="text-blue-600 cursor-pointer hover:text-blue-800 p-1.5 rounded-md hover:bg-blue-100 transition-colors"
                                                            title="View pincode details"
                                                        >
                                                            <FaEye className="w-4 h-4" />
                                                        </button> */}
                                                        <button
                                                            onClick={() => handleEdit(pincode)}
                                                            className="text-green-600 cursor-pointer hover:text-green-800 p-1.5 rounded-md hover:bg-green-100 transition-colors"
                                                            title="Edit pincode"
                                                        >
                                                            <FiEdit className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeletePincode(pincode.id)}
                                                            className="text-red-600 cursor-pointer hover:text-red-800 p-1.5 rounded-md hover:bg-red-100 transition-colors"
                                                            title="Delete pincode"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                                                No pincodes found. Click "Add Pincode" to add a new one.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Fixed pagination at the bottom */}
                        {pincodes.length > 0 && (
                            <div className="sticky bottom-0 bg-white border-t border-gray-200 px-4 py-3">
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
                )}
            </div>

            {/* Add Pincode Modal */}
            {pincodeAddModal && (
                <div
                    className="fixed inset-0 backdrop-brightness-50 flex items-center justify-center z-50 p-4"
                    onClick={() => { setPincodeAddModal(false); }}
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="bg-white rounded-lg shadow-lg w-full max-w-md transform transition-all duration-300 scale-100 max-h-[90vh] overflow-y-auto"
                    >
                        <div className="flex justify-between items-center border-b p-4 sticky top-0 modal_header z-10">
                            <h2 className="text-xl font-semibold ">
                                {editData ? 'Edit Pincode' : 'Add New Pincode'}
                            </h2>
                            <button
                                onClick={() => { setPincodeAddModal(false); }}
                                className=" hover:text-red-500 text-2xl font-bold cursor-pointer"
                            >
                                &times;
                            </button>
                        </div>
                        <div className="p-4">
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