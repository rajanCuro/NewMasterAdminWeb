import React, { useState, useEffect } from 'react';
import { useAuth } from '../../auth/AuthContext';
import axiosInstance from '../../auth/axiosInstance';
import Swal from 'sweetalert2';

function AddUpdateDivision({ EditData, onClose }) {
  console.log('EditData:', EditData);
  const { stateList } = useAuth();
  const [selectedState, setSelectedState] = useState('');
  const [divisions, setDivisions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDivisionsLoading, setIsDivisionsLoading] = useState(false);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    mobileNumber: '',
    divisionId: '',
    profilePicture: '',
  });

  // Initialize form with edit data if available
  useEffect(() => {
    if (EditData) {
      setFormData({
        firstName: EditData.firstName || '',
        lastName: EditData.lastName || '',
        email: EditData.email || '',
        mobileNumber: EditData.mobileNumber || '',
        divisionId: EditData.division?.id || '', // Fixed: get division ID from division object
        profilePicture: EditData.profilePicture || '',
      });

      // Set the state if available (you might need to get state from division data)
      if (EditData.division) {
        // You may need to determine the state from the division data
        // This depends on your API structure - you might need to add stateId to division object
        setSelectedState(EditData.division.stateId || '');
        if (EditData.division.stateId) {
          getALLdivisions(EditData.division.stateId);
        }
      }
    }
  }, [EditData]);

  // Fetch divisions
  const getALLdivisions = async (stateId) => {
    setIsDivisionsLoading(true);
    try {
      const res = await axiosInstance.get(`/area/getAllDivisions?stateId=${stateId}`);
      console.log("Divisions payload:", res.data);
      const divisionsData = res.data.divisionList;
      if (Array.isArray(divisionsData)) {
        setDivisions(divisionsData);
      } else if (divisionsData) {
        setDivisions([divisionsData]);
      } else {
        setDivisions([]);
      }
    } catch (error) {
      console.error("Error fetching divisions:", error);
      setDivisions([]);
      Swal.fire("Error", "Failed to load divisions. Please try again.", "error");
    } finally {
      setIsDivisionsLoading(false);
    }
  };

  // Handle input changes
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  // Handle state change -> load divisions
  const handleStateChange = (e) => {
    const stateId = e.target.value;
    setSelectedState(stateId);
    setFormData((prev) => ({ ...prev, divisionId: '' })); // Reset division when state changes

    if (stateId) {
      getALLdivisions(stateId);
    } else {
      setDivisions([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Basic validation
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.mobileNumber || !selectedState || !formData.divisionId) {
      Swal.fire("Validation Error", "Please fill all required fields", "warning");
      setIsLoading(false);
      return;
    }

    if (!/^\d{10}$/.test(formData.mobileNumber)) {
      Swal.fire("Validation Error", "Please enter a valid 10-digit phone number", "warning");
      setIsLoading(false);
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      Swal.fire("Validation Error", "Please enter a valid email address", "warning");
      setIsLoading(false);
      return;
    }

    // Build payload
    const payload = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      mobileNumber: formData.mobileNumber,
      divisionId: formData.divisionId,
      profilePicture: formData.profilePicture,
    };

    try {
      if (EditData) {
        const res = await axiosInstance.put(
          `/head_admin/updateDivisionAdmin/${EditData.id}`,
          payload
        );
        console.log("Update response:", res.data);
        Swal.fire("Success", "Division Admin updated successfully!", "success");
        onClose();
      } else {
        const res = await axiosInstance.post(
          `/head_admin/createNewDivisionAdmin`,
          payload
        );
        console.log("Create response:", res.data);
        Swal.fire("Success", "Division Admin created successfully!", "success");
        onClose();
      }
    } catch (error) {
      console.error("Error:", error);
      const errorMessage = error.response?.data?.message || "An error occurred. Please try again.";
      Swal.fire("Error", errorMessage, "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="w-full">
        <form onSubmit={handleSubmit} className="p-6 space-y-1 max-h-[80vh] overflow-y-auto">
          {/* State + Division Select */}
          <div className="flex gap-4">
            {/* State */}
            <div className='w-full'>
              <label htmlFor="state" className="block mb-2 font-medium text-gray-700">
                Select State <span className="text-red-500">*</span>
              </label>
              <select
                id="state"
                value={selectedState}
                onChange={handleStateChange}
                className="w-full px-3 py-2  border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">-- Select State --</option>
                {stateList.map((state) => (
                  <option key={state.id} value={state.id}>
                    {state.stateName}
                  </option>
                ))}
              </select>
            </div>

            {/* Division */}
            <div className='w-full'>
              <label htmlFor="divisionId" className="block mb-2 font-medium text-gray-700">
                Select Division <span className="text-red-500">*</span>
              </label>
              <select
                id="divisionId"
                value={formData.divisionId}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                disabled={!selectedState || isDivisionsLoading}
                required
              >
                <option value="">-- Select Division --</option>
                {isDivisionsLoading ? (
                  <option value="" disabled>Loading divisions...</option>
                ) : divisions.length === 0 ? (
                  <option value="" disabled>No divisions available</option>
                ) : (
                  divisions.map((div) => (
                    <option key={div.id} value={div.id}>
                      {div.zoneName}
                    </option>
                  ))
                )}
              </select>
            </div>
          </div>

          {/* First + Last Name */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">           
            <div className='float-container'>
              <input
                type="text"
                id="firstName"
                className="float-input"
                required
                value={formData.firstName}
                onChange={handleChange}
                placeholder=""
              />
              <label htmlFor="firstName" className="float-label">
                First Name <span className="text-red-500">*</span>
              </label>
            </div>

            <div className='float-container'>
              <input
                type="text"
                id="lastName"
                className="float-input"
                required
                value={formData.lastName}
                onChange={handleChange}
                placeholder=""
              />
              <label htmlFor="lastName" className="float-label">
                Last Name <span className="text-red-500">*</span>
              </label>
            </div>
          </div>

          {/* Phone + Email */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className='float-container'>
              <input
                type="tel"
                id="mobileNumber"
                className="float-input"
                required
                value={formData.mobileNumber}
                onChange={handleChange}
                maxLength="10"
                pattern="[0-9]{10}"
                placeholder=""
              />
              <label htmlFor="mobileNumber" className="float-label">
                Phone Number <span className="text-red-500">*</span>
              </label>
            </div>

            <div className='float-container'>
              <input
                type="email"
                id="email"
                className="float-input"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder=""
              />
              <label htmlFor="email" className="float-label">
                Email Address <span className="text-red-500">*</span>
              </label>
            </div>
          </div>

          {/* Profile Picture */}
          <div className='float-container'>
            <input
              type="text"
              id="profilePicture"
              className="float-input"
              value={formData.profilePicture}
              onChange={handleChange}
              placeholder=""
            />
            <label htmlFor="profilePicture" className="float-label">
              Profile Picture URL
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className={`px-5 py-2 rounded-lg transition-colors font-medium cursor-pointer ${isLoading
                ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
            >
              {isLoading ? "Processing..." : EditData ? "Update Division" : "Add Division"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export default AddUpdateDivision;