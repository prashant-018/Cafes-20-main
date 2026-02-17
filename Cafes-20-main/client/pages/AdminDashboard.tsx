import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Phone,
  Clock,
  Image as ImageIcon,
  FileText,
  BookOpen,
  LogOut,
  Save,
  CheckCircle,
  AlertCircle,
  LayoutDashboard,
  Settings,
  Menu as MenuIcon,
  Tag,
  User,
  Upload,
  X,
  Loader2,
  MessageCircle,
  Plus,
  Trash2,
  Calendar,
  Eye
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useMenuImages } from "@/hooks/useMenuImages";
import { ApiTest } from "@/components/ApiTest";
import socketService, { SettingsUpdateEvent } from "@/services/socket";
import { settingsAPI } from "@/services/api";

interface MenuImage {
  id: string;
  name: string;
  url: string;
  uploadDate: string;
  size: number;
  mimeType: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface AdminData {
  phoneNumber: string;
  openingTime: string;
  closingTime: string;
  offersText: string;
  storyContent: string;
  isOpen: boolean;
}

type ActiveSection = 'dashboard' | 'business' | 'menu' | 'offers';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeSection, setActiveSection] = useState<ActiveSection>('dashboard');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Use the menu images hook for real-time updates
  const {
    images: menuImages,
    loading: imagesLoading,
    error: imagesError,
    uploadImages,
    deleteImage,
    uploadProgress
  } = useMenuImages(true); // true for admin mode

  const [adminData, setAdminData] = useState<AdminData>({
    phoneNumber: "+918305385083",
    openingTime: "10:00",
    closingTime: "23:00",
    offersText: "Wednesday BOGO Special - Buy One Get One Free on all medium Premium & Delight pizzas! Valid every Wednesday. Cannot be combined with other offers.",
    storyContent: "Born in the heart of Jabalpur, The Himalayan Pizza brings you authentic mountain flavors with a modern twist. Our journey began with a simple dream - to serve the most delicious pizzas using fresh, locally sourced ingredients and traditional Himalayan spices.",
    isOpen: true
  });

  // Simple auth check to prevent unauthorized access
  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      navigate("/admin/login");
    }
  }, [navigate]);

  // Load settings on page load
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const res = await settingsAPI.get();
        if (res?.success && res.data) {
          setAdminData(prev => ({
            ...prev,
            phoneNumber: res.data.whatsappNumber ?? prev.phoneNumber,
            openingTime: res.data.openingTime ?? prev.openingTime,
            closingTime: res.data.closingTime ?? prev.closingTime,
            storyContent: res.data.brandStory ?? prev.storyContent,
            offersText: res.data.offersText ?? prev.offersText,
            isOpen: typeof res.data.isManuallyOpen === 'boolean' ? res.data.isManuallyOpen : prev.isOpen,
          }));
        }
      } catch (e) {
        // Keep UI usable even if settings endpoint fails
        console.error('Failed to load settings:', e);
      }
    };

    loadSettings();
  }, []);

  // Realtime updates for settings
  useEffect(() => {
    const socket = socketService.connect();
    socketService.joinAdmin();

    const onUpdate = (event: SettingsUpdateEvent) => {
      const s = event?.data;
      if (!s) return;
      setAdminData(prev => ({
        ...prev,
        phoneNumber: s.whatsappNumber ?? prev.phoneNumber,
        openingTime: s.openingTime ?? prev.openingTime,
        closingTime: s.closingTime ?? prev.closingTime,
        storyContent: s.brandStory ?? prev.storyContent,
        offersText: s.offersText ?? prev.offersText,
        isOpen: typeof s.isManuallyOpen === 'boolean' ? s.isManuallyOpen : prev.isOpen,
      }));
    };

    socketService.onSettingsUpdate(onUpdate);
    return () => {
      socketService.offSettingsUpdate(onUpdate);
    };
  }, []);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('admin');
    navigate('/admin/login');
  };

  // Handle form updates
  const updateField = (field: keyof AdminData, value: string) => {
    setAdminData(prev => ({ ...prev, [field]: field === 'isOpen' ? value === 'true' : value }));
  };

  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Format date
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Handle multiple image uploads - REAL API UPLOAD
  const handleImageUpload = async (files: FileList) => {
    console.log('🎯 AdminDashboard: handleImageUpload called with', files.length, 'file(s)');
    console.log('📊 Current menu images count:', menuImages.length);

    const validFiles: File[] = [];

    // Validate files
    Array.from(files).forEach(file => {
      if (file.size > 10 * 1024 * 1024) {
        setMessage({ type: 'error', text: `${file.name} is too large. Maximum size is 10MB.` });
        return;
      }

      if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
        setMessage({ type: 'error', text: `${file.name} is not a supported format.` });
        return;
      }

      validFiles.push(file);
    });

    if (validFiles.length === 0) {
      console.log('❌ No valid files to upload');
      return;
    }

    console.log(`✅ ${validFiles.length} valid file(s) ready for upload`);

    try {
      // Create FileList-like object from valid files
      const dataTransfer = new DataTransfer();
      validFiles.forEach(file => dataTransfer.items.add(file));
      const fileList = dataTransfer.files;

      console.log('📤 Calling uploadImages from useMenuImages hook...');
      console.log('⚠️ IMPORTANT: This should ADD to existing images, not replace them!');

      await uploadImages(fileList);

      console.log('✅ Upload successful!');
      console.log('📊 Expected total images:', menuImages.length + validFiles.length);

      setMessage({
        type: 'success',
        text: `Successfully uploaded ${validFiles.length} image${validFiles.length > 1 ? 's' : ''}! Previous images preserved.`
      });

      setTimeout(() => setMessage(null), 4000);
    } catch (error: any) {
      console.error('❌ Upload failed:', error);
      setMessage({
        type: 'error',
        text: error?.message || 'Failed to upload images. Please try again.'
      });
      setTimeout(() => setMessage(null), 4000);
    }
  };

  // Handle file input change
  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      handleImageUpload(files);
    }
    // Reset input value to allow re-uploading the same file
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Handle drag and drop
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleImageUpload(e.dataTransfer.files);
    }
  };

  // Delete menu image - REAL API DELETE
  const deleteMenuImage = async (imageId: string) => {
    console.log('🗑️ AdminDashboard: Deleting image:', imageId);
    setIsLoading(true);

    try {
      await deleteImage(imageId);
      console.log('✅ Image deleted successfully');

      setMessage({ type: 'success', text: 'Menu image deleted successfully!' });
      setTimeout(() => setMessage(null), 4000);
    } catch (error: any) {
      console.error('❌ Delete failed:', error);
      setMessage({
        type: 'error',
        text: error?.message || 'Failed to delete image. Please try again.'
      });
      setTimeout(() => setMessage(null), 4000);
    } finally {
      setIsLoading(false);
      setDeleteConfirm(null);
    }
  };

  // Save individual section
  const saveSection = async (sectionName: string) => {
    setIsLoading(true);
    setMessage(null);

    try {
      const isBusinessSettingsSection =
        sectionName === 'Contact Information' ||
        sectionName === 'Business Hours' ||
        sectionName === 'Restaurant Story' ||
        sectionName === 'Special Offers' ||
        sectionName === 'Business Settings';

      if (isBusinessSettingsSection) {
        const payload = {
          whatsappNumber: adminData.phoneNumber,
          openingTime: adminData.openingTime,
          closingTime: adminData.closingTime,
          isManuallyOpen: adminData.isOpen,
          brandStory: adminData.storyContent,
          offersText: adminData.offersText,
        };

        const res = await settingsAPI.update(payload);
        if (!res?.success) {
          throw new Error(res?.message || 'Failed to update settings');
        }

        // Re-fetch from DB to ensure UI reflects persisted values
        const refreshed = await settingsAPI.get();
        if (refreshed?.success && refreshed.data) {
          setAdminData(prev => ({
            ...prev,
            phoneNumber: refreshed.data.whatsappNumber ?? prev.phoneNumber,
            openingTime: refreshed.data.openingTime ?? prev.openingTime,
            closingTime: refreshed.data.closingTime ?? prev.closingTime,
            storyContent: refreshed.data.brandStory ?? prev.storyContent,
            offersText: refreshed.data.offersText ?? prev.offersText,
            isOpen: typeof refreshed.data.isManuallyOpen === 'boolean' ? refreshed.data.isManuallyOpen : prev.isOpen,
          }));
        }
      } else {
        // Keep other sections as-is for now
        await new Promise(resolve => setTimeout(resolve, 400));
      }

      setMessage({ type: 'success', text: `${sectionName} updated successfully!` });

      // Clear message after 4 seconds
      setTimeout(() => setMessage(null), 4000);
    } catch (error) {
      setMessage({ type: 'error', text: `Failed to update ${sectionName}` });
      setTimeout(() => setMessage(null), 4000);
    } finally {
      setIsLoading(false);
    }
  };

  // Navigation items
  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'business', label: 'Business Settings', icon: Settings },
    { id: 'menu', label: 'Menu', icon: MenuIcon },
    { id: 'offers', label: 'Offers', icon: Tag },
  ];

  // Get current time status
  const getCurrentStatus = () => {
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    const openTime = parseInt(adminData.openingTime.split(':')[0]) * 60 + parseInt(adminData.openingTime.split(':')[1]);
    const closeTime = parseInt(adminData.closingTime.split(':')[0]) * 60 + parseInt(adminData.closingTime.split(':')[1]);

    const isCurrentlyOpen = adminData.isOpen && currentTime >= openTime && currentTime <= closeTime;
    return isCurrentlyOpen;
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex overflow-x-hidden">
      {/* API Debug Component */}
      <ApiTest />

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          w-64 bg-[#111111] border-r border-gray-800 
          flex flex-col
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Logo */}
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-lg overflow-hidden border-2 border-red-600/20 flex-shrink-0">
                <img
                  src="/the himalya image.jpg"
                  alt="Himalayan Pizza Logo"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="min-w-0">
                <h1 className="text-white font-semibold text-lg truncate">Himalayan Pizza</h1>
                <p className="text-gray-400 text-sm truncate">Admin Panel</p>
              </div>
            </div>
            {/* Close button for mobile */}
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-gray-400 hover:text-white p-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <div className="space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveSection(item.id as ActiveSection);
                    setSidebarOpen(false); // Close sidebar on mobile after selection
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-300 group min-w-0 ${isActive
                    ? 'bg-red-600/10 text-red-400 border border-red-600/20'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                    }`}
                >
                  <Icon className={`w-5 h-5 flex-shrink-0 transition-all duration-300 ${isActive
                    ? 'text-red-400 drop-shadow-[0_0_6px_rgba(239,68,68,0.8)]'
                    : 'text-gray-400 group-hover:text-white group-hover:drop-shadow-[0_0_4px_rgba(255,255,255,0.3)]'
                    }`} />
                  <span className="font-medium truncate">{item.label}</span>
                </button>
              );
            })}
          </div>
        </nav>

        {/* User Profile & Logout */}
        <div className="p-4 border-t border-gray-800">
          <div className="flex items-center gap-3 mb-4 min-w-0">
            <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center flex-shrink-0">
              <User className="w-5 h-5 text-gray-300" />
            </div>
            <div className="min-w-0">
              <p className="text-white font-medium truncate">Admin</p>
              <p className="text-gray-400 text-sm truncate">Restaurant Owner</p>
            </div>
          </div>
          <Button
            variant="ghost"
            onClick={handleLogout}
            className="w-full justify-start text-gray-400 hover:text-red-400 hover:bg-red-600/10"
          >
            <LogOut className="w-4 h-4 mr-2 flex-shrink-0" />
            <span className="truncate">Logout</span>
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="bg-[#111111] border-b border-gray-800 px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between gap-4">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-gray-400 hover:text-white p-2 -ml-2"
            >
              <MenuIcon className="w-6 h-6" />
            </button>

            <div className="min-w-0 flex-1">
              <h2 className="text-xl sm:text-2xl font-semibold text-white capitalize truncate">
                {activeSection === 'dashboard' ? 'Dashboard Overview' :
                  activeSection === 'business' ? 'Business Settings' :
                    activeSection === 'menu' ? 'Menu Management' : 'Offers & Promotions'}
              </h2>
              <p className="text-gray-400 mt-1 text-sm sm:text-base hidden sm:block">
                {activeSection === 'dashboard' ? 'Monitor your restaurant performance' :
                  activeSection === 'business' ? 'Manage your business information' :
                    activeSection === 'menu' ? 'Update your menu and pricing' : 'Create and manage special offers'}
              </p>
            </div>
            <div className="flex items-center gap-4 flex-shrink-0">
              <Badge variant={getCurrentStatus() ? "default" : "secondary"} className={`${getCurrentStatus() ? "bg-green-600 text-white" : "bg-gray-600 text-gray-200"} whitespace-nowrap`}>
                {getCurrentStatus() ? 'Open' : 'Closed'}
              </Badge>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto overflow-x-hidden">
          {/* Success/Error Toast */}
          <AnimatePresence>
            {message && (
              <motion.div
                initial={{ opacity: 0, y: -50, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -50, scale: 0.95 }}
                className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg border flex items-center gap-3 max-w-[calc(100vw-2rem)] sm:min-w-[300px] ${message.type === 'success'
                  ? 'bg-green-900/90 text-green-100 border-green-700 backdrop-blur-sm'
                  : 'bg-red-900/90 text-red-100 border-red-700 backdrop-blur-sm'
                  }`}
              >
                {message.type === 'success' ? (
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                )}
                <span className="font-medium break-words">{message.text}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Dashboard Overview */}
          {activeSection === 'dashboard' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                <Card className="bg-[#111111] border-gray-800">
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-gray-400 text-xs sm:text-sm font-medium">Restaurant Status</p>
                        <p className="text-xl sm:text-2xl font-bold text-white mt-1 truncate">
                          {getCurrentStatus() ? 'Open' : 'Closed'}
                        </p>
                      </div>
                      <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-all duration-300 group flex-shrink-0 ${getCurrentStatus() ? 'bg-green-600/20 hover:bg-green-600/30' : 'bg-gray-600/20 hover:bg-gray-600/30'}`}>
                        <Clock className={`w-5 h-5 sm:w-6 sm:h-6 transition-all duration-300 ${getCurrentStatus() ? 'text-green-400 group-hover:text-green-300 group-hover:drop-shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'text-gray-300 group-hover:text-gray-200 group-hover:drop-shadow-[0_0_8px_rgba(156,163,175,0.4)]'}`} />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-[#111111] border-gray-800">
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-gray-400 text-xs sm:text-sm font-medium">Contact Number</p>
                        <p className="text-xl sm:text-2xl font-bold text-white mt-1 truncate">{adminData.phoneNumber}</p>
                      </div>
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-blue-600/20 hover:bg-blue-600/30 flex items-center justify-center transition-all duration-300 group flex-shrink-0">
                        <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 text-gray-300 group-hover:text-blue-300 group-hover:drop-shadow-[0_0_8px_rgba(59,130,246,0.6)] transition-all duration-300" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-[#111111] border-gray-800">
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-gray-400 text-xs sm:text-sm font-medium">Business Hours</p>
                        <p className="text-xl sm:text-2xl font-bold text-white mt-1 truncate">{adminData.openingTime} - {adminData.closingTime}</p>
                      </div>
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-purple-600/20 hover:bg-purple-600/30 flex items-center justify-center transition-all duration-300 group flex-shrink-0">
                        <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-gray-300 group-hover:text-purple-300 group-hover:drop-shadow-[0_0_8px_rgba(147,51,234,0.6)] transition-all duration-300" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Actions */}
              <Card className="bg-[#111111] border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">Quick Actions</CardTitle>
                  <CardDescription className="text-gray-400">
                    Common tasks to manage your restaurant
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                    <Button
                      onClick={() => setActiveSection('business')}
                      variant="outline"
                      className="h-16 sm:h-20 flex-col gap-1 sm:gap-2 border-gray-700 hover:border-red-600/50 hover:bg-red-600/5 group transition-all duration-300"
                    >
                      <Settings className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400 group-hover:text-red-400 group-hover:drop-shadow-[0_0_6px_rgba(239,68,68,0.6)] transition-all duration-300" />
                      <span className="text-xs sm:text-sm text-gray-300 group-hover:text-white transition-colors duration-300 text-center">Business Settings</span>
                    </Button>
                    <Button
                      onClick={() => setActiveSection('menu')}
                      variant="outline"
                      className="h-16 sm:h-20 flex-col gap-1 sm:gap-2 border-gray-700 hover:border-red-600/50 hover:bg-red-600/5 group transition-all duration-300"
                    >
                      <MenuIcon className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400 group-hover:text-red-400 group-hover:drop-shadow-[0_0_6px_rgba(239,68,68,0.6)] transition-all duration-300" />
                      <span className="text-xs sm:text-sm text-gray-300 group-hover:text-white transition-colors duration-300 text-center">Update Menu</span>
                    </Button>
                    <Button
                      onClick={() => setActiveSection('offers')}
                      variant="outline"
                      className="h-16 sm:h-20 flex-col gap-1 sm:gap-2 border-gray-700 hover:border-red-600/50 hover:bg-red-600/5 group transition-all duration-300"
                    >
                      <Tag className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400 group-hover:text-red-400 group-hover:drop-shadow-[0_0_6px_rgba(239,68,68,0.6)] transition-all duration-300" />
                      <span className="text-xs sm:text-sm text-gray-300 group-hover:text-white transition-colors duration-300 text-center">Manage Offers</span>
                    </Button>
                    <Button
                      onClick={() => window.open('https://wa.me/' + adminData.phoneNumber.replace('+', ''), '_blank')}
                      variant="outline"
                      className="h-16 sm:h-20 flex-col gap-1 sm:gap-2 border-gray-700 hover:border-green-600/50 hover:bg-green-600/5 group transition-all duration-300"
                    >
                      <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400 group-hover:text-green-400 group-hover:drop-shadow-[0_0_6px_rgba(34,197,94,0.6)] transition-all duration-300" />
                      <span className="text-xs sm:text-sm text-gray-300 group-hover:text-white transition-colors duration-300 text-center">WhatsApp</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Business Settings */}
          {activeSection === 'business' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Phone Number Section */}
              <Card className="bg-[#111111] border-gray-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-white">
                    <Phone className="w-5 h-5 text-red-500" />
                    Contact Information
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Update the phone number used for WhatsApp orders and customer contact
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-gray-300 font-medium">Phone / WhatsApp Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={adminData.phoneNumber}
                      onChange={(e) => updateField('phoneNumber', e.target.value)}
                      className="bg-[#0a0a0a] border-gray-700 text-white h-12 text-lg focus:border-red-500 focus:ring-red-500/20"
                      placeholder="+91XXXXXXXXXX"
                    />
                    <p className="text-gray-500 text-sm">This number will be used for WhatsApp order links</p>
                  </div>
                  <Button
                    onClick={() => saveSection('Contact Information')}
                    disabled={isLoading}
                    className="bg-red-600 hover:bg-red-700 text-white px-6 h-11 font-medium"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              {/* Business Hours Section */}
              <Card className="bg-[#111111] border-gray-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-white group">
                    <Clock className="w-5 h-5 text-red-500 group-hover:text-red-400 group-hover:drop-shadow-[0_0_6px_rgba(239,68,68,0.8)] transition-all duration-300" />
                    Business Hours
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Set your restaurant opening and closing times
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="opening" className="text-gray-300 font-medium">Opening Time</Label>
                      <Input
                        id="opening"
                        type="time"
                        value={adminData.openingTime}
                        onChange={(e) => updateField('openingTime', e.target.value)}
                        className="bg-[#0a0a0a] border-gray-700 text-white h-12 text-lg focus:border-red-500 focus:ring-red-500/20"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="closing" className="text-gray-300 font-medium">Closing Time</Label>
                      <Input
                        id="closing"
                        type="time"
                        value={adminData.closingTime}
                        onChange={(e) => updateField('closingTime', e.target.value)}
                        className="bg-[#0a0a0a] border-gray-700 text-white h-12 text-lg focus:border-red-500 focus:ring-red-500/20"
                      />
                    </div>
                  </div>

                  {/* Status Toggle */}
                  <div className="flex items-center justify-between p-4 bg-[#0a0a0a] rounded-lg border border-gray-700">
                    <div>
                      <p className="text-white font-medium">Restaurant Status</p>
                      <p className="text-gray-400 text-sm">Manually override open/closed status</p>
                    </div>
                    <Button
                      onClick={() => updateField('isOpen', (!adminData.isOpen).toString())}
                      variant={adminData.isOpen ? "default" : "secondary"}
                      className={adminData.isOpen ? "bg-green-600 hover:bg-green-700" : "bg-gray-600 hover:bg-gray-700"}
                    >
                      {adminData.isOpen ? 'Open' : 'Closed'}
                    </Button>
                  </div>

                  {/* Current Status Display */}
                  <div className="p-4 bg-red-600/10 rounded-lg border border-red-600/20">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${getCurrentStatus() ? 'bg-green-400' : 'bg-gray-400'}`}></div>
                      <p className="text-red-400 font-medium">
                        Currently {getCurrentStatus() ? 'Open' : 'Closed'} • Hours: {adminData.openingTime} - {adminData.closingTime}
                      </p>
                    </div>
                  </div>

                  <Button
                    onClick={() => saveSection('Business Hours')}
                    disabled={isLoading}
                    className="bg-red-600 hover:bg-red-700 text-white px-6 h-11 font-medium"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              {/* Story Content */}
              <Card className="bg-[#111111] border-gray-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-white">
                    <BookOpen className="w-5 h-5 text-red-500" />
                    Restaurant Story
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Update your restaurant's story and brand message displayed on the website
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="story" className="text-gray-300 font-medium">Brand Story</Label>
                    <Textarea
                      id="story"
                      value={adminData.storyContent}
                      onChange={(e) => updateField('storyContent', e.target.value)}
                      className="bg-[#0a0a0a] border-gray-700 text-white min-h-[120px] text-base focus:border-red-500 focus:ring-red-500/20 resize-none"
                      placeholder="Tell your restaurant's story..."
                    />
                    <div className="flex justify-between items-center">
                      <p className="text-gray-500 text-sm">Share your restaurant's journey and values</p>
                      <p className="text-gray-500 text-sm">{adminData.storyContent.length} characters</p>
                    </div>
                  </div>
                  <Button
                    onClick={() => saveSection('Restaurant Story')}
                    disabled={isLoading}
                    className="bg-red-600 hover:bg-red-700 text-white px-6 h-11 font-medium"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Menu Management */}
          {activeSection === 'menu' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Menu Images Overview */}
              <Card className="bg-[#111111] border-gray-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-white">
                    <ImageIcon className="w-5 h-5 text-red-500" />
                    Menu Images
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Upload and manage multiple menu images displayed on your website
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Upload Area */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label className="text-gray-300 font-medium">Add New Menu Images</Label>
                      <Badge variant="secondary" className="bg-gray-700 text-gray-300">
                        {menuImages.length} image{menuImages.length !== 1 ? 's' : ''}
                      </Badge>
                    </div>

                    {/* Drag & Drop Upload Area */}
                    <div
                      className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300 cursor-pointer ${dragActive
                        ? 'border-red-500 bg-red-500/5'
                        : 'border-gray-600 hover:border-gray-500 bg-[#0a0a0a]'
                        }`}
                      onDragEnter={handleDrag}
                      onDragLeave={handleDrag}
                      onDragOver={handleDrag}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleFileInputChange}
                        className="hidden"
                      />

                      <div className="space-y-4">
                        <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center transition-colors duration-300 ${dragActive ? 'bg-red-500/20' : 'bg-gray-700'
                          }`}>
                          <Upload className={`w-8 h-8 transition-colors duration-300 ${dragActive ? 'text-red-400' : 'text-gray-400'
                            }`} />
                        </div>

                        <div>
                          <p className="text-white font-medium mb-2">
                            {dragActive ? 'Drop images here' : 'Drag & drop images here'}
                          </p>
                          <p className="text-gray-400 text-sm mb-4">
                            or click to browse files
                          </p>
                          <Button
                            type="button"
                            variant="outline"
                            className="border-red-600/50 text-red-400 hover:bg-red-600/10"
                            disabled={imagesLoading || uploadProgress > 0}
                            onClick={(e) => {
                              e.stopPropagation();
                              fileInputRef.current?.click();
                            }}
                          >
                            {uploadProgress > 0 ? (
                              <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Uploading... {uploadProgress}%
                              </>
                            ) : (
                              <>
                                <Plus className="w-4 h-4 mr-2" />
                                Select Images
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Upload Guidelines */}
                    <div className="flex items-start gap-2 p-3 bg-blue-600/10 rounded-lg border border-blue-600/20">
                      <Upload className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                      <div className="text-sm">
                        <p className="text-blue-400 font-medium">Upload Guidelines</p>
                        <ul className="text-gray-400 mt-1 space-y-1">
                          <li>• Maximum file size: 5MB per image</li>
                          <li>• Supported formats: JPG, PNG, WebP</li>
                          <li>• Multiple images can be uploaded at once</li>
                          <li>• Recommended size: 800x1200px or similar ratio</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Menu Images Grid */}
                  {menuImages.length > 0 && (
                    <div className="space-y-4">
                      <Label className="text-gray-300 font-medium">Current Menu Images</Label>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {menuImages.map((image) => (
                          <motion.div
                            key={image.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-[#0a0a0a] rounded-lg border border-gray-700 overflow-hidden group hover:border-gray-600 transition-all duration-300"
                          >
                            {/* Image Preview */}
                            <div className="relative aspect-[4/3] overflow-hidden">
                              <img
                                src={image.url}
                                alt={image.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />

                              {/* Overlay Actions */}
                              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
                                <Button
                                  size="sm"
                                  variant="secondary"
                                  className="bg-white/20 hover:bg-white/30 text-white border-0"
                                  onClick={() => window.open(image.url, '_blank')}
                                >
                                  <Eye className="w-4 h-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  className="bg-red-600/80 hover:bg-red-600 text-white border-0"
                                  onClick={() => setDeleteConfirm(image.id)}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>

                            {/* Image Info */}
                            <div className="p-4 space-y-2">
                              <h4 className="text-white font-medium truncate" title={image.name}>
                                {image.name}
                              </h4>
                              <div className="flex items-center justify-between text-sm text-gray-400">
                                <div className="flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />
                                  <span>{formatDate(image.uploadDate)}</span>
                                </div>
                                <span>{formatFileSize(image.size)}</span>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Empty State */}
                  {menuImages.length === 0 && !imagesLoading && (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 mx-auto bg-gray-700 rounded-full flex items-center justify-center mb-4">
                        <ImageIcon className="w-8 h-8 text-gray-400" />
                      </div>
                      <p className="text-gray-400 mb-2">No menu images uploaded yet</p>
                      <p className="text-gray-500 text-sm">Upload your first menu image to get started</p>
                    </div>
                  )}

                  {/* Loading State */}
                  {imagesLoading && (
                    <div className="text-center py-12">
                      <Loader2 className="w-8 h-8 mx-auto text-gray-400 animate-spin mb-4" />
                      <p className="text-gray-400">Loading menu images...</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Delete Confirmation Modal */}
          <AnimatePresence>
            {deleteConfirm && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
                onClick={() => setDeleteConfirm(null)}
              >
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.95, opacity: 0 }}
                  className="bg-[#111111] border border-gray-800 rounded-lg p-6 max-w-md w-full"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-red-600/20 rounded-full flex items-center justify-center">
                      <Trash2 className="w-5 h-5 text-red-400" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">Delete Menu Image</h3>
                      <p className="text-gray-400 text-sm">This action cannot be undone</p>
                    </div>
                  </div>

                  <p className="text-gray-300 mb-6">
                    Are you sure you want to delete this menu image? It will be permanently removed from your website.
                  </p>

                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      className="flex-1 border-gray-700 text-gray-300 hover:bg-gray-800"
                      onClick={() => setDeleteConfirm(null)}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="destructive"
                      className="flex-1 bg-red-600 hover:bg-red-700"
                      onClick={() => deleteMenuImage(deleteConfirm)}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Deleting...
                        </>
                      ) : (
                        <>
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </>
                      )}
                    </Button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Offers Management */}
          {activeSection === 'offers' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <Card className="bg-[#111111] border-gray-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-white">
                    <Tag className="w-5 h-5 text-red-500" />
                    Special Offers & Promotions
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Create and manage special offers displayed on your website
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="offers" className="text-gray-300 font-medium">Offers Description</Label>
                    <Textarea
                      id="offers"
                      value={adminData.offersText}
                      onChange={(e) => updateField('offersText', e.target.value)}
                      className="bg-[#0a0a0a] border-gray-700 text-white min-h-[120px] text-base focus:border-red-500 focus:ring-red-500/20 resize-none"
                      placeholder="Enter your current offers and promotions..."
                      maxLength={500}
                    />
                    <div className="flex justify-between items-center">
                      <p className="text-gray-500 text-sm">Describe your current promotions and special deals</p>
                      <p className={`text-sm ${adminData.offersText.length > 450 ? 'text-red-400' : 'text-gray-500'}`}>
                        {adminData.offersText.length}/500 characters
                      </p>
                    </div>
                  </div>

                  {/* Preview */}
                  {adminData.offersText && (
                    <div className="space-y-2">
                      <Label className="text-gray-300 font-medium">Preview</Label>
                      <div className="p-4 bg-[#0a0a0a] rounded-lg border border-gray-700">
                        <p className="text-white">{adminData.offersText}</p>
                      </div>
                    </div>
                  )}

                  <Button
                    onClick={() => saveSection('Special Offers')}
                    disabled={isLoading}
                    className="bg-red-600 hover:bg-red-700 text-white px-6 h-11 font-medium"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </main>
      </div>
    </div >
  );
}