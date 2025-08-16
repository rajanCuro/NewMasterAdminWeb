import React, { useState } from 'react';

function AddUpdate_CircleOfficer({ Editdata }) {
  console.log('Editdata: ', Editdata);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUpdate = () => {
    alert('Update Circle Officer');
  }

  const AddCircleOfficier = () => {
    alert('Add Circle Officer');
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (Editdata) {
      handleUpdate()
    } else {
      AddCircleOfficier()
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        {/* Circle Name Field */}
        <div className="float-container">
          <input
            type="text"
            id="circle_name"
            name="circle_name"
            value={formData.circle_name}
            onChange={handleChange}
            placeholder=" "
            className="float-input text-black"
            required
          />
          <label htmlFor="circle_name" className="float-label">Circle Name</label>
        </div>
        {/* Email Field */}
        <div className="float-container mt-4">
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder=" "
            className="float-input text-black"
            required
          />
          <label htmlFor="email" className="float-label">Email</label>
        </div>

        {/* Phone Field */}
        <div className="float-container mt-4">
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder=" "
            className="float-input text-black"
            required
          />
          <label htmlFor="phone" className="float-label">Phone Number</label>
        </div>

        {/* Role Field */}
        <div className="float-container mt-4">
          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="float-input text-black"
            required
          >
            <option value="">Select a role</option>
            <option value="admin">Admin</option>
            <option value="officer">Officer</option>
            <option value="manager">Manager</option>
          </select>
          <label htmlFor="role" className="float-label">Role</label>
        </div>

        <div className='flex  mt-6'>
          <button type="submit" className='submit-btn w-full'>{Editdata ? "Update" : "Add"}</button>
        </div>
      </form>
    </div>
  );
}

export default AddUpdate_CircleOfficer;