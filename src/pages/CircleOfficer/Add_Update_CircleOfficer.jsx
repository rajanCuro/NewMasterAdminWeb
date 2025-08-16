import React, { useState, useEffect } from 'react';

function AddUpdate_CircleOfficer({ Editdata }) {
  const [formData, setFormData] = useState({
    circle_name: '',
    email: '',
    phone: '',
    role: ''
  });

  // Initialize form with Editdata when component mounts or Editdata changes
  useEffect(() => {
    if (Editdata) {
      setFormData({
        circle_name: Editdata.circleName || '',
        email: Editdata.email || '',
        phone: Editdata.phone || '',
        role: Editdata.role || ''
      });
    }
  }, [Editdata]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUpdate = () => {
    // Here you would typically make an API call to update the officer
    console.log('Updating officer with data:', formData);
    alert(`Updating Circle Officer: ${Editdata.id}`);
  };

  const AddCircleOfficier = () => {
    // Here you would typically make an API call to add a new officer
    console.log('Adding new officer with data:', formData);
    alert('Adding new Circle Officer');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (Editdata) {
      handleUpdate();
    } else {
      AddCircleOfficier();
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
            disabled={!!Editdata} // Disable if in edit mode
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

        <div className='flex mt-6'>
          <button type="submit" className='submit-btn w-full'>
            {Editdata ? "Update" : "Add"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddUpdate_CircleOfficer;