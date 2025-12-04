import React, { useState, useEffect } from 'react';
import axiosInstance from '../auth/axiosInstance';
import {
  FaSearch,
  FaFilter,
  FaStar,
  FaRegStar,
  FaEye,
  FaSync,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaUser,
  FaSort,
  FaSortUp,
  FaSortDown,
  FaExclamationCircle,
  FaLightbulb,
  FaComment,
  FaQuestionCircle,
  FaDesktop,
  FaMobileAlt,
  FaCalendarAlt,
  FaIdBadge,
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
  FaInfoCircle
} from 'react-icons/fa';
import { BiMessageDetail } from 'react-icons/bi';

function Feedback() {
  const [feedbackData, setFeedbackData] = useState({
    content: [],
    totalElements: 0,
    totalPages: 0,
    perPage: 10
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    userId: '',
    userName: '',
    subject: '',
    status: '',
    source: ''
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState({
    field: 'createdAt',
    order: 'Desc'
  });

  // Fetch feedback data
  const fetchFeedback = async () => {
    setLoading(true);
    setError(null);
    try {
      const requestBody = {
        filter: {
          ...(filters.subject && { subject: filters.subject }),
          ...(filters.status && { status: filters.status }),
          ...(filters.source && { source: filters.source }),
          ...(searchTerm && { search: searchTerm })
        }
      };

      const response = await axiosInstance.post(
        `/feedback/fetch?sortedField=${sortConfig.field}&perPage=${rowsPerPage}&pageNo=${page}&sortingOrder=${sortConfig.order}`,
        requestBody
      );

      if (response.data) {
        setFeedbackData(response.data);
      }
    } catch (error) {
      setError('Failed to fetch feedback data. Please try again.');
      console.error('Error fetching feedback:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedback();
  }, [page, rowsPerPage, sortConfig]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSearch = () => {
    setPage(1);
    fetchFeedback();
  };

  const handleClearFilters = () => {
    setFilters({
      userId: '',
      userName: '',
      subject: '',
      status: '',
      source: ''
    });
    setSearchTerm('');
    setPage(1);
    fetchFeedback();
  };

  // Render star rating
  const renderRating = (rating) => {
    const stars = [];
    const numericRating = parseFloat(rating) || 0;

    for (let i = 1; i <= 1; i++) {
      if (i <= Math.floor(numericRating)) {
        stars.push(<FaStar key={i} className="text-yellow-500 mr-0.5" />);
      } else if (i === Math.ceil(numericRating) && numericRating % 1 !== 0) {
        stars.push(<FaStar key={i} className="text-yellow-500 mr-0.5" />);
      } else {
        stars.push(<FaRegStar key={i} className="text-gray-300 mr-0.5" />);
      }
    }
    return (
      <div className="flex items-center">
        <span className="mr-2 font-semibold text-gray-700 ">{rating}</span>
        {stars}
      </div>
    );
  };

  // Get subject icon and color
  const getSubjectInfo = (subject) => {
    switch (subject) {
      case 'COMPLAINT':
        return {
          icon: <FaExclamationCircle />,
          color: 'text-red-600',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          label: 'Complaint'
        };
      case 'SUGGESTION':
        return {
          icon: <FaLightbulb />,
          color: 'text-orange-600',
          bgColor: 'bg-orange-50',
          borderColor: 'border-orange-200',
          label: 'Suggestion'
        };
      case 'FEEDBACK':
        return {
          icon: <FaComment />,
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          label: 'Feedback'
        };
      case 'QUERY':
        return {
          icon: <FaQuestionCircle />,
          color: 'text-blue-600',
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
          label: 'Query'
        };
      default:
        return {
          icon: <FaComment />,
          color: 'text-gray-600',
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200',
          label: subject
        };
    }
  };

  // Get status badge
  const getStatusBadge = (status) => {
    switch (status) {
      case 'NEW':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <FaClock className="mr-1" /> New
          </span>
        );
      case 'IN_PROGRESS':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <FaSync className="mr-1" /> In Progress
          </span>
        );
      case 'RESOLVED':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <FaCheckCircle className="mr-1" /> Resolved
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            <FaInfoCircle className="mr-1" /> {status || 'Unknown'}
          </span>
        );
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);

    const formattedDate = date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });

    const formattedTime = date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });

    return `${formattedDate}\n${formattedTime}`;  // 👈 new line added
  };


  // Pagination
  const renderPagination = () => {
    const pages = [];
    for (let i = 1; i <= feedbackData.totalPages; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => setPage(i)}
          className={`px-3 py-1 rounded-md ${page === i
            ? 'bg-blue-600 text-white'
            : 'bg-white text-gray-700 hover:bg-gray-50 border'
            }`}
        >
          {i}
        </button>
      );
    }
    return pages;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading feedback data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* Header */}
      <div className="mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Feedback Management</h1>
          <p className="text-gray-600 mt-1">View and manage user feedback submissions</p>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4 py-4">
          <div className="bg-white p-4 rounded-lg border border-gray-300 shadow-sm">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FaComment className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Total Feedback</p>
                <p className="text-2xl font-bold text-gray-900">{feedbackData.totalElements}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-300 shadow-sm">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <FaExclamationCircle className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Complaints</p>
                <p className="text-2xl font-bold text-gray-900">
                  {feedbackData.content.filter(f => f.subject === 'COMPLAINT').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-300 shadow-sm">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <FaLightbulb className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Suggestions</p>
                <p className="text-2xl font-bold text-gray-900">
                  {feedbackData.content.filter(f => f.subject === 'SUGGESTION').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-300 shadow-sm">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <FaClock className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">New Status</p>
                <p className="text-2xl font-bold text-gray-900">
                  {feedbackData.content.filter(f => f.status === 'NEW').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center text-gray-700">
              <FaFilter className="mr-2" />
              <span className="font-medium">Filters</span>
            </div>
            <button
              onClick={handleClearFilters}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Clear all
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Subject Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
              <select
                name="subject"
                value={filters.subject}
                onChange={handleFilterChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              >
                <option value="">All Subjects</option>
                <option value="COMPLAINT">Complaint</option>
                <option value="SUGGESTION">Suggestion</option>
                <option value="FEEDBACK">Feedback</option>
                <option value="QUERY">Query</option>
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              >
                <option value="">All Status</option>
                <option value="NEW">New</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="RESOLVED">Resolved</option>
              </select>
            </div>

            {/* Source Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Source</label>
              <select
                name="source"
                value={filters.source}
                onChange={handleFilterChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              >
                <option value="">All Sources</option>
                <option value="WEB">Web</option>
                <option value="MOBILE">Mobile</option>
              </select>
            </div>
            {/* Apply Filters Button */}
            <div className="mt-6">
              <button
                onClick={handleSearch}
                className="w-full md:w-auto px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium cursor-pointer"
              >
                Apply Filters
              </button>
            </div>
            <div className='mt-6'>
              <button
                onClick={fetchFeedback}
                className="flex items-center px-6 py-2 bg-green-500 hover:bg-green-600 rounded-lg text-white font-medium cursor-pointer"
              >
                <FaSync className="mr-2" /> Refresh
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center">
            <FaTimesCircle className="text-red-500 mr-2" />
            <span className="text-red-700">{error}</span>
          </div>
        </div>
      )}

      {/* Feedback Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">
                  <div className="flex items-center">
                    User
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-xs font-medium text-gray-500 uppercase"

                >
                  <div className="flex items-center">
                    Subject
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                >
                  <div className="flex items-center">
                    Rating
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Comments
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-xs font-medium text-gray-500 uppercase"
                >
                  <div className="flex items-center">
                    Date
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {feedbackData.content.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center">
                    <div className="text-gray-500">
                      <FaComment className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                      <p className="text-lg">No feedback found</p>
                      <p className="text-sm mt-1">Try adjusting your filters or search terms</p>
                    </div>
                  </td>
                </tr>
              ) : (
                feedbackData.content.map((item) => {
                  const subjectInfo = getSubjectInfo(item.subject);
                  return (
                    <tr key={item.id} className="hover:bg-gray-50">
                      {/* User Column */}
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <FaUser className="h-5 w-5 text-blue-600" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {item.name || 'N/A'}
                            </div>
                            <div className="text-sm text-gray-500">
                              ID: {item.userId || 'N/A'}
                            </div>
                            <div className="flex items-center mt-1 text-xs text-gray-500">
                              <FaEnvelope className="mr-1" />
                              {item.email}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Subject Column */}
                      <td className="px-6 py-4">
                        <div className={`inline-flex items-center px-3 py-1.5 rounded-full ${subjectInfo.bgColor} ${subjectInfo.borderColor} border`}>
                          <span className={`mr-2 ${subjectInfo.color}`}>
                            {subjectInfo.icon}
                          </span>
                          <span className="text-sm font-medium">{subjectInfo.label}</span>
                        </div>
                        {item.source && (
                          <div className="mt-2 text-xs text-gray-500 flex items-center">
                            {item.source === 'WEB' ? <FaDesktop /> : <FaMobileAlt />}
                            <span className="ml-1">{item.source}</span>
                          </div>
                        )}
                      </td>

                      {/* Rating Column */}
                      <td className="px-6 py-4">
                        {renderRating(item.rating)}
                      </td>

                      {/* Comments Column */}
                      <td className="px-6 py-4">
                        <div className="max-w-xs">
                          <p className="text-sm text-gray-900 line-clamp-2">
                            {item.comments}
                          </p>
                        </div>
                      </td>

                      {/* Status Column */}
                      <td className="px-6 py-4">
                        {getStatusBadge(item.status)}
                      </td>

                      {/* Date Column */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-xs text-gray-900">
                          <div className="flex items-center">
                            <FaCalendarAlt className="mr-2 text-gray-400" />
                            {formatDate(item.createdAt)}
                          </div>
                          {item.ipAddress && (
                            <div className="mt-1 text-xs text-gray-500 flex items-center">
                              <FaMapMarkerAlt className="mr-1" />
                              IP: {item.ipAddress}
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {feedbackData.totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing <span className="font-medium">{(page - 1) * rowsPerPage + 1}</span> to{' '}
                <span className="font-medium">
                  {Math.min(page * rowsPerPage, feedbackData.totalElements)}
                </span>{' '}
                of <span className="font-medium">{feedbackData.totalElements}</span> entries
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                  disabled={page === 1}
                  className="px-3 py-1 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Previous
                </button>
                <div className="flex space-x-1">
                  {renderPagination()}
                </div>
                <button
                  onClick={() => setPage(prev => Math.min(prev + 1, feedbackData.totalPages))}
                  disabled={page === feedbackData.totalPages}
                  className="px-3 py-1 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-700">Rows per page:</span>
                <select
                  value={rowsPerPage}
                  onChange={(e) => setRowsPerPage(parseInt(e.target.value))}
                  className="border rounded-md px-2 py-1"
                >
                  <option value="10">10</option>
                  <option value="20">20</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Feedback;