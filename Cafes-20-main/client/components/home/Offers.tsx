import { motion } from "framer-motion";
import { BadgePercent, UtensilsCrossed, ShieldCheck, Clock, Flame, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useSettings } from "@/contexts/SettingsContext";

export function Offers() {
  const { settings } = useSettings();
  const whatsappNumberDigits = (settings?.whatsappNumber || "+918305385083").replace(/\D/g, "");

  // Get offers text from settings, fallback to default
  const offersText = settings?.offersText || "Wednesday BOGO Special - Buy One Get One Free on all medium Premium & Delight pizzas! Valid every Wednesday. Cannot be combined with other offers.";

  // WhatsApp order function for Wednesday deal
  const orderWednesdayDeal = () => {
    const message = `Hi! I'd like to order the Wednesday BOGO Special:\n\n${offersText}\n\nPlease confirm availability and delivery details.`;
    const whatsappUrl = `https://wa.me/${whatsappNumberDigits}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };
  return (
    <section id="offers" className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative p-12 rounded-[2.5rem] border-2 border-dashed border-primary/40 bg-primary/5 group"
          >
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute -top-8 -right-8 w-32 h-32 bg-accent rounded-full flex items-center justify-center shadow-2xl z-10"
            >
              <div className="text-center text-accent-foreground font-black leading-none">
                <span className="text-2xl">BOGO</span><br />
                <span className="text-3xl">FREE</span><br />
                <span className="text-xl underline decoration-2">WED</span>
              </div>
            </motion.div>

            <BadgePercent className="w-16 h-16 text-primary mb-6" />
            <h3 className="text-4xl font-serif font-bold text-white mb-4">Wednesday BOGO Special</h3>
            <p className="text-xl text-muted-foreground mb-8">
              {offersText}
            </p>
            <div className="flex flex-wrap gap-6 mb-8">
              <div className="flex items-center gap-2">
                <motion.div
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center"
                >
                  <UtensilsCrossed className="w-5 h-5 text-primary" />
                </motion.div>
                <span className="text-white font-medium">Wednesday Exclusive</span>
              </div>
            </div>
            <Button
              className="bg-green-600 hover:bg-green-700 text-white rounded-full px-8 h-14"
              onClick={orderWednesdayDeal}
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Order Wednesday Deal
            </Button>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="p-8 rounded-3xl bg-primary border border-white/5 hover:border-primary/30 transition-all group relative overflow-hidden"
            >
              <div className="relative z-10">
                <h4 className="text-xl font-bold text-white mb-2">Saturday Special</h4>
                <p className="text-white/80 mb-4">2 Paneer Makhani Pizzas (Medium) at just ₹499.</p>
                <Badge className="bg-accent text-accent-foreground font-bold">ONLY SATURDAYS</Badge>
              </div>
              <Flame className="absolute -bottom-4 -right-4 w-24 h-24 text-white/10" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="p-8 rounded-3xl bg-card border border-white/5 hover:border-primary/30 transition-all group"
            >
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary transition-colors">
                <ShieldCheck className="w-8 h-8 text-primary group-hover:text-white transition-colors" />
              </div>
              <h4 className="text-xl font-bold text-white mb-2">Mountain Purity</h4>
              <p className="text-muted-foreground">Ingredients sourced directly from Himalayan farms.</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="p-8 rounded-3xl bg-card border border-white/5 hover:border-primary/30 transition-all group"
            >
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary transition-colors">
                <Clock className="w-8 h-8 text-primary group-hover:text-white transition-colors" />
              </div>
              <h4 className="text-xl font-bold text-white mb-2">24/7 Cravings</h4>
              <p className="text-muted-foreground">Because mountain vibes never sleep. Open all night.</p>
            </motion.div>

            <div className="p-8 rounded-3xl bg-primary flex flex-col items-center justify-center text-center">
              <h4 className="text-3xl font-serif font-bold text-white mb-2">10k+</h4>
              <p className="text-white/80">Happy Customers this month</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
