import React, { useState, useEffect } from 'react';
import { MdBrowserUpdated } from "react-icons/md";
import { MdUpdate } from "react-icons/md";


function EditZonal({ data, onClose, onSave }) {
    const [formData, setFormData] = useState({
        zoneName: '',
        zoneId: '',
        status: 'Pending'
    });
    const [errors, setErrors] = useState({});
    console.log(data)

    // Initialize form with data when component mounts or data changes
    useEffect(() => {
        if (data) {
            setFormData({
                zoneName: data.zoneName || '',
                zoneId: data.zoneId || '',
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
        // Clear error when user types
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.zoneName.trim()) newErrors.zoneName = 'Zone name is required';
        if (!formData.zoneId.trim()) newErrors.zoneId = 'Zone ID is required';
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
                <div className="float-container relative">
                    <input
                        type="text"
                        id="zoneName"
                        name="zoneName"
                        value={formData.zoneName}
                        onChange={handleChange}
                        className={`float-input w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${errors.zoneName ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'} text-black`}
                        required
                    />
                    <label htmlFor="zoneName" className="float-label">Zone Name</label>
                    {errors.zoneName && <p className="text-red-500 text-xs mt-1">{errors.zoneName}</p>}
                </div>

                <div className="float-container relative">
                    <input
                        type="text"
                        id="zoneId"
                        name="zoneId"
                        value={formData.zoneId}
                        onChange={handleChange}
                        className={`float-input w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${errors.zoneId ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'} text-black`}
                        required
                    />
                    <label htmlFor="zoneId" className="float-label">Zone ID</label>
                    {errors.zoneId && <p className="text-red-500 text-xs mt-1">{errors.zoneId}</p>}
                </div>

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
                <div className='text-sm text-gray-600 flex justify-between'>
                    <span className='flex justify-center items-center gap-2'><MdBrowserUpdated/> {data.created}</span>
                    <span className='flex justify-center items-center gap-2'><MdUpdate /> {data.lastUpdated}</span>
                </div>

                <div className="flex justify-end gap-3 ">
                   
                    <button
                        type="submit"
                        className="px-4 py-2 cursor-pointer bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                    >
                        Save Changes
                    </button>
                </div>
            </form>
        </div>
    );
}

export default EditZonal;