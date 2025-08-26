import React, { useState } from 'react';
import axiosInstance from '../../auth/axiosInstance';
import Swal from 'sweetalert2';

function AddVehicle({id}) {
  const [formData, setFormData] = useState({
    type: '',
    number: '',
    model: '',
    color: '',
    assignedDate: '',
    fieldExecutiveId: id || ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async() => {
    e.preventDefault();
    try {
        const  response = await axiosInstance.post('/city-admin/addNewVehicleToFiledExecutive',formData);
        Swal.fire({
            icon: 'success',
            title: 'success',
            text: 'Vehicale add successfully'
        })
    } catch (error) {
     console.log('error',error)   
    }
  };

  return (
    <div className="">
      <div className="">      
        <form onSubmit={handleSubmit} className="">
          <div className="relative mt-4">
            <input
              type="text"
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="float-input"
              required
              placeholder=" "
            />
            <label htmlFor="type" className="float-label">Vehicle Type</label>
          </div>
          <div className="relative mt-6">
            <input
              type="text"
              id="number"
              name="number"
              value={formData.number}
              onChange={handleChange}
              className="float-input"
              required
              placeholder=" "
            />
            <label htmlFor="number" className="float-label">Vehicle Number</label>
          </div>
          <div className="relative mt-6">
            <input
              type="text"
              id="model"
              name="model"
              value={formData.model}
              onChange={handleChange}
              className="float-input"
              placeholder=" "
            />
            <label htmlFor="model" className="float-label">Model</label>
          </div>
          <div className="relative mt-6">
            <input
              type="text"
              id="color"
              name="color"
              value={formData.color}
              onChange={handleChange}
              className="float-input"
              placeholder=" "
            />
            <label htmlFor="color" className="float-label">Color</label>
          </div>
          <div className="relative mt-6">
            <input
              type="date"
              id="assignedDate"
              name="assignedDate"
              value={formData.assignedDate}
              onChange={handleChange}
              className="float-input"
              placeholder=" "
            />
            <label htmlFor="assignedDate" className="float-label">Assigned Date</label>
          </div>
          <div className="mt-8">
            <button
              type="submit"
              className='submit-btn'
              >
              Add Vehicle
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddVehicle;