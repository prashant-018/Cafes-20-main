import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, User, MessageCircle, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { ProfileMenu } from "./ProfileMenu";
import { useSettings } from "@/contexts/SettingsContext";

// Navbar height constant for scroll calculations
const NAVBAR_HEIGHT = 88; // Approximate height of sticky navbar

interface User {
  name: string;
  email: string;
  role?: 'user' | 'admin';
}

// Floating WhatsApp FAB Component
function FloatingWhatsAppFAB({ whatsappNumber }: { whatsappNumber: string }) {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Show button when scrolling up, hide when scrolling down
      if (currentScrollY < lastScrollY || currentScrollY < 100) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed bottom-6 right-6 z-50"
        >
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => window.open(`https://wa.me/${whatsappNumber}`, '_blank')}
            className="w-14 h-14 bg-[#25D366] rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow duration-300"
            style={{
              boxShadow: '0 4px 20px rgba(37, 211, 102, 0.4)'
            }}
            aria-label="Order on WhatsApp"
          >
            <MessageCircle className="w-7 h-7 text-white" />
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function Navbar() {
  const { settings } = useSettings();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const whatsappNumber = settings?.whatsappNumber || "+918305385083";
  const whatsappNumberDigits = whatsappNumber.replace(/\D/g, "");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Check auth state on component mount and storage changes
  useEffect(() => {
    const checkAuthState = () => {
      // Check regular user auth
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');

      // Check admin auth
      const adminToken = localStorage.getItem('adminToken');
      const adminData = localStorage.getItem('admin');

      if (token && userData) {
        try {
          const parsedUser = JSON.parse(userData);
          setUser({
            name: parsedUser.name || 'User',
            email: parsedUser.email,
            role: parsedUser.role || 'user'
          });
          setIsLoggedIn(true);
        } catch (error) {
          console.error('Error parsing user data:', error);
          handleLogout();
        }
      } else if (adminToken && adminData) {
        try {
          const parsedAdmin = JSON.parse(adminData);
          setUser({
            name: 'Admin',
            email: parsedAdmin.email,
            role: 'admin'
          });
          setIsLoggedIn(true);
        } catch (error) {
          console.error('Error parsing admin data:', error);
          handleLogout();
        }
      } else {
        setUser(null);
        setIsLoggedIn(false);
      }
    };

    checkAuthState();

    // Listen for storage changes (e.g., login from another tab)
    window.addEventListener('storage', checkAuthState);
    return () => window.removeEventListener('storage', checkAuthState);
  }, []);

  // Handle logout
  const handleLogout = () => {
    // Clear both user and admin tokens
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('adminToken');
    localStorage.removeItem('admin');
    setUser(null);
    setIsLoggedIn(false);
  };

  // Smooth scroll to section
  const scrollToSection = (sectionId: string) => {
    setIsMobileMenuOpen(false);

    const element = document.getElementById(sectionId);
    if (element) {
      const navbarHeight = 88; // Approximate navbar height
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - navbarHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const navLinks = [
    { name: "Home", sectionId: "home" },
    { name: "Menu", sectionId: "menu" },
    { name: "Offers", sectionId: "offers" },
    { name: "Gallery", sectionId: "gallery" },
    { name: "Our Story", sectionId: "our-story" },
    { name: "Contact", sectionId: "contact" },
  ];

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500 px-6 py-4",
        isScrolled ? "bg-background/80 backdrop-blur-md border-b border-white/10" : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <a
          href="#home"
          onClick={(e) => {
            e.preventDefault();
            scrollToSection("home");
          }}
          className="flex items-center gap-3 cursor-pointer"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-12 h-12 rounded-full overflow-hidden border-2 border-primary/20 hover:border-primary/40 transition-colors"
          >
            <img
              src="/the himalya image.jpg"
              alt="The Himalayan Pizza Logo"
              className="w-full h-full object-cover"
            />
          </motion.div>
          <span className="font-serif text-2xl font-bold tracking-tight text-white">
            The Himalayan <span className="text-primary">Pizza</span>
          </span>
        </a>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={`#${link.sectionId}`}
              onClick={(e) => {
                e.preventDefault();
                scrollToSection(link.sectionId);
              }}
              className="text-sm font-medium text-white/70 hover:text-primary transition-colors cursor-pointer"
            >
              {link.name}
            </a>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-4">
          {/* Auth Section - Show avatar if logged in, user icon if not */}
          {isLoggedIn && user ? (
            <ProfileMenu user={user} onLogout={handleLogout} />
          ) : (
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:text-primary"
              onClick={() => navigate("/login")}
            >
              <User className="w-5 h-5" />
            </Button>
          )}

          {/* WhatsApp Order Button */}
          <Button
            className="bg-green-600 hover:bg-green-700 text-white rounded-full px-6 shadow-lg hover:shadow-xl transition-all duration-300"
            onClick={() => window.open(`https://wa.me/${whatsappNumberDigits}`, '_blank')}
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            Order on WhatsApp
          </Button>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden text-white"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 bg-background border-b border-white/10 p-6 md:hidden flex flex-col gap-4"
          >
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={`#${link.sectionId}`}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection(link.sectionId);
                }}
                className="text-lg font-medium text-white/70 hover:text-primary transition-colors cursor-pointer"
              >
                {link.name}
              </a>
            ))}
            <div className="flex flex-col gap-2 pt-4">
              {/* Mobile Auth Section */}
              {!isLoggedIn ? (
                <Button
                  variant="ghost"
                  className="text-white hover:text-primary w-full justify-start"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    navigate("/login");
                  }}
                >
                  <User className="w-5 h-5 mr-2" />
                  Login
                </Button>
              ) : (
                <Button
                  variant="ghost"
                  className="text-white hover:text-primary w-full justify-start"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    handleLogout();
                  }}
                >
                  <User className="w-5 h-5 mr-2" />
                  Logout
                </Button>
              )}

              {/* WhatsApp Order Button */}
              <Button
                className="bg-green-600 hover:bg-green-700 text-white w-full"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  window.open(`https://wa.me/${whatsappNumberDigits}`, '_blank');
                }}
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Order on WhatsApp
              </Button>

              {/* Call Now Button */}
              <Button
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10 w-full"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  window.open(`tel:${whatsappNumberDigits}`, '_self');
                }}
              >
                <Phone className="w-5 h-5 mr-2" />
                Call Now
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
