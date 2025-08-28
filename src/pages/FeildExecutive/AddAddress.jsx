import React, { useEffect, useState } from 'react';
import axiosInstance from '../../auth/axiosInstance';
import Swal from 'sweetalert2';
import { useAuth } from '../../auth/AuthContext';

const AddAddress = ({onClose}) => {
    const {latitude,longitude, user} = useAuth();

      const [formData, setFormData] = useState({
        houseNumber: '',
        street: '',
        city: '',
        state: '',
        postalCode: '',
        country: '',
        phoneNumber: '',
        longitude: 0,
        latitude: 0,
        addressType: 'HOME',
    });

     useEffect(() => {
        if (latitude && longitude) {
            setFormData(prev => ({
                ...prev,
                latitude: latitude,
                longitude: longitude
            }));
        }
    }, [latitude, longitude]);

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
            const requestData = {
                ...formData,
                user: {
                    id: user?.id || 0
                }
            };
            
            const response = await axiosInstance.post('/address/addHomeAddress', requestData);
            
            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'Address added successfully'
            });
            onClose();
            
        } catch (error) {
            console.log('Error adding address:', error);
                Swal.fire({
                icon: 'error',
                title: 'Error',
                text: errorMessage
            });
        } 
    };

  return (
      <div className="p-4">
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* House Number */}
            <div className="md:col-span-1">
              <label htmlFor="houseNumber" className="block text-sm font-medium text-gray-700 mb-1">
                House/Apartment Number
              </label>
              <input
                type="text"
                id="houseNumber"
                name="houseNumber"
                value={formData.houseNumber}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            
            {/* Street */}
            <div className="md:col-span-1">
              <label htmlFor="street" className="block text-sm font-medium text-gray-700 mb-1">
                Street
              </label>
              <input
                type="text"
                id="street"
                name="street"
                value={formData.street}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            
            {/* City */}
            <div className="md:col-span-1">
              <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                City
              </label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            
            {/* State */}
            <div className="md:col-span-1">
              <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                State/Province
              </label>
              <input
                type="text"
                id="state"
                name="state"
                value={formData.state}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            
            {/* Postal Code */}
            <div className="md:col-span-1">
              <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-1">
                Postal Code
              </label>
              <input
                type="text"
                id="postalCode"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            
            {/* Country */}
            <div className="md:col-span-1">
              <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                Country
              </label>
              <input
                type="text"
                id="country"
                name="country"
                value={formData.country}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            
            {/* Phone Number */}
            <div className="md:col-span-1">
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
       
            {/* Address Type */}
            <div className="md:col-span-1">
              <label htmlFor="addressType" className="block text-sm font-medium text-gray-700 mb-1">
                Address Type
              </label>
              <select
                id="addressType"
                name="addressType"
                value={formData.addressType}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="HOME">Home</option>
                <option value="WORK">Work</option>
                <option value="OTHER">Other</option>
              </select>
            </div>
          </div>
          
          {/* Submit Button */}
          <div className="flex justify-center mt-8">
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              Save Address
            </button>
          </div>
        </form>
      </div>
  );
};

export default AddAddress;