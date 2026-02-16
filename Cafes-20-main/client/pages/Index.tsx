import { motion, useScroll, useSpring } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { Hero } from "@/components/home/Hero";
import { Story } from "@/components/home/Story";
import Gallery from "@/components/home/Gallery";
import { Pizzas } from "@/components/home/Pizzas";
import { Offers } from "@/components/home/Offers";
import { Contact } from "@/components/home/Contact";
import { useSettings } from "@/contexts/SettingsContext";

export default function Index() {
  const { settings } = useSettings();
  const whatsappNumberDigits = (settings?.whatsappNumber || "+918305385083").replace(/\D/g, "");
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <div className="relative">
      {/* Page Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-primary z-[60] origin-left"
        style={{ scaleX }}
      />

      {/* Sections with reveal animations - Each section is separate for proper scrolling */}
      <section id="home">
        <Hero />
      </section>

      <section id="story" className="relative z-10 bg-background">
        <Story />
      </section>

      <section id="gallery" className="relative z-10 bg-background">
        <Gallery />
      </section>

      <section id="menu" className="relative z-10 bg-background">
        <Pizzas />
      </section>

      <section id="offers" className="relative z-10 bg-background">
        <Offers />
      </section>

      <section id="contact" className="relative z-10 bg-background">
        <Contact />
      </section>

      {/* Floating WhatsApp CTA for Mobile */}
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ delay: 2 }}
        className="fixed bottom-6 left-6 right-6 z-40 md:hidden"
      >
        <button
          className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-full shadow-[0_10px_30px_rgba(34,197,94,0.5)] flex items-center justify-center gap-2 transition-all"
          onClick={() => window.open(`https://wa.me/${whatsappNumberDigits}`, '_blank')}
        >
          <MessageCircle className="w-5 h-5" />
          Order on WhatsApp
        </button>
      </motion.div>
    </div>
  );
}
