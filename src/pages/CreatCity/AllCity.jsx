import React, { useEffect, useState } from 'react';
import Pagination from '../Pagination';
import axiosInstance from '../../auth/axiosInstance';
import CityCreate from './CityCreate';

function AllCities() {
  const [citiesList, setCitiesList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10); // Reduced for better pagination demo
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    getAllCitiesList();
  }, [currentPage, itemsPerPage]);

  const getAllCitiesList = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get(
        `/area/getAllCities?page=${currentPage}&pageSize=${itemsPerPage}`
      );
      console.log("city", response);
      const { cityList, totalItems, totalPages } = response.data;
      setCitiesList(cityList || []);
      setTotalItems(totalItems || 0);
      setTotalPages(totalPages || 0); 
    } catch (error) {
      console.log('Error fetching cities list:', error);
      setCitiesList([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-4 flex flex-col">
      <div className="mx-auto flex-grow flex flex-col w-full">
        <div className='flex justify-between mb-4'>
          <div>
            <h1 className="text-2xl font-bold">All City List</h1>
            <p className="mt-1">Administrative cities information</p>
          </div>
          <div>
            <button onClick={() => setOpenModal(true)} className='submit-btn'>Create City</button>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow flex flex-col flex-grow overflow-hidden">
          {isLoading ? (
            <div className="flex justify-center items-center py-12 flex-grow">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              <span className="ml-4 text-gray-600">Loading cities...</span>
            </div>
          ) : citiesList.length === 0 ? (
            <div className="text-center py-12 flex-grow">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="mt-2 text-lg font-medium text-gray-900">No cities found</h3>
              <p className="mt-1 text-gray-500">There are currently no cities available.</p>
            </div>
          ) : (
            <div className="flex flex-col flex-grow overflow-hidden">
              {/* Table container with fixed header and scrollable body */}
              <div className="overflow-auto flex-grow">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-100 sticky top-0 z-10">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider bg-gray-100">Sr.No</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider bg-gray-100">City Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider bg-gray-100">Area</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider bg-gray-100">Population</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider bg-gray-100">Zone</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider bg-gray-100">Zone Code</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {citiesList.map((city, index) => (
                      <tr key={city.id} className="hover:bg-gray-50 transition-colors duration-150">
                        <td className="px-6 py-4 whitespace-nowrap">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                        <td className="px-6 py-4 text-blue-600 whitespace-nowrap">{city.cityName}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{city.area}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{city.populationInMillion ? `${city.populationInMillion} million` : 'N/A'}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{city.zone?.zoneName || 'N/A'}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{city.zone?.zoneCode || 'N/A'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Fixed pagination at the bottom */}
              <div className="sticky bottom-0 bg-white border-t border-gray-200 px-4 py-3 mt-auto">
                <Pagination
                  currentPage={currentPage}
                  totalItems={totalItems}
                  totalPages={totalPages}
                  itemsPerPage={itemsPerPage}
                  onPageChange={setCurrentPage}
                  onItemsPerPageChange={setItemsPerPage}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {openModal && (
        <div
          className="fixed inset-0 backdrop-brightness-50 flex items-center justify-center z-50 p-4"
          onClick={() => { setOpenModal(false); }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-lg shadow-lg w-full max-w-md transform transition-all duration-300 scale-100 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center border-b p-4 sticky top-0 bg-white z-10">
              <h2 className="text-xl font-semibold text-gray-800">
                Create New City
              </h2>
              <button
                onClick={() => { setOpenModal(false); }}
                className="text-gray-500 hover:text-red-500 text-2xl font-bold cursor-pointer"
              >
                &times;
              </button>
            </div>
            <div className="p-4">
              <CityCreate 
                onClose={() => setOpenModal(false)}
                refresh={getAllCitiesList}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AllCities;