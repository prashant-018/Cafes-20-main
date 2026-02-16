import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Utensils } from "lucide-react";
import { Link } from "react-router-dom";
import { scrollToSection } from "@/lib/scroll";

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const mountainY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const pizzaY = useTransform(scrollYProgress, [0, 1], ["0%", "-20%"]);
  const pizzaRotate = useTransform(scrollYProgress, [0, 1], [0, 45]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section
      id="home"
      ref={containerRef}
      className="relative h-screen w-full overflow-hidden flex items-center justify-center pt-20"
    >
      {/* Mountain Background (Slower parallax) */}
      <motion.div
        style={{ y: mountainY }}
        className="absolute inset-0 z-0"
      >
        <div className="absolute inset-0 bg-black/40 z-10" />
        <img
          src="https://images.pexels.com/photos/32132399/pexels-photo-32132399.jpeg"
          alt="Himalayan Mountains"
          className="w-full h-[120%] object-cover object-center"
        />
      </motion.div>

      {/* Floating Pizza (Faster parallax + rotation) */}
      <motion.div
        style={{ y: pizzaY, rotate: pizzaRotate }}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="absolute right-[5%] top-[20%] w-[400px] md:w-[600px] pointer-events-none z-20 hidden lg:block"
      >
        <motion.img
          animate={{
            y: [0, -20, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          src="https://images.pexels.com/photos/2762938/pexels-photo-2762938.jpeg"
          alt="Signature Pizza"
          className="w-full h-auto drop-shadow-[0_0_50px_rgba(255,193,7,0.3)] rounded-full"
        />

        {/* Steam Animation */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full flex justify-center gap-12 opacity-30">
          {[1, 2, 3].map((i) => (
            <motion.div
              key={i}
              animate={{
                y: [0, -100],
                x: [0, (i - 2) * 20, 0],
                opacity: [0, 0.5, 0],
                scale: [1, 1.5],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                delay: i * 0.8,
                ease: "easeOut"
              }}
              className="w-8 h-24 bg-white/20 blur-2xl rounded-full"
            />
          ))}
        </div>
      </motion.div>

      {/* Content */}
      <motion.div
        style={{ y: textY, opacity }}
        className="relative z-30 max-w-7xl mx-auto px-6 w-full text-center lg:text-left"
      >
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 border border-primary/30 text-primary-foreground mb-6"
        >
          <Utensils className="w-4 h-4" />
          <span className="text-sm font-semibold tracking-wider uppercase">Authentic Himalayan Flavors</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-6xl md:text-8xl font-serif font-bold text-white mb-6 leading-tight"
        >
          From <span className="text-primary italic">Hills</span> <br />
          to Your Plate
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-xl md:text-2xl text-white/70 mb-10 max-w-2xl leading-relaxed mx-auto lg:mx-0"
        >
          Experience the high-altitude zest of freshly baked pizzas, crafted with
          mountain-sourced herbs and a dash of Jabalpur's heart.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-col sm:row items-center justify-center lg:justify-start gap-4"
        >
          <Button
            size="lg"
            className="bg-primary hover:bg-primary/90 text-white rounded-full px-10 h-16 text-lg pulse-glow"
            onClick={() => scrollToSection("menu")}
          >
            Order Now
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-white/20 text-white hover:bg-white/10 rounded-full px-10 h-16 text-lg backdrop-blur-sm"
            asChild
          >
            <Link to="/menu">
              View Menu
            </Link>
          </Button>
        </motion.div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30"
      >
        <div className="w-6 h-10 border-2 border-white/20 rounded-full flex justify-center p-2">
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-1.5 h-1.5 bg-primary rounded-full"
          />
        </div>
      </motion.div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-20" />
    </section>
  );
}
