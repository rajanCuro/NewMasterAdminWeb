import React, { useState } from 'react';
import { useAuth } from '../../auth/AuthContext';
import ChangePassword from './ChangePassword';

function Setting() {
    const { token, user } = useAuth();
    console.log('user:', user);
    const [userData, setUserData] = useState(null);
    const [changePasswordModalOpen, setChangePasswordModalOpen] = useState(false);

    console.log('user:', user);
    const handleChangePassword = (data) => {
        setChangePasswordModalOpen(true);
        setUserData(data);
    }

    return (
        <>
            <div className='sticky top-0 z-50'>
                <h1 className="text-2xl font-bold text-gray-800 mb-1 px-4 "> Settings</h1>
            </div>
            <div className="p-4  mx-auto">
                {user ? (
                    <div className="bg-white shadow rounded-lg p-6">
                        <h2 className="text-xl font-semibold text-gray-700 mb-4">Profile Information</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <div>
                                    <label className="block text-sm font-medium text-gray-500">User ID</label>
                                    <p className="mt-1 text-sm text-gray-900">{user.id}</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-500">Username</label>
                                    <p className="mt-1 text-sm text-gray-900">{user.username}</p>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div>
                                    <label className="block text-sm font-medium text-gray-500">Role</label>
                                    <p className="mt-1 text-sm text-gray-900">{user.role}</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-500">Status</label>
                                    <p className="mt-1 text-sm text-gray-900">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.isActive === 'Y' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                            {user.isActive === 'Y' ? 'Active' : 'Inactive'}
                                        </span>
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 pt-6 border-t border-gray-200">
                            <h3 className="text-lg font-medium text-gray-700 mb-4">Account Actions</h3>
                            <div className="flex space-x-4">
                                <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                                    Edit Profile
                                </button>
                                <button onClick={() => handleChangePassword(user)} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors">
                                    Change Password
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                        <div className="flex">
                            <div className="ml-3">
                                <p className="text-sm text-yellow-700">
                                    No user information available. Please check if you're properly logged in.
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            {changePasswordModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50  backdrop-brightness-50">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-bold text-gray-800">Update Your Password</h3>
                                <button
                                    onClick={() => setChangePasswordModalOpen(false)}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-6 w-6"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M6 18L18 6M6 6l12 12"
                                        />
                                    </svg>
                                </button>
                            </div>
                            <ChangePassword userData={userData} />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default Setting;