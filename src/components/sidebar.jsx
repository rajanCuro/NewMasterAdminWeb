import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
    FiHome,
    FiFileText,
    FiUserCheck,
    FiUser,
    FiUsers,
    FiSettings,
    FiChevronLeft,
    FiChevronRight,
    FiMenu,
} from 'react-icons/fi';
import { CiLogin } from "react-icons/ci";
import { FaMapMarkerAlt } from "react-icons/fa";


const Sidebar = ({ collapsed, toggleSidebar }) => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    const toggleMobileSidebar = () => setMobileOpen(!mobileOpen);

    const handleLogoutClick = () => {
        setShowLogoutModal(true);
    };

    const confirmLogout = () => { 
        window.location.reload()      
        
    };

    const cancelLogout = () => {
        setShowLogoutModal(false);
    };

    const menuItems = [
        { icon: <FiHome className="text-lg" />, label: 'Dashboard', path: '/dashboard' },
        // { icon: <FiFileText className="text-lg" />, label: 'Report', path: '/report' },
        { icon: <FiUsers className="text-lg" />, label: 'Zonal Head', path: '/zonal' },
        { icon: <FiUserCheck className="text-lg" />, label: 'Circle Officer', path: '/circle-officer' },
        { icon: <FiUser className="text-lg" />, label: 'Agent', path: '/agent' },
        { icon: <FaMapMarkerAlt className="text-lg" />, label: 'Curo Map', path: '/curo_map' },
    ];

    return (
        <>
            {/* Mobile menu button */}
            <button
                onClick={toggleMobileSidebar}
                className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-md sidebar_bg"
            >
                <FiMenu className="text-2xl border rounded-md p-1" />
            </button>

            {/* Sidebar */}
            <div
                className={`fixed shadow-md top-0 left-0 h-screen sidebar_bg transition-all duration-300 ease-in-out ${collapsed ? 'w-20' : 'w-64'
                    } ${mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'} z-50`}
             >
                <div className="flex flex-col h-full">
                    {/* Logo */}
                    <div
                        className={`flex items-center ${collapsed ? 'justify-center' : 'justify-between'} p-4 border-b border-gray-700`}
                    >
                        {!collapsed && <h1 className="text-xl font-bold hidden md:block">Admin Panel</h1>}
                        <button onClick={toggleSidebar} className="p-1 rounded-full hover:bg-gray-50">
                            {collapsed ? <FiChevronRight /> : <FiChevronLeft />}
                        </button>
                    </div>

                    {/* Menu */}
                    <nav className="flex-1 overflow-y-auto">
                        <ul className="space-y-2 p-4">
                            {menuItems.map((item, index) => (
                                <li key={index}>
                                    <Link
                                        onClick={toggleMobileSidebar}
                                        to={item.path}
                                        className={`flex items-center p-3 rounded-lg transition-colors ${location.pathname === item.path ? 'bg-gray-200' : 'hover:bg-gray-300'
                                            } ${collapsed ? 'justify-center' : ''}`}
                                    >
                                        <span className="flex-shrink-0">{item.icon}</span>
                                        {!collapsed && <span className="ml-3">{item.label}</span>}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    {/* Profile */}
                    <div
                        className={`p-4 border-t border-gray-700 ${collapsed ? 'text-center' : 'flex items-center'}`}
                    >
                        <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                            <span>U</span>
                        </div>
                        {!collapsed && (
                            <div className="ml-3 flex items-center justify-between">
                                <div>
                                    <p className="font-medium">Admin User</p>
                                    <p className="text-xs text-gray-400">admin@example.com</p>
                                </div>
                                <div className='cursor-pointer' onClick={handleLogoutClick}>
                                    <CiLogin className='text-red-500 rounded-md hover:bg-red-300 transition-300 ease-in-out' size={30} />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Overlay for mobile */}
            {mobileOpen && (
                <div
                    onClick={toggleMobileSidebar}
                    className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
                ></div>
            )}

            {/* Logout Confirmation Modal */}
            {showLogoutModal && (
                <div className="fixed inset-0 backdrop-brightness-50 flex items-center justify-center z-80">
                    <div className="bg-white rounded-lg p-6 max-w-sm w-full">
                        <h3 className="text-lg font-medium mb-4">Confirm Logout</h3>
                        <p className="mb-6">Are you sure you want to logout?</p>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={cancelLogout}
                                className="px-4 cursor-pointer py-2 border border-gray-300  rounded-md transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmLogout}
                                className="px-4 cursor-pointer py-2 bg-red-500 rounded-md hover:bg-red-600 transition-colors"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Sidebar;