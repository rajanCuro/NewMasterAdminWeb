import React, { useState } from 'react';

function AllPharmacy({ data }) {
  const [selectedPharmacy, setSelectedPharmacy] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  if (!data || !data.pharmacies) {
    return (
      <div className="p-6 text-center text-gray-500">
        No pharmacy data available
      </div>
    );
  }

  const filteredPharmacies = data.pharmacies.filter(pharmacy =>
    pharmacy.pharmacyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pharmacy.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
      <div className=" mx-auto">      
        
        {/* Search and Filter Bar */}
        <div className="rounded-lg mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search by name or email..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 cursor-pointer bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
                Filter
              </button>
              <button className="px-4 py-2 cursor-pointer bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition">
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* Stats Summary */}
       

        {/* Pharmacy List */}
        <div className="bg-white rounded-lg shadow overflow-hidden max-h-[50vh] overflow-y-auto">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
             <tr className='bg-gray-400 text-white'>
                  <th className="px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider">
                    Pharmacy
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPharmacies.map((pharmacy) => (
                  <tr 
                    key={pharmacy.id} 
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => setSelectedPharmacy(pharmacy)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          {pharmacy.profilePicture ? (
                            <img
                              className="h-10 w-10 rounded-full object-cover"
                              src={pharmacy.profilePicture}
                              alt="Profile"
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                              <span className="text-gray-500 text-sm">
                                {pharmacy.pharmacyName?.charAt(0) || 'P'}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {pharmacy.pharmacyName || 'Unnamed Pharmacy'}
                          </div>
                          <div className="text-sm text-gray-500">
                            {pharmacy.pharmacyType || 'N/A'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{pharmacy.email}</div>
                      <div className="text-sm text-gray-500">{pharmacy.mobileNumber || 'No phone'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col gap-1">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${pharmacy.verified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                          {pharmacy.verified ? 'Verified' : 'Pending'}
                        </span>
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${pharmacy.enabled ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'}`}>
                          {pharmacy.enabled ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(pharmacy.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        className="text-blue-600 hover:text-blue-900 mr-3"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedPharmacy(pharmacy);
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

        {/* Pharmacy Detail Modal */}
        {selectedPharmacy && (
          <div className="fixed inset-0 backdrop-brightness-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-xl font-semibold text-gray-800">
                  {selectedPharmacy.pharmacyName || 'Pharmacy Details'}
                </h3>
                <button
                  className="text-gray-400 hover:text-gray-500"
                  onClick={() => setSelectedPharmacy(null)}
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-lg font-medium text-gray-700 mb-2">Basic Information</h4>
                    <div className="space-y-2">
                      <p><span className="font-medium">Name:</span> {selectedPharmacy.pharmacyName || 'N/A'}</p>
                      <p><span className="font-medium">Type:</span> {selectedPharmacy.pharmacyType || 'N/A'}</p>
                      <p><span className="font-medium">License #:</span> {selectedPharmacy.licenseNumber || 'N/A'}</p>
                      <p><span className="font-medium">GST #:</span> {selectedPharmacy.gstRegistrationNumber || 'N/A'}</p>
                      <p><span className="font-medium">Business Reg #:</span> {selectedPharmacy.businessRegistrationNumber || 'N/A'}</p>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-gray-700 mb-2">Contact Information</h4>
                    <div className="space-y-2">
                      <p><span className="font-medium">Email:</span> {selectedPharmacy.email || 'N/A'}</p>
                      <p><span className="font-medium">Phone:</span> {selectedPharmacy.mobileNumber || 'N/A'}</p>
                      <p><span className="font-medium">Owner:</span> {selectedPharmacy.firstName} {selectedPharmacy.lastName}</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6">
                  <h4 className="text-lg font-medium text-gray-700 mb-2">Status Information</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className={`p-3 rounded-lg ${selectedPharmacy.verified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      <p className="font-medium">Verification</p>
                      <p>{selectedPharmacy.verified ? 'Verified' : 'Pending Verification'}</p>
                    </div>
                    <div className={`p-3 rounded-lg ${selectedPharmacy.enabled ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'}`}>
                      <p className="font-medium">Account Status</p>
                      <p>{selectedPharmacy.enabled ? 'Active' : 'Inactive'}</p>
                    </div>
                    <div className={`p-3 rounded-lg ${selectedPharmacy.accountNonLocked ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      <p className="font-medium">Lock Status</p>
                      <p>{selectedPharmacy.accountNonLocked ? 'Unlocked' : 'Locked'}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-gray-100 text-gray-800">
                      <p className="font-medium">Failed Login Attempts</p>
                      <p>{selectedPharmacy.failedLoginAttempts || 0}</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6">
                  <h4 className="text-lg font-medium text-gray-700 mb-2">Dates</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-gray-100 rounded-lg">
                      <p className="font-medium">Created At</p>
                      <p>{formatDate(selectedPharmacy.createdAt)}</p>
                    </div>
                    <div className="p-3 bg-gray-100 rounded-lg">
                      <p className="font-medium">Updated At</p>
                      <p>{formatDate(selectedPharmacy.updatedAt)}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
                <button
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                  onClick={() => setSelectedPharmacy(null)}
                >
                  Close
                </button>
                <button
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                >
                  Edit Pharmacy
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default AllPharmacy;