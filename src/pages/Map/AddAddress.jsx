import React, { useState, useEffect } from 'react';

function AddAddress({ initialPosition, onClose }) {
  const [address, setAddress] = useState({
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    if (initialPosition) {
      fetchAddressFromCoordinates(initialPosition.lat, initialPosition.lng);
    }
  }, [initialPosition]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAddress(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const fetchAddressFromCoordinates = async (lat, lng) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      );
      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      setAddress({
        street: [data.address.road, data.address.house_number].filter(Boolean).join(' ') || '',
        city: data.address.city || data.address.town || data.address.village || '',
        state: data.address.state || data.address.region || '',
        postalCode: data.address.postcode || '',
        country: data.address.country || ''
      });
    } catch (err) {
      setError('Failed to fetch address details. Please enter manually.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }

    setIsFetchingLocation(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        fetchAddressFromCoordinates(position.coords.latitude, position.coords.longitude);
        setIsFetchingLocation(false);
      },
      (err) => {
        setError('Location access denied. Please enable location services or enter manually.');
        setIsFetchingLocation(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Validate required fields
      if (!address.street || !address.city || !address.country) {
        throw new Error('Please fill in all required fields');
      }

      // Here you would typically send the address data to your backend
      console.log('Address submitted:', address);
      
      setSuccess('Address saved successfully!');
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      setError(err.message || 'Failed to save address');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="px-2 mx-auto  ">    

      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <button
            type="button"
            onClick={fetchCurrentLocation}
            disabled={isFetchingLocation}
            className={`w-full flex items-center justify-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              isFetchingLocation 
                ? 'bg-blue-100 text-blue-600' 
                : 'bg-blue-50 hover:bg-blue-100 text-blue-600'
            }`}
          >
            {isFetchingLocation ? (
              <>
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Detecting your location...</span>
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>Use Current Location</span>
              </>
            )}
          </button>
          <p className="mt-2 text-sm text-gray-500">We'll automatically fill your address details</p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span>{error}</span>
            </div>
          </div>
        )}

        {success && (
          <div className="mb-6 p-3 bg-green-50 border-l-4 border-green-500 text-green-700 rounded">
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>{success}</span>
            </div>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="street">
              Street Address <span className="text-red-500">*</span>
            </label>
            <input
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              type="text"
              id="street"
              name="street"
              value={address.street}
              onChange={handleInputChange}
              placeholder="123 Main St"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="city">
                City <span className="text-red-500">*</span>
              </label>
              <input
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                type="text"
                id="city"
                name="city"
                value={address.city}
                onChange={handleInputChange}
                placeholder="New York"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="state">
                State/Province
              </label>
              <input
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                type="text"
                id="state"
                name="state"
                value={address.state}
                onChange={handleInputChange}
                placeholder="NY"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="postalCode">
                Postal Code
              </label>
              <input
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                type="text"
                id="postalCode"
                name="postalCode"
                value={address.postalCode}
                onChange={handleInputChange}
                placeholder="10001"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="country">
                Country <span className="text-red-500">*</span>
              </label>
              <input
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                type="text"
                id="country"
                name="country"
                value={address.country}
                onChange={handleInputChange}
                placeholder="United States"
                required
              />
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-end space-x-3">
         
          <button
            type="submit"
            disabled={isLoading}
            className={`submit-btn ${
              isLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isLoading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </span>
            ) : 'Save Address'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddAddress;