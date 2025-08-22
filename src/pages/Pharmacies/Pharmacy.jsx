import React, { useState, useEffect } from 'react';
import AddPharmacy from './AddPharmacy';

const PharmacyTable = () => {
  const [pharmacies, setPharmacies] = useState([]);
  const [filteredPharmacies, setFilteredPharmacies] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [expandedRow, setExpandedRow] = useState(null);
  const [addModal, setAddModal] = useState(false);

  // Sample data with enhanced information
  useEffect(() => {
    const sampleData = [
      {
        id: 1,
        name: "MediCare Pharmacy",
        address: "123 Main St, Cityville",
        contact: "(555) 123-4567",
        email: "contact@medicarepharmacy.com",
        status: "Open",
        hours: "8:00 AM - 10:00 PM",
        distance: "0.8 miles",
        rating: 4.7,
        reviewCount: 128,
        requirements: ["Prescription", "ID Proof", "Insurance Card"],
        medications: ["Paracetamol", "Amoxicillin", "Insulin", "Lipitor", "Ventolin"],
        waitTime: "10-15 min",
        services: ["Prescription Filling", "Health Consultations", "Vaccinations", "Home Delivery"],
        paymentMethods: ["Credit Card", "Debit Card", "Insurance", "Cash"],
        pharmacist: "Dr. Sarah Johnson",
        yearsInBusiness: 12
      },
      {
        id: 2,
        name: "HealthPlus Pharmacy",
        address: "456 Oak Ave, Townsville",
        contact: "(555) 987-6543",
        email: "info@healthplus.com",
        status: "Open",
        hours: "24/7",
        distance: "1.2 miles",
        rating: 4.9,
        reviewCount: 245,
        requirements: ["Prescription", "ID Proof"],
        medications: ["Ibuprofen", "Lipitor", "Metformin", "Omeprazole", "Atorvastatin"],
        waitTime: "5-10 min",
        services: ["Prescription Filling", "Compounding", "Health Screenings", "24/7 Service"],
        paymentMethods: ["Credit Card", "Debit Card", "Insurance", "HSA", "Cash"],
        pharmacist: "Dr. Michael Chen",
        yearsInBusiness: 8
      },
      {
        id: 3,
        name: "QuickMeds",
        address: "789 Pine Rd, Villageton",
        contact: "(555) 456-7890",
        email: "support@quickmeds.com",
        status: "Closed",
        hours: "9:00 AM - 9:00 PM",
        distance: "2.5 miles",
        rating: 4.3,
        reviewCount: 87,
        requirements: ["Prescription", "Doctor's Note"],
        medications: ["Aspirin", "Atorvastatin", "Ventolin", "Metoprolol", "Simvastatin"],
        waitTime: "15-20 min",
        services: ["Prescription Filling", "Quick Pickup", "Online Orders"],
        paymentMethods: ["Credit Card", "Debit Card", "Cash"],
        pharmacist: "Dr. Emily Williams",
        yearsInBusiness: 5
      },
      {
        id: 4,
        name: "City Drugstore",
        address: "321 Elm Blvd, Metropolis",
        contact: "(555) 234-5678",
        email: "hello@citydrugstore.com",
        status: "Open",
        hours: "7:00 AM - 11:00 PM",
        distance: "1.8 miles",
        rating: 4.5,
        reviewCount: 156,
        requirements: ["Prescription", "ID Proof", "Insurance Card"],
        medications: ["Omeprazole", "Albuterol", "Simvastatin", "Amlodipine", "Levothyroxine"],
        waitTime: "20-25 min",
        services: ["Prescription Filling", "Compounding", "Health Consultations"],
        paymentMethods: ["Credit Card", "Debit Card", "Insurance", "HSA", "Cash"],
        pharmacist: "Dr. Robert Kim",
        yearsInBusiness: 15
      },
      {
        id: 5,
        name: "Village Pharmacy",
        address: "654 Maple Ln, Countryside",
        contact: "(555) 876-5432",
        email: "care@villagepharmacy.com",
        status: "Limited",
        hours: "9:00 AM - 5:00 PM",
        distance: "3.2 miles",
        rating: 4.6,
        reviewCount: 94,
        requirements: ["Prescription"],
        medications: ["Levothyroxine", "Amlodipine", "Metoprolol", "Losartan", "Gabapentin"],
        waitTime: "5 min",
        services: ["Prescription Filling", "Home Delivery", "Senior Discounts"],
        paymentMethods: ["Credit Card", "Debit Card", "Insurance", "Cash"],
        pharmacist: "Dr. Amanda Rodriguez",
        yearsInBusiness: 10
      }
    ];
    setPharmacies(sampleData);
    setFilteredPharmacies(sampleData);
  }, []);

  // Filter and search logic
  useEffect(() => {
    let result = pharmacies;

    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter(pharmacy => pharmacy.status === statusFilter);
    }

    // Apply search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(pharmacy =>
        pharmacy.name.toLowerCase().includes(term) ||
        pharmacy.address.toLowerCase().includes(term) ||
        pharmacy.medications.some(med => med.toLowerCase().includes(term)) ||
        pharmacy.services.some(service => service.toLowerCase().includes(term))
      );
    }

    setFilteredPharmacies(result);
  }, [searchTerm, statusFilter, pharmacies]);

  // Sorting logic
  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });

    const sortedData = [...filteredPharmacies].sort((a, b) => {
      // Handle numeric values differently
      if (key === 'rating' || key === 'distance') {
        const aValue = key === 'distance' ? parseFloat(a[key]) : a[key];
        const bValue = key === 'distance' ? parseFloat(b[key]) : b[key];
        return direction === 'ascending' ? aValue - bValue : bValue - aValue;
      }

      // Handle string values
      if (a[key] < b[key]) {
        return direction === 'ascending' ? -1 : 1;
      }
      if (a[key] > b[key]) {
        return direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });

    setFilteredPharmacies(sortedData);
  };

  // Toggle row expansion
  const toggleExpand = (id) => {
    if (expandedRow === id) {
      setExpandedRow(null);
    } else {
      setExpandedRow(id);
    }
  };

  // Render star ratings
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={i} className="text-yellow-400">★</span>);
    }

    if (hasHalfStar) {
      stars.push(<span key="half" className="text-yellow-400">★</span>);
    }

    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<span key={`empty-${i}`} className="text-gray-300">★</span>);
    }

    return stars;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className='flex justify-between items-center'>
          <div>
            <h1 className="text-3xl font-bold text-blue-800 mb-2">Pharmacy Finder</h1>
            <p className="text-gray-600 mb-6">Find available pharmacies and their complete information</p>
          </div>
          <button onClick={() => setAddModal(true)} className='submit-btn'>Add Pharmacy</button>
        </div>
        {/* Filters and Search */}
        <div className="bg-white p-4 rounded-lg shadow-md mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                Search Pharmacies
              </label>
              <input
                type="text"
                id="search"
                placeholder="Search by name, address, medication, or service..."
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                Filter by Status
              </label>
              <select
                id="status"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="Open">Open</option>
                <option value="Closed">Closed</option>
                <option value="Limited">Limited Hours</option>
              </select>
            </div>
          </div>
        </div>

        {/* Pharmacy Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Pharmacy Info
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('status')}
                  >
                    Status {sortConfig.key === 'status' && (
                      <span>{sortConfig.direction === 'ascending' ? '↑' : '↓'}</span>
                    )}
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('rating')}
                  >
                    Rating {sortConfig.key === 'rating' && (
                      <span>{sortConfig.direction === 'ascending' ? '↑' : '↓'}</span>
                    )}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPharmacies.length > 0 ? (
                  filteredPharmacies.map((pharmacy) => (
                    <React.Fragment key={pharmacy.id}>
                      <tr className="hover:bg-gray-50 cursor-pointer" onClick={() => toggleExpand(pharmacy.id)}>
                        <td className="px-6 py-4">
                          <div className="font-medium text-gray-900">{pharmacy.name}</div>
                          <div className="text-sm text-gray-500">{pharmacy.address}</div>
                          <div className="text-sm text-blue-600">{pharmacy.contact}</div>
                          <div className="text-xs text-gray-400">{pharmacy.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${pharmacy.status === 'Open'
                              ? 'bg-green-100 text-green-800'
                              : pharmacy.status === 'Closed'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                            {pharmacy.status}
                          </span>
                          <div className="text-xs text-gray-500 mt-1">{pharmacy.hours}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {renderStars(pharmacy.rating)}
                            <span className="ml-1 text-sm font-medium text-gray-700">
                              {pharmacy.rating} ({pharmacy.reviewCount})
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            className="text-blue-600 hover:text-blue-900 mr-3"
                            onClick={(e) => {
                              e.stopPropagation();
                              // Handle contact action
                            }}
                          >
                            Contact
                          </button>
                          <button
                            className="text-green-600 hover:text-green-900"
                            onClick={(e) => {
                              e.stopPropagation();
                              // Handle select action
                            }}
                          >
                            Select
                          </button>
                        </td>
                      </tr>
                      {expandedRow === pharmacy.id && (
                        <tr className="bg-blue-50">
                          <td colSpan="5" className="px-6 py-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div>
                                <h4 className="font-semibold text-blue-800 mb-2">Requirements</h4>
                                <ul className="list-disc list-inside text-sm text-gray-700 pl-2">
                                  {pharmacy.requirements.map((req, index) => (
                                    <li key={index}>{req}</li>
                                  ))}
                                </ul>

                                <h4 className="font-semibold text-blue-800 mt-4 mb-2">Pharmacist</h4>
                                <p className="text-sm text-gray-700">{pharmacy.pharmacist}</p>
                                <p className="text-xs text-gray-500">{pharmacy.yearsInBusiness} years in business</p>
                              </div>

                              <div>
                                <h4 className="font-semibold text-blue-800 mb-2">Available Medications</h4>
                                <div className="flex flex-wrap gap-1">
                                  {pharmacy.medications.map((med, index) => (
                                    <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                      {med}
                                    </span>
                                  ))}
                                </div>

                                <h4 className="font-semibold text-blue-800 mt-4 mb-2">Payment Methods</h4>
                                <div className="flex flex-wrap gap-1">
                                  {pharmacy.paymentMethods.map((method, index) => (
                                    <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                      {method}
                                    </span>
                                  ))}
                                </div>
                              </div>

                              <div>
                                <h4 className="font-semibold text-blue-800 mb-2">Services Offered</h4>
                                <ul className="list-disc list-inside text-sm text-gray-700 pl-2">
                                  {pharmacy.services.map((service, index) => (
                                    <li key={index}>{service}</li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                      No pharmacies found matching your criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {addModal && (
        <div
          className="fixed inset-0 backdrop-brightness-50 flex items-center justify-center z-50"
          onClick={() => { setAddModal(false) }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="main_bg rounded-lg shadow-lg transform transition-all duration-300 scale-100 animate-modalFade p-6"
          >
            <div className="flex justify-between items-center border-b pb-3 mb-4">
              <h2 className='text-lg font-semibold'>Add Pharmacy</h2>
              <button
                onClick={() => { setAddModal(false) }}
                className="text-gray-500 hover:text-red-500 text-2xl font-bold cursor-pointer"
              >
                &times;
              </button>
            </div>
            <AddPharmacy onClose={() => setAddModal(false)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default PharmacyTable;