import React, { useState, useEffect } from 'react';
import axiosInstance from '../../auth/axiosInstance';
import { useAuth } from '../../auth/AuthContext';
import Swal from 'sweetalert2';

function DivisionCreate({ onClose, refresh }) {
  const { stateList } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    zoneName: '',
    zoneCode: '',
    area: '',
    populationInMillion: '',
    noOfDistricts: '',
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
      [name]: value
    }));
  };

  // 🔍 Validation before submission
  const validateForm = () => {
    const nameRegex = /^[A-Za-z\s]+$/;
    const codeRegex = /^[A-Za-z0-9]{1,10}$/;
    const numberRegex = /^[0-9]+(\.[0-9]+)?$/;
    const intRegex = /^[0-9]+$/;

    if (!nameRegex.test(formData.zoneName)) {
      Swal.fire('Invalid Zone Name', 'Only letters and spaces are allowed.', 'error');
      return false;
    }

    if (!codeRegex.test(formData.zoneCode)) {
      Swal.fire('Invalid Zone Code', 'Alphanumeric only, max 10 characters, no spaces.', 'error');
      return false;
    }

    if (!numberRegex.test(formData.area) || parseFloat(formData.area) <= 0) {
      Swal.fire('Invalid Area', 'Enter a valid positive number for area.', 'error');
      return false;
    }

    if (!numberRegex.test(formData.populationInMillion) || parseFloat(formData.populationInMillion) <= 0) {
      Swal.fire('Invalid Population', 'Enter a valid positive number for population.', 'error');
      return false;
    }

    if (!intRegex.test(formData.noOfDistricts) || parseInt(formData.noOfDistricts) <= 0) {
      Swal.fire('Invalid Districts Count', 'Enter a valid positive integer for number of districts.', 'error');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    // Show loading
    Swal.fire({
      title: 'Please wait...',
      text: 'Creating division...',
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      await axiosInstance.post('/head_admin/createNewDivision', {
        ...formData,
        populationInMillion: parseFloat(formData.populationInMillion),
        noOfDistricts: parseInt(formData.noOfDistricts),
        area: parseFloat(formData.area)
      });

      Swal.close();

      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Division created successfully'
      });

      onClose();
      refresh();

    } catch (error) {
      Swal.close();
      console.error('Error creating division:', error);
      Swal.fire('Error', 'Failed to create division.', 'error');
    } finally {
      setLoading(false);
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
            onInput={(e) => {
              e.target.value = e.target.value.replace(/[^A-Za-z\s]/g, '');
            }}
            maxLength={100}
            className="float-input"
            placeholder=" "
            required
          />
          <label htmlFor="zoneName" className="float-label">Zone Name</label>
        </div>

        {/* Zone Code */}
        <div className="relative">
          <input
            type="text"
            id="zoneCode"
            name="zoneCode"
            value={formData.zoneCode}
            onChange={handleChange}
            onInput={(e) => {
              e.target.value = e.target.value.replace(/[^A-Za-z0-9]/g, '');
            }}
            maxLength={10}
            className="float-input"
            placeholder=" "
            required
          />
          <label htmlFor="zoneCode" className="float-label">Zone Code</label>
        </div>

        {/* Area */}
        <div className="relative">
          <input
            type="text"
            id="area"
            name="area"
            value={formData.area}
            onChange={handleChange}
            onInput={(e) => {
              e.target.value = e.target.value.replace(/[^0-9.]/g, '');
            }}
            className="float-input"
            placeholder=" "
            required
          />
          <label htmlFor="area" className="float-label">Area (in km²)</label>
        </div>

        {/* Population */}
        <div className="relative">
          <input
            type="text"
            id="populationInMillion"
            name="populationInMillion"
            value={formData.populationInMillion}
            onChange={handleChange}
            onInput={(e) => {
              e.target.value = e.target.value.replace(/[^0-9.]/g, '');
            }}
            className="float-input"
            placeholder=" "
            required
          />
          <label htmlFor="populationInMillion" className="float-label">Population (in millions)</label>
        </div>

        {/* Number of Districts */}
        <div className="relative">
          <input
            type="text"
            id="noOfDistricts"
            name="noOfDistricts"
            value={formData.noOfDistricts}
            onChange={handleChange}
            onInput={(e) => {
              e.target.value = e.target.value.replace(/[^0-9]/g, '');
            }}
            className="float-input"
            placeholder=" "
            required
          />
          <label htmlFor="noOfDistricts" className="float-label">Number of Districts</label>
        </div>

        {/* Buttons */}
        <div className="flex justify-end space-x-4 pt-6">
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Creating...' : 'Create Division'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default DivisionCreate;
