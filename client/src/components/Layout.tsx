
import { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

const Layout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activePlatform, setActivePlatform] = useState("Amazon");
  const navigate = useNavigate();

  useEffect(() => {
    const handlePlatformChange = (event: Event) => {
      const customEvent = event as CustomEvent;
      setActivePlatform(customEvent.detail);
    };

    window.addEventListener('platform-changed', handlePlatformChange);
    
    return () => {
      window.removeEventListener('platform-changed', handlePlatformChange);
    };
  }, [navigate]);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-iraav-bg-light">
      <Sidebar collapsed={sidebarCollapsed} />
      <div className="flex flex-col flex-1 w-full overflow-hidden">
        <Navbar toggleSidebar={toggleSidebar} />
        <main className="flex-1 overflow-y-auto p-2 sm:p-4 md:p-6">
          <div className="mx-auto animate-fade-in w-full max-w-[1600px]">
            <Outlet />
          </div>
        </main>
        <footer className="bg-white border-t border-gray-200 py-2 text-center text-xs text-gray-500">
          IRAAV Amazon Solution - Integrated Amazon Seller API Services
        </footer>
      </div>
    </div>
  );
};

export default Layout;
