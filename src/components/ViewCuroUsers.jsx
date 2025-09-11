import React from 'react';

function ViewCuroUsers({ data }) {
    const {
        firstName,
        lastName,
        email,
        mobileNumber,
        profilePicture,
        roles,
        createdAt,
        lastLogin,
        accountNonLocked,
        enabled
    } = data;

    // Format date for better readability
    const formatDate = (dateString) => {
        if (!dateString) return 'Never logged in';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Calculate account age
    const getAccountAge = () => {
        const created = new Date(createdAt);
        const now = new Date();
        const diffTime = Math.abs(now - created);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return `${diffDays} day${diffDays !== 1 ? 's' : ''}`;
    };

    return (
        <div className="rounded-xl">
            <div className=" mx-auto bg-white rounded-xl shadow-md overflow-hidden">
                {/* Header Section */}
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6 text-white">
                    <h1 className="text-2xl font-bold">{roles.roleName.replace('ROLE_', '')} PROFILE</h1>
                    <p className="opacity-90">Detailed information about the Curo {roles.roleName.replace('ROLE_', '')} </p>
                </div>

                {/* Profile Content */}
                <div className="p-6 md:p-8">
                    <div className="flex flex-col md:flex-row gap-8">
                        {/* Left Column - Profile Image & Status */}
                        <div className="md:w-1/3 flex flex-col items-center">
                            <div className="relative">
                                <img
                                    src={profilePicture}
                                    alt={`${firstName} ${lastName}`}
                                    className="w-48 h-48 rounded-full object-cover border-4 border-white shadow-lg"
                                />
                                <div className={`absolute bottom-3 right-3 w-6 h-6 rounded-full border-2 border-white ${enabled ? 'bg-green-500' : 'bg-red-500'}`}></div>
                            </div>

                            <div className="mt-6 w-full space-y-4">
                                <div className={`p-3 rounded-lg text-center ${accountNonLocked ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                    <p className="font-medium">Account {accountNonLocked ? 'Unlocked' : 'Locked'}</p>
                                </div>

                                <div className="bg-blue-50 p-3 rounded-lg text-center">
                                    <p className="text-sm text-blue-700">Role: {roles.roleName.replace('ROLE_', '')}</p>
                                    <p className="text-xs text-blue-600 mt-1">{roles.description}</p>
                                </div>
                            </div>
                        </div>

                        {/* Right Column - User Details */}
                        <div className="md:w-2/3">
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">{firstName} {lastName}</h2>
                            {/* <p className="text-gray-600 mb-6">User ID: #{data.id}</p> */}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <p className="text-sm text-gray-500">Email Address</p>
                                    <p className="font-medium">{email}</p>
                                </div>

                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <p className="text-sm text-gray-500">Mobile Number</p>
                                    <p className="font-medium">{mobileNumber}</p>
                                </div>

                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <p className="text-sm text-gray-500">Account Created</p>
                                    <p className="font-medium">{formatDate(createdAt)}</p>
                                    <p className="text-xs text-gray-500 mt-1">Active for {getAccountAge()}</p>
                                </div>

                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <p className="text-sm text-gray-500">Last Login</p>
                                    <p className="font-medium">{formatDate(lastLogin)}</p>
                                </div>
                            </div>

                            {/* Security Status */}
                            <div className="mt-6 p-4 bg-gray-100 rounded-lg">
                                <h3 className="font-medium text-gray-700 mb-2">Security Status</h3>
                                <div className="flex items-center space-x-4">
                                    <div className={`h-3 w-3 rounded-full ${data.accountNonExpired ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                    <span>Account Non-Expired: {data.accountNonExpired ? 'Yes' : 'No'}</span>
                                </div>
                                <div className="flex items-center space-x-4 mt-2">
                                    <div className={`h-3 w-3 rounded-full ${data.credentialsNonExpired ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                    <span>Credentials Non-Expired: {data.credentialsNonExpired ? 'Yes' : 'No'}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Footer */}
                <div className="bg-gray-100 px-6 py-4 text-center">
                    <p className="text-sm text-gray-600">Curo User Management System</p>
                </div>
            </div>
        </div>
    );
}

export default ViewCuroUsers;