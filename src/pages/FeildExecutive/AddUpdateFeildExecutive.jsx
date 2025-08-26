import React, { useState, useEffect } from 'react';
import axiosInstance from '../../auth/axiosInstance';
import Swal from 'sweetalert2';
import { useAuth } from '../../auth/AuthContext';

function AddUpdateAgent({ editData,onClose,onSave }) {
  const { user } = useAuth();
  const id = user.city.id;

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    email: '',
    password: '',
    dlno: '',
    adhar: ''
  });

  const [loading, setLoading] = useState(false);
  const [pincodeByCity, setPincodeByCity] = useState([]);
  const [selectedPincodeIds, setSelectedPincodeIds] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  // Populate form when editing
  useEffect(() => {
    if (editData) {
      const pinCodeIds = Array.isArray(editData.pinCodeIds) ? editData.pinCodeIds : [editData.pinCodeIds] || [];
      setFormData({
        firstName: editData.firstName || '',
        lastName: editData.lastName || '',
        phoneNumber: editData.phoneNumber || '',
        email: editData.email || '',
        password: editData.password || '',
        dlno: editData.dlno || '',
        adhar: editData.adhar || ''
      });
      setSelectedPincodeIds(pinCodeIds);
    }
  }, [editData]);

  // Fetch pincodes
  const getPincodeByCity = async () => {
    try {
      const response = await axiosInstance.get(`/city-admin/getAllPincodesByCity?cityId=${id}`);
      const dtoList = response.data.dtoList;

      if (Array.isArray(dtoList)) {
        setPincodeByCity(dtoList);
      } 
      

    } catch (error) {
      console.error('Error fetching pincodes:', error);
      setPincodeByCity([]);
    }
  };

  useEffect(() => {
    getPincodeByCity();
  }, []);

  // Input change
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [id]: value
    }));
  };

  // Pincode selection
  const togglePincodeSelection = (pincodeId) => {
    let updatedPincodeIds;
    
    if (selectedPincodeIds.includes(pincodeId)) {
      updatedPincodeIds = selectedPincodeIds.filter(id => id !== pincodeId);
    } else {
      updatedPincodeIds = [...selectedPincodeIds, pincodeId];
    }
    
    setSelectedPincodeIds(updatedPincodeIds);
  };

  // Select all pincodes
  const selectAllPincodes = () => {
    const allPincodeIds = filteredPincodes.map(pin => pin.id);
    setSelectedPincodeIds(allPincodeIds);
  };

  // Clear all pincodes
  const clearAllPincodes = () => {
    setSelectedPincodeIds([]);
  };

  // Filter pincodes based on search term
  const filteredPincodes = pincodeByCity.filter(pin => 
    pin.pinCode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get pincode value by ID for display
  const getPincodeValueById = (id) => {
    const pincode = pincodeByCity.find(pin => pin.id === id);
    return pincode ? pincode.pinCode : '';
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (selectedPincodeIds.length === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Pincode Required',
        text: 'Please select at least one pincode',
      });
      return;
    }
    
    setLoading(true);

    try {
      const payload = {
        ...formData,
        pinCodeIds: selectedPincodeIds
      };

      const response = await axiosInstance.post('/city-admin/createNewFieldExecutive', payload);

      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Agent added successfully',
      });
