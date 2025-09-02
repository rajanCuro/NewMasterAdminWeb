import React, { useState, useEffect } from 'react';
import { FaUserTie, FaPhone, FaEnvelope, FaMapMarkerAlt, FaCalendarAlt, FaSyncAlt, FaChartLine, FaCheckCircle, FaExclamationTriangle, FaUsers, FaSave, FaTimes, FaList } from 'react-icons/fa';
import Transfer from './Transfer';
import { IoMdSwap } from "react-icons/io";
import { MdSwapHorizontalCircle } from "react-icons/md";
import axiosInstance from '../../auth/axiosInstance';

const ViewDivisionDetails = ({ ViewData: initialData, onSave, onClose }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('details');
  const [transferModal, setTransferModal] = useState(false);
  const [divisions, setDivisions] = useState([]);
  const [isLoadingDivisions, setIsLoadingDivisions] = useState(false);
  console.log(initialData);
  // Transform API data to match component structure
  const transformData = (data) => {
    return {
      id: data.id,
      name: `${data.firstName} ${data.lastName}`,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      mobileNumber: data.mobileNumber,
      zoneName: data.division?.zoneName || 'N/A',
      zoneId: data.division?.id || 'N/A',
      status: data.accountNonLocked ? 'Active' : 'Inactive',
      performance: 'Good', // Default value
      agentsCount: 24, // Default value since not in API
      coCounts: 5, // Default value since not in API
      profilePicture: data.profilePicture,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      lastLogin: data.lastLogin,
      joiningDate: data.createdAt?.split('T')[0] || '2023-05-15',
      additionalInfo: `This division admin manages the ${data.division?.zoneName || 'N/A'} region.`,
      // Include all original properties
      ...data
    };
  };

  const [formData, setFormData] = useState(transformData(initialData));
  const [errors, setErrors] = useState({});

  // Format phone number
  const formatPhoneNumber = (phone) => {
    if (!phone) return 'N/A';
    try {
      // Remove any non-digit characters
      const cleaned = phone.replace(/\D/g, '');
      // Format as (XXX) XXX-XXXX for 10-digit numbers
      if (cleaned.length === 10) {
        return `(${cleaned.substring(0, 3)}) ${cleaned.substring(3, 6)}-${cleaned.substring(6)}`;
      }
      return phone;
    } catch {
      return phone;
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
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
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Valid email is required';
    if (!formData.mobileNumber || !/^\d{10}$/.test(formData.mobileNumber.replace(/\D/g, ''))) {
      newErrors.mobileNumber = 'Valid 10-digit phone number is required';
    }
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

  const handleTransferModal = () => {
    setTransferModal(true);
  };

  return (
    <div className="min-h-[400px]">
      <div className="max-w-7xl mx-auto">
        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
          <div className="flex flex-col lg:flex-row">
            {/* Profile Sidebar */}
            <div className="lg:w-1/3 p-6 bg-gradient-to-br from-indigo-50 to-blue-50 flex flex-col items-center justify-start">
              <div className="w-24 h-24 sm:w-32 sm:h-32 bg-indigo-100 rounded-full flex items-center justify-center mb-4 border-4 border-white shadow-md">
                {formData.profilePicture && formData.profilePicture !== 'NA' ? (
                  <img
                    src={formData.profilePicture}
                    alt={formData.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <FaUserTie className="text-indigo-500 text-3xl sm:text-5xl" aria-hidden="true" />
                )}
              </div>

              {isEditing ? (
                <>
                  <div className="w-full mb-4 relative">
                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="firstName">First Name</label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className={`w-full p-2.5 border ${errors.firstName ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-sm sm:text-base transition-all duration-200`}
                      aria-invalid={!!errors.firstName}
                      aria-describedby={errors.firstName ? 'firstName-error' : undefined}
                    />
                    {errors.firstName && <p id="firstName-error" className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
                  </div>
                  <div className="w-full mb-4 relative">
                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="lastName">Last Name</label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className={`w-full p-2.5 border ${errors.lastName ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-sm sm:text-base transition-all duration-200`}
                      aria-invalid={!!errors.lastName}
                      aria-describedby={errors.lastName ? 'lastName-error' : undefined}
                    />
                    {errors.lastName && <p id="lastName-error" className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
                  </div>
                </>
              ) : (
                <>
                  <h2 className="text-lg sm:text-xl font-semibold uppercase text-gray-800 text-center">{formData.name}</h2>
                  <p className="text-indigo-600 font-medium text-sm sm:text-base mt-2">{formData.zoneName}</p>
                </>
              )}

              <div className={`flex w-full ${isEditing ? "flex-col" : "flex-row"} justify-center items-center gap-4 mt-4`}>
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
                    </select>
                  </div>
                ) : (
                  <div className={`px-3 py-1.5 rounded-full text-sm font-medium inline-flex items-center animate-pulse-short ${formData.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                    <FaCheckCircle className="mr-2" aria-hidden="true" />
                    {formData.status}
                  </div>
                )}

                {/* Performance Indicator */}
                {isEditing ? (
                  <div className="w-full mt-4 relative">
                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="performance">Performance</label>
                    <select
                      id="performance"
                      name="performance"
                      value={formData.performance}
                      onChange={handleInputChange}
                      className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-sm sm:text-base transition-all duration-200"
                      aria-label="Performance"
                    >
                      <option value="Excellent">Excellent</option>
                      <option value="Good">Good</option>
                      <option value="Needs Improvement">Needs Improvement</option>
                      <option value="Poor">Poor</option>
                    </select>
                  </div>
                ) : (
                  <div className="">
                    <PerformanceIndicator performance={formData.performance} />
                  </div>
                )}
                <button
                  onClick={handleTransferModal}
                  className=' py-0.5 bg-amber-200 text-amber-900 px-3 cursor-pointer hover:bg-amber-300 rounded-xl flex justify-center items-center'
                >
                  <MdSwapHorizontalCircle className="mr-1" />
                  Transfer
                </button>
              </div>

              {/* Stats Section */}
              <div className="mt-6 w-full space-y-3">
                <div className="flex items-center bg-white p-3 rounded-lg shadow-sm">
                  <div className="bg-blue-100 p-2 rounded-lg mr-3">
                    <FaUsers className="text-blue-500" aria-hidden="true" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-500">Last Login</p>
                    <p className="font-semibold text-gray-800">
                      {formData.lastLogin ? formatDate(formData.lastLogin) : 'Never'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center bg-white p-3 rounded-lg shadow-sm">
                  <div className="bg-purple-100 p-2 rounded-lg mr-3">
                    <FaCalendarAlt className="text-purple-500" aria-hidden="true" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-500">Member Since</p>
                    <p className="font-semibold text-gray-800">{formatDate(formData.createdAt)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Details Section */}
            <div className="lg:w-2/3 p-4 sm:p-6">
              {/* Tabs */}
              <div className="flex flex-col sm:flex-row border-b border-gray-200 mb-6 space-y-2 sm:space-y-0 sm:space-x-4">
                {['details', 'activity', 'divisions'].map(tab => (
                  <button
                    key={tab}
                    className={`py-2 px-3 sm:px-4 cursor-pointer font-medium text-sm rounded-t-lg transition-all duration-200 ${activeTab === tab
                      ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50'
                      : 'text-gray-500 hover:text-indigo-600 hover:bg-gray-100'
                      }`}
                    onClick={() => {
                      setActiveTab(tab);
                      setIsEditing(false);
                    }}
                    aria-current={activeTab === tab ? "page" : undefined}
                  >
                    {tab === "details" && "Details"}
                    {tab === "activity" && "Activity"}
                    {tab === "divisions" && `Divisions (${divisions.length + 1})`}
                  </button>
                ))}
              </div>

              {/* Details Tab Content */}
              {activeTab === 'details' && (
                <div className="space-y-6 animate-fade-in">
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
                          <p className="text-gray-800 text-sm sm:text-base break-all">{formData.email}</p>
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
                              id="mobileNumber"
                              name="mobileNumber"
                              value={formData.mobileNumber}
                              onChange={handleInputChange}
                              className={`w-full p-2.5 border ${errors.mobileNumber ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-sm sm:text-base transition-all duration-200`}
                              aria-invalid={!!errors.mobileNumber}
                              aria-describedby={errors.mobileNumber ? 'mobileNumber-error' : undefined}
                            />
                            {errors.mobileNumber && <p id="mobileNumber-error" className="text-red-500 text-xs mt-1">{errors.mobileNumber}</p>}
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
                        <p className="text-sm text-gray-500">Division</p>
                        <p className="text-gray-800 text-sm sm:text-base">{formData.zoneName}</p>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <div className="bg-yellow-100 p-2.5 rounded-lg mr-3 sm:mr-4">
                        <FaMapMarkerAlt className="text-yellow-500" aria-hidden="true" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-500">Division ID</p>
                        <p className="text-gray-800 text-sm sm:text-base">{formData.zoneId}</p>
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
              {activeTab === 'activity' && (
                <div className="space-y-4 animate-fade-in">
                  <div className="flex justify-between items-center p-3 sm:p-4 bg-gray-50 rounded-lg shadow-sm">
                    <div>
                      <p className="font-medium text-sm sm:text-base">Account Created</p>
                      <p className="text-xs sm:text-sm text-gray-500">{formatDate(formData.createdAt)}</p>
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs sm:text-sm font-medium bg-green-100 text-green-800">
                      Completed
                    </span>
                  </div>

                  <div className="flex justify-between items-center p-3 sm:p-4 bg-gray-50 rounded-lg shadow-sm">
                    <div>
                      <p className="font-medium text-sm sm:text-base">Last Login</p>
                      <p className="text-xs sm:text-sm text-gray-500">
                        {formData.lastLogin ? formatDate(formData.lastLogin) : 'Never logged in'}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${formData.lastLogin ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                      {formData.lastLogin ? 'Active' : 'Pending'}
                    </span>
                  </div>

                  <div className="flex justify-between items-center p-3 sm:p-4 bg-gray-50 rounded-lg shadow-sm">
                    <div>
                      <p className="font-medium text-sm sm:text-base">Profile Updated</p>
                      <p className="text-xs sm:text-sm text-gray-500">{formatDate(formData.updatedAt)}</p>
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs sm:text-sm font-medium bg-purple-100 text-purple-800">
                      Updated
                    </span>
                  </div>
                </div>
              )}

              {/* Divisions Tab Content */}
              {activeTab === 'divisions' && (
                <div className="space-y-4 animate-fade-in">
                  <div className="bg-blue-50 p-4 rounded-lg mb-4">
                    <h3 className="font-semibold text-blue-800 flex items-center">
                      <FaList className="mr-2" />
                      Division Details
                    </h3>
                    <p className="text-sm text-blue-600 mt-1">
                      This shows the details of the division managed by this admin.
                    </p>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="min-w-full border border-gray-300">
                      <thead className="bg-gray-100 border-b border-gray-300">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border border-gray-300">
                            ID
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border border-gray-300">
                            Division Name
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border border-gray-300">
                            Population
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border border-gray-300">
                            Zone Code
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border border-gray-300">
                            Area
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border border-gray-300">
                            Districts
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white text-start">
                        <tr>
                          <td className="px-4 py-2 border border-gray-300 whitespace-nowrap text-sm font-medium text-gray-900">
                            {initialData.division?.id || 'N/A'}
                          </td>
                          <td className="px-4 py-2 border border-gray-300 whitespace-nowrap text-sm text-gray-900">
                            {initialData.division?.zoneName || 'N/A'}
                          </td>
                          <td className="px-4 py-2 border border-gray-300 whitespace-nowrap text-sm text-gray-500">
                            {initialData.division?.populationInMillion ? `${initialData.division.populationInMillion}M` : 'N/A'}
                          </td>
                          <td className="px-4 py-2 border border-gray-300 whitespace-nowrap text-sm text-gray-500">
                            {initialData.division?.zoneCode || 'N/A'}
                          </td>
                          <td className="px-4 py-2 border border-gray-300 whitespace-nowrap text-sm text-gray-500">
                            {initialData.division?.area
                              ? `${initialData.division.area.replace(/[^0-9.]/g, '')} Sq.Km`
                              : 'N/A'}
                          </td>
                          <td className="px-4 py-2 border border-gray-300 whitespace-nowrap text-sm text-gray-500">
                            {initialData.division?.noOfDistricts || 'N/A'}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer Section */}
          <div className="bg-gray-50 px-4 sm:px-6 py-4 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <p className="text-sm text-gray-500">
                Last updated: {formatDate(formData.updatedAt)}
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

      {/* Transfer Modal */}
      {transferModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-70 p-4">
          <div className="bg-gray-100 rounded-lg max-h-[90vh] w-full max-w-7xl p-4 flex flex-col">
            {/* Fixed Header */}
            <div className="flex flex-row justify-between items-center mb-4 border-b pb-2">
              <h1 className="text-lg font-semibold">Transfer Division Admin</h1>
              <button
                className="w-8 h-8 flex items-center justify-center text-red-500 rounded-full hover:bg-red-200 duration-300 cursor-pointer"
                onClick={() => setTransferModal(false)}
              >
                ✕
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto">
              <Transfer divisionAdmin={formData} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewDivisionDetails;