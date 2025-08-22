import React, { useState, useEffect } from 'react';

function AddUpdate_CircleOfficer({ Editdata }) {
  const [formData, setFormData] = useState({
    cityId: '', // keeping in state but no input field
    email: '',
    mobileNumber: '',
    profilePicture: '',
    firstName: '',
    lastName: ''
  });

  // Initialize form with Editdata
  useEffect(() => {
    if (Editdata) {
      setFormData({
        cityId: Editdata.cityId || '',
        email: Editdata.email || '',
        mobileNumber: Editdata.mobileNumber || '',
        profilePicture: Editdata.profilePicture || '',
        firstName: Editdata.firstName || '',
        lastName: Editdata.lastName || ''
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
    console.log('Updating Officer with data:', formData);
    alert(`Updating Officer ID: ${Editdata.id}`);
  };

  const handleAdd = () => {
    console.log('Adding new Officer with data:', formData);
    alert('Adding new Officer');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (Editdata) {
      handleUpdate();
    } else {
      handleAdd();
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        
        {/* First + Last Name in one row */}
        <div className="flex gap-4">
          <div className="float-container flex-1">
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder=" "
              className="float-input text-black"
              required
            />
            <label htmlFor="firstName" className="float-label">First Name</label>
          </div>

          <div className="float-container flex-1">
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder=" "
              className="float-input text-black"
              required
            />
            <label htmlFor="lastName" className="float-label">Last Name</label>
          </div>
        </div>

        {/* Email + Mobile Number in one row */}
        <div className="flex gap-4 mt-4">
          <div className="float-container flex-1">
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

          <div className="float-container flex-1">
            <input
              type="tel"
              id="mobileNumber"
              name="mobileNumber"
              value={formData.mobileNumber}
              onChange={handleChange}
              placeholder=" "
              className="float-input text-black"
              required
            />
            <label htmlFor="mobileNumber" className="float-label">Mobile Number</label>
          </div>
        </div>

        {/* Profile Picture */}
        <div className="float-container mt-4">
          <input
            type="text"
            id="profilePicture"
            name="profilePicture"
            value={formData.profilePicture}
            onChange={handleChange}
            placeholder=" "
            className="float-input text-black"
          />
          <label htmlFor="profilePicture" className="float-label">Profile Picture (URL)</label>
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
