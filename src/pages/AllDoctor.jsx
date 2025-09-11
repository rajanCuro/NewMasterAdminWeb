import React, { useState } from 'react';
import NoDataPage from '../NodataPage';

function AllDoctor({ data }) {
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  if (!data || !data.doctors) {
    return (
      <NoDataPage />
    );
  }

  const filteredDoctors = data.doctors
    .filter(doctor => {
      const matchesSearch =
        doctor.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.specialization?.toLowerCase().includes(searchTerm.toLowerCase());

      let matchesFilter = true;
      if (activeFilter === 'active') {
        matchesFilter = doctor.active;
      } else if (activeFilter === 'verified') {
        matchesFilter = doctor.licenceVerified;
      } else if (activeFilter === 'inactive') {
        matchesFilter = !doctor.active;
      }

      return matchesSearch && matchesFilter;
    })
    .reverse(); // 🔁 Reverse the final filtered list


  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <>
      <div className="">
        {/* Search and Filter Bar */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search by name, email or specialization..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                className={`px-4 py-2 rounded-lg ${activeFilter === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                onClick={() => setActiveFilter('all')}
              >
                All
              </button>
              <button
                className={`px-4 py-2 rounded-lg ${activeFilter === 'active' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                onClick={() => setActiveFilter('active')}
              >
                Active
              </button>
              <button
                className={`px-4 py-2 rounded-lg ${activeFilter === 'verified' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                onClick={() => setActiveFilter('verified')}
              >
                Verified
              </button>
              <button
                className={`px-4 py-2 rounded-lg ${activeFilter === 'inactive' ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                onClick={() => setActiveFilter('inactive')}
              >
                Inactive
              </button>
            </div>
          </div>
        </div>

        {/* Doctor List */}
        <div className="bg-white rounded-lg shadow overflow-hidden max-h-[50vh] overflow-y-auto">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr className='bg-gray-400 text-white'>
                  <th className="px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider">
                    Doctor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider">
                    Specialization
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider">
                    Experience
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredDoctors.map((doctor) => (
                  <tr
                    key={doctor.id}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => setSelectedDoctor(doctor)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          {doctor.profilePicture ? (
                            <img
                              className="h-10 w-10 rounded-full object-cover"
                              src={doctor.profilePicture}
                              alt="Profile"
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                              <span className="text-gray-500 text-sm">
                                {doctor.firstName?.charAt(0) || 'D'}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {doctor.firstName} {doctor.lastName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {doctor.qualification || 'N/A'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{doctor.specialization || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{doctor.email}</div>
                      <div className="text-sm text-gray-500">{doctor.mobileNumber || 'No phone'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col gap-1">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${doctor.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {doctor.active ? 'Active' : 'Inactive'}
                        </span>
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${doctor.licenceVerified ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'}`}>
                          {doctor.licenceVerified ? 'Verified' : 'Pending'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {doctor.yearsOfExperience || 0} years
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        className="text-blue-600 hover:text-blue-900 mr-3"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedDoctor(doctor);
                        }}
                      >
                        View
                      </button>
                      <button
                        className="text-indigo-600 hover:text-indigo-900"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Doctor Detail Modal */}
        {selectedDoctor && (
          <div className="fixed inset-0 backdrop-blur-xl flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-5xl w-full max-h-[70vh] overflow-y-auto">
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-xl font-semibold text-gray-800">
                  Dr. {selectedDoctor.firstName} {selectedDoctor.lastName}
                </h3>
                <button
                  className="text-gray-400 hover:text-gray-500"
                  onClick={() => setSelectedDoctor(null)}
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="p-6">
                <div className="flex flex-col md:flex-row gap-6 mb-6">
                  <div className="flex-shrink-0 mx-auto md:mx-0">
                    {selectedDoctor.profilePicture ? (
                      <img
                        className="h-32 w-32 rounded-full object-cover"
                        src={selectedDoctor.profilePicture}
                        alt="Profile"
                      />
                    ) : (
                      <div className="h-32 w-32 rounded-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-500 text-4xl">
                          {selectedDoctor.firstName?.charAt(0) || 'D'}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-800">
                      Dr. {selectedDoctor.firstName} {selectedDoctor.lastName}
                    </h2>
                    <p className="text-gray-600">{selectedDoctor.qualification}</p>
                    <p className="text-gray-800 font-medium mt-2">{selectedDoctor.specialization}</p>
                    <p className="text-gray-600">{selectedDoctor.yearsOfExperience} years of experience</p>

                    <div className="flex gap-2 mt-4">
                      <span className={`px-3 py-1 rounded-full text-sm ${selectedDoctor.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {selectedDoctor.active ? 'Active' : 'Inactive'}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-sm ${selectedDoctor.licenceVerified ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {selectedDoctor.licenceVerified ? 'Verified' : 'Pending Verification'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-lg font-medium text-gray-700 mb-2">Professional Information</h4>
                    <div className="space-y-2">
                      <p><span className="font-medium">License Number:</span> {selectedDoctor.licenseNumber || 'N/A'}</p>
                      <p><span className="font-medium">GST Registration:</span> {selectedDoctor.gstRegistrationNumber || 'N/A'}</p>
                      <p><span className="font-medium">Hospital Affiliation:</span> {selectedDoctor.hospitalAffiliation || 'N/A'}</p>
                      <p><span className="font-medium">Consultation Fee:</span> ₹{selectedDoctor.consultationFee || 'N/A'}</p>
                      <p><span className="font-medium">Available Hours:</span> {selectedDoctor.availableHours || 'N/A'}</p>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-gray-700 mb-2">Contact Information</h4>
                    <div className="space-y-2">
                      <p><span className="font-medium">Email:</span> {selectedDoctor.email || 'N/A'}</p>
                      <p><span className="font-medium">Mobile:</span> {selectedDoctor.mobileNumber || 'N/A'}</p>
                      <p><span className="font-medium">Contact Number:</span> {selectedDoctor.contactNumber || 'N/A'}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <h4 className="text-lg font-medium text-gray-700 mb-2">Account Information</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-gray-100 rounded-lg">
                      <p className="font-medium">Created At</p>
                      <p>{formatDate(selectedDoctor.createdAt)}</p>
                    </div>
                    <div className="p-3 bg-gray-100 rounded-lg">
                      <p className="font-medium">Updated At</p>
                      <p>{formatDate(selectedDoctor.updatedAt)}</p>
                    </div>
                    <div className={`p-3 rounded-lg ${selectedDoctor.accountNonLocked ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      <p className="font-medium">Account Lock Status</p>
                      <p>{selectedDoctor.accountNonLocked ? 'Unlocked' : 'Locked'}</p>
                    </div>
                    <div className="p-3 bg-gray-100 rounded-lg">
                      <p className="font-medium">Failed Login Attempts</p>
                      <p>{selectedDoctor.failedLoginAttempts || 0}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
                <button
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                  onClick={() => setSelectedDoctor(null)}
                >
                  Close
                </button>
                <button
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                >
                  Edit Doctor
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default AllDoctor;