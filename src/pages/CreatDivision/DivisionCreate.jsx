import React, { useState, useEffect } from 'react';
import axiosInstance from '../../auth/axiosInstance';
import { useAuth } from '../../auth/AuthContext';
import Swal from 'sweetalert2';

function DivisionCreate({onClose, refresh}) {
  const { stateList } = useAuth();
  const [loading,setLoading] = useState(false);
  const [formData, setFormData] = useState({
    zoneName: '',
    zoneCode: '',
    area: '',
    populationInMillion: 0,
    noOfDistricts: 0,
    stateId: ''
  });

  useEffect(() => {
    if (stateList && stateList.length > 0) {
      setFormData(prev => ({
        ...prev,
        stateId: stateList[0].id
      }));
    }
  }, [stateList]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: name.includes('population') || name.includes('Districts')
        ? parseFloat(value) || 0
        : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true)
    try {
      const response = await axiosInstance.post('/head_admin/createNewDivision', formData);
      Swal.fire({
        icon: 'success',
        title: 'success',
        text: 'Division created successfully'
      });
      onClose();
      refresh();

    } catch (error) {
      console.error('Error creating division:', error);
    } finally{
        setLoading(false)
    }
  };

  return (
    <div className="p-6">
      <form onSubmit={handleSubmit} className="space-y-10">
        {/* Zone Name */}
        <div className="relative">
          <input
            type="text"
            id="zoneName"
            name="zoneName"
            value={formData.zoneName}
            onChange={handleChange}
            className="float-input"
            placeholder=" "
            required
          />
          <label htmlFor="zoneName" className="float-label">
            Zone Name
          </label>
        </div>

        {/* Zone Code */}
        <div className="relative">
          <input
            type="text"
            id="zoneCode"
            name="zoneCode"
            value={formData.zoneCode}
            onChange={handleChange}
            className="float-input"
            placeholder=" "
            required
          />
          <label htmlFor="zoneCode" className="float-label">
            Zone Code
          </label>
        </div>

        {/* Area */}
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

        {/* Population */}
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

        {/* Districts */}
        <div className="relative">
          <input
            type="number"
            id="noOfDistricts"
            name="noOfDistricts"
            value={formData.noOfDistricts}
            onChange={handleChange}
            min="0"
            className="float-input"
            placeholder=" "
            required
          />
          <label htmlFor="noOfDistricts" className="float-label">
            Number of Districts
          </label>
        </div>

        {/* Buttons */}
        <div className="flex justify-end space-x-4 pt-6">
          <button type="submit" className="submit-btn">
            {loading ? 'Creating...' : 'Create Division'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default DivisionCreate;
