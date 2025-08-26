import React, { useEffect, useState } from 'react';
import AddUpdatePincode from './AddUpdatePincode';
import { FiEdit } from "react-icons/fi";
import { FaEye } from "react-icons/fa";
import axiosInstance from '../../auth/axiosInstance';
import Swal from 'sweetalert2';

function Pincode() {
    const [pincodeAddModal, setPincodeAddModal] = useState(false);
    const [pincodes, setPincodes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editData,setEditData] = useState();

    const getAllPincode = async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.get('/city-admin/getAllPinCodes');
            console.log("API Response:", response.data);
            
            // Check if response.data has dtoList property and it's an array
            if (response.data && Array.isArray(response.data.dtoList)) {
                setPincodes(response.data.dtoList);
            } else {
                console.error('Invalid data format:', response.data);
                setError('Invalid data format received from server');
                setPincodes([]);
            }
        } catch (error) {
            console.log('Error fetching pincodes:', error);
            setError('Failed to fetch pincodes');
            setPincodes([]);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getAllPincode();
    }, []);

    const handleEdit = (data) =>{
setPincodeAddModal(true);
setEditData(data)
    }

    const handleDeletePincode = async (id) => {
            try {
                const response = await axiosInstance.delete(`/city-admin/deletePinCode?id=${id}`)
                Swal.fire({
                    icon: 'success',
                    title: 'delete',
                    text: 'Pincode delete successfully'
                })
            } catch (error) {
                console.error('Error deleting pincode:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Field to delete pincode'
                })
            }
    };

    return (
        <div className='w-full px-4 py-6 md:px-10'>
            <div className='flex flex-col sm:flex-row justify-between items-center mb-6'>
                <h1 className='text-2xl font-bold text-gray-800 mb-4 sm:mb-0'>Pincode Management</h1>
                <button
                    onClick={() => {setPincodeAddModal(true); setEditData(null)}}
                    className='bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center'
                >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                    </svg>
                    Add Pincode
                </button>
            </div>

            {/* Pincodes Table */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
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
                            {pincodes.length > 0 ? (
                               [...pincodes].reverse().map((pincode, index) => (
                                    <tr key={pincode.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {index + 1}
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
                                                <button
                                                    className="text-blue-600 cursor-pointer hover:text-blue-800 p-1.5 rounded-md hover:bg-blue-100 transition-colors"
                                                    title="View pincode details"
                                                >
                                                    <FaEye className="w-4 h-4" />
                                                </button>
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
                        <div className="flex justify-between items-center border-b p-4 sticky top-0 bg-white z-10">
                            <h2 className="text-xl font-semibold text-gray-800">
                                {editData ? 'Edit Pincode' : 'Add New Pincode'}
                            </h2>
                            <button
                                onClick={() => { setPincodeAddModal(false); }}
                                className="text-gray-500 hover:text-red-500 text-2xl font-bold cursor-pointer"
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