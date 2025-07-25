import React, { useState, useContext } from "react";
import { useLocation } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import SearchBar from "@/components/molecules/SearchBar";
import Button from "@/components/atoms/Button";
import { AuthContext } from "@/App";
const Header = ({ onMenuToggle, onQuickAdd }) => {
  const [searchValue, setSearchValue] = useState("");
  const location = useLocation();
  const { logout } = useContext(AuthContext) || {};
  const getPageTitle = () => {
    const pathTitles = {
      "/": "Dashboard",
      "/contacts": "Contacts",
      "/deals": "Deals",
      "/activities": "Activities",
      "/settings": "Settings"
    };
    return pathTitles[location.pathname] || "RelateFlow";
  };

  const getPageDescription = () => {
    const pathDescriptions = {
      "/": "Overview of your sales pipeline and recent activities",
      "/contacts": "Manage your customer relationships and contact information",
      "/deals": "Track your sales opportunities through the pipeline",
      "/activities": "Log and review all customer interactions",
      "/settings": "Configure your CRM preferences and settings"
    };
    return pathDescriptions[location.pathname] || "";
  };

  return (
    <header className="bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8 py-4">
      <div className="flex items-center justify-between">
        {/* Mobile menu button and title */}
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuToggle}
            className="lg:hidden p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-all duration-200"
          >
            <ApperIcon name="Menu" size={24} />
          </button>
          
          <div>
            <h1 className="text-2xl font-bold text-transparent bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text">
              {getPageTitle()}
            </h1>
            {getPageDescription() && (
              <p className="text-sm text-gray-600 mt-1">
                {getPageDescription()}
              </p>
            )}
          </div>
        </div>

        {/* Search and actions */}
        <div className="flex items-center gap-4">
          {/* Search bar - hidden on mobile */}
          <div className="hidden md:block">
            <SearchBar
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Search contacts, deals..."
              className="w-80"
              onClear={() => setSearchValue("")}
            />
          </div>

          {/* Quick add button */}
          <div className="relative">
            <Button
              onClick={onQuickAdd}
              variant="primary"
              size="md"
              icon="Plus"
              className="shadow-lg"
            >
              <span className="hidden sm:inline">Quick Add</span>
            </Button>
          </div>

          {/* Notifications */}
          <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-all duration-200 relative">
            <ApperIcon name="Bell" size={20} />
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-accent-500 to-pink-600 text-white text-xs rounded-full flex items-center justify-center font-medium">
              3
            </span>
          </button>

{/* User menu */}
          <div className="flex items-center gap-3">
            <button 
onClick={() => {
                if (logout) logout();
              }}
              className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-all duration-200 flex items-center gap-2"
              title="Logout"
            >
              <ApperIcon name="LogOut" size={16} />
              <span className="hidden sm:inline">Logout</span>
            </button>
            <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white font-medium shadow-lg">
              <ApperIcon name="User" size={16} />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile search */}
      <div className="md:hidden mt-4">
        <SearchBar
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          placeholder="Search contacts, deals..."
          onClear={() => setSearchValue("")}
        />
      </div>
    </header>
  );
};

export default Header;