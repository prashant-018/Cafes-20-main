import { motion } from "framer-motion";
import { Facebook, Instagram, Twitter, MapPin, Phone, Mail } from "lucide-react";

const scrollToSection = (id: string) => {
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ behavior: "smooth", block: "start" });
  }
};

const footerLinks = [
  { label: "Home", id: "home" },
  { label: "Our Story", id: "story" },
  { label: "Gallery", id: "gallery" },
  { label: "Menu", id: "menu" },
  { label: "Offers", id: "offers" },
  { label: "Contact", id: "contact" }
] as const;

export function Footer() {
  return (
    <footer className="relative bg-background pt-12 pb-10 overflow-hidden">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary via-transparent to-accent animate-gradient-slow" />
      </div>

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 relative z-10">
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xl">H</span>
            </div>
            <span className="font-serif text-2xl font-bold text-white">
              The Himalayan <span className="text-primary">Pizza</span>
            </span>
          </div>
          <p className="text-muted-foreground leading-relaxed">
            Crafting the finest pizzas with Himalayan spirit and Jabalpur's love. 
            A taste that reaches new heights.
          </p>
          <div className="flex gap-4">
            {[Facebook, Instagram, Twitter].map((Icon, i) => (
              <motion.a
                key={i}
                href="#"
                whileHover={{ y: -5, color: "hsl(var(--primary))" }}
                className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/50 transition-colors"
              >
                <Icon className="w-5 h-5" />
              </motion.a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-serif text-xl font-bold text-white mb-6">Quick Links</h4>
          <ul className="space-y-4">
            {footerLinks.map((link) => (
              <li key={link.id}>
                <button
                  type="button"
                  onClick={() => scrollToSection(link.id)}
                  className="text-muted-foreground hover:text-primary transition-colors text-left"
                >
                  {link.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-serif text-xl font-bold text-white mb-6">Contact Us</h4>
          <ul className="space-y-4">
            <li className="flex items-center gap-3 text-muted-foreground">
              <MapPin className="w-5 h-5 text-primary" />
              <span>Civil Lines, Jabalpur, MP</span>
            </li>
            <li className="flex items-center gap-3 text-muted-foreground">
              <Phone className="w-5 h-5 text-primary" />
              <span>+91 98765 43210</span>
            </li>
            <li className="flex items-center gap-3 text-muted-foreground">
              <Mail className="w-5 h-5 text-primary" />
              <span>hello@himalayanpizza.com</span>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-serif text-xl font-bold text-white mb-6">Newsletter</h4>
          <p className="text-muted-foreground mb-4">Subscribe for special offers and updates.</p>
          <div className="flex gap-2">
            <input
              type="email"
              placeholder="Your email"
              className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 flex-1 focus:outline-none focus:border-primary text-white"
            />
            <button className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors">
              Join
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-10 pt-6 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
        <p>© 2024 The Himalayan Pizza. All rights reserved.</p>
        <div className="flex gap-8">
          <a href="#" className="hover:text-white">Privacy Policy</a>
          <a href="#" className="hover:text-white">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
}