onClose();
onSave();
      if (!editData) {
        setFormData({
          firstName: '',
          lastName: '',
          phoneNumber: '',
          email: '',
          password: '',
          dlno: '',
          adhar: ''
        });
        setSelectedPincodeIds([]);
      }
    } catch (error) {
      console.error('Error adding agent:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.message || 'Failed to add agent',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* First Name */}
          <div className="float-container">
            <input
              type="text"
              id="firstName"
              placeholder=" "
              className="float-input"
              required
              value={formData.firstName}
              onChange={handleChange}
            />
            <label htmlFor="firstName" className="float-label">First Name</label>
          </div>

          {/* Last Name */}
          <div className="float-container">
            <input
              type="text"
              id="lastName"
              placeholder=" "
              className="float-input"
              required
              value={formData.lastName}
              onChange={handleChange}
            />
            <label htmlFor="lastName" className="float-label">Last Name</label>
          </div>

          {/* Email */}
          <div className="float-container">
            <input
              type="email"
              id="email"
              placeholder=" "
              className="float-input"
              required
              value={formData.email}
              onChange={handleChange}
            />
            <label htmlFor="email" className="float-label">Email Address</label>
          </div>

          {/* Phone Number */}
          <div className="float-container">
            <input
              type="text"
              id="phoneNumber"
              placeholder=" "
              className="float-input"
              required
              value={formData.phoneNumber}
              onChange={handleChange}
            />
            <label htmlFor="phoneNumber" className="float-label">Phone Number</label>
          </div>

          {/* Password */}
          <div className="float-container">
            <input
              type="password"
              id="password"
              placeholder=" "
              className="float-input"
              required
              value={formData.password}
              onChange={handleChange}
            />
            <label htmlFor="password" className="float-label">Password</label>
          </div>

          {/* DL Number */}
          <div className="float-container">
            <input
              type="text"
              id="dlno"
              placeholder=" "
              className="float-input"
              value={formData.dlno}
              onChange={handleChange}
            />
            <label htmlFor="dlno" className="float-label">DL Number (Optional)</label>
          </div>

          {/* Aadhar */}
          <div className="float-container md:col-span-2">
            <input
              type="text"
              id="adhar"
              placeholder=" "
              className="float-input"
              value={formData.adhar}
              onChange={handleChange}
            />
            <label htmlFor="adhar" className="float-label">Aadhar Number (Optional)</label>
          </div>

          {/* Pincode Selection - Full width */}
          <div className="md:col-span-2">
            <div className="mb-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Pincode(s) <span className="text-red-500">*</span>
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                <button 
                  type="button"
                  onClick={selectAllPincodes}
                  className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200"
                >
                  Select All
                </button>
                <button 
                  type="button"
                  onClick={clearAllPincodes}
                  className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                >
                  Clear All
                </button>
                <span className="text-sm text-gray-500 ml-auto">
                  {selectedPincodeIds.length} pincode(s) selected
                </span>
              </div>
              
              {/* Custom select dropdown */}
              <div className="relative">
                <div 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white cursor-pointer flex items-center justify-between"
                  onClick={() => setShowDropdown(!showDropdown)}
                >
                  <span className="text-gray-500">Select pincodes</span>
                  <svg 
                    className={`w-4 h-4 transition-transform ${showDropdown ? 'rotate-180' : ''}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24" 
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </div>
                
                {showDropdown && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                    {/* Search input inside dropdown */}
                    <div className="sticky top-0 bg-white p-2 border-b">
                      <input
                        type="text"
                        placeholder="Search pincodes..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                    
                    {/* Pincode options */}
                    <div className="p-2">
                      {filteredPincodes.length > 0 ? (
                        filteredPincodes.map((pin) => (
                          <div
                            key={pin.id}
                            className={`p-2 rounded-md cursor-pointer flex items-center ${
                              selectedPincodeIds.includes(pin.id)
                                ? 'bg-blue-100 text-blue-700'
                                : 'hover:bg-gray-100'
                            }`}
                            onClick={() => togglePincodeSelection(pin.id)}
                          >
                            <input
                              type="checkbox"
                              checked={selectedPincodeIds.includes(pin.id)}
                              onChange={() => {}}
                              className="mr-2"
                            />
                            {pin.pinCode}
                          </div>
                        ))
                      ) : (
                        <div className="text-center text-gray-500 py-4">
                          {pincodeByCity.length === 0 ? 'No pincodes available' : 'No pincodes match your search'}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Selected pincodes preview */}
            {selectedPincodeIds.length > 0 && (
              <div className="mt-3">
                <p className="text-sm font-medium text-gray-700 mb-1">Selected Pincodes:</p>
                <div className="flex flex-wrap gap-2">
                  {selectedPincodeIds.map((pincodeId) => (
                    <span 
                      key={pincodeId}
                      className="px-2 py-1 bg-blue-100 text-blue-700 rounded-md text-sm flex items-center"
                    >
                      {getPincodeValueById(pincodeId)}
                      <button
                        type="button"
                        onClick={() => togglePincodeSelection(pincodeId)}
                        className="ml-1 text-blue-900 hover:text-red-600"
                      >
                        &times;
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-6">
          <button 
            type="submit" 
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400"
            disabled={loading}
          >
            {loading
              ? (editData ? 'Updating Agent...' : 'Adding Agent...')
              : (editData ? 'Update Agent' : 'Add Agent')}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddUpdateAgent;