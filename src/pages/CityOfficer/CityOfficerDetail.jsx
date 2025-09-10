import React, { useEffect, useState } from 'react';
import { FaUserTie, FaPhone, FaEnvelope, FaMapMarkerAlt, FaCalendarAlt, FaChartLine, FaCheckCircle, FaExclamationTriangle, FaUsers, FaSave, FaTimes } from 'react-icons/fa';
import { MdLocalPharmacy } from "react-icons/md";
import AllPharmacy from '../AllPharmacy';
import AllLabs from '../AllLabs';
import AllAmbulance from '../AllAmbulance';
import AllDoctor from '../AllDoctor';
import axiosInstance from '../../auth/axiosInstance';
import { useAuth } from '../../auth/AuthContext';
import NoDataPage from '../../NodataPage';

const VIewZonal = ({ ViewData: initialData, onSave, onClose }) => {
  console.log('view ', initialData);
  // console.log('data', onSave);
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('details');
  const [errors, setErrors] = useState({});
  const [AllStats, setAllStates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchDataAsync = async () => {
      await fetchData();
    };

    fetchDataAsync();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      const response = await axiosInstance.get(
        `/api/field-executive/getAgentStatistics/${user?.id}`
      );
      setAllStates(response.data);
    } catch (error) {
      setError(true)
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
      setError(true)
    }
  };

  const transformData = (data) => {
    return {
      id: data.id,
      name: `${data.firstName} ${data.lastName}`,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      mobileNumber: data.mobileNumber,
      cityName: data.city?.cityName || 'N/A',
      cityId: data.city?.id || 'N/A',
      status: data.accountNonLocked ? 'Active' : 'Inactive',
      performance: 'Good', // Default value
      agentsCount: 24, // Default value since not in API
      PhCounts: 5, // Default value since not in API
      LbCounts: 10,
      profilePicture: data.profilePicture,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      lastLogin: data.lastLogin,
      joiningDate: data.createdAt?.split('T')[0] || '2023-05-15',
      additionalInfo: `This division admin manages the ${data.division?.zoneName || 'N/A'} region.`,
      // Include all original properties
      ...data
    };

  }
  const [formData, setFormData] = useState(transformData(initialData));
  // Format phone number
  const formatPhoneNumber = (phone) => {
    try {
      return phone.replace(/(\+\d{1,2})(\d{3})(\d{3})(\d{4})/, '$1 ($2) $3-$4');
    } catch {
      return phone;
    }
  };

  // Format date
  const formatDate = (dateString) => {
    try {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    } catch {
      return dateString;
    }
  };

  // Validate form data
  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Valid email is required';
    if (!formData.phone || !/^\+\d{1,2}\d{10}$/.test(formData.phone.replace(/\D/g, ''))) newErrors.phone = 'Valid phone number is required';
    if (!formData.circleName.trim()) newErrors.circleName = 'circle name is required';
    if (!formData.circleId.trim()) newErrors.circleId = 'circle ID is required';
    if (!formData.joiningDate) newErrors.joiningDate = 'Joining date is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  // Handle save
  const handleSave = () => {
    if (validateForm()) {
      onSave(formData);
      setIsEditing(false);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    setFormData(transformData(initialData));
    setErrors({});
    setIsEditing(false);
  };

  // Performance indicator component
  const PerformanceIndicator = ({ performance }) => {
    let bgColor, textColor, icon;
    switch (performance) {
      case 'Excellent':
        bgColor = 'bg-green-100';
        textColor = 'text-green-800';
        icon = <FaChartLine className="text-green-500" />;
        break;
      case 'Good':
        bgColor = 'bg-blue-100';
        textColor = 'text-blue-800';
        icon = <FaChartLine className="text-blue-500" />;
        break;
      case 'Needs Improvement':
        bgColor = 'bg-yellow-100';
        textColor = 'text-yellow-800';
        icon = <FaExclamationTriangle className="text-yellow-500" />;
        break;
      case 'Poor':
        bgColor = 'bg-red-100';
        textColor = 'text-red-800';
        icon = <FaExclamationTriangle className="text-red-500" />;
        break;
      default:
        bgColor = 'bg-gray-100';
        textColor = 'text-gray-800';
        icon = <FaChartLine className="text-gray-500" />;
    }
    return (
      <div className={`flex items-center ${bgColor} ${textColor} px-3 py-1 rounded-full text-sm font-medium animate-pulse-short`}>
        {icon}
        <span className="ml-2">{performance}</span>
      </div>
    );
  };

  if (error) {
    <NoDataPage />
  }

  return (
    <div className=" min-h-[400px]">
      <div className="max-w-7xl mx-auto">
        {/* Profile Card */}
        <div className=" overflow-hidden transition-all duration-300 hover:shadow-xl">
          <div className="flex flex-col lg:flex-row">
            {/* Profile Sidebar */}
            <div className="lg:w-1/3 p-6 bg-gradient-to-br from-indigo-50 to-blue-50 flex flex-col items-center justify-start">
              <div className="w-10 h-10 sm:w-32 sm:h-32 bg-indigo-100 rounded-full flex items-center justify-center mb-4 border-4 border-white shadow-md">
                <img src={formData.profilePicture} alt="" className=' w-full h-full rounded-full object-cover' />
              </div>

              {isEditing ? (
                <div className="w-full mb-4 relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="name">Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`w-full p-2.5 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-sm sm:text-base transition-all duration-200`}
                    aria-invalid={!!errors.name}
                    aria-describedby={errors.name ? 'name-error' : undefined}
                  />
                  {errors.name && <p id="name-error" className="text-red-500 text-xs mt-1">{errors.name}</p>}
                </div>
              ) : (
                <>
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-800 text-center">{formData.name}</h2>
                  <p>{formData.cityName}</p>
                </>
              )}

              {isEditing ? (
                <div className="w-full mb-4 relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="circleName">City Name</label>
                  <input
                    type="text"
                    id="circleName"
                    name="circleName"
                    value={formData.cityName}
                    onChange={handleInputChange}
                    className={`w-full p-2.5 border ${errors.circleName ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-sm sm:text-base transition-all duration-200`}
                    aria-invalid={!!errors.circleName}
                    aria-describedby={errors.circleName ? 'circleName-error' : undefined}
                  />
                  {errors.circleName && <p id="circleName-error" className="text-red-500 text-xs mt-1">{errors.circleName}</p>}
                </div>
              ) : (
                <p className="text-indigo-600 font-medium text-sm sm:text-base mt-2">{formData.circleName}</p>
              )}

              {/* Status Badge */}
              {isEditing ? (
                <div className="w-full mb-4 relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="status">Status</label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-sm sm:text-base transition-all duration-200"
                    aria-label="Status"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="On Leave">On Leave</option>
                  </select>
                </div>
              ) : (
                <div className={`mt-4 px-3 py-1.5 bg-green-100 text-green-800 rounded-full text-sm font-medium inline-flex items-center animate-pulse-short ${formData.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                  <FaCheckCircle className="mr-2" aria-hidden="true" />
                  {formData.status}
                </div>
              )}


            </div>

            {/* Profile Details Section */}
            <div className="lg:w-2/3 p-4 sm:p-6  ">
              {/* Tabs */}
              <div className="flex flex-col sm:flex-row border-b border-gray-200 mb-6 space-y-2 sm:space-y-0 sm:space-x-4">
                {loading ? (
                  ['details', 'Ambulance', 'Doctors', 'Pharmacy', 'Labs'].map((tab, index) => (
                    <div
                      key={index}
                      className="py-2 px-3 sm:px-4 rounded-t-lg bg-gray-300 animate-pulse w-28 h-8"
                    />
                  ))
                ) : (
                  ['details', 'Ambulance', 'Doctors', 'Pharmacy', 'Labs'].map(tab => (
                    <button
                      key={tab}
                      className={`py-2 px-3 sm:px-4 cursor-pointer font-medium text-sm rounded-t-lg transition-all duration-200 ${activeTab === tab
                        ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50'
                        : 'text-gray-500 hover:text-indigo-600 hover:bg-gray-100'
                        }`}
                      onClick={() => { setActiveTab(tab); setIsEditing(false); }}
                      aria-current={activeTab === tab ? 'page' : undefined}
                    >
                      {tab === 'details' && 'Details'}
                      {tab === 'Ambulance' && `Ambulance (${AllStats?.ambulanceCount})`}
                      {tab === 'Doctors' && `Doctors (${AllStats?.doctorCount})`}
                      {tab === 'Pharmacy' && `Pharmacy (${AllStats?.pharmacyCount})`}
                      {tab === 'Labs' && `Labs (${AllStats?.labCount})`}
                    </button>
                  ))
                )}
              </div>


              {/* Details Tab Content */}
              {activeTab === 'details' && (
                <div className="space-y-6 animate-fade-in ">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div className="flex items-center">
                      <div className="bg-blue-100 p-2.5 rounded-lg mr-3 sm:mr-4">
                        <FaEnvelope className="text-blue-500" aria-hidden="true" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-500">Email</p>
                        {isEditing ? (
                          <div className="relative">
                            <input
                              type="email"
                              id="email"
                              name="email"
                              value={formData.email}
                              onChange={handleInputChange}
                              className={`w-full p-2.5 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-sm sm:text-base transition-all duration-200`}
                              aria-invalid={!!errors.email}
                              aria-describedby={errors.email ? 'email-error' : undefined}
                            />
                            {errors.email && <p id="email-error" className="text-red-500 text-xs mt-1">{errors.email}</p>}
                          </div>
                        ) : (
                          <p className="text-gray-800 text-sm sm:text-base">{formData.email}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center">
                      <div className="bg-green-100 p-2.5 rounded-lg mr-3 sm:mr-4">
                        <FaPhone className="text-green-500" aria-hidden="true" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-500">Phone</p>
                        {isEditing ? (
                          <div className="relative">
                            <input
                              type="tel"
                              id="phone"
                              name="phone"
                              value={formData.mobileNumber}
                              onChange={handleInputChange}
                              className={`w-full p-2.5 border ${errors.mobileNumber ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-sm sm:text-base transition-all duration-200`}
                              aria-invalid={!!errors.mobileNumber}
                              aria-describedby={errors.mobileNumber ? 'phone-error' : undefined}
                            />
                            {errors.phone && <p id="phone-error" className="text-red-500 text-xs mt-1">{errors.mobileNumber}</p>}
                          </div>
                        ) : (
                          <p className="text-gray-800 text-sm sm:text-base">{formatPhoneNumber(formData.mobileNumber)}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center">
                      <div className="bg-purple-100 p-2.5 rounded-lg mr-3 sm:mr-4">
                        <FaMapMarkerAlt className="text-purple-500" aria-hidden="true" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-500">City ID</p>
                        {isEditing ? (
                          <div className="relative">
                            <input
                              type="text"
                              id="circleId"
                              name="circleId"
                              value={formData.cityId}
                              onChange={handleInputChange}
                              className={`w-full p-2.5 border ${errors.cityId ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-sm sm:text-base transition-all duration-200`}
                              aria-invalid={!!errors.cityId}
                              aria-describedby={errors.cityId ? 'circleId-error' : undefined}
                            />
                            {errors.cityId && <p id="circleId-error" className="text-red-500 text-xs mt-1">{errors.cityId}</p>}
                          </div>
                        ) : (
                          <p className="text-gray-800 text-sm sm:text-base">{formData.cityId}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center">
                      <div className="bg-yellow-100 p-2.5 rounded-lg mr-3 sm:mr-4">
                        <FaCalendarAlt className="text-yellow-500" aria-hidden="true" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-500">Joining Date</p>
                        {isEditing ? (
                          <div className="relative">
                            <input
                              type="date"
                              id="joiningDate"
                              name="joiningDate"
                              value={formData.joiningDate}
                              onChange={handleInputChange}
                              className={`w-full p-2.5 border ${errors.joiningDate ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-sm sm:text-base transition-all duration-200`}
                              aria-invalid={!!errors.joiningDate}
                              aria-describedby={errors.joiningDate ? 'joiningDate-error' : undefined}
                            />
                            {errors.joiningDate && <p id="joiningDate-error" className="text-red-500 text-xs mt-1">{errors.joiningDate}</p>}
                          </div>
                        ) : (
                          <p className="text-gray-800 text-sm sm:text-base">{formatDate(formData.joiningDate)}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-200">
                    <h3 className="font-medium text-gray-700 text-sm sm:text-base mb-2">Additional Information</h3>
                    {isEditing ? (
                      <textarea
                        name="additionalInfo"
                        value={formData.additionalInfo}
                        onChange={handleInputChange}
                        className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-sm sm:text-base transition-all duration-200"
                        rows="4"
                        aria-label="Additional Information"
                      />
                    ) : (
                      <p className="text-gray-600 text-sm sm:text-base">{formData.additionalInfo}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Activity Tab Content */}
              {activeTab === 'Ambulance' && (
                <AllAmbulance data={AllStats} />
              )}

              {/* Agents Tab Content */}
              {activeTab === 'Doctors' && (
                <AllDoctor data={AllStats} />
              )}

              {/* CO Tab Content */}
              {activeTab === 'Pharmacy' && (
                <div className="animate-fade-in  overflow-hidden w-full overflow-y-auto">
                  <div className="bg-purple-50 p-3 sm:p-4 rounded-lg shadow-sm">
                    <AllPharmacy data={AllStats} />
                  </div>
                </div>
              )}
              {activeTab === 'Labs' && (
                <div className="animate-fade-in  overflow-hidden w-full overflow-y-auto">
                  <div className="bg-purple-50 p-3 sm:p-4 rounded-lg shadow-sm">
                    <AllLabs data={AllStats} />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer Section */}
          <div className="bg-gray-50 px-4 sm:px-6 py-4 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <p className="text-sm text-gray-500">
                Last updated: {formatDate(formData.lastUpdated)}
              </p>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                {isEditing ? (
                  <>
                    <button
                      onClick={handleSave}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-all duration-200 flex items-center justify-center"
                      aria-label="Save Changes"
                    >
                      <FaSave className="mr-2" aria-hidden="true" />
                      Save Changes
                    </button>
                    <button
                      onClick={handleCancel}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300 transition-all duration-200 flex items-center justify-center"
                      aria-label="Cancel Editing"
                    >
                      <FaTimes className="mr-2" aria-hidden="true" />
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-all duration-200"
                      aria-label="Edit Profile"
                    >
                      Edit Profile
                    </button>
                    <button
                      className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-all duration-200"
                      aria-label="Message Zonal Head"
                    >
                      Message
                    </button>
                    <button
                      onClick={onClose}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-all duration-200 flex items-center justify-center"
                      aria-label="Close"
                    >
                      <FaTimes className="mr-2" aria-hidden="true" />
                      Close
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VIewZonal;