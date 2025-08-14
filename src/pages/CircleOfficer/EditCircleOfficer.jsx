import React, { useState, useEffect } from 'react';
import { MdBrowserUpdated, MdUpdate } from "react-icons/md";

function EditCircleOfficier({ data, onClose, onSave }) {
    const [formData, setFormData] = useState({
        circleName: '',
        circleId: '',
        status: 'Pending'
    });
    const [errors, setErrors] = useState({});

    // Initialize form with data
    useEffect(() => {
        if (data) {
            setFormData({
                circleName: data.circleName || '',
                circleId: data.circleId || '',
                status: data.status || 'Pending'
            });
        }
    }, [data]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.circleName.trim()) newErrors.circleName = 'Circle name is required';
        if (!formData.circleId.trim()) newErrors.circleId = 'Circle ID is required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            onSave(formData);
        }
    };

    return (
        <div className="p-4 max-w-md mx-auto">
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Circle Name Field */}
                <div className="float-container relative">
                    <input
                        type="text"
                        id="circleName"
                        name="circleName"
                        value={formData.circleName}
                        onChange={handleChange}
                        className={`float-input w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                            errors.circleName 
                                ? 'border-red-500 focus:ring-red-200' 
                                : 'border-gray-300 focus:ring-blue-200'
                        } text-black`}
                        required
                    />
                    <label htmlFor="circleName" className="float-label">Circle Name</label>
                    {errors.circleName && (
                        <p className="text-red-500 text-xs mt-1">{errors.circleName}</p>
                    )}
                </div>

                {/* Circle ID Field */}
                <div className="float-container relative">
                    <input
                        type="text"
                        id="circleId"
                        name="circleId"
                        value={formData.circleId}
                        onChange={handleChange}
                        className={`float-input w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                            errors.circleId 
                                ? 'border-red-500 focus:ring-red-200' 
                                : 'border-gray-300 focus:ring-blue-200'
                        } text-black`}
                        required
                        disabled // Assuming circle ID shouldn't be editable
                    />
                    <label htmlFor="circleId" className="float-label">Circle ID</label>
                    {errors.circleId && (
                        <p className="text-red-500 text-xs mt-1">{errors.circleId}</p>
                    )}
                </div>

                {/* Status Field */}
                <div className="float-container relative">
                    <select
                        id="status"
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className="float-input w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 text-black appearance-none"
                    >
                        <option value="Pending">Pending</option>
                        <option value="Verified">Verified</option>
                        <option value="Rejected">Rejected</option>
                    </select>
                    <label htmlFor="status" className="float-label">Status</label>
                </div>

                {/* Date Information */}
                <div className="text-sm text-gray-600 flex justify-between items-center">
                    <span className="flex items-center gap-2">
                        <MdBrowserUpdated className="text-gray-500" /> 
                        Created: {data?.created || 'N/A'}
                    </span>
                    <span className="flex items-center gap-2">
                        <MdUpdate className="text-gray-500" /> 
                        Last Updated: {data?.lastUpdated || 'N/A'}
                    </span>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-3 pt-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2"
                    >
                        <MdUpdate />
                        Save Changes
                    </button>
                </div>
            </form>
        </div>
    );
}

export default EditCircleOfficier;