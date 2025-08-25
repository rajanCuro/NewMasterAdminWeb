import React, { useState } from 'react';
import { FaStar, FaPhone, FaEnvelope, FaFileMedical, FaUserMd } from 'react-icons/fa';

const ViewDoctor = ({ viewData }) => {
  const [activeTab, setActiveTab] = useState('overview');
  
  // Static doctor image (in a real app, this would come from the database)
  const doctorImage = "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80";
  
  // Static ratings data
  const ratings = {
    average: 4.7,
    total: 128,
    breakdown: [95, 20, 8, 3, 2] // 5-star to 1-star counts
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header Section */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
        <div className="md:flex">
          {/* Doctor Image */}
          <div className="md:flex-shrink-0 md:w-64 p-6 flex flex-col items-center">
            <div className="relative">
              <img
                className="h-48 w-48 rounded-full object-cover border-4 border-blue-100"
                src={doctorImage}
                alt={viewData.name}
              />
              <div className="absolute -bottom-2 left-0 right-0 flex justify-center">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${viewData.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {viewData.status === 'active' ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
            
            {/* Rating Section */}
            <div className="mt-6 text-center">
              <div className="flex items-center justify-center">
                {[...Array(5)].map((_, i) => (
                  <FaStar
                    key={i}
                    className={`h-5 w-5 ${i < Math.floor(ratings.average) ? 'text-yellow-400' : 'text-gray-300'}`}
                  />
                ))}
                <span className="ml-2 text-gray-700 font-bold">{ratings.average}</span>
              </div>
              <p className="text-sm text-gray-500 mt-1">{ratings.total} reviews</p>
            </div>
          </div>
          
          {/* Doctor Info */}
          <div className="p-8 flex-1">
            <div className="uppercase tracking-wide text-sm text-blue-500 font-semibold">
              {viewData.specialization}
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mt-1">{viewData.name}</h1>
            <p className="mt-2 text-gray-600">License: {viewData.licenseNumber}</p>
            
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center">
                <FaUserMd className="text-blue-500 mr-3" />
                <span className="text-gray-700">{viewData.experience} years experience</span>
              </div>
              <div className="flex items-center">
                <FaPhone className="text-blue-500 mr-3" />
                <span className="text-gray-700">{viewData.phone}</span>
              </div>
              <div className="flex items-center">
                <FaEnvelope className="text-blue-500 mr-3" />
                <span className="text-gray-700">{viewData.email}</span>
              </div>
              <div className="flex items-center">
                <FaFileMedical className="text-blue-500 mr-3" />
                <span className="text-gray-700">License Verified</span>
              </div>
            </div>
            
            <div className="mt-8">
              <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg mr-4">
                Book Appointment
              </button>
              <button className="border border-blue-500 text-blue-500 hover:bg-blue-50 px-6 py-2 rounded-lg">
                Message
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Tabs Section */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            {['overview', 'reviews', 'availability', 'contact'].map((tab) => (
              <button
                key={tab}
                className={`mr-8 py-4 px-1 text-sm font-medium ${activeTab === tab ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-500 hover:text-gray-700'}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>
        </div>
        
        {/* Tab Content */}
        <div className="p-8">
          {activeTab === 'overview' && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">About Dr. {viewData.name.split(' ')[2]}</h2>
              <p className="text-gray-700">
                Dr. {viewData.name} is a seasoned {viewData.specialization} with {viewData.experience} years of experience. 
                She completed her medical education at prestigious institutions and has been practicing medicine since 2008.
                Dr. {viewData.name.split(' ')[2]} is known for her patient-centered approach and attention to detail.
              </p>
              
              <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Education</h3>
              <ul className="list-disc pl-5 text-gray-700">
                <li>MD in Pathology, Medical University (2005-2008)</li>
                <li>MBBS, College of Medicine (1998-2004)</li>
              </ul>
            </div>
          )}
          
          {activeTab === 'reviews' && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Patient Reviews</h2>
              
              <div className="flex items-center mb-6">
                <div className="mr-6 text-center">
                  <div className="text-4xl font-bold text-gray-900">{ratings.average}</div>
                  <div className="flex justify-center mt-1">
                    {[...Array(5)].map((_, i) => (
                      <FaStar
                        key={i}
                        className={`h-4 w-4 ${i < Math.floor(ratings.average) ? 'text-yellow-400' : 'text-gray-300'}`}
                      />
                    ))}
                  </div>
                  <div className="text-sm text-gray-500 mt-1">{ratings.total} reviews</div>
                </div>
                
                <div className="flex-1">
                  {[5, 4, 3, 2, 1].map((stars, index) => {
                    const percentage = (ratings.breakdown[index] / ratings.total) * 100;
                    return (
                      <div key={stars} className="flex items-center mt-2">
                        <div className="w-10 text-sm text-gray-600">{stars} star</div>
                        <div className="flex-1 h-2 bg-gray-200 rounded-full mx-2">
                          <div 
                            className="h-2 bg-yellow-400 rounded-full" 
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                        <div className="w-10 text-sm text-gray-600">{ratings.breakdown[index]}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              {/* Sample Reviews */}
              <div className="border-t border-gray-200 pt-6">
                <div className="flex items-start mb-6">
                  <div className="mr-4">
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-blue-600 font-semibold">JP</span>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center">
                      <h4 className="font-semibold">John Peterson</h4>
                      <span className="text-xs text-gray-500 ml-4">2 weeks ago</span>
                    </div>
                    <div className="flex items-center mt-1">
                      {[...Array(5)].map((_, i) => (
                        <FaStar
                          key={i}
                          className={`h-4 w-4 ${i < 5 ? 'text-yellow-400' : 'text-gray-300'}`}
                        />
                      ))}
                    </div>
                    <p className="mt-2 text-gray-700">
                      Dr. Doe was incredibly thorough and took the time to explain everything in detail. 
                      I felt truly cared for and would highly recommend her.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'availability' && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Availability</h2>
              <div className="bg-blue-50 p-4 rounded-lg mb-6">
                <p className="text-blue-700">Next available appointment: Thursday, 2:00 PM</p>
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Regular Schedule</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map(day => (
                  <div key={day} className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900">{day}</h4>
                    <p className="text-gray-700">9:00 AM - 5:00 PM</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {activeTab === 'contact' && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Contact Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Clinic Address</h3>
                  <p className="text-gray-700">
                    Medical Center Building<br />
                    123 Health Avenue<br />
                    City, State 12345
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Contact Details</h3>
                  <div className="flex items-center mb-3">
                    <FaPhone className="text-blue-500 mr-3" />
                    <span className="text-gray-700">{viewData.phone}</span>
                  </div>
                  <div className="flex items-center">
                    <FaEnvelope className="text-blue-500 mr-3" />
                    <span className="text-gray-700">{viewData.email}</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Send a Message</h3>
                <form className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Your Name</label>
                    <input type="text" id="name" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border" />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Your Email</label>
                    <input type="email" id="email" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border" />
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
                    <textarea id="message" rows="4" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"></textarea>
                  </div>
                  <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg">
                    Send Message
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Sample data for demonstration
const sampleDoctorData = {
  email: "doctor1@curo24.com",
  experience: 15,
  id: 1,
  licenseNumber: "LIC1001",
  name: "Dr. Jane Doe 1",
  phone: "+91-900000001",
  specialization: "Pathologist",
  status: "inactive"
};

// App component to wrap the ViewDoctor
const App = () => {
  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <ViewDoctor viewData={sampleDoctorData} />
    </div>
  );
};

export default App;