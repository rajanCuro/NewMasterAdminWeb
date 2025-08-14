import React, { useState } from 'react';
import {
  FiHome,
  FiFileText,
  FiUserCheck,
  FiUser,
  FiUsers,
  FiSettings,
  FiChevronLeft,
  FiChevronRight,
  FiMenu
} from 'react-icons/fi';

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const toggleMobileSidebar = () => {
    setMobileOpen(!mobileOpen);
  };

  const menuItems = [
    { icon: <FiHome className="text-lg" />, label: 'Dashboard' },
    { icon: <FiFileText className="text-lg" />, label: 'Report' },
    { icon: <FiUsers className="text-lg" />, label: 'Zonal Head' },
    { icon: <FiUser className="text-lg" />, label: 'Agent' },
    { icon: <FiUserCheck className="text-lg" />, label: 'Circle Officer' },
    { icon: <FiSettings className="text-lg" />, label: 'Settings' },
  ];

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={toggleMobileSidebar}
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-gray-800 text-white"
      >
        <FiMenu className="text-xl" />
      </button>

      {/* Sidebar */}
      <div
        className={`
          fixed top-0 left-0 h-screen bg-gray-800 text-white transition-all duration-300 ease-in-out
          ${collapsed ? 'w-20' : 'w-64'}
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          z-40
        `}
      >
        <div className="flex flex-col h-full">
          {/* Logo/Sidebar Header */}
          <div className={`flex items-center ${collapsed ? 'justify-center' : 'justify-between'} p-4 border-b border-gray-700`}>
            {!collapsed && (
              <h1 className="text-xl font-bold">Admin Panel</h1>
            )}
            <button
              onClick={toggleSidebar}
              className="p-1 rounded-full hover:bg-gray-700"
            >
              {collapsed ? <FiChevronRight /> : <FiChevronLeft />}
            </button>
          </div>

          {/* Menu Items */}
          <nav className="flex-1 overflow-y-auto">
            <ul className="space-y-2 p-4">
              {menuItems.map((item, index) => (
                <li key={index}>
                  <a
                    href="#"
                    className={`
                      flex items-center p-3 rounded-lg hover:bg-gray-700 transition-colors
                      ${collapsed ? 'justify-center' : ''}
                    `}
                  >
                    <span className="flex-shrink-0">{item.icon}</span>
                    {!collapsed && (
                      <span className="ml-3">{item.label}</span>
                    )}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* User Profile */}
          <div className={`p-4 border-t border-gray-700 ${collapsed ? 'text-center' : 'flex items-center'}`}>
            <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center">
              <span>U</span>
            </div>
            {!collapsed && (
              <div className="ml-3">
                <p className="font-medium">Admin User</p>
                <p className="text-xs text-gray-400">admin@example.com</p>
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
    </>
  );
};

export default Sidebar;