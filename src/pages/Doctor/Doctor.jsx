import React, { useState, useMemo } from "react";
import { FaEdit, FaPlus, FaEye } from "react-icons/fa";
import AddDoctor from './AddDoctor';
import Swal from "sweetalert2";
import ViewDoctor from "./ViewDoctor";

// Generate 50 fake doctors
const generateDoctors = () => {
  const specializations = ["Oncologist", "Radiologist", "Hematologist", "Surgeon", "Pathologist"];
  const doctors = [];

  for (let i = 1; i <= 50; i++) {
    const randomSpec = specializations[Math.floor(Math.random() * specializations.length)];
    doctors.push({
      id: i,
      name: `Dr. ${i % 2 ? 'Jane' : 'John'} Doe ${i}`,
      specialization: randomSpec,
      experience: Math.floor(Math.random() * 20) + 1,
      licenseNumber: `LIC${1000 + i}`,
      phone: `+91-90000${i.toString().padStart(4, "0")}`,
      email: `doctor${i}@curo24.com`,
      status: Math.random() > 0.3 ? "active" : "inactive" // Random status
    });
  }

  return doctors;
};

const DoctorList = () => {
  const [doctors, setDoctors] = useState(generateDoctors());
  const [filter, setFilter] = useState("All");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [viewDoctorData, setViewDoctorData] = useState(null); // Renamed to avoid conflict
  const [viewDoctorModal, setViewDoctorModal] = useState(false);
  const [doctorModal, setAddDoctorModal] = useState(false);
  const [editData, setEditData] = useState(null);

  // Calculate statistics for cards
  const doctorStats = useMemo(() => {
    const total = doctors.length;
    const active = doctors.filter(doc => doc.status === "active").length;
    const inactive = total - active;
    
    return { total, active, inactive };
  }, [doctors]);

  // Get unique specializations for filter dropdown
  const specializations = ["All", ...new Set(doctors.map(doc => doc.specialization))];

  // Filter doctors based on selected specialization
  const filteredDoctors = filter === "All"
    ? doctors
    : doctors.filter(doc => doc.specialization === filter);

  // Handle sorting
  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  // Apply sorting
  const sortedDoctors = useMemo(() => {
    if (!sortConfig.key) return filteredDoctors;

    return [...filteredDoctors].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });
  }, [filteredDoctors, sortConfig]);

  // Handle status change
  const handleStatusChange = (doctor, newStatus) => {
    Swal.fire({
      title: `Are you sure?`,
      text: `You are about to ${newStatus === 'active' ? 'activate' : 'deactivate'} Dr. ${doctor.name}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: newStatus === 'active' ? '#10B981' : '#EF4444',
      cancelButtonColor: '#6B7280',
      confirmButtonText: `Yes, ${newStatus === 'active' ? 'Activate' : 'Deactivate'}`,
    }).then((result) => {
      if (result.isConfirmed) {
        // Update the doctor status in state
        setDoctors(prevDoctors => 
          prevDoctors.map(doc => 
            doc.id === doctor.id ? { ...doc, status: newStatus } : doc
          )
        );

        Swal.fire({
          title: 'Updated!',
          text: `Dr. ${doctor.name} has been ${newStatus === 'active' ? 'activated' : 'deactivated'}.`,
          icon: 'success',
          timer: 2000,
          showConfirmButton: false,
        });
      }
    });
  };

  const handleEdit = (data) => {
    setEditData(data);
    setAddDoctorModal(true);
  };

  const handleViewDoctor = (data) => {
    setViewDoctorData(data);
    setViewDoctorModal(true);
  };

  return (
    <>
      <div className="w-full mx-auto">
        {/* Stats Cards Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-1">
          {/* Total Doctors Card */}
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">Total Doctors</h3>
                <p className="text-2xl font-semibold text-gray-900">{doctorStats.total}</p>
              </div>
            </div>
          </div>

          {/* Active Doctors Card */}
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">Active Doctors</h3>
                <p className="text-2xl font-semibold text-gray-900">{doctorStats.active}</p>
              </div>
            </div>
          </div>

          {/* Inactive Doctors Card */}
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-red-500">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                  <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">Inactive Doctors</h3>
                <p className="text-2xl font-semibold text-gray-900">{doctorStats.inactive}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 rounded-md bg-green-50 sticky top-0 z-10">
          {/* Title and count section */}
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold text-gray-800">Doctors Directory</h1>
            <p className="text-gray-600">Total: {filteredDoctors.length} doctors found</p>
          </div>

          {/* Controls section */}
          
            {/* Filter dropdown */}
            <div className="flex items-center">
              <label htmlFor="specialization-filter" className="mr-2 text-gray-700 font-medium whitespace-nowrap">
                Filter :
              </label>
              <select
                id="specialization-filter"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full xs:w-auto"
              >
                {specializations.map(spec => (
                  <option key={spec} value={spec}>{spec}</option>
                ))}
              </select>
            </div>

            {/* Add Doctor button */}
            <button
              onClick={() => setAddDoctorModal(true)}
              className="flex cursor-pointer items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 whitespace-nowrap"
            >
              <FaPlus className="mr-2" />
              Doctor
            </button>
        
        </div>

        {/* Doctors table */}
        <div className="bg-white rounded-lg shadow overflow-hidden mt-4">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('name')}
                  >
                    Name {sortConfig.key === 'name' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('specialization')}
                  >
                    Specialty {sortConfig.key === 'specialization' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('experience')}
                  >
                    Experience {sortConfig.key === 'experience' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    License
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedDoctors.map((doc) => (
                  <tr onDoubleClick={() => handleViewDoctor(doc)} key={doc.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{doc.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {doc.specialization}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {doc.experience} years
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {doc.licenseNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div>{doc.phone}</div>
                      <div className="text-blue-600">{doc.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        doc.status === "active" 
                          ? "bg-green-100 text-green-800" 
                          : "bg-red-100 text-red-800"
                      }`}>
                        {doc.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleViewDoctor(doc)}
                          className="hover:bg-gray-100 cursor-pointer text-gray-600 rounded-full p-2 transition duration-200"
                          title="View Doctor"
                        >
                          <FaEye size={16} />
                        </button>
                        <button
                          onClick={() => handleEdit(doc)}
                          className="hover:bg-blue-100 cursor-pointer text-blue-600 rounded-full p-2 transition duration-200"
                          title="Edit Doctor"
                        >
                          <FaEdit size={16} />
                        </button>
                        {doc.status === "active" ? (
                          <button
                            onClick={() => handleStatusChange(doc, "inactive")}
                            className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 px-2 py-1 rounded-md text-xs font-medium transition-colors"
                          >
                            Deactivate
                          </button>
                        ) : (
                          <button
                            onClick={() => handleStatusChange(doc, "active")}
                            className="text-green-600 hover:text-green-900 bg-green-50 hover:bg-green-100 px-2 py-1 rounded-md text-xs font-medium transition-colors"
                          >
                            Activate
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {sortedDoctors.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No doctors found with the selected specialization.
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Doctor Modal */}
      {doctorModal && (
        <div className="fixed inset-0 backdrop-brightness-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-5xl relative flex flex-col max-h-[90vh]">
            <div className="p-4 border-b rounded-t-2xl border-gray-200 flex justify-between items-center sticky top-0 bg-white z-10">
              {editData ?
                <h3 className="text-xl font-semibold text-gray-800">Update Doctor Details</h3> :
                <h3 className="text-xl font-semibold text-gray-800">Doctor Onboarding Form</h3>
              }
              <button
                onClick={() => { setAddDoctorModal(false); setEditData(null); }}
                className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-colors duration-150"
                aria-label="Close modal"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="overflow-y-auto p-6">
              <AddDoctor EditData={editData} />
            </div>
          </div>
        </div>
      )}

      {/* View Doctor Modal */}
      {viewDoctorModal && (
        <div className="fixed inset-0 backdrop-brightness-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl relative flex flex-col max-h-[90vh]">
            <div className="p-4 border-b rounded-t-2xl border-gray-200 flex justify-between items-center sticky top-0 bg-white z-10">
              <h3 className="text-xl font-semibold text-gray-800">Doctor Details</h3>
              <button
                onClick={() => { setViewDoctorModal(false); setViewDoctorData(null); }}
                className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-colors duration-150"
                aria-label="Close modal"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="overflow-y-auto p-6">
              <ViewDoctor viewData={viewDoctorData} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DoctorList;