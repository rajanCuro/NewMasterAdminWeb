import React, { useState, useEffect } from 'react';
import { useAuth } from '../../auth/AuthContext';
import axiosInstance from '../../auth/axiosInstance';
import Swal from 'sweetalert2';


function AddUpdate_CircleOfficer({ Editdata, onClose, refresh }) {
  const { user } = useAuth();
  // const id = user.division.id;
   console.log('id',user);
  const [formData, setFormData] = useState({
    cityId: '',
    email: '',
    mobileNumber: '',
    profilePicture: '',
    firstName: '',
    lastName: '',
  });
  const [slectedDivision, setSelectedDivision] = useState('');
  const [city, setCity] = useState([]);
  const [isCityLoading, setIsCityLoading] = useState(false);

  // Initialize form with Editdata
  useEffect(() => {
    if (Editdata) {
      setFormData({
        cityId: Editdata.cityId || '',
        email: Editdata.email || '',
        mobileNumber: Editdata.mobileNumber || '',
        profilePicture: Editdata.profilePicture || '',
        firstName: Editdata.firstName || '',
        lastName: Editdata.lastName || '',
        divisionId: Editdata.divisionId || ''
      });

      // If Editdata has a division, set it and load cities
      if (Editdata.divisionId) {
        setSelectedDivision(Editdata.divisionId);
        getAllCity(Editdata.divisionId);
      }
    }
  }, [Editdata]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const getAllCity = async (divisionId) => {
    try {
      setIsCityLoading(true);
      const response = await axiosInstance.get(`/area/getAllCities?divisionId=${divisionId}`);
      const cityList = response?.data?.cityList;
     if (Array.isArray(cityList)) {
        setCity(cityList);
      } else if (cityList) {
        setCity([cityList]);
      } else {
        setCity([]);
      }

    } catch (error) {
      console.log('Error fetching cities:', error);
      setCity([]);
    } finally {
      setIsCityLoading(false);
    }
  };

  const handleDivisionChange = (e) => {
    const divisionId = e.target.value;
    setSelectedDivision(divisionId);
    setFormData(prev => ({ ...prev, divisionId, cityId: '' }));

    if (divisionId) {
      getAllCity(divisionId);
    } else {
      setCity([]);
    }
  };

  const handleCityChange = (e) => {
    const cityId = e.target.value;
    setFormData(prev => ({ ...prev, cityId }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Prepare the data for API call
      const requestData = {
        cityId: parseInt(formData.cityId),
        email: formData.email,
        mobileNumber: formData.mobileNumber,
        profilePicture: formData.profilePicture || "",
        firstName: formData.firstName,
        lastName: formData.lastName
      };

      if (Editdata) {
        console.log('Updating Officer with data:', requestData);
        alert(`Updating Officer ID: ${Editdata.id}`);
      } else {
        const response = await axiosInstance.post('/division_admin/createNewCityAdmin', requestData);
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'City Admin Created Successfully',
        });
        onClose();
        refresh();
        setSelectedDivision('');
        setCity([]);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      Swal.fire({
        icons: 'error',
        title: 'error',
        text: 'error',
      })
    }
  };

  return (
    <div className="">
      <form onSubmit={handleSubmit}>
        {/* First + Last Name in one row */}
        <div className="flex gap-4 mb-4">
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder=" "
                className="float-input"
                required
              />
              <label
                htmlFor="firstName" className="float-label" >
                First Name
              </label>
            </div>
          </div>

          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder=" "
                className="float-input"
                required
              />
              <label
                htmlFor="lastName" className="float-label">
                Last Name
              </label>
            </div>
          </div>
        </div>

        {/* State and Division Selection */}
        <div className="flex gap-4 mb-4">
          {/* State */}
          <div className='w-full'>
            <label htmlFor="state" className="block mb-2 font-medium text-gray-700">
              Select Division <span className="text-red-500">*</span>
            </label>
            <select
              id="state"
              value={slectedDivision}
              onChange={handleDivisionChange}
              className="w-full py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">-- Select Division --</option>

              <option key={user.division.id} value={user.division.id} selected>
                {user.division.zoneName}
              </option>
            </select>
          </div>

          {/* Division */}
          <div className='w-full'>
            <label htmlFor="state" className="block mb-2 font-medium text-gray-700">
              Select City <span className="text-red-500">*</span>
            </label>
            <select
              id="cityId"
              name="cityId"
              value={formData.cityId}
              onChange={handleCityChange}
              className="w-full py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
              disabled={!formData.divisionId || isCityLoading}
              required
            >
              <option value="">-- Select City --</option>
              {isCityLoading ? (
                <option value="" disabled>Loading City...</option>
              ) : city.length === 0 ? (
                <option value="" disabled>No city available</option>
              ) : (
                city?.map((cityItem) => (
                  <option key={cityItem.id} value={cityItem.id}>
                    {cityItem.cityName}
                  </option>
                ))
              )}
            </select>
          </div>
        </div>

        {/* City Selection and Email */}

          <div className="w-full mb-4">
            <div className="relative">
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder=" " className="float-input"
                required
              />
              <label
                htmlFor="email" className="float-label"
              >
                Email
              </label>
            </div>
          </div>

        {/* Mobile Number and Profile Picture */}
        <div className="flex gap-4 mb-4">
          <div className="w-full">
            <div className="relative">
              <input
                type="tel"
                id="mobileNumber"
                name="mobileNumber"
                value={formData.mobileNumber}
                onChange={handleChange}
                placeholder=''
                className="float-input"
                required
              />
              <label
                htmlFor="mobileNumber"
                className="float-label"
              >
                Mobile Number
              </label>
            </div>
          </div>

          <div className="w-full">
            <div className="relative">
              <input
                type="text"
                id="profilePicture"
                name="profilePicture"
                value={formData.profilePicture}
                onChange={handleChange}
                placeholder=''
                className="float-input"
              />
              <label
                htmlFor="profilePicture"
                className="float-label"
              >
                Profile Picture (URL)
              </label>
            </div>
          </div>
        </div>

        <div className='flex mt-6 justify-end'>
          <button
            type="submit"
            className='submit-btn'
          >
            {Editdata ? "Update Officer" : "Add Officer"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddUpdate_CircleOfficer;