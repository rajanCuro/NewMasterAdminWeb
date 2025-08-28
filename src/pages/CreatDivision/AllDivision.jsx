import React, { useEffect, useState } from 'react';
import axiosInstance from '../../auth/axiosInstance';
import Pagination from '../Pagination';
import DivisionCreate from './DivisionCreate';

function Division() {
  const [divisionsList, setDivisionsList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(100);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    getAllDivisionsList();
  }, [currentPage, itemsPerPage]);

  const getAllDivisionsList = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get(
        `/area/getAllDivisions?page=${currentPage}&pageSize=${itemsPerPage}`
      );
      const { divisionList, totalItems, totalPages } = response.data;
      setDivisionsList(divisionList || []);
      setTotalItems(totalItems || 0);
      setTotalPages(totalPages || 0);
    } catch (error) {
      console.log('Error fetching division list:', error);
      setDivisionsList([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-4">
      <div className="mx-auto">
        <div className='flex justify-between'>
          <div>
            <h1 className="text-2xl font-bold">Division List</h1>
            <p className="mt-1">Administrative divisions information</p>
          </div>
          <div>
            <button onClick={() => setOpenModal(true)} className='submit-btn'>CreateDivision</button>
          </div>
        </div>

        <div className="p-6">
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              <span className="ml-4 text-gray-600">Loading divisions...</span>
            </div>
          ) : divisionsList.length === 0 ? (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="mt-2 text-lg font-medium text-gray-900">No divisions found</h3>
              <p className="mt-1 text-gray-500">There are currently no divisions available.</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Sr.No</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Division Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Zone Code</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Area</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Population</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Districts</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {[...divisionsList].reverse().map((division,index) => (
                      <tr key={division.id} className="hover:bg-gray-50 transition-colors duration-150">
                        <td className="px-6 py-4">{index+1}</td>
                        <td className="px-6 py-4 text-blue-600">{division.zoneName}</td>
                        <td className="px-6 py-4">{division.zoneCode}</td>
                        <td className="px-6 py-4">{division.area}</td>
                        <td className="px-6 py-4">{division.populationInMillion ? `${division.populationInMillion} million` : 'N/A'}</td>
                        <td className="px-6 py-4">{division.noOfDistricts || 0}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* ✅ Pagination Here */}
              <div className="sticky bottom-0 bg-white border-t border-gray-200 px-4 py-3">
                <Pagination
                  currentPage={currentPage}
                  totalItems={totalItems}
                  totalPages={totalPages}
                  itemsPerPage={itemsPerPage}
                  onPageChange={setCurrentPage}
                  onItemsPerPageChange={setItemsPerPage}
                />
              </div>
            </>
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
                Creat New Division
              </h2>
              <button
                onClick={() => { setOpenModal(false); }}
                className="text-gray-500 hover:text-red-500 text-2xl font-bold cursor-pointer"
              >
                &times;
              </button>
            </div>
            <div className="p-4">
              <DivisionCreate 
              onClose={() =>setOpenModal(false)}
              refresh={getAllDivisionsList}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Division;
