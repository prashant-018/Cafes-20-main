import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { ArrowLeft, MessageCircle, Leaf, Search, X, ZoomIn, Loader2, ImageOff } from "lucide-react";
import { useSettings } from "@/contexts/SettingsContext";
import { useMenuImages } from "@/hooks/useMenuImages";

// Default products to show when no images are uploaded
const DEFAULT_PRODUCTS = [
  {
    id: 1,
    name: "Himalayan Special",
    price: 499,
    description: "Our signature pizza with exotic Himalayan flavors and premium toppings",
    image: "https://images.pexels.com/photos/2762938/pexels-photo-2762938.jpeg",
    isVeg: true
  },
  {
    id: 2,
    name: "Veg Supreme",
    price: 449,
    description: "Loaded with fresh vegetables, olives, and premium cheese blend",
    image: "https://images.pexels.com/photos/845811/pexels-photo-845811.jpeg",
    isVeg: true
  },
  {
    id: 3,
    name: "Farm Fresh",
    price: 459,
    description: "Garden-fresh vegetables with herbs and mozzarella cheese",
    image: "https://images.pexels.com/photos/905847/pexels-photo-905847.jpeg",
    isVeg: true
  },
  {
    id: 4,
    name: "BBQ Paneer",
    price: 529,
    description: "Smoky BBQ paneer with onions, peppers, and special sauce",
    image: "https://images.pexels.com/photos/10790638/pexels-photo-10790638.jpeg",
    isVeg: true
  },
  {
    id: 5,
    name: "Paneer Makhani",
    price: 499,
    description: "Creamy paneer makhani with bell peppers and Indian spices",
    image: "https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg",
    isVeg: true
  },
  {
    id: 6,
    name: "4 Cheese",
    price: 599,
    description: "Four premium cheeses melted to perfection on crispy crust",
    image: "https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg",
    isVeg: true
  }
];

