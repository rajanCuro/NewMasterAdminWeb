// src/components/sidebar.jsx
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
import { MdAppRegistration } from "react-icons/md";
import { TbLiveViewFilled, TbMapPinCode } from "react-icons/tb";
import { CiLogin } from "react-icons/ci";
import { FaInfoCircle, FaMapMarkerAlt, FaUsers } from "react-icons/fa";
import { useAuth } from '../auth/AuthContext';
import { IoMdSettings } from "react-icons/io";
import { FaFile } from "react-icons/fa";

import Time from '../Time';
import { SiPrivatedivision } from 'react-icons/si';
import { FaMountainCity } from 'react-icons/fa6';



const Sidebar = ({ collapsed, toggleSidebar }) => {
    const { logout, role, user } = useAuth();
    console.log('role', role);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    const toggleMobileSidebar = () => setMobileOpen(!mobileOpen);

    const handleLogoutClick = () => {
        setShowLogoutModal(true);
    };

    const confirmLogout = () => {
        logout()

    };

    const cancelLogout = () => {
        setShowLogoutModal(false);
    };

    const menuItems = [
        { icon: <FiHome className="text-lg" />, label: 'Dashboard', path: '/dashboard' },
        (role === "ROLE_ZONE_ADMIN" || role === "ROLE_CIRCLE_OFFICER")
            ? null
            : { icon: <FiUsers className="text-lg" />, label: 'Division Officer', path: '/division_officier' },
        (role === "ROLE_ZONE_ADMIN" || role === "ROLE_CIRCLE_OFFICER") ? null : { icon: <SiPrivatedivision className="text-lg" />, label: 'All Divisions', path: '/all_division' },
        role === "ROLE_CIRCLE_OFFICER" ? null : { icon: <FiUserCheck className="text-lg" />, label: 'City Officer', path: '/circle-officer' },
        role === "ROLE_CIRCLE_OFFICER" ? null : { icon: <FaMountainCity className="text-lg" />, label: 'All Cities', path: '/all_cities' },
        { icon: <FiUser className="text-lg" />, label: 'Field Executive', path: '/agent' },
        { icon: <TbMapPinCode className="text-lg" />, label: 'Pincode', path: '/pincode' },
        { icon: <FaMapMarkerAlt className="text-lg" />, label: 'Curo Map', path: '/curo_map' },
        { icon: <IoMdSettings className="text-lg" />, label: 'Settings', path: '/setting' },
        role === "ROLE_ADMIN" ? { icon: <FaUsers className='text-lg' />, label: 'Curo Users', path: '/curo_users' } : null,
        { icon: <TbLiveViewFilled className='text-lg' />, label: 'Live Tracking', path: '/distance_info' },
        { icon: <FaFile className="text-lg" />, label: 'File manager', path: '/file_manager' },

    ].filter(Boolean); // ✅ This removes null



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
                    <div className={`${collapsed ? "hidden" : "block"} p-4`}>
                        <Time />
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

                    <div className={`p-4 border-t border-gray-700 ${collapsed ? 'text-center' : 'flex  items-center'}`}>

                        <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                            <span>U</span>
                        </div>
                        {!collapsed && (
                            <div className="ml-3 flex items-center justify-between">
                                <div onClick={() => navigate('/setting')} className='cursor-pointer'>
                                    <p className="text-xs">{role}</p>
                                    <p className="text-xs text-gray-400">{user?.email}</p>
                                    <p className="text-xs text-gray-400"></p>
                                </div>
                                <div className='cursor-pointer'onClick={handleLogoutClick}>
                                    <button class="Btn">
                                        <div class="sign">
                                            <svg viewBox="0 0 512 512">
                                                <path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z"></path>
                                            </svg>
                                        </div>
                                        <div class="text">Logout</div>
                                    </button>
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
                                className="px-4 cursor-pointer py-2 bg-red-500 rounded-md hover:bg-red-600 transition-colors text-white"
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