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
        {/* Brand Section */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <img
              src="/logo.png"
              alt="The Himalayan Pizza Logo"
              className="w-12 h-12 rounded-full object-cover"
              onError={(e) => {
                // Fallback to H if logo doesn't exist
                e.currentTarget.style.display = 'none';
                const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                if (fallback) fallback.classList.remove('hidden');
              }}
            />
            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center hidden">
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
            <motion.a
              href="https://www.facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ y: -5, color: "hsl(var(--primary))" }}
              className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/50 hover:border-primary transition-all"
              aria-label="Facebook"
            >
              <Facebook className="w-5 h-5" />
            </motion.a>
            <motion.a
              href="https://www.instagram.com/the_himalayan_pizza/"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ y: -5, color: "hsl(var(--primary))" }}
              className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/50 hover:border-primary transition-all"
              aria-label="Instagram"
            >
              <Instagram className="w-5 h-5" />
            </motion.a>
            <motion.a
              href="https://www.twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ y: -5, color: "hsl(var(--primary))" }}
              className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/50 hover:border-primary transition-all"
              aria-label="Twitter"
            >
              <Twitter className="w-5 h-5" />
            </motion.a>
          </div>
        </div>

        {/* Quick Links */}
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

        {/* Contact Us & Visit Us */}
        <div className="space-y-8">
          <div>
            <h4 className="font-serif text-xl font-bold text-white mb-6">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-muted-foreground">
                <Phone className="w-5 h-5 text-primary flex-shrink-0" />
                <a
                  href="tel:+918305385083"
                  className="hover:text-primary transition-colors"
                >
                  +91 83053 85083
                </a>
              </li>
              <li className="flex items-center gap-3 text-muted-foreground">
                <Mail className="w-5 h-5 text-primary flex-shrink-0" />
                <a
                  href="mailto:hello@himalayanpizza.com"
                  className="hover:text-primary transition-colors"
                >
                  hello@himalayanpizza.com
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-serif text-xl font-bold text-white mb-6 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              Visit Us
            </h4>
            <address className="not-italic text-muted-foreground leading-relaxed space-y-1">
              <p className="font-semibold text-white">The Himalayan Pizza</p>
              <p>Opposite Ayush Gallery,</p>
              <p>Shop No. 1,</p>
              <p>Home Science College Road,</p>
              <p>Napier Town,</p>
              <p>Jabalpur, Madhya Pradesh 482001</p>
            </address>
          </div>
        </div>

        {/* Newsletter */}
        <div>
          <h4 className="font-serif text-xl font-bold text-white mb-6">Newsletter</h4>
          <p className="text-muted-foreground mb-4">Subscribe for special offers and updates.</p>
          <div className="flex gap-2">
            <input
              type="email"
              placeholder="Your email"
              className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 flex-1 focus:outline-none focus:border-primary text-white placeholder:text-white/30"
            />
            <button className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors font-medium">
              Join
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto px-6 mt-10 pt-6 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
        <p>© 2024 The Himalayan Pizza. All rights reserved.</p>
        <div className="flex gap-8">
          <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
}
