
import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import EnhancedNavbar from "./Navbar";
import useRedirectLoggedOutUser from "@/hooks/useRedirectLoggedOutUser";

const EnhancedLayout = () => {
  const location = useLocation();
  useRedirectLoggedOutUser(`/login?redirect_url=${location.pathname}`);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar collapsed={sidebarCollapsed} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <EnhancedNavbar toggleSidebar={toggleSidebar} />
        <main className="flex-1 overflow-auto p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default EnhancedLayout;
