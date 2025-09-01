import React, { useState } from 'react';
import { FaUserTie, FaPhone, FaEnvelope, FaMapMarkerAlt, FaCalendarAlt, FaUsers, FaSave, FaTimes } from 'react-icons/fa';
import { MdLocalPharmacy } from "react-icons/md";
import AddVehicale from './AddVehicale';
import AddAddress from './AddAddress';

const ViewFeildExecutiveDetails = ({ ViewData: initialData, onSave, onClose }) => {
  console.log('view ', initialData);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('details');
  const [errors, setErrors] = useState({});
  const [addVehicleModal, setAddVehicleModal] = useState(false);
  const [addAddressModal, setAddAddressModal] = useState(false);
  const fieldExecutiveId = initialData.id;

  const transformData = (data) => {
    return {
      name: `${data.firstName || ''} ${data.lastName || ''}`.trim(),
      firstName: data.firstName || '',
      lastName: data.lastName || '',
      email: data.email || '',
      mobileNumber: data.mobileNumber || 'N/A',
      roleName: data.roles?.roleName || 'N/A',
      roleId: data.id || 'N/A',
      assignedPinCodes: data.assignedPinCodes?.map(pin => pin.pinCode) || [],
      type: data.vehicle?.type || '',
      vehicleNum: data.vehicle?.vehicleNumber || '',
      status: data.enabled ? 'Active' : 'Inactive',
      performance: 'Good', // Default placeholder
      agentsCount: 24, // Placeholder since not in API
      PhCounts: 5, // Placeholder
      LbCounts: 10, // Placeholder
      profilePicture: data.profilePicture || '',
      createdAt: data.createdAt || '',
      updatedAt: data.updatedAt || '',
      lastLogin: data.lastLogin || 'Never',
      joiningDate: data.createdAt?.split('T')[0] || '2023-05-15',
      additionalInfo: `This division admin manages the ${data.division?.zoneName || 'N/A'} region.`,
      // Spread all original properties for reference
      ...data
    };
  };

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

  const handleAddVehicleClick = () => {
    setAddVehicleModal(true);

  };

  return (
    <div className=" min-h-[400px]">
      <div className="max-w-7xl mx-auto">
        {/* Profile Card */}
        <div className=" overflow-hidden transition-all duration-300 hover:shadow-xl">
          <div className="flex flex-col lg:flex-row">
            {/* Profile Sidebar */}
            <div className="lg:w-1/3 p-6 bg-gradient-to-br from-indigo-50 to-blue-50 flex flex-col items-center justify-start">
              <div className="w-24 h-24 sm:w-32 sm:h-32 bg-indigo-100 rounded-full flex items-center justify-center mb-4 border-4 border-white shadow-md">
                <FaUserTie className="text-indigo-500 text-3xl sm:text-5xl" aria-hidden="true" />
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
                </>
              )}

              {isEditing ? (
                <div className="w-full mb-4 relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="circleName">Role Name</label>
                  <input
                    type="text"
                    id="circleName"
                    name="circleName"
                    value={formData.roleName}
                    onChange={handleInputChange}
                    className={`w-full p-2.5 border ${errors.roleName ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-sm sm:text-base transition-all duration-200`}
                    aria-invalid={!!errors.roleName}
                    aria-describedby={errors.roleName ? 'circleName-error' : undefined}
                  />

                </div>
              ) : (
                <p className="text-indigo-600 font-medium text-sm sm:text-base mt-2">{formData.roleName}</p>
              )}
              <div className="mt-6 w-full space-x-3">
                <button onClick={handleAddVehicleClick} className='submit-btn'>{formData.vehicleNum ? 'Edite Vehical' : 'Add Vehicle'}</button>
                <button onClick={() => { setAddAddressModal(true); }} className='submit-btn'>Add Address</button>
              </div>
            </div>

            {/* Profile Details Section */}
            <div className="lg:w-2/3 p-4 sm:p-6">
              {/* Tabs */}
              <div className="flex flex-col sm:flex-row border-b border-gray-200 mb-6 space-y-2 sm:space-y-0 sm:space-x-4">
                {['details', 'ambulance', 'doctor', 'Pharmacy', 'Labs'].map(tab => (
                  <button
                    key={tab}
                    className={`py-2 px-3 sm:px-4 cursor-pointer font-medium text-sm rounded-t-lg transition-all duration-200 ${activeTab === tab
                      ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50'
                      : 'text-gray-500 hover:text-indigo-600 hover:bg-gray-100'
                      }`}
                    onClick={() => { setActiveTab(tab), setIsEditing(false) }}
                    aria-current={activeTab === tab ? 'page' : undefined}
                  >
                    {tab === 'details' && 'Details'}
                    {tab === 'ambulance' && 'Ambulance'}
                    {tab === 'doctor' && `Doctor (${formData.agentsCount})`}
                    {tab === 'Pharmacy' && `Pharmacy (${formData.PhCounts})`}
                    {tab === 'Labs' && `Labs (${formData.LbCounts})`}
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
                        <p className="text-sm text-gray-500"> ID</p>
                        {isEditing ? (
                          <div className="relative">
                            <input
                              type="text"
                              id="circleId"
                              name="circleId"
                              value={formData.roleId}
                              onChange={handleInputChange}
                              className={`w-full p-2.5 border ${errors.roleId ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-sm sm:text-base transition-all duration-200`}
                              aria-invalid={!!errors.roleId}
                              aria-describedby={errors.roleId ? 'circleId-error' : undefined}
                            />
                            {errors.roleId && <p id="circleId-error" className="text-red-500 text-xs mt-1">{errors.roleId}</p>}
                          </div>
                        ) : (
                          <p className="text-gray-800 text-sm sm:text-base">{formData.roleId}</p>
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
                    <h3 className="font-medium text-gray-700 text-sm sm:text-base mb-2">
                      Additional Information
                    </h3>

                    <div className='flex justify-between'>
                      <div className="mb-4">
                      <h1 className="text-gray-800 font-semibold mb-1">Vehicle Info</h1>
                      <p className="text-sm text-gray-600">Type: {formData.type || 'N/A'}</p>
                      <p className="text-sm text-gray-600">Vehicle Number: {formData.vehicleNum || 'N/A'}</p>
                    </div>
                    <div className="mb-4">
                      <h1 className="text-gray-800 font-semibold mb-1">Address Info</h1>
                      {/* <p className="text-sm text-gray-600">Type: {formData || 'N/A'}</p>
                      <p className="text-sm text-gray-600">Vehicle Number: {formData || 'N/A'}</p> */}
                    </div>
                    </div>

                    <div className="mt-4">
                      <h1 className="text-gray-800 font-semibold mb-2">Assigned Pincodes</h1>
                      {formData.assignedPinCodes?.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {formData.assignedPinCodes.map((pin, index) => (
                            <span
                              key={pin.id || index}
                              className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full shadow-sm"
                            >
                              {pin.pinCode}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500">No pin codes assigned</p>
                      )}
                    </div>

                  </div>

                </div>
              )}

              {/* Activity Tab Content */}
              {activeTab === 'ambulance' && (
                <div className="space-y-4 animate-fade-in">
                  {[
                    { title: 'Performance Review', date: 'August 15, 2025', status: 'Needs Attention', statusColor: 'bg-yellow-100 text-yellow-800' },
                    { title: 'Team Meeting', date: 'August 20, 2025', status: 'Upcoming', statusColor: 'bg-blue-100 text-blue-800' },
                    { title: 'Quarterly Report', date: 'July 30, 2025', status: 'Completed', statusColor: 'bg-green-100 text-green-800' }
                  ].map((activity, index) => (
                    <div key={index} className="flex justify-between items-center p-3 sm:p-4 bg-gray-50 rounded-lg shadow-sm transition-all duration-200 hover:bg-gray-100">
                      <div>
                        <p className="font-medium text-sm sm:text-base">{activity.title}</p>
                        <p className="text-xs sm:text-sm text-gray-500">{activity.date}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${activity.statusColor}`}>
                        {activity.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Agents Tab Content */}
              {activeTab === 'doctor' && (
                <div className="animate-fade-in">
                  <p className="text-gray-600 text-sm sm:text-base mb-4">
                    This Circle Officer manages a team of {formData.agentsCount} agents in the {formData.circleName} region.
                  </p>
                  <div className="bg-blue-50 p-3 sm:p-4 rounded-lg shadow-sm">
                    <div className="flex items-center">
                      <div className="bg-blue-100 p-2 rounded-lg mr-3">
                        <FaUsers className="text-blue-500" aria-hidden="true" />
                      </div>
                      <div>
                        <p className="text-sm text-blue-700">
                          Agent details are managed in the dedicated agents section.{' '}
                          <a href="#agents" className="font-medium text-blue-600 hover:underline">View full agent list</a>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Pharmacy Tab Content */}
              {activeTab === 'Pharmacy' && (
                <div className="animate-fade-in">
                  <p className="text-gray-600 text-sm sm:text-base mb-4">
                    This Circle officer oversees {formData.coCounts} Pharmacys in the {formData.circleName} region.
                  </p>
                  <div className="bg-purple-50 p-3 sm:p-4 rounded-lg shadow-sm">
                    <div className="flex items-center">
                      <div className="bg-purple-100 p-2 rounded-lg mr-3">
                        <MdLocalPharmacy className="text-purple-500" aria-hidden="true" />
                      </div>
                      <div>
                        <p className="text-sm text-purple-700">
                          Pharmacy details are managed in the dedicated pharmacy management section.{' '}
                          <a href="#co" className="font-medium text-purple-600 hover:underline">View full pharmacy list</a>
                        </p>
                      </div>
                    </div>
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

      {/* Vehicle Modal */}
      {addVehicleModal && (
        <div
          className="fixed inset-0 backdrop-brightness-50 flex items-center justify-center z-50"
          onClick={() => { setAddVehicleModal(false); }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="main_bg rounded-lg shadow-lg w-full max-w-md transform transition-all duration-300 scale-100 animate-modalFade p-4"
          >
            <div className="flex justify-between items-center border-b pb-3 mb-4">
              <h2 className="text-lg font-semibold">
                Add New Vehicle
              </h2>
              <button
                onClick={() => { setAddVehicleModal(false); }}
                className="text-gray-500 hover:text-red-500 text-2xl font-bold cursor-pointer"
              >
                &times;
              </button>
            </div>
            <AddVehicale id={fieldExecutiveId}
              onClose={setAddVehicleModal}
            />
          </div>
        </div>
      )}
      {/** Add Adress modal */}
      {addAddressModal && (
        <div
          className="fixed inset-0 backdrop-brightness-50 flex items-center justify-center z-50"
          onClick={() => { setAddAddressModal(false); }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-xl shadow-2xl max-w-xl w-full max-h-[95vh] overflow-y-auto p-4"
          >
            <div className="flex justify-between items-center border-b pb-3 mb-4">
              <h2 className="text-lg font-semibold">
                Add Address
              </h2>
              <button
                onClick={() => { setAddAddressModal(false); }}
                className="text-gray-500 hover:text-red-500 text-2xl font-bold cursor-pointer"
              >
                &times;
              </button>
            </div>
            <AddAddress
              onClose={setAddAddressModal}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewFeildExecutiveDetails;