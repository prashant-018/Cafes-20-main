import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MessageCircle, Phone, Leaf } from 'lucide-react';
import { useSettings } from '@/contexts/SettingsContext';
import { useState } from 'react';

type PizzaSize = 'Medium' | 'Large';

interface Product {
  id: string;
  name: string;
  description: string;
  prices: {
    Medium: number;
    Large: number;
  };
  image: string;
  isVeg: boolean;
  category?: string;
}

// Exact pizzas from menu with correct pricing
const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Himalayan Pizza Special',
    description: 'Our signature pizza with exotic Himalayan flavors and premium toppings',
    prices: {
      Medium: 450,
      Large: 650
    },
    image: '/images/pizza1.jpg',
    isVeg: true,
    category: 'Pizza'
  },
  {
    id: '2',
    name: 'Veg Supreme Pizza',
    description: 'Loaded with fresh vegetables, olives, and premium cheese blend',
    prices: {
      Medium: 510,
      Large: 660
    },
    image: '/images/pizza2.jpg',
    isVeg: true,
    category: 'Pizza'
  },
  {
    id: '3',
    name: 'Paneer 65',
    description: 'Spicy paneer 65 with onions, peppers, and special tandoori sauce',
    prices: {
      Medium: 510,
      Large: 660
    },
    image: '/images/pizza3.jpg',
    isVeg: true,
    category: 'Pizza'
  },
  {
    id: '4',
    name: 'Mexican Green',
    description: 'Zesty Mexican flavors with jalapeños, bell peppers, and green sauce',
    prices: {
      Medium: 400,
      Large: 360
    },
    image: '/images/pizza4.jpg',
    isVeg: true,
    category: 'Pizza'
  },
  {
    id: '5',
    name: 'Hot N Spicy',
    description: 'Fiery hot pizza with spicy toppings and chili flakes',
    prices: {
      Medium: 400,
      Large: 360
    },
    image: '/images/pizza5.jpg',
    isVeg: true,
    category: 'Pizza'
  },
  {
    id: '6',
    name: 'Peppy Paneer',
    description: 'Delicious paneer chunks with peppers and special seasoning',
    prices: {
      Medium: 400,
      Large: 360
    },
    image: '/images/pizza6.jpg',
    isVeg: true,
    category: 'Pizza'
  }
];

export function ProductGrid() {
  const { settings } = useSettings();
  const whatsappNumber = (settings?.whatsappNumber || '+918305385083').replace(/\D/g, '');

  // Track selected size for each product
  const [selectedSizes, setSelectedSizes] = useState<Record<string, PizzaSize>>(
    PRODUCTS.reduce((acc, product) => ({ ...acc, [product.id]: 'Medium' }), {})
  );

  const handleSizeChange = (productId: string, size: PizzaSize) => {
    setSelectedSizes(prev => ({ ...prev, [productId]: size }));
  };

  const orderOnWhatsApp = (productName: string, size: PizzaSize, price: number) => {
    const message = `Hi! I want to order ${productName} - ${size} (₹${price})`;
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const callRestaurant = () => {
    window.open(`tel:${whatsappNumber}`, '_self');
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {PRODUCTS.map((product, index) => {
        const selectedSize = selectedSizes[product.id];
        const currentPrice = product.prices[selectedSize];

        return (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -8 }}
            className="group bg-[#1a1a1a] rounded-2xl overflow-hidden border border-white/10 hover:border-primary/30 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/20 flex flex-col h-full"
          >
            {/* Image Container */}
            <div className="relative aspect-square overflow-hidden">
              <motion.img
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.4 }}
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback placeholder
                  (e.target as HTMLImageElement).src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDQwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjMUExQTFBIi8+Cjx0ZXh0IHg9IjIwMCIgeT0iMTkwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSJ3aGl0ZSIgZm9udC1zaXplPSI0OCIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIj7wn5OQPC90ZXh0Pgo8dGV4dCB4PSIyMDAiIHk9IjIzMCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzk5OSIgZm9udC1zaXplPSIxNiIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIj5JbWFnZSBub3QgYXZhaWxhYmxlPC90ZXh0Pgo8L3N2Zz4=";
                }}
              />

              {/* Veg Badge */}
              <div className="absolute top-3 right-3">
                <Badge className="bg-green-600 hover:bg-green-700 border-2 border-green-500 text-white font-semibold px-3 py-1 shadow-lg">
                  <Leaf className="w-3 h-3 mr-1" />
                  VEG
                </Badge>
              </div>

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>

            {/* Content */}
            <div className="p-5 flex flex-col flex-1">
              {/* Product Name */}
              <h3 className="text-xl font-bold text-white mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                {product.name}
              </h3>

              {/* Description */}
              <p className="text-gray-400 text-sm mb-4 line-clamp-2 flex-1">
                {product.description}
              </p>

              {/* Size Selector */}
              <div className="mb-4">
                <p className="text-gray-400 text-xs mb-2 font-medium">Select Size:</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleSizeChange(product.id, 'Medium')}
                    className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-all duration-300 ${selectedSize === 'Medium'
                        ? 'bg-primary text-white shadow-lg shadow-primary/50'
                        : 'bg-white/10 text-gray-400 hover:bg-white/20'
                      }`}
                  >
                    Medium
                  </button>
                  <button
                    onClick={() => handleSizeChange(product.id, 'Large')}
                    className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-all duration-300 ${selectedSize === 'Large'
                        ? 'bg-primary text-white shadow-lg shadow-primary/50'
                        : 'bg-white/10 text-gray-400 hover:bg-white/20'
                      }`}
                  >
                    Large
                  </button>
                </div>
              </div>

              {/* Price */}
              <div className="mb-4">
                <span className="text-3xl font-bold text-yellow-400">
                  ₹{currentPrice}
                </span>
                <span className="text-gray-500 text-sm ml-2">({selectedSize})</span>
              </div>

              {/* Buttons */}
              <div className="space-y-2">
                {/* WhatsApp Order Button */}
                <Button
                  onClick={() => orderOnWhatsApp(product.name, selectedSize, currentPrice)}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-green-600/50"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Order on WhatsApp
                </Button>

                {/* Call Button */}
                <Button
                  onClick={callRestaurant}
                  variant="outline"
                  className="w-full border-white/20 text-white hover:bg-white/10 py-3 rounded-xl transition-all duration-300"
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Call to Order
                </Button>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
