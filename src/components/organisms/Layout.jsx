import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "@/components/organisms/Sidebar";
import Header from "@/components/organisms/Header";
import QuickAddMenu from "@/components/organisms/QuickAddMenu";

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [quickAddOpen, setQuickAddOpen] = useState(false);

  const handleMenuToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleSidebarClose = () => {
    setSidebarOpen(false);
  };

  const handleQuickAdd = () => {
    setQuickAddOpen(true);
  };

  const handleQuickAddClose = () => {
    setQuickAddOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={handleSidebarClose} />
      
      {/* Main Content */}
      <div className="lg:pl-64">
        <Header onMenuToggle={handleMenuToggle} onQuickAdd={handleQuickAdd} />
        
        <main className="py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Quick Add Menu */}
      <QuickAddMenu
        isOpen={quickAddOpen}
        onClose={handleQuickAddClose}
        onContactAdded={() => window.location.reload()}
        onDealAdded={() => window.location.reload()}
        onActivityAdded={() => window.location.reload()}
      />
    </div>
  );
};

export default Layout;