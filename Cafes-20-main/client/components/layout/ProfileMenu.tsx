import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, ShoppingBag, LogOut, LayoutDashboard } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface User {
  name: string;
  email: string;
  role?: 'user' | 'admin';
}

interface ProfileMenuProps {
  user: User;
  onLogout: () => void;
}

export function ProfileMenu({ user, onLogout }: ProfileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Get first letter of user's name for avatar
  const getInitial = (name: string) => {
    return name.charAt(0).toUpperCase();
  };

  const handleLogout = () => {
    onLogout();
    setIsOpen(false);
    navigate("/");
  };

  // Role-based menu items
  const menuItems = user.role === 'admin'
    ? [
      {
        icon: LayoutDashboard,
        label: "Dashboard",
        onClick: () => {
          setIsOpen(false);
          navigate("/admin/dashboard");
        }
      },
      {
        icon: User,
        label: "Profile",
        onClick: () => {
          setIsOpen(false);
          // Navigate to profile page when implemented
          console.log("Navigate to profile");
        }
      },
      {
        icon: LogOut,
        label: "Logout",
        onClick: handleLogout
      }
    ]
    : [
      {
        icon: ShoppingBag,
        label: "My Orders",
        onClick: () => {
          setIsOpen(false);
          navigate("/my-orders");
        }
      },
      {
        icon: User,
        label: "Profile",
        onClick: () => {
          setIsOpen(false);
          // Navigate to profile page when implemented
          console.log("Navigate to profile");
        }
      },
      {
        icon: LogOut,
        label: "Logout",
        onClick: handleLogout
      }
    ];

  return (
    <div className="relative" ref={menuRef}>
      {/* Avatar Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="w-9 h-9 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center text-white font-bold text-sm cursor-pointer hover:scale-105 transition-transform duration-200 shadow-lg"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {getInitial(user.name)}
      </motion.button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 top-12 w-56 bg-gray-900 rounded-lg shadow-xl border border-gray-700 overflow-hidden z-50"
          >
            {/* User Info Header */}
            <div className="px-4 py-3 border-b border-gray-700">
              <p className="font-semibold text-white text-sm">{user.name}</p>
              <p className="text-gray-400 text-xs truncate">{user.email}</p>
            </div>

            {/* Menu Items */}
            <div className="py-2">
              {menuItems.map((item, index) => (
                <button
                  key={item.label}
                  onClick={item.onClick}
                  className="w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors duration-150 flex items-center gap-3"
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}