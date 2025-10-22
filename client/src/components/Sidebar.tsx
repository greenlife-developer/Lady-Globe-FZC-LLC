import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  Package,
  LogIn,
  ChevronDown,
  ChevronRight,
  FlipHorizontal,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";

interface SidebarProps {
  collapsed: boolean;
}

interface SidebarItem {
  title: string;
  href: string;
  icon: React.ElementType;
  submenu?: SidebarSubItem[];
}

interface SidebarSubItem {
  title: string;
  href: string;
}

import { logoutUser } from "../services/authService";
import {
  SET_LOGIN,
  SET_NAME,
  SET_USER,
} from "../redux/features/auth/authSlice";

const Sidebar = ({ collapsed }: SidebarProps) => {
  const location = useLocation();
  const [activePlatform, setActivePlatform] = useState<string>("Trendyol");
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>(
    {}
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const handlePlatformChange = (event: Event) => {
      const customEvent = event as CustomEvent;
      setActivePlatform(customEvent.detail);
      setExpandedItems({});
    };

    window.addEventListener("platform-changed", handlePlatformChange);

    return () => {
      window.removeEventListener("platform-changed", handlePlatformChange);
    };
  }, []);

  const toggleSubmenu = (title: string) => {
    setExpandedItems((prev) => ({
      [title]: !prev[title],
    }));
  };

  const handleLogOut = async () => {
    await logoutUser();
    await dispatch(SET_LOGIN(false));
    navigate("/login");
  };

  const trendyolItems: SidebarItem[] = [
    {
      title: "Inventory",
      href: "/inventory",
      icon: Package,
      submenu: [
        { title: "Manage Inventory", href: "/inventory/manage" },
        // { title: "Inventory Planning", href: "/inventory/planning" },
        // { title: "Items", href: "/inventory/items" },
      ],
    }
  ];

  const renderItems = (items: SidebarItem[]) => {
    return items.map((item) => (
      <div key={item.title} className="mb-1">
        {item.submenu ? (
          <>
            <button
              onClick={() => toggleSubmenu(item.title)}
              className={cn(
                "flex items-center w-full px-2 py-3 rounded-md transition-colors text-left",
                location.pathname === item.href ||
                  location.pathname.startsWith(`${item.href}/`)
                  ? "bg-iraav-navy text-white"
                  : "text-white/70 hover:bg-iraav-navy hover:text-white"
              )}
            >
              <item.icon className="h-5 w-5 mr-3" />
              {!collapsed && (
                <>
                  <span className="flex-1">{item.title}</span>
                  {expandedItems[item.title] ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </>
              )}
            </button>

            {!collapsed && expandedItems[item.title] && (
              <div className="ml-7 mt-1 space-y-1 border-l-2 border-iraav-navy/40 pl-2">
                {item.submenu.map((subItem) => (
                  <Link
                    key={subItem.title}
                    to={subItem.href}
                    className={cn(
                      "flex items-center px-2 py-2 text-sm rounded-md transition-colors",
                      location.pathname === subItem.href
                        ? "bg-iraav-navy/70 text-white"
                        : "text-white/70 hover:bg-iraav-navy/40 hover:text-white"
                    )}
                  >
                    <span>{subItem.title}</span>
                  </Link>
                ))}
              </div>
            )}
          </>
        ) : (
          <Link
            to={item.href}
            className={cn(
              "flex items-center px-2 py-3 rounded-md transition-colors",
              item.href === location.pathname
                ? "bg-iraav-navy text-white"
                : "text-white/70 hover:bg-iraav-navy hover:text-white"
            )}
          >
            <item.icon className="h-5 w-5 mr-3" />
            {!collapsed && <span>{item.title}</span>}
          </Link>
        )}
      </div>
    ));
  };

  return (
    <div
      className={cn(
        "bg-iraav-dark-blue text-white h-full flex flex-col transition-all duration-300 ease-in-out",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 mt-4">
          {!collapsed && (
            <div className="space-y-1">
              <h2 className="text-lg font-semibold tracking-tight">
                {activePlatform}
              </h2>
              {/* <p className="text-sm text-muted_override">Navigation Panel</p> */}
            </div>
          )}
        </div>

        <nav className="space-y-1 px-2">
          {activePlatform === "Trendyol" && renderItems(trendyolItems)}
        </nav>
      </div>

      <div className="p-4 border-t border-gray-700">
        <div className="flex items-center justify-between">
          <span
            onClick={handleLogOut}
            className={cn(
              "flex items-center px-2 py-3 rounded-md transition-colors text-white/70 hover:bg-iraav-navy hover:text-white"
            )}
          >
            <LogIn className={cn("h-5 w-5", collapsed ? "mx-auto" : "mr-3")} />
            {!collapsed && <span>Logout</span>}
          </span>

          <Link
            to="/settings"
            className={cn(
              "flex items-center px-2 py-3 rounded-md transition-colors text-white/70 hover:bg-iraav-navy hover:text-white"
            )}
          >
            <FlipHorizontal className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
