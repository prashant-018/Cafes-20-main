import { motion } from "framer-motion";
import { MessageCircle, Leaf } from "lucide-react";
import { Link } from "react-router-dom";
import { useSettings } from "@/contexts/SettingsContext";
import { Badge } from "@/components/ui/badge";

interface MenuHighlight {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  isVeg: boolean;
}

const menuHighlights: MenuHighlight[] = [
  {
    id: 1,
    name: "Himalayan Special",
    description: "Our signature pizza with exotic Himalayan flavors and premium toppings",
    price: 499,
    image: "https://images.pexels.com/photos/2762938/pexels-photo-2762938.jpeg",
    isVeg: true
  },
  {
    id: 2,
    name: "Veg Supreme",
    description: "Loaded with fresh vegetables, olives, and premium cheese blend",
    price: 449,
    image: "https://i.pinimg.com/736x/2e/23/6f/2e236f086bbd1c433b0c49ffba6312c9.jpg",
    isVeg: true
  },
  {
    id: 3,
    name: "Farm Fresh",
    description: "Garden-fresh vegetables with herbs and mozzarella cheese",
    price: 459,
    image: "https://i.pinimg.com/736x/b0/96/23/b09623357dd96f64242e391b00fae7fe.jpg",
    isVeg: true
  },
  {
    id: 4,
    name: "BBQ Paneer",
    description: "Smoky BBQ paneer with onions, peppers, and special sauce",
    price: 529,
    image: "https://images.pexels.com/photos/10790638/pexels-photo-10790638.jpeg",
    isVeg: true
  },
  {
    id: 5,
    name: "Paneer Makhani",
    description: "Creamy paneer makhani with bell peppers and Indian spices",
    price: 499,
    image: "https://i.pinimg.com/736x/da/f3/98/daf3988311896ed002a1d75f3702870c.jpg",
    isVeg: true
  },
  {
    id: 6,
    name: "4 Cheese",
    description: "Four premium cheeses melted to perfection on crispy crust",
    price: 599,
    image: "https://i.pinimg.com/736x/4e/f3/c0/4ef3c0d642b3608e621d89a25531cf6e.jpg",
    isVeg: true
  },
  {
    id: 7,
    name: "Paneer 65",
    description: "Spicy paneer 65 with onions, peppers, and tandoori sauce",
    price: 549,
    image: "https://i.pinimg.com/736x/3c/b7/c1/3cb7c1650427e3afde160e971c2e25d7.jpg",
    isVeg: true
  }
];

const MenuHighlights = () => {
  const { settings } = useSettings();
  const whatsappNumberDigits = (settings?.whatsappNumber || "+918305385083").replace(/\D/g, "");

  const orderOnWhatsApp = (itemName: string) => {
    const message = `Hi! I'm interested in ordering ${itemName}. Could you please share the price and availability?`;
    const whatsappUrl = `https://wa.me/${whatsappNumberDigits}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const containerVariants: any = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants: any = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0, 0, 0.2, 1]
      }
    }
  };

  return (
    <section className="py-20 bg-gradient-to-b from-background to-secondary/10 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(255,107,0,0.1),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,rgba(255,107,0,0.05),transparent_50%)]" />

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white mb-6">
            Popular from{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-400">
              Our Menu
            </span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-primary to-orange-400 mx-auto mb-6 rounded-full" />
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            A few customer favorites you'll love
          </p>
        </motion.div>

        {/* Menu Items Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto"
        >
          {menuHighlights.map((item) => (
            <motion.div
              key={item.id}
              variants={itemVariants}
              whileHover={{ y: -8, scale: 1.02 }}
              transition={{ duration: 0.3 }}
              className="bg-card/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/10 group cursor-pointer shadow-xl hover:shadow-2xl"
            >
              {/* Image Container */}
              <div className="relative aspect-[4/3] overflow-hidden">
                <motion.img
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />

                {/* Veg Badge */}
                {item.isVeg && (
                  <div className="absolute top-3 right-3">
                    <Badge className="bg-green-600 hover:bg-green-700 border-2 border-green-500 text-white font-semibold px-3 py-1 shadow-lg">
                      <Leaf className="w-3 h-3 mr-1" />
                      VEG
                    </Badge>
                  </div>
                )}

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Hover Button */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => orderOnWhatsApp(item.name)}
                    className="bg-[#111111] border border-[#25D366] hover:bg-[#25D366]/10 text-white px-6 py-3 rounded-full font-semibold flex items-center gap-2 shadow-lg transition-all duration-300"
                  >
                    <MessageCircle className="w-4 h-4 text-[#25D366]" />
                    Order Now
                  </motion.button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-primary transition-colors duration-200">
                  {item.name}
                </h3>
                <p className="text-muted-foreground text-sm mb-3 leading-relaxed">
                  {item.description}
                </p>

                {/* Price */}
                <div className="mb-4">
                  <span className="text-2xl font-bold text-yellow-400">
                    ₹{item.price}
                  </span>
                </div>

                {/* WhatsApp Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => orderOnWhatsApp(item.name)}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  <MessageCircle className="w-4 h-4" />
                  Order on WhatsApp
                </motion.button>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-16"
        >
          <p className="text-muted-foreground mb-6 text-lg">
            Want to see our complete menu?
          </p>
          <Link to="/menu">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-primary to-orange-500 hover:from-primary/90 hover:to-orange-500/90 text-white px-8 py-4 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              View Full Menu
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </motion.div>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default MenuHighlights;