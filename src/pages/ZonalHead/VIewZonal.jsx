import React, { useState } from 'react';
import { FaUserTie, FaPhone, FaEnvelope, FaMapMarkerAlt, FaCalendarAlt, FaSyncAlt, FaChartLine, FaCheckCircle, FaExclamationTriangle, FaUsers, FaSave, FaTimes } from 'react-icons/fa';
import Transfer from './Transfer';
import { IoMdSwap } from "react-icons/io";
import { MdSwapHorizontalCircle } from "react-icons/md";



const VIewZonal = ({ ViewData: initialData, onSave, onClose }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('details');
  const [transferModal, setTransferModal] = useState(false);
  const [formData, setFormData] = useState({
    ...initialData,
    joiningDate: initialData.joiningDate || '2023-05-15',
    additionalInfo: initialData.additionalInfo || `This zonal head manages the ${initialData.zoneName} region and oversees a team of ${initialData.agentsCount} agents and ${initialData.coCounts} COs.`
  });
  const [errors, setErrors] = useState({});

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
    if (!formData.zoneName.trim()) newErrors.zoneName = 'Zone name is required';
    if (!formData.zoneId.trim()) newErrors.zoneId = 'Zone ID is required';
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
    setFormData(initialData);
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

  const handleTransferModal = (name) => {
    setTransferModal(true)
  }


  return (
    <div className=" min-h-[400px]">
      <div className="max-w-7xl mx-auto">
        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
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
                <h2 className="text-lg sm:text-xl font-semibold text-gray-800 text-center">{formData.name} </h2>
              )}

              {isEditing ? (
                <div className="w-full mb-4 relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="zoneName">Zone Name</label>
                  <input
                    type="text"
                    id="zoneName"
                    name="zoneName"
                    value={formData.zoneName}
                    onChange={handleInputChange}
                    className={`w-full p-2.5 border ${errors.zoneName ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-sm sm:text-base transition-all duration-200`}
                    aria-invalid={!!errors.zoneName}
                    aria-describedby={errors.zoneName ? 'zoneName-error' : undefined}
                  />
                  {errors.zoneName && <p id="zoneName-error" className="text-red-500 text-xs mt-1">{errors.zoneName}</p>}
                </div>
              ) : (
                <p className="text-indigo-600 font-medium text-sm sm:text-base mt-2">{formData.zoneName}</p>
              )}
              <div className={`flex w-full ${isEditing ? "flex-col" : "flex-row"}  justify-center items-center gap-4`}>
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
                  <div className="mt-4 px-3 py-1.5 bg-green-100 text-green-800 rounded-full text-sm font-medium inline-flex items-center animate-pulse-short">
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
                  <div className="mt-4">
                    <PerformanceIndicator performance={formData.performance} />
                  </div>
                )}
                <button onClick={handleTransferModal} className='mt-4 py-0.5  bg-amber-200 text-amber-900 px-3 cursor-pointer hover:bg-amber-300 rounded-xl flex justify-center items-center '> <MdSwapHorizontalCircle />Transfer</button>
              </div>
              {/* Stats Section */}
              <div className="mt-6 w-full space-y-3">
                <div className="flex items-center bg-white p-3 rounded-lg shadow-sm">
                  <div className="bg-blue-100 p-2 rounded-lg mr-3">
                    <FaUsers className="text-blue-500" aria-hidden="true" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-500">Agents</p>
                    {isEditing ? (
                      <input
                        type="number"
                        name="agentsCount"
                        value={formData.agentsCount}
                        onChange={handleInputChange}
                        className="w-20 p-1.5 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-sm transition-all duration-200"
                        min="0"
                        aria-label="Agents Count"
                      />
                    ) : (
                      <p className="font-semibold text-gray-800">{formData.agentsCount}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center bg-white p-3 rounded-lg shadow-sm">
                  <div className="bg-purple-100 p-2 rounded-lg mr-3">
                    <FaUserTie className="text-purple-500" aria-hidden="true" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-500">CO Count</p>
                    {isEditing ? (
                      <input
                        type="number"
                        name="coCounts"
                        value={formData.coCounts}
                        onChange={handleInputChange}
                        className="w-20 p-1.5 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-sm transition-all duration-200"
                        min="0"
                        aria-label="CO Count"
                      />
                    ) : (
                      <p className="font-semibold text-gray-800">{formData.coCounts}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Details Section */}
            <div className="lg:w-2/3 p-4 sm:p-6">
              {/* Tabs */}
              <div className="flex flex-col sm:flex-row border-b border-gray-200 mb-6 space-y-2 sm:space-y-0 sm:space-x-4">
                {['details', 'activity', 'agents', 'co',].map(tab => (
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
                    {tab === "agents" && `Agents (${formData.agentsCount})`}
                    {tab === "co" && `CO (${formData.coCounts})`}

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
                              value={formData.phone}
                              onChange={handleInputChange}
                              className={`w-full p-2.5 border ${errors.phone ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-sm sm:text-base transition-all duration-200`}
                              aria-invalid={!!errors.phone}
                              aria-describedby={errors.phone ? 'phone-error' : undefined}
                            />
                            {errors.phone && <p id="phone-error" className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                          </div>
                        ) : (
                          <p className="text-gray-800 text-sm sm:text-base">{formatPhoneNumber(formData.phone)}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center">
                      <div className="bg-purple-100 p-2.5 rounded-lg mr-3 sm:mr-4">
                        <FaMapMarkerAlt className="text-purple-500" aria-hidden="true" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-500">Zone ID</p>
                        {isEditing ? (
                          <div className="relative">
                            <input
                              type="text"
                              id="zoneId"
                              name="zoneId"
                              value={formData.zoneId}
                              onChange={handleInputChange}
                              className={`w-full p-2.5 border ${errors.zoneId ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-sm sm:text-base transition-all duration-200`}
                              aria-invalid={!!errors.zoneId}
                              aria-describedby={errors.zoneId ? 'zoneId-error' : undefined}
                            />
                            {errors.zoneId && <p id="zoneId-error" className="text-red-500 text-xs mt-1">{errors.zoneId}</p>}
                          </div>
                        ) : (
                          <p className="text-gray-800 text-sm sm:text-base">{formData.zoneId}</p>
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
              {activeTab === 'activity' && (
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
              {activeTab === 'agents' && (
                <div className="animate-fade-in">
                  <p className="text-gray-600 text-sm sm:text-base mb-4">
                    This zonal head manages a team of {formData.agentsCount} agents in the {formData.zoneName} region.
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

              {/* CO Tab Content */}
              {activeTab === 'co' && (
                <div className="animate-fade-in">
                  <p className="text-gray-600 text-sm sm:text-base mb-4">
                    This zonal head oversees {formData.coCounts} COs in the {formData.zoneName} region.
                  </p>
                  <div className="bg-purple-50 p-3 sm:p-4 rounded-lg shadow-sm">
                    <div className="flex items-center">
                      <div className="bg-purple-100 p-2 rounded-lg mr-3">
                        <FaUserTie className="text-purple-500" aria-hidden="true" />
                      </div>
                      <div>
                        <p className="text-sm text-purple-700">
                          CO details are managed in the dedicated CO management section.{' '}
                          <a href="#co" className="font-medium text-purple-600 hover:underline">View full CO list</a>
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
      {/* transfer modal */}

      {transferModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-70 p-4">
          <div className="bg-gray-100 rounded-lg max-h-[90vh] w-full max-w-7xl p-4 flex flex-col">

            {/* Fixed Header */}
            <div className="flex flex-row justify-between items-center mb-4 border-b pb-2">
              <h1 className="text-lg font-semibold">Transfer</h1>
              <button
                className="w-8 h-8 flex items-center justify-center  text-red-500 rounded-full hover:bg-red-200 duration-300 cursor-pointer"
                onClick={() => setTransferModal(false)}
              >
                ✕
              </button>

            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto">
              <Transfer />
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

// Default props with dummy data
VIewZonal.defaultProps = {
  ViewData: {
    name: "John Doe",
    zoneName: "North Region",
    status: "Active",
    performance: "Good",
    agentsCount: 24,
    coCounts: 5,
    email: "john.doe@example.com",
    phone: "+1234567890",
    zoneId: "ZONE-1234",
    createdDate: "2023-05-15T00:00:00.000Z",
    lastUpdated: new Date().toISOString(),
    joiningDate: "2023-05-15",
    additionalInfo: "This zonal head manages the North Region and oversees a team of 24 agents and 5 COs."
  },
  onSave: (data) => console.log("Saving data:", data),
  onClose: () => console.log("Closing modal")
};

export default VIewZonal;