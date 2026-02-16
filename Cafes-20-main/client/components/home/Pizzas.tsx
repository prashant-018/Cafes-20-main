import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageCircle, Phone, Leaf } from "lucide-react";
import { Link } from "react-router-dom";
import { useSettings } from "@/contexts/SettingsContext";

const pizzas = [
  {
    id: 1,
    name: "Himalayan Special",
    price: "₹499",
    type: "veg",
    image: "https://images.pexels.com/photos/2762938/pexels-photo-2762938.jpeg",
    description: "Our signature pizza with exotic Himalayan flavors and premium toppings",
  },
  {
    id: 2,
    name: "Veg Supreme",
    price: "₹449",
    type: "veg",
    image: "https://images.pexels.com/photos/845811/pexels-photo-845811.jpeg",
    description: "Loaded with fresh vegetables, olives, and premium cheese blend",
  },
  {
    id: 3,
    name: "Farm Fresh",
    price: "₹459",
    type: "veg",
    image: "https://images.pexels.com/photos/905847/pexels-photo-905847.jpeg",
    description: "Garden-fresh vegetables with herbs and mozzarella cheese",
  },
  {
    id: 4,
    name: "BBQ Paneer",
    price: "₹529",
    type: "veg",
    image: "https://images.pexels.com/photos/10790638/pexels-photo-10790638.jpeg",
    description: "Smoky BBQ paneer with onions, peppers, and special sauce",
  },
  {
    id: 5,
    name: "Paneer Makhani",
    price: "₹499",
    type: "veg",
    image: "https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg",
    description: "Creamy paneer makhani with bell peppers and Indian spices",
  },
  {
    id: 6,
    name: "4 Cheese",
    price: "₹599",
    type: "veg",
    image: "https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg",
    description: "Four premium cheeses melted to perfection on crispy crust",
  },
  {
    id: 7,
    name: "Paneer 65",
    price: "₹549",
    type: "veg",
    image: "https://images.pexels.com/photos/2147491/pexels-photo-2147491.jpeg",
    description: "Spicy paneer 65 with onions, peppers, and tandoori sauce",
  },
];

export function Pizzas() {
  const { settings } = useSettings();
  const whatsappNumberDigits = (settings?.whatsappNumber || "+918305385083").replace(/\D/g, "");
  const containerRef = useRef<HTMLDivElement>(null);

  // WhatsApp order function
  const orderOnWhatsApp = (pizza: any) => {
    const message = `Hi! I'd like to order:\n\n${pizza.name} - ${pizza.price}\n${pizza.description}\n\nPlease confirm availability and delivery details.`;
    const whatsappUrl = `https://wa.me/${whatsappNumberDigits}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <section id="menu" className="py-24 bg-secondary/30">
      <div className="max-w-7xl mx-auto px-6 mb-16 flex flex-col md:row items-end justify-between gap-6">
        <div>
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-primary font-bold tracking-widest uppercase text-sm"
          >
            Chef's Specialties
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-serif font-bold text-white mt-2"
          >
            Signature <span className="text-primary italic">Pizzas</span>
          </motion.h2>
        </div>
        <div className="flex gap-4">
          <Button variant="outline" className="rounded-full border-white/10 text-white" asChild>
            <Link to="/menu">View All</Link>
          </Button>
        </div>
      </div>

      <div
        ref={containerRef}
        className="relative flex overflow-x-auto pb-12 px-6 gap-8 no-scrollbar snap-x"
      >
        {pizzas.map((pizza, idx) => (
          <motion.div
            key={pizza.id}
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
            whileHover={{ y: -10 }}
            className="min-w-[300px] md:min-w-[400px] bg-card rounded-3xl overflow-hidden border border-white/5 group snap-center"
          >
            <div className="relative aspect-square overflow-hidden">
              <motion.img
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.6 }}
                src={pizza.image}
                alt={pizza.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 right-4 flex gap-2">
                <Badge className="bg-green-600 hover:bg-green-700 border-2 border-green-500 text-white font-semibold px-3 py-1 shadow-lg">
                  <Leaf className="w-3 h-3 mr-1" />
                  VEG
                </Badge>
              </div>

              {/* Cheese Drip Simulation on Hover */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                whileHover={{ opacity: 1, y: 0 }}
                className="absolute inset-0 pointer-events-none overflow-hidden"
              >
                <svg className="absolute top-0 left-0 w-full h-full text-accent/40" viewBox="0 0 400 400">
                  <path d="M50,0 Q60,40 70,0 M150,0 Q165,60 180,0 M280,0 Q300,50 320,0" fill="currentColor" stroke="none" />
                </svg>
              </motion.div>
            </div>

            <div className="p-8">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-2xl font-bold text-white group-hover:text-primary transition-colors">
                  {pizza.name}
                </h3>
                <span className="text-yellow-400 font-bold text-xl">{pizza.price}</span>
              </div>
              <p className="text-muted-foreground mb-8 line-clamp-2">
                {pizza.description}
              </p>
              <div className="flex gap-2">
                <Button
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white border-0 rounded-xl py-6 transition-all"
                  onClick={() => orderOnWhatsApp(pizza)}
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Order on WhatsApp
                </Button>
                <Button
                  variant="outline"
                  className="px-4 border-white/20 text-white hover:bg-white/10 rounded-xl py-6 transition-all"
                  onClick={() => window.open(`tel:${whatsappNumberDigits}`, '_self')}
                >
                  <Phone className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