export default function Menu() {
  const { settings } = useSettings();
  const { images: menuImages, loading, error } = useMenuImages(false);
  const whatsappNumberDigits = (settings?.whatsappNumber || "+918305385083").replace(/\D/g, "");

  const [searchTerm, setSearchTerm] = useState("");
  const [showFullMenu, setShowFullMenu] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  // Use uploaded images if available, otherwise use default products
  const displayProducts = menuImages.length > 0 ? menuImages : DEFAULT_PRODUCTS;

  console.log('📊 Menu Display Logic:', {
    uploadedImagesCount: menuImages.length,
    defaultProductsCount: DEFAULT_PRODUCTS.length,
    displayingCount: displayProducts.length,
    usingUploadedImages: menuImages.length > 0
  });

  // Filter based on search
  const filteredProducts = displayProducts.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative pt-8 pb-12 min-h-screen bg-background">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-6 mb-8">
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
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-4">
            Our Full <span className="text-primary italic">Menu</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Authentic Himalayan flavors crafted with love in Jabalpur
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="relative max-w-md mx-auto mb-8"
        >
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search menu items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-card border border-white/10 rounded-full text-white placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
          />
        </motion.div>
      </div>

      {/* Best 6 Items Section */}
      <div className="max-w-7xl mx-auto px-6 mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-4">
            Our <span className="text-primary">Menu Gallery</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Fresh menu images uploaded by our team
          </p>
        </motion.div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
            <p className="text-muted-foreground">Loading menu...</p>
          </div>
        )}

        {/* Products Grid */}
        {!loading && filteredProducts.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="bg-card rounded-2xl overflow-hidden border border-white/5 group cursor-pointer shadow-xl hover:shadow-2xl transition-all duration-300"
                onClick={() => setSelectedProduct(product)}
              >
                {/* Image Container */}
                <div className="relative h-[300px] overflow-hidden">
                  <motion.img
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                    src={'image' in product ? product.image : product.url}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />

                  {/* Veg Badge */}
                  {'isVeg' in product && product.isVeg && (
                    <div className="absolute top-3 right-3">
                      <Badge className="bg-green-600 hover:bg-green-700 border-2 border-green-500 text-white font-semibold px-3 py-1 shadow-lg">
                        <Leaf className="w-3 h-3 mr-1" />
                        VEG
                      </Badge>
                    </div>
                  )}

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="bg-white/20 backdrop-blur-sm rounded-full p-4">
                      <ZoomIn className="w-8 h-8 text-white" />
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-lg font-bold text-white group-hover:text-primary transition-colors line-clamp-2 mb-2">
                    {product.name}
                  </h3>

                  {/* Description (only for default products) */}
                  {'description' in product && (
                    <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                      {product.description}
                    </p>
                  )}

                  {/* Price (only for default products) */}
                  {'price' in product && (
                    <div className="mb-4">
                      <span className="text-2xl font-bold text-yellow-400">
                        ₹{product.price}
                      </span>
                    </div>
                  )}

                  <Button
                    className="w-full bg-green-600 hover:bg-green-700 text-white border-0 rounded-xl py-3 transition-all"
                    onClick={(e) => {
                      e.stopPropagation();
                      const message = `Hi, I want to order ${product.name}`;
                      const whatsappUrl = `https://wa.me/${whatsappNumberDigits}?text=${encodeURIComponent(message)}`;
                      window.open(whatsappUrl, '_blank');
                    }}
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Order on WhatsApp
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredProducts.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20">
            <ImageOff className="w-16 h-16 text-muted-foreground mb-4" />
            <p className="text-white text-lg mb-2">No menu items found</p>
            <p className="text-muted-foreground text-sm">
              {searchTerm ? "Try a different search term" : "Menu items will appear here soon"}
            </p>
          </div>
        )}
      </div>

      {/* Divider */}
      <div className="max-w-7xl mx-auto px-6 mb-16">
        <div className="flex items-center gap-4">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
          <div className="text-white/60 text-sm font-medium">OR</div>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
        </div>
      </div>

      {/* Complete Price List Section */}
      <div className="max-w-7xl mx-auto px-6 mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-4">
            📜 Complete Price List
          </h2>
          <p className="text-muted-foreground text-lg mb-8">
            Tap to zoom / save the menu
          </p>

          {/* Menu Image */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="relative cursor-pointer group max-w-2xl mx-auto"
            onClick={() => setShowFullMenu(true)}
          >
            <div className="relative overflow-hidden rounded-2xl border border-white/10 shadow-2xl">
              <img
                src="/menu.png"
                alt="Complete Menu Price List"
                className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
                onError={(e) => {
                  // Fallback if menu.png doesn't exist
                  e.currentTarget.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgdmlld0JveD0iMCAwIDgwMCA2MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI4MDAiIGhlaWdodD0iNjAwIiBmaWxsPSIjMUExQTFBIi8+Cjx0ZXh0IHg9IjQwMCIgeT0iMjgwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSJ3aGl0ZSIgZm9udC1zaXplPSIzNiIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIj7wn5OQIE1lbnUgQ29taW5nIFNvb24uLi48L3RleHQ+Cjx0ZXh0IHg9IjQwMCIgeT0iMzQwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjOTk5IiBmb250LXNpemU9IjE4IiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiPlBsZWFzZSBhZGQgbWVudS5wbmcgdG8gcHVibGljIGZvbGRlcjwvdGV4dD4KPC9zdmc+";
                }}
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <div className="bg-white/20 backdrop-blur-sm rounded-full p-4">
                  <ZoomIn className="w-8 h-8 text-white" />
                </div>
              </div>
            </div>

            <p className="text-white/60 text-sm mt-4">
              Click to view full size menu
            </p>
          </motion.div>
        </motion.div>
      </div>



      {/* Full Menu Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="relative max-w-4xl max-h-[90vh] w-full"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute -top-12 right-0 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors duration-200 z-10"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Menu Image */}
              <div className="relative overflow-hidden rounded-2xl">
                <img
                  src={selectedImage}
                  alt="Menu Image"
                  className="w-full h-auto object-contain max-h-[85vh]"
                />
              </div>

              {/* Instructions */}
              <div className="text-center mt-4">
                <p className="text-white/80 text-sm">
                  Pinch to zoom on mobile • Right-click to save image
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Product Detail Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedProduct(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="relative max-w-4xl w-full bg-card rounded-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedProduct(null)}
                className="absolute top-4 right-4 w-10 h-10 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white transition-colors duration-200 z-10"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="grid md:grid-cols-2 gap-0">
                {/* Product Image */}
                <div className="relative aspect-square overflow-hidden">
                  <img
                    src={'image' in selectedProduct ? selectedProduct.image : selectedProduct.url}
                    alt={selectedProduct.name}
                    className="w-full h-full object-cover"
                  />

                  {/* Veg Badge */}
                  {'isVeg' in selectedProduct && selectedProduct.isVeg && (
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-green-600 hover:bg-green-700 border-2 border-green-500 text-white font-semibold px-4 py-2 shadow-lg text-base">
                        <Leaf className="w-4 h-4 mr-2" />
                        VEG
                      </Badge>
                    </div>
                  )}
                </div>

                {/* Product Details */}
                <div className="p-8 flex flex-col justify-between">
                  <div>
                    <h2 className="text-3xl font-bold text-white mb-4">
                      {selectedProduct.name}
                    </h2>

                    {'description' in selectedProduct && (
                      <p className="text-gray-400 text-lg mb-6 leading-relaxed">
                        {selectedProduct.description}
                      </p>
                    )}

                    {'price' in selectedProduct && (
                      <div className="mb-8">
                        <span className="text-4xl font-bold text-yellow-400">
                          ₹{selectedProduct.price}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    <Button
                      className="w-full bg-green-600 hover:bg-green-700 text-white border-0 rounded-xl py-6 text-lg transition-all"
                      onClick={() => {
                        const message = `Hi, I want to order ${selectedProduct.name}`;
                        const whatsappUrl = `https://wa.me/${whatsappNumberDigits}?text=${encodeURIComponent(message)}`;
                        window.open(whatsappUrl, '_blank');
                      }}
                    >
                      <MessageCircle className="w-5 h-5 mr-2" />
                      Order on WhatsApp
                    </Button>

                    <p className="text-center text-gray-500 text-sm">
                      Click to order via WhatsApp
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Full Menu Price List Modal */}
      <AnimatePresence>
        {showFullMenu && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
            onClick={() => setShowFullMenu(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="relative max-w-6xl max-h-[95vh] w-full"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setShowFullMenu(false)}
                className="absolute -top-12 right-0 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors duration-200 z-10"
              >
                <X className="w-7 h-7" />
              </button>

              {/* Full Menu Image */}
              <div className="relative overflow-hidden rounded-2xl bg-white">
                <img
                  src="/menu.png"
                  alt="Complete Menu Price List"
                  className="w-full h-auto object-contain max-h-[90vh]"
                  onError={(e) => {
                    e.currentTarget.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgdmlld0JveD0iMCAwIDgwMCA2MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI4MDAiIGhlaWdodD0iNjAwIiBmaWxsPSIjMUExQTFBIi8+Cjx0ZXh0IHg9IjQwMCIgeT0iMjgwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSJ3aGl0ZSIgZm9udC1zaXplPSIzNiIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIj7wn5OQIE1lbnUgQ29taW5nIFNvb24uLi48L3RleHQ+Cjx0ZXh0IHg9IjQwMCIgeT0iMzQwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjOTk5IiBmb250LXNpemU9IjE4IiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiPlBsZWFzZSBhZGQgbWVudS5wbmcgdG8gcHVibGljIGZvbGRlcjwvdGV4dD4KPC9zdmc+";
                  }}
                />
              </div>

              {/* Instructions */}
              <div className="text-center mt-4">
                <p className="text-white/80 text-sm">
                  Pinch to zoom on mobile • Right-click to save • Scroll to see full menu
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div >
  );
}
