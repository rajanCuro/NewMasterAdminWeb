import React, { useEffect, useState } from 'react';
import axiosInstance from '../../auth/axiosInstance';
import Loader from '../Loader';
import NoDataPage from '../../NodataPage';

function Pharmacy({ id }) {
  const [allPharmacy, setAllPharmacy] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/api/field-executive/getAgentStatistics/${id}`);
      console.log(response.data.pharmacies);
      setAllPharmacy(response.data.pharmacies);
    } catch (error) {
      console.error(error);
      setError('Failed to fetch pharmacy data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
     <Loader/>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-lg text-red-600">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      {/* <h2 className="text-2xl font-bold mb-4 text-gray-800">Pharmacies</h2> */}
      {allPharmacy.length === 0 ? (
        <NoDataPage/>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
            <thead>
              <tr className="bg-gray-100 border-b">
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Pharmacy Name</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Email</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Mobile</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Type</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Profile Picture</th>
              </tr>
            </thead>
            <tbody>
              {allPharmacy.map((pharmacy) => (
                <tr key={pharmacy.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4 text-gray-600">{pharmacy.pharmacyName}</td>
                  <td className="py-3 px-4 text-gray-600">{pharmacy.email}</td>
                  <td className="py-3 px-4 text-gray-600">{pharmacy.mobileNumber}</td>
                  <td className="py-3 px-4 text-gray-600">{pharmacy.pharmacyType}</td>
                  <td className="py-3 px-4">
                    {pharmacy.profilePicture ? (
                      <img
                        src={pharmacy.profilePicture}
                        alt="Profile"
                        className="w-12 h-12 object-cover rounded"
                      />
                    ) : (
                      <span className="text-gray-400">No Image</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Pharmacy;