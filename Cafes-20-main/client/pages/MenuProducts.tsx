import { useMemo, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  MessageCircle,
  Leaf,
  Search,
  Filter,
  X,
  ShoppingCart
} from "lucide-react";
import { useSettings } from "@/contexts/SettingsContext";
import { getMenuItemImage, menuData, MenuItem, MenuCategory } from "@/data/menuData";
import { useIsMobile } from "@/hooks/use-mobile";

export default function MenuProducts() {
  const { settings } = useSettings();
  const whatsappNumberDigits = (settings?.whatsappNumber || "+918305385083").replace(/\D/g, "");
  const reduceMotion = useReducedMotion();
  const isMobile = useIsMobile();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [vegFilter, setVegFilter] = useState<"all" | "veg" | "nonveg">("all");
  const [cart, setCart] = useState<MenuItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);

  const VegNonVegToggleIcon = ({
    variant,
    active
  }: {
    variant: "veg" | "nonveg";
    active: boolean;
  }) => {
    const color = variant === "veg" ? "#22c55e" : "#dc2626";
    const borderColor = active ? "#ffffff" : color;
    const fillColor = active ? "#ffffff" : color;

    return (
      <span
        className="inline-flex items-center justify-center w-[14px] h-[14px]"
        style={{
          borderWidth: 1.5,
          borderStyle: "solid",
          borderColor,
          borderRadius: 3
        }}
        aria-hidden="true"
      >
        <span
          className="w-[7px] h-[7px] rounded-full"
          style={{ backgroundColor: fillColor }}
        />
      </span>
    );
  };

  const VegNonVegDot = ({ isVeg }: { isVeg: boolean }) => (
    <span
      className="inline-flex items-center justify-center w-[18px] h-[18px]"
      style={{
        borderWidth: 3,
        borderStyle: "solid",
        borderColor: isVeg ? "#22c55e" : "#dc2626",
        borderRadius: 3
      }}
      aria-label={isVeg ? "Veg" : "Non-Veg"}
      title={isVeg ? "Veg" : "Non-Veg"}
    >
      <span
        className="w-[9px] h-[9px] rounded-full"
        style={{ backgroundColor: isVeg ? "#22c55e" : "#dc2626" }}
      />
    </span>
  );

  // Filter items based on search and category
  const filteredCategories = useMemo(() => {
    const q = searchTerm.toLowerCase().trim();
    return menuData
      .map(category => ({
        ...category,
        items: category.items.filter(item => {
          const matchesSearch =
            !q ||
            item.name.toLowerCase().includes(q) ||
            item.description.toLowerCase().includes(q);
          const matchesCategory = selectedCategory === "all" || category.id === selectedCategory;
          const matchesVeg =
            vegFilter === "all" || (vegFilter === "veg" ? item.isVeg : !item.isVeg);
          return matchesSearch && matchesCategory && matchesVeg;
        })
      }))
      .filter(category => category.items.length > 0);
  }, [searchTerm, selectedCategory, vegFilter]);

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
  const formatPrice = (price: MenuItem["price"]) => {
    const money = (n?: number) => (typeof n === "number" ? `₹${n}` : "");

    if (price.small || price.medium || price.large) {
      const rows: Array<{ label: string; value?: number }> = [
        { label: "Small", value: price.small },
        { label: "Medium", value: price.medium },
        { label: "Large", value: price.large }
      ].filter(r => typeof r.value === "number");

      return (
        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
          {rows.map(r => (
            <div
              key={r.label}
              className="flex items-baseline gap-1.5 rounded-full bg-white/5 ring-1 ring-white/10 px-3 py-1.5 whitespace-nowrap w-fit"
            >
              <span className="text-[11px] text-muted-foreground">{r.label}</span>
              <span className="text-[15px] font-bold tabular-nums text-yellow-400 whitespace-nowrap">
                {money(r.value)}
              </span>
            </div>
          ))}
        </div>
      );
    }

    return (
      <div className="flex items-baseline gap-2">
        <span className="text-[11px] text-muted-foreground">Price</span>
        <span className="text-xl font-bold tabular-nums text-yellow-400">{money(price.regular)}</span>
      </div>
    );
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
          <Button
            variant={vegFilter === "veg" ? "default" : "outline"}
            onClick={() => setVegFilter(prev => (prev === "veg" ? "all" : "veg"))}
            className={`rounded-full whitespace-nowrap ${vegFilter === "veg"
              ? "bg-green-600 text-white hover:bg-green-700"
              : "border-white/10 text-white hover:bg-white/10"
              }`}
          >
            <span className="inline-flex items-center gap-[6px]">
              <VegNonVegToggleIcon variant="veg" active={vegFilter === "veg"} />
              <span>VEG</span>
            </span>
          </Button>
          <Button
            variant={vegFilter === "nonveg" ? "default" : "outline"}
            onClick={() => setVegFilter(prev => (prev === "nonveg" ? "all" : "nonveg"))}
            className={`rounded-full whitespace-nowrap ${vegFilter === "nonveg"
              ? "bg-red-600 text-white hover:bg-red-700"
              : "border-white/10 text-white hover:bg-white/10"
              }`}
          >
            <span className="inline-flex items-center gap-[6px]">
              <VegNonVegToggleIcon variant="nonveg" active={vegFilter === "nonveg"} />
              <span>NON-VEG</span>
            </span>
          </Button>
          {menuData.map((category) => (
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
                    initial={reduceMotion ? false : { opacity: 0, x: -20 }}
                    animate={reduceMotion ? undefined : { opacity: 1, x: 0 }}
                    transition={reduceMotion ? undefined : { delay: itemIndex * 0.05 }}
                    whileHover={reduceMotion || isMobile ? undefined : { scale: 1.02 }}
                    className="bg-card/80 backdrop-blur rounded-2xl overflow-hidden border border-white/10 hover:border-primary/30 hover:shadow-[0_18px_60px_-28px_rgba(0,0,0,0.9)] transition-all duration-300 group cursor-pointer"
                    onClick={() => setSelectedItem(item)}
                  >
                    <div className="flex flex-col sm:flex-row gap-4 p-4 sm:p-5 [will-change:transform]">
                      {/* Image */}
                      <div className="relative w-full h-48 sm:w-32 sm:h-32 flex-shrink-0 rounded-xl overflow-hidden ring-1 ring-white/10">
                        <img
                          src={getMenuItemImage(item)}
                          alt={item.name}
                          loading="lazy"
                          decoding="async"
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300 [will-change:transform]"
                        />
                        <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-black/55 to-transparent" />
                        {item.isPopular && (
                          <div className="absolute top-2 left-2">
                            <Badge className="bg-yellow-500/90 border-yellow-300/50 text-black px-2 py-0.5 text-xs font-semibold">
                              ★ Popular
                            </Badge>
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                          <h3 className="text-base sm:text-lg font-semibold text-white mb-1 leading-snug group-hover:text-primary transition-colors">
                            <span className="flex items-center gap-2 min-w-0">
                              <VegNonVegDot isVeg={item.isVeg} />
                              <span className="truncate">{item.name}</span>
                              {item.isVeg && (
                                <span className="ml-1 inline-flex items-center gap-1 rounded-full bg-green-500/10 px-2 py-0.5 text-[11px] font-medium text-green-400 ring-1 ring-green-500/20 whitespace-nowrap leading-none shrink-0">
                                  <Leaf className="w-3.5 h-3.5" />
                                  Veg
                                </span>
                              )}
                            </span>
                          </h3>
                          <p className="text-gray-400 text-xs sm:text-sm line-clamp-2 mb-3">
                            {item.description}
                          </p>
                        </div>

                        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                          {/* Price */}
                          <div className="min-w-0">{formatPrice(item.price)}</div>

                          {/* Order Button */}
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700 text-white border-0 rounded-full px-4 h-9 text-xs sm:text-sm shadow-sm hover:shadow transition-shadow w-full sm:w-auto justify-center"
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
                    src={getMenuItemImage(selectedItem)}
                    alt={selectedItem.name}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4 flex gap-2">
                    <Badge
                      className={`${selectedItem.isVeg
                          ? "bg-green-600 border-green-500"
                          : "bg-red-600 border-red-500"
                        } text-white`}
                    >
                      {selectedItem.isVeg ? (
                        <>
                          <Leaf className="w-4 h-4 mr-1" />
                          VEG
                        </>
                      ) : (
                        "NON-VEG"
                      )}
                    </Badge>
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
                    <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3 flex items-center gap-3">
                      <VegNonVegDot isVeg={selectedItem.isVeg} />
                      <span>{selectedItem.name}</span>
                    </h2>
                    <p className="text-gray-400 text-base sm:text-lg mb-6 leading-relaxed">
                      {selectedItem.description}
                    </p>

                    {/* Price */}
                    <div className="mb-6">
                      {selectedItem.price.small ? (
                        <div className="space-y-2">
                          <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                            <span className="text-white">Small</span>
                            <span className="text-yellow-400 font-bold text-xl">₹{selectedItem.price.small}</span>
                          </div>
                          <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                            <span className="text-white">Medium</span>
                            <span className="text-yellow-400 font-bold text-xl">₹{selectedItem.price.medium}</span>
                          </div>
                          <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                            <span className="text-white">Large</span>
                            <span className="text-yellow-400 font-bold text-xl">₹{selectedItem.price.large}</span>
                          </div>
                        </div>
                      ) : selectedItem.price.medium ? (
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
