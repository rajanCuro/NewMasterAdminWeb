import React, { useEffect, useState } from 'react';
import axiosInstance from '../../auth/axiosInstance';
import Swal from 'sweetalert2';
import { useAuth } from '../../auth/AuthContext';

function AddVehicle({ id, onClose, editeVehicleData }) {
  const [loading, setLoading] = useState(false);
  const { submittedData, setSubmittedData } = useAuth()
  const [formData, setFormData] = useState({
    type: '',
    number: '',
    model: '',
    color: '',
    assignedDate: '',
    fieldExecutiveId: id || ''
  });

  useEffect(() => {
    setFormData({
      type: editeVehicleData?.type || '',
      number: editeVehicleData?.vehicleNumber || '',
      model: editeVehicleData?.model || '',
      color: editeVehicleData?.color || '',
      assignedDate: editeVehicleData?.assignedDate || '',
      fieldExecutiveId: id || ''
    })
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axiosInstance.post('/city-admin/addNewVehicleToFiledExecutive', formData);
      Swal.fire({
        icon: 'success',
        title: 'success',
        text: 'Vehicale add successfully'
      })
      onClose();
      setSubmittedData(formData)
    } catch (error) {
      console.log('error', error)
    } finally {
      setLoading(false);
    }
  };

  return (
    <>

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
            onChange={(e) => {
              let raw = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
              let formatted = '';

              if (raw.length <= 2) {
                formatted = raw;
              } else if (raw.length <= 4) {
                formatted = `${raw.slice(0, 2)}-${raw.slice(2)}`;
              } else if (raw.length <= 6) {
                formatted = `${raw.slice(0, 2)}-${raw.slice(2, 4)} ${raw.slice(4)}`;
              } else if (raw.length <= 8) {
                formatted = `${raw.slice(0, 2)}-${raw.slice(2, 4)} ${raw.slice(4, 6)}-${raw.slice(6)}`;
              } else {
                formatted = `${raw.slice(0, 2)}-${raw.slice(2, 4)} ${raw.slice(4, 6)}-${raw.slice(6, 10)}`;
              }

              handleChange({
                target: {
                  name: 'number',
                  value: formatted,
                },
              });
            }}
            className="float-input uppercase"
            required
            placeholder=" "
            maxLength={14} // Max length to fit format: UP-65 FM-6848
          />
          <label htmlFor="number" className="float-label">Vehicle Number</label>

        </div>

        <div className="relative mt-6">
          <input
            type="text"
            id="model"
            name="model"
            value={formData.model}
            onChange={(e) => {
              // Allow only digits and limit to 4 characters
              const value = e.target.value.replace(/\D/g, '').slice(0, 4);
              handleChange({
                target: {
                  name: 'model',
                  value,
                },
              });
            }}
            className="float-input"
            placeholder=" "
            required
            maxLength={4}
          />
          <label htmlFor="model" className="float-label">Model</label>
        </div>

        <div className="relative mt-6">
          <input
            type="text"
            id="color"
            name="color"
            value={formData.color}
            onChange={(e) => {
              // Allow only letters and spaces
              const value = e.target.value.replace(/[^a-zA-Z\s]/g, '');
              handleChange({
                target: {
                  name: 'color',
                  value,
                },
              });
            }}
            className="float-input"
            placeholder=" "
            required
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
            {loading ? (editeVehicleData ? 'Updating...' : 'Adding...') : (editeVehicleData ? 'Update Vehicle' : 'Add Vehicle')}
          </button>
        </div>
      </form>
    </>
  );
}

export default AddVehicle;