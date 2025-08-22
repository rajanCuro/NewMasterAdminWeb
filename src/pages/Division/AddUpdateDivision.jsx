import React, { useState, useEffect } from 'react';

function AddUpdateDivision({ EditData, onClose }) {
  console.log('EditData:', EditData);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: ''
  });

  // Initialize form with edit data if available
  useEffect(() => {
    if (EditData) {
      setFormData({
        name: EditData.zoneName || '',
        email: EditData.email || '',
        phone: EditData.phone || '',
        role: EditData.role || ''
      });
    } else {
      setFormData({
        name: '',
        email: '',
        phone: '',
        role: ''
      });
    }
  }, [EditData]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name || !formData.email || !formData.phone || !formData.role) {
      alert('Please fill all required fields');
      return;
    }

    // Phone number validation
    if (!/^\d{10}$/.test(formData.phone)) {
      alert('Please enter a valid 10-digit phone number');
      return;
    }

    // Email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      alert('Please enter a valid email address');
      return;
    }

    try {
      if (EditData) {
        // Call API to update zonal head
        const response = await updateZonalHeadAPI(EditData.id, formData);
        if (response.success) {
          alert('Zonal head updated successfully!');
          onClose();
        } else {
          alert('Failed to update zonal head');
        }
      } else {
        // Call API to add new zonal head
        const response = await addZonalHeadAPI(formData);
        if (response.success) {
          alert('Zonal head added successfully!');
          onClose();
        } else {
          alert('Failed to add zonal head');
        }
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred. Please try again.');
    }
  };

  // Mock API functions (replace with actual API calls)
  const addZonalHeadAPI = async (data) => {
    console.log('Adding zonal head:', data);
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { success: true, data };
  };

  const updateZonalHeadAPI = async (id, data) => {
    console.log(`Updating zonal head ${id}:`, data);
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { success: true, data };
  };

  return (
    <div className="p-4">
      <form onSubmit={handleSubmit}>
        {/* Name Field */}
        <div className="float-container mb-4">
          <input
            type="text"
            id="name"
            placeholder=" "
            className="float-input w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            value={formData.name}
            onChange={handleChange}
          />
          <label htmlFor="name" className="float-label">Zone Name</label>
        </div>

        {/* Email Field */}
        <div className="float-container mb-4">
          <input
            type="email"
            id="email"
            placeholder=" "
            className="float-input w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            value={formData.email}
            onChange={handleChange}
          />
          <label htmlFor="email" className="float-label">Email Address</label>
        </div>

        {/* Phone Field */}
        <div className="float-container mb-4">
          <input
            type="tel"
            id="phone"
            placeholder=" "
            className="float-input w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            value={formData.phone}
            onChange={handleChange}
            maxLength="10"
            pattern="[0-9]{10}"
          />
          <label htmlFor="phone" className="float-label">Phone Number (10 digits)</label>
        </div>

        {/* Role Field */}
        <div className="float-container mb-6">
          <select
            id="role"
            className="float-input w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            value={formData.role}
            onChange={handleChange}
          >
            <option value="" disabled>Select a role</option>
            <option value="zonal_head">Zonal Head</option>
            <option value="admin">Admin</option>
            <option value="manager">Manager</option>
          </select>
          <label htmlFor="role" className="float-label">Role</label>
        </div>

        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            {EditData ? 'Update' : 'Add'} Zonal Head
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddUpdateDivision;