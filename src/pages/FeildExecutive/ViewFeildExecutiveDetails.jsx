import React, { useEffect, useState } from 'react';
import { FaUserTie, FaPhone, FaEnvelope, FaMapMarkerAlt, FaCalendarAlt, FaUsers, FaSave, FaTimes } from 'react-icons/fa';
import { MdLocalPharmacy } from "react-icons/md";
import AddVehicale from './AddVehicale';
import AddAddress from './AddAddress';
import { useAuth } from '../../auth/AuthContext';
import AddNewAddress from '../Map/AddAddress'
import axiosInstance from '../../auth/axiosInstance';
import AllDoctor from '../AllDoctor';
import AllPharmacy from '../AllPharmacy';
import AllLabs from '../AllLabs';
import AllAmbulance from '../AllAmbulance';

const ViewFeildExecutiveDetails = ({ ViewData: initialData, onSave, onClose }) => {
  const { submittedData, setSubmittedData, user } = useAuth()
  console.log("check", submittedData)
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('details');
  const [errors, setErrors] = useState({});
  const [addVehicleModal, setAddVehicleModal] = useState(false);
  const [addAddressModal, setAddAddressModal] = useState(false);
  const [editeAddressData, setEditeAddressData] = useState(initialData.address);
  const [editeVehicleData, setEditeVehicleData] = useState(initialData.vehicle);
  const [addedData, setAddedData] = useState(null)
  const [AllStats, setAllStates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false)
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
      city: data.address?.city || 'N/A',
      street: data.address?.street || '',
      status: data.accountNonLocked ? 'Active' : 'Inactive',
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
                <img src={formData.profilePicture} alt="" className='w-full h-full object-cover rounded-full' />
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
              <p className={` font-medium rounded-md px-3 ${formData.status === 'Active' ? 'bg-green-400 text-white' : 'bg-red-400 text-white'}`}>{formData.status}</p>
              <div className="mt-6 w-full space-x-3">
                <button onClick={handleAddVehicleClick} className='bg-blue-500 rounded-md py-1 px-3 text-white cursor-pointer hover:bg-blue-600'>{formData.vehicleNum ? 'Update Vehicle' : 'Add Vehicle'}</button>
                <button onClick={() => { setAddAddressModal(true); }} className='bg-blue-500 rounded-md py-1 px-3 text-white cursor-pointer hover:bg-blue-600'>{formData.street ? 'Update Address' : 'Add Address'}</button>
              </div>
            </div>

            {/* Profile Details Section */}
            <div className="lg:w-2/3 p-4 sm:p-6">
              {/* Tabs */}
              {
                loading ? (
                  <div className="flex flex-col sm:flex-row border-b border-gray-200 mb-6 space-y-2 sm:space-y-0 sm:space-x-4">
                    {['details', 'ambulance', 'doctor', 'Pharmacy', 'Labs'].map((tab, index) => (
                      <div
                        key={index}
                        className="py-2 px-3 sm:px-4 rounded-t-lg bg-gray-300 animate-pulse w-24 h-8"
                      />
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col sm:flex-row border-b border-gray-200 mb-6 space-y-2 sm:space-y-0 sm:space-x-4">
                    {['details', 'ambulance', 'doctor', 'Pharmacy', 'Labs'].map(tab => (
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
                        {tab === 'ambulance' && `Ambulance (${AllStats?.ambulanceCount})`}
                        {tab === 'doctor' && `Doctor (${AllStats?.doctorCount})`}
                        {tab === 'Pharmacy' && `Pharmacy (${formData.PhCounts})`}
                        {tab === 'Labs' && `Labs (${formData.LbCounts})`}
                      </button>
                    ))}
                  </div>
                )
              }


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
                        <p className="text-sm text-gray-600 capitalize">Type: {submittedData && submittedData.type || formData.type}</p>
                        <p className="text-sm text-gray-600 ">Vehicle Number: <span className='uppercase'>{submittedData && submittedData.number || formData.vehicleNum}</span></p>
                      </div>
                      <div className="mb-4">
                        <h1 className="text-gray-800 font-semibold mb-1">Address Info</h1>
                        <p className="text-sm text-gray-600">City: {formData.city || 'N/A'}</p>
                        <p className="text-sm text-gray-600">Street: {formData.street || 'N/A'}</p>
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
                <AllAmbulance data={AllStats} />
              )}

              {/* Agents Tab Content */}
              {activeTab === 'doctor' && (
                <AllDoctor data={AllStats} />
              )}

              {/* Pharmacy Tab Content */}
              {activeTab === 'Pharmacy' && (
                <AllPharmacy data={AllStats} />
              )}
              {activeTab === 'Labs' && (
                <AllLabs data={AllStats} />
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
                {editeVehicleData ? 'Edit Vehicle' : 'Add Vehicle'}
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
              editeVehicleData={editeVehicleData}
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
                {editeAddressData ? 'Edit Address' : 'Add New Address'}
              </h2>
              <button
                onClick={() => { setAddAddressModal(false); }}
                className="text-gray-500 hover:text-red-500 text-2xl font-bold cursor-pointer"
              >
                &times;
              </button>
            </div>
            {/* <AddAddress
              onClose={setAddAddressModal}
              agentId={fieldExecutiveId}
              editeAddressData={editeAddressData}
            /> */}
            <AddNewAddress onClose={() => setAddAddressModal(false)}
              agentId={fieldExecutiveId}
              editeAddressData={editeAddressData} />
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewFeildExecutiveDetails;