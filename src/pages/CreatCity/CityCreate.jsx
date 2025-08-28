import React, { useState } from 'react';
import axiosInstance from '../../auth/axiosInstance';
import { useAuth } from '../../auth/AuthContext';
import Swal from 'sweetalert2';

function CityCreate({ onClose, refresh }) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    cityName: '',
    area: '',
    populationInMillion: 0,
    divisionId: user?.division?.id || ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true)
    try {
      const response = await axiosInstance.post('/head_admin/createNewCity', formData);
      Swal.fire({
        icon: 'success',
        title: 'success',
        text: response.data.message || 'City created successfully!'
      });
      onClose();
      refresh();

    } catch (error) {
      console.error('Error creating city:', error);
      Swal.fire({
        icon: 'success',
        title: 'success',
        text: response.data.error || ''
      });
    } finally {
      setLoading(false)
    }
  };

  return (
    <div className="p-6">
      <form onSubmit={handleSubmit} className="space-y-10">
        <div className="relative">
          <input
            type="text"
            id="cityName"
            name="cityName"
            value={formData.cityName}
            onChange={handleChange}
            className="float-input"
            placeholder=" "
            required
          />
          <label htmlFor="cityName" className="float-label">
            Zone Name
          </label>
        </div>
        <div className="relative">
          <input
            type="text"
            id="area"
            name="area"
            value={formData.area}
            onChange={handleChange}
            className="float-input"
            placeholder=" "
            required
          />
          <label htmlFor="area" className="float-label">
            Area
          </label>
        </div>
        <div className="relative">
          <input
            type="number"
            id="populationInMillion"
            name="populationInMillion"
            value={formData.populationInMillion}
            onChange={handleChange}
            min="0"
            step="0.1"
            className="float-input"
            placeholder=" "
            required
          />
          <label htmlFor="populationInMillion" className="float-label">
            Population (in millions)
          </label>
        </div>
        <div className="flex justify-end space-x-4 pt-6">
          <button type="submit" className="submit-btn">
            {loading ? 'Creating...' : 'Create City'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CityCreate;
