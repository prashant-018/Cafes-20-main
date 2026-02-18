import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  MessageCircle,
  Leaf,
  Search,
  X
} from "lucide-react";
import { useSettings } from "@/contexts/SettingsContext";
import { menuData, MenuItem } from "@/data/menuData";

// Interface for admin-added items
interface AdminMenuItem {
  id?: string;
  name: string;
  category: string;
  description: string;
  isVeg: boolean;
  pricing: {
    small?: number;
    medium?: number;
    large?: number;
    single?: number;
  };
  image: string;
  isAvailable: boolean;
  isPopular?: boolean;
}

export default function Menu() {
  const { settings } = useSettings();
  const whatsappNumberDigits = (settings?.whatsappNumber || "+918305385083").replace(/\D/g, "");

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [adminMenuItems, setAdminMenuItems] = useState<AdminMenuItem[]>([]);

  // Load admin-added menu items from localStorage
  useEffect(() => {
    const loadMenuItems = () => {
      const saved = localStorage.getItem('adminMenuItems');
      if (saved) {
        try {
          const items = JSON.parse(saved);
          // Filter for available items and remove duplicates by id
          const uniqueItems = items
            .filter((item: AdminMenuItem) => item.isAvailable)
            .filter((item: AdminMenuItem, index: number, self: AdminMenuItem[]) =>
              index === self.findIndex((t) => t.id === item.id)
            );
          setAdminMenuItems(uniqueItems);
        } catch (error) {
          console.error('Failed to load admin menu items:', error);
        }
      }
    };

    loadMenuItems();

    // Listen for storage changes (when admin updates menu)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'adminMenuItems') {
        loadMenuItems();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // Also check for changes every 2 seconds (for same-tab updates)
    const interval = setInterval(() => {
      loadMenuItems();
    }, 2000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  // Convert admin items to MenuItem format and merge with static data
  const convertAdminItemToMenuItem = (adminItem: AdminMenuItem): MenuItem => {
    return {
      id: adminItem.id || '',
      name: adminItem.name,
      description: adminItem.description,
      price: {
        regular: adminItem.pricing.single,
        medium: adminItem.pricing.medium,
        large: adminItem.pricing.large
      },
      image: adminItem.image,
      isVeg: adminItem.isVeg,
      category: adminItem.category,
      isPopular: adminItem.isPopular
    };
  };

  // Merge static menu data with admin-added items
  const mergedMenuData = [...menuData];

  // Debug logging
  console.log('📊 Menu Data Merge:', {
    staticCategories: menuData.length,
    adminItems: adminMenuItems.length,
    adminItemsDetails: adminMenuItems.map(i => ({ name: i.name, category: i.category, id: i.id }))
  });

  // Group admin items by category and add to merged data
  adminMenuItems.forEach(adminItem => {
    // Find matching category (case-insensitive)
    const existingCategory = mergedMenuData.find(cat =>
      cat.name.toLowerCase() === adminItem.category.toLowerCase()
    );
    const menuItem = convertAdminItemToMenuItem(adminItem);

    if (existingCategory) {
      // Add to existing category (check for duplicates)
      const isDuplicate = existingCategory.items.some(item => item.id === menuItem.id);
      if (!isDuplicate) {
        existingCategory.items.push(menuItem);
        console.log(`✅ Added "${menuItem.name}" to existing category "${existingCategory.name}"`);
      } else {
        console.log(`⚠️ Skipped duplicate "${menuItem.name}" in "${existingCategory.name}"`);
      }
    } else {
      // Create new category
      const newCategory = {
        id: adminItem.category.toLowerCase().replace(/\s+/g, '-'),
        name: adminItem.category,
        description: `Delicious ${adminItem.category.toLowerCase()}`,
        icon: '🍽️',
        items: [menuItem]
      };
      mergedMenuData.push(newCategory);
      console.log(`✨ Created new category "${newCategory.name}" with "${menuItem.name}"`);
    }
  });

  // Filter items based on search and category
  const filteredCategories = mergedMenuData.map(category => ({
    ...category,
    items: category.items.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === "all" || category.id === selectedCategory;
      return matchesSearch && matchesCategory;
    })
  })).filter(category => category.items.length > 0);

  // WhatsApp order function
  const orderOnWhatsApp = (item: MenuItem) => {
    const priceText = item.price.medium
      ? `Medium: ₹${item.price.medium}, Large: ₹${item.price.large}`
      : `₹${item.price.regular}`;

    const message = `Hi! I'd like to order:\n\n${item.name}\n${item.description}\nPrice: ${priceText}\n\nPlease confirm availability and delivery details.`;
    const whatsappUrl = `https://wa.me/${whatsappNumberDigits}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  // Format price display
  const formatPrice = (price: MenuItem['price']) => {
    if (price.medium) {
      return (
        <div className="flex flex-col">
          <span className="text-yellow-400 font-bold text-lg">₹{price.medium}</span>
          <span className="text-gray-400 text-xs">Medium</span>
        </div>
      );
    }
    return <span className="text-yellow-400 font-bold text-xl">₹{price.regular}</span>;
  };

  return (
    <div className="relative pt-8 pb-12 min-h-screen bg-background">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <Link to="/">
            <Button variant="ghost" className="text-white hover:text-primary gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Button>
          </Link>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-serif font-bold text-white mb-4">
            Complete <span className="text-primary italic">Menu</span>
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
            Explore our full range of delicious offerings
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="relative max-w-md mx-auto mb-6"
        >
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search menu items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-card border border-white/10 rounded-full text-white placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex gap-2 overflow-x-auto pb-4 no-scrollbar"
        >
          <Button
            variant={selectedCategory === "all" ? "default" : "outline"}
            onClick={() => setSelectedCategory("all")}
            className={`rounded-full whitespace-nowrap ${selectedCategory === "all"
              ? "bg-primary text-white"
              : "border-white/10 text-white hover:bg-white/10"
              }`}
          >
            All Items
          </Button>
          {mergedMenuData.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              onClick={() => setSelectedCategory(category.id)}
              className={`rounded-full whitespace-nowrap ${selectedCategory === category.id
                ? "bg-primary text-white"
                : "border-white/10 text-white hover:bg-white/10"
                }`}
            >
              {category.icon} {category.name}
            </Button>
          ))}
        </motion.div>
      </div>

      {/* Menu Categories */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {filteredCategories.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-white text-lg mb-2">No items found</p>
            <p className="text-muted-foreground">Try a different search term or category</p>
          </div>
        ) : (
          filteredCategories.map((category, categoryIndex) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: categoryIndex * 0.1 }}
              className="mb-16"
            >
              {/* Category Header */}
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-4xl">{category.icon}</span>
                  <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white">
                    {category.name}
                  </h2>
                  <Badge variant="secondary" className="bg-primary/20 text-primary border-primary/30">
                    {category.items.length} items
                  </Badge>
                </div>
                <p className="text-muted-foreground ml-14">{category.description}</p>
              </div>

              {/* Items Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                {category.items.map((item, itemIndex) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: itemIndex * 0.05 }}
                    whileHover={{ scale: 1.02 }}
                    className="bg-card rounded-2xl overflow-hidden border border-white/5 hover:border-primary/30 transition-all duration-300 group cursor-pointer"
                    onClick={() => setSelectedItem(item)}
                  >
                    <div className="flex gap-4 p-4">
                      {/* Image */}
                      <div className="relative w-24 h-24 sm:w-32 sm:h-32 flex-shrink-0 rounded-xl overflow-hidden">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        {item.isVeg && (
                          <div className="absolute top-2 right-2">
                            <Badge className="bg-green-600 border-green-500 text-white px-2 py-0.5 text-xs">
                              <Leaf className="w-3 h-3" />
                            </Badge>
                          </div>
                        )}
                        {item.isPopular && (
                          <div className="absolute top-2 left-2">
                            <Badge className="bg-yellow-600 border-yellow-500 text-white px-2 py-0.5 text-xs">
                              ⭐
                            </Badge>
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                          <h3 className="text-base sm:text-lg font-bold text-white mb-1 group-hover:text-primary transition-colors line-clamp-1">
                            {item.name}
                          </h3>
                          <p className="text-gray-400 text-xs sm:text-sm line-clamp-2 mb-2">
                            {item.description}
                          </p>
                        </div>

                        <div className="flex items-end justify-between gap-2">
                          {/* Price */}
                          <div>
                            {formatPrice(item.price)}
                            {item.price.large && (
                              <div className="mt-1">
                                <span className="text-yellow-400 font-bold text-sm">₹{item.price.large}</span>
                                <span className="text-gray-400 text-xs ml-1">Large</span>
                              </div>
                            )}
                          </div>

                          {/* Order Button */}
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700 text-white border-0 rounded-lg px-3 py-2 text-xs sm:text-sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              orderOnWhatsApp(item);
                            }}
                          >
                            <MessageCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                            Order
                          </Button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Item Detail Modal */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedItem(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="relative max-w-2xl w-full bg-card rounded-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedItem(null)}
                className="absolute top-4 right-4 w-10 h-10 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white transition-colors duration-200 z-10"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="grid md:grid-cols-2 gap-0">
                {/* Item Image */}
                <div className="relative aspect-square overflow-hidden">
                  <img
                    src={selectedItem.image}
                    alt={selectedItem.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4 flex gap-2">
                    {selectedItem.isVeg && (
                      <Badge className="bg-green-600 border-green-500 text-white">
                        <Leaf className="w-4 h-4 mr-1" />
                        VEG
                      </Badge>
                    )}
                    {selectedItem.isPopular && (
                      <Badge className="bg-yellow-600 border-yellow-500 text-white">
                        ⭐ Popular
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Item Details */}
                <div className="p-6 sm:p-8 flex flex-col justify-between">
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
                      {selectedItem.name}
                    </h2>
                    <p className="text-gray-400 text-base sm:text-lg mb-6 leading-relaxed">
                      {selectedItem.description}
                    </p>

                    {/* Price */}
                    <div className="mb-6">
                      {selectedItem.price.medium ? (
                        <div className="space-y-2">
                          <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                            <span className="text-white">Medium</span>
                            <span className="text-yellow-400 font-bold text-xl">₹{selectedItem.price.medium}</span>
                          </div>
                          <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                            <span className="text-white">Large</span>
                            <span className="text-yellow-400 font-bold text-xl">₹{selectedItem.price.large}</span>
                          </div>
                        </div>
                      ) : (
                        <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                          <span className="text-white">Price</span>
                          <span className="text-yellow-400 font-bold text-2xl">₹{selectedItem.price.regular}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Order Button */}
                  <Button
                    className="w-full bg-green-600 hover:bg-green-700 text-white border-0 rounded-xl py-6 text-lg transition-all"
                    onClick={() => orderOnWhatsApp(selectedItem)}
                  >
                    <MessageCircle className="w-5 h-5 mr-2" />
                    Order on WhatsApp
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
