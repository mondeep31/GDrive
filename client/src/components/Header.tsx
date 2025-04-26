import { useState, useRef, useEffect } from "react";
import {
  Search,
  HelpCircle,
  Settings,
  Menu as MenuIcon,
  X,
  RefreshCw,
} from "lucide-react";
import DriveIcon from "./icons/DriveIcon";
import AvatarIcon from "./icons/AvatarIcon";
import axios from "../services/axios"; // or wherever your axios instance is

interface HeaderProps {
  query: string;
  setQuery: (q: string) => void;
  handleSearch: () => void;
  handleRefresh: () => void;
  toggleSidebar: () => void;
  isSidebarOpen: boolean;
}

const Header = ({
  query,
  setQuery,
  handleSearch,
  handleRefresh,
  toggleSidebar,
  isSidebarOpen,
}: HeaderProps) => {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [avatarMenuOpen, setAvatarMenuOpen] = useState(false);
  const avatarRef = useRef<HTMLDivElement>(null);

  // State for real user info
  const [userEmail, setUserEmail] = useState<string>("");

  // Fetch user info on mount
  useEffect(() => {
    axios
      .get("/auth/me", { withCredentials: true })
      .then((res) => {
        if (res.data.user && res.data.user.email) {
          setUserEmail(res.data.user.email);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch user info:", err);
      });
  }, []);

  // Click-away listener for dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        avatarRef.current &&
        !avatarRef.current.contains(event.target as Node)
      ) {
        setAvatarMenuOpen(false);
      }
    }
    if (avatarMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [avatarMenuOpen]);

  return (
    <header className="h-16 border-b border-gray-200 px-4 flex items-center relative">
      {/* Sidebar toggle and logo */}
      <div className="flex items-center flex-shrink-0 z-10">
        <button
          className="p-2 rounded-full hover:bg-gray-100 mr-2"
          onClick={toggleSidebar}
        >
          {isSidebarOpen ? <X size={20} /> : <MenuIcon size={20} />}
        </button>
        <div className="flex items-center">
          <DriveIcon className="h-10 w-10 mr-1" />
          <span className="text-gray-800 text-xl hidden sm:inline">Drive</span>
        </div>
      </div>

      {/* Absolutely centered search bar and refresh */}
      <div
        className={`
          absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2
          w-full max-w-2xl
          transition-all duration-200
        `}
        style={{ pointerEvents: "auto" }}
      >
        <div
          className={`
            flex items-center rounded-full pl-4 pr-2
            bg-gray-100
            ${isSearchFocused ? "bg-white shadow-md" : "bg-gray-100"}
            transition-all duration-200
          `}
        >
          <Search
            size={18}
            className={`
              ${isSearchFocused ? "text-blue-500" : "text-gray-500"}
              mr-2
              transition-colors duration-200
            `}
          />
          <input
            type="text"
            placeholder="Search in Drive"
            className="bg-transparent py-2 outline-none flex-1 text-gray-800"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <button
            className="ml-2 p-2 rounded-full hover:bg-gray-200 transition"
            onClick={handleRefresh}
            title="Refresh"
            type="button"
          >
            <RefreshCw size={18} className="text-gray-600" />
          </button>
        </div>
      </div>

      {/* Right side icons */}
      <div className="flex items-center ml-auto gap-2 flex-shrink-0 z-10">
        <button className="p-2 rounded-full hover:bg-gray-100">
          <HelpCircle size={20} className="text-gray-600" />
        </button>
        <button className="p-2 rounded-full hover:bg-gray-100">
          <Settings size={20} className="text-gray-600" />
        </button>

        <div className="relative" ref={avatarRef}>
          <div
            className="w-9 h-9 bg-yellow-500 rounded-full flex items-center justify-center ml-2 cursor-pointer"
            onClick={() => setAvatarMenuOpen((v) => !v)}
          >
            <AvatarIcon />
          </div>
          {avatarMenuOpen && (
            <div className="absolute right-0 mt-2 w-72 bg-white/90 rounded-xl shadow-xl border z-50">
              <div className="px-4 py-4">
                <div className="text-sm text-gray-700 font-medium">
                  {userEmail}
                </div>
              </div>
              <button
                className="w-full text-left px-4 py-3 hover:bg-gray-100 rounded-b-xl text-sm font-medium text-gray-700"
                onClick={async () => {
                  await axios.get("/auth/logout", { withCredentials: true });
                  window.location.href = "/login";
                }}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
