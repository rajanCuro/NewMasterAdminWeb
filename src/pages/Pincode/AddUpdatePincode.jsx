import React, { useEffect, useState } from 'react';
import { useAuth } from '../../auth/AuthContext';
import axiosInstance from '../../auth/axiosInstance';
import Swal from 'sweetalert2'

function AddUpdatePincode({ onClose, refresh, editData }) {
    const { user } = useAuth();

    const [formData, setFormData] = useState({
        pincode: '',
        population: '',
        areaInKm: '',
    });

    useEffect(() => {
        if (editData) {
            setFormData({
                pincode: editData.pincode || '',
                population: editData.population || '',
                areaInKm: editData.areaInKm || '',
            })
        }
    }, [editData])

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [id]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const payload = {
                pinCode: formData.pincode,
                city: {
                    id: user?.city?.id || 0
                },
                population: formData.population,
                areaInKm: formData.areaInKm,
            };

            if (editData) {
                await axiosInstance.put(`/city-admin/updatePincode?id=${editData.id}`, payload);
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: 'Pincode updated successfully'
                });
            } else {
                await axiosInstance.post('/city-admin/addNewPinCode', payload);
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: 'Pincode added successfully'
                });
            }

            if (refresh) refresh();
            if (onClose) onClose();

        } catch (error) {
            console.error('Error submitting pincode:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: editData ? 'Failed to update pincode!' : 'Failed to add pincode!',
            });
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="">
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="pincode" className="block text-sm font-medium text-gray-700 mb-1">
                        Pincode <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        id="pincode"
                        placeholder="Enter 6-digit pincode"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={formData.pincode}
                        onChange={handleChange}
                        required
                    />
                    <p className="text-xs text-gray-500 mt-1">Must be 6 digits</p>
                </div>
                <div className="mb-4">
                    <label htmlFor="population" className="block text-sm font-medium text-gray-700 mb-1">
                        Population <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        id="population"
                        placeholder="Enter population"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={formData.population}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="areaInKm" className="block text-sm font-medium text-gray-700 mb-1">
                        Area (in km²) <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        id="areaInKm"
                        placeholder="Enter area in km²"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={formData.areaInKm}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="flex space-x-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                    >
                        {loading ? (editData ? 'Updating...' : 'Adding...') : (editData ? 'Update Pincode' : 'Add Pincode')}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default AddUpdatePincode;
