import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowLeft, Search, X, ZoomIn } from "lucide-react";
import { ProductGrid } from "@/components/menu/ProductGrid";

export default function MenuProducts() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showFullMenu, setShowFullMenu] = useState(false);

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
            Our <span className="text-primary italic">Menu</span>
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

      {/* Product Grid Section */}
      <div className="max-w-7xl mx-auto px-6 mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-4">
            Featured <span className="text-primary">Pizzas</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Handcrafted with premium ingredients and Himalayan spices
          </p>
        </motion.div>

        {/* Product Cards Grid */}
        <ProductGrid />
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
                  (e.currentTarget as HTMLImageElement).src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgdmlld0JveD0iMCAwIDgwMCA2MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI4MDAiIGhlaWdodD0iNjAwIiBmaWxsPSIjMUExQTFBIi8+Cjx0ZXh0IHg9IjQwMCIgeT0iMjgwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSJ3aGl0ZSIgZm9udC1zaXplPSIzNiIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIj7wn5OQIE1lbnUgQ29taW5nIFNvb24uLi48L3RleHQ+Cjx0ZXh0IHg9IjQwMCIgeT0iMzQwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjOTk5IiBmb250LXNpemU9IjE4IiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiPlBsZWFzZSBhZGQgbWVudS5wbmcgdG8gcHVibGljIGZvbGRlcjwvdGV4dD4KPC9zdmc+";
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
        {showFullMenu && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={() => setShowFullMenu(false)}
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
                onClick={() => setShowFullMenu(false)}
                className="absolute -top-12 right-0 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors duration-200 z-10"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Menu Image */}
              <div className="relative overflow-hidden rounded-2xl">
                <img
                  src="/menu.png"
                  alt="Full Menu"
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
    </div>
  );
}
