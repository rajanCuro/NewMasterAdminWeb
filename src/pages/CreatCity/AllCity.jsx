import React, { useEffect, useState } from 'react';
import Pagination from '../Pagination';
import axiosInstance from '../../auth/axiosInstance';
import CityCreate from './CityCreate';
import Loader from '../Loader';
import NoDataPage from '../../NodataPage';

function AllCities() {
  const [citiesList, setCitiesList] = useState([]);
  const [filteredCities, setFilteredCities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [openModal, setOpenModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    getAllCitiesList();
  }, [currentPage, itemsPerPage]);

  useEffect(() => {
    // Filter cities based on search query
    if (searchQuery.trim() === '') {
      setFilteredCities(citiesList);
    } else {
      const filtered = citiesList.filter(city => 
        city.cityName.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredCities(filtered);
    }
  }, [searchQuery, citiesList]);

  const getAllCitiesList = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get(
        `/area/getAllCities?page=${currentPage}&pageSize=${itemsPerPage}`
      );
      console.log("city", response);
      const { cityList, totalItems, totalPages } = response.data;
      setCitiesList(cityList || []);
      setFilteredCities(cityList || []); // Initialize filtered list with all cities
      setTotalItems(totalItems || 0);
      setTotalPages(totalPages || 0);
    } catch (error) {
      console.log('Error fetching cities list:', error);
      setCitiesList([]);
      setFilteredCities([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const clearSearch = () => {
    setSearchQuery('');
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

        {/* Search Bar */}
        <div className="mb-4 flex items-center">
          <div className="relative flex-grow max-w-md">
            <input
              type="text"
              placeholder="Search by city name..."
              value={searchQuery}
              onChange={handleSearch}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            />
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow flex flex-col flex-grow overflow-hidden">
          {isLoading ? (
            <Loader />
          ) : filteredCities.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8">
              {searchQuery ? (
                <div className="text-center">
                  <p className="text-gray-500 text-lg">No cities found matching "{searchQuery}"</p>
                  <button 
                    onClick={clearSearch}
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                  >
                    Clear Search
                  </button>
                </div>
              ) : (
                <NoDataPage />
              )}
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
                    {filteredCities.map((city, index) => (
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
                  totalItems={searchQuery ? filteredCities.length : totalItems}
                  totalPages={searchQuery ? Math.ceil(filteredCities.length / itemsPerPage) : totalPages}
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