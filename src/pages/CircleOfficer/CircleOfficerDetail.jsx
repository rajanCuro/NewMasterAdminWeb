import React, { useState } from 'react';
import { 
  UserIcon, 
  PhoneIcon, 
  EnvelopeIcon, 
  MapPinIcon, 
  ChartBarIcon, 
  CheckBadgeIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon
} from '@heroicons/react/24/outline';

function CircleOfficerDetail() {
  // Mock data for the circle officer
  const [officerData, setOfficerData] = useState({
    name: "Rajesh Kumar",
    designation: "Circle Officer",
    employeeId: "CO7842",
    profileImage: "",
    contact: {
      phone: "+91 9876543210",
      email: "rajesh.kumar@example.com",
      address: "Mumbai Central, Maharashtra"
    },
    performance: {
      totalAgents: 42,
      activeAgents: 38,
      newAgents: 5,
      pendingVerification: 4
    },
    stats: {
      totalTransactions: 12478,
      successRate: 96.4,
      averageRating: 4.7,
      monthlyGrowth: 2.3
    },
    joinDate: "2021-03-15"
  });

  // Format numbers with commas
  const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="w-full mx-auto">
        <div className="">
          
          {/* Profile Section */}
          <div className="px-6 py-8 flex flex-col md:flex-row items-start gap-6 border-b border-gray-200">
            {/* Profile Image */}
            <div className="flex-shrink-0">
              <div className="w-32 h-32 bg-blue-100 rounded-full flex items-center justify-center border-4 border-white shadow-md">
                {officerData.profileImage ? (
                  <img 
                    src={officerData.profileImage} 
                    alt={officerData.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <UserIcon className="w-16 h-16 text-blue-500" />
                )}
              </div>
            </div>
            
            {/* Profile Details */}
            <div className="flex-grow">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-2xl font-bold text-gray-800">{officerData.name}</h2>
                <CheckBadgeIcon className="w-6 h-6 text-blue-500" />
              </div>
              
              <p className="text-gray-600 mb-4 flex items-center gap-1">
                <span>{officerData.designation}</span>
                <span className="mx-2">•</span>
                <span>ID: {officerData.employeeId}</span>
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="flex items-center gap-2 text-gray-600">
                  <PhoneIcon className="w-5 h-5" />
                  <span>{officerData.contact.phone}</span>
                </div>
                
                <div className="flex items-center gap-2 text-gray-600">
                  <EnvelopeIcon className="w-5 h-5" />
                  <span>{officerData.contact.email}</span>
                </div>
                
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPinIcon className="w-5 h-5" />
                  <span>{officerData.contact.address}</span>
                </div>
              </div>
            </div>
            
            {/* Join Date */}
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <p className="text-sm text-gray-500">Joined On</p>
              <p className="font-semibold text-blue-700">
                {new Date(officerData.joinDate).toLocaleDateString('en-IN', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
          </div>
          
          {/* Stats Overview */}
          <div className="px-6 py-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 border-b border-gray-200">
            <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="text-gray-500 text-sm font-medium">Total Agents</h3>
                <div className="p-2 bg-blue-100 rounded-lg">
                  <UserIcon className="w-5 h-5 text-blue-600" />
                </div>
              </div>
              <p className="text-2xl font-bold mt-2 text-gray-800">
                {formatNumber(officerData.performance.totalAgents)}
              </p>
              <div className="flex items-center gap-1 mt-1">
                <span className="text-xs text-green-600 font-medium">+{officerData.performance.newAgents} new</span>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="text-gray-500 text-sm font-medium">Active Agents</h3>
                <div className="p-2 bg-green-100 rounded-lg">
                  <ChartBarIcon className="w-5 h-5 text-green-600" />
                </div>
              </div>
              <p className="text-2xl font-bold mt-2 text-gray-800">
                {formatNumber(officerData.performance.activeAgents)}
              </p>
              <div className="flex items-center gap-1 mt-1">
                <span className="text-xs text-gray-500">
                  {((officerData.performance.activeAgents / officerData.performance.totalAgents) * 100).toFixed(1)}% active
                </span>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="text-gray-500 text-sm font-medium">Total Transactions</h3>
                <div className="p-2 bg-purple-100 rounded-lg">
                  <ArrowTrendingUpIcon className="w-5 h-5 text-purple-600" />
                </div>
              </div>
              <p className="text-2xl font-bold mt-2 text-gray-800">
                {formatNumber(officerData.stats.totalTransactions)}
              </p>
              <div className="flex items-center gap-1 mt-1">
                {officerData.stats.monthlyGrowth >= 0 ? (
                  <span className="text-xs text-green-600 font-medium">↑ {officerData.stats.monthlyGrowth}%</span>
                ) : (
                  <span className="text-xs text-red-600 font-medium">↓ {Math.abs(officerData.stats.monthlyGrowth)}%</span>
                )}
                <span className="text-xs text-gray-500">this month</span>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="text-gray-500 text-sm font-medium">Success Rate</h3>
                <div className="p-2 bg-amber-100 rounded-lg">
                  <ChartBarIcon className="w-5 h-5 text-amber-600" />
                </div>
              </div>
              <p className="text-2xl font-bold mt-2 text-gray-800">
                {officerData.stats.successRate}%
              </p>
              <div className="flex items-center gap-1 mt-1">
                <span className="text-xs text-gray-500">
                  Average rating: {officerData.stats.averageRating}/5
                </span>
              </div>
            </div>
          </div>
          
          {/* Detailed Information */}
          <div className="px-6 py-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Agent Management</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Pending Verifications */}
              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-yellow-800">Pending Verification</h4>
                  <span className="bg-yellow-200 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full">
                    {officerData.performance.pendingVerification}
                  </span>
                </div>
                <p className="text-sm text-yellow-700">
                  Agents awaiting documentation verification and approval
                </p>
                <button className="mt-4 text-sm font-medium text-yellow-700 hover:text-yellow-900 underline">
                  Review Now →
                </button>
              </div>
              
              {/* Performance Summary */}
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 md:col-span-2">
                <h4 className="font-medium text-blue-800 mb-3">Performance Summary</h4>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-blue-700">Agent Retention Rate</p>
                    <div className="w-full bg-blue-200 rounded-full h-2 mt-1">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: '92%' }}
                      ></div>
                    </div>
                    <p className="text-xs text-blue-800 mt-1">92%</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-blue-700">Training Completion</p>
                    <div className="w-full bg-blue-200 rounded-full h-2 mt-1">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: '88%' }}
                      ></div>
                    </div>
                    <p className="text-xs text-blue-800 mt-1">88%</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-blue-700">Target Achievement</p>
                    <div className="w-full bg-blue-200 rounded-full h-2 mt-1">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: '105%' }}
                      ></div>
                    </div>
                    <p className="text-xs text-blue-800 mt-1">105%</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-blue-700">Customer Satisfaction</p>
                    <div className="w-full bg-blue-200 rounded-full h-2 mt-1">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: '94%' }}
                      ></div>
                    </div>
                    <p className="text-xs text-blue-800 mt-1">94%</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="mt-8 flex flex-wrap gap-4">
              <button className="px-5 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
                Manage Agents
              </button>
              <button className="px-5 py-2 bg-white text-gray-700 rounded-lg font-medium border border-gray-300 hover:bg-gray-50 transition-colors">
                Generate Reports
              </button>
              <button className="px-5 py-2 bg-white text-gray-700 rounded-lg font-medium border border-gray-300 hover:bg-gray-50 transition-colors">
                Send Broadcast
              </button>
              <button className="px-5 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors">
                Add New Agent
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CircleOfficerDetail;