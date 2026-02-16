import { motion } from "framer-motion";
import { Phone, MapPin, Clock, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSettings } from "@/contexts/SettingsContext";

export function Contact() {
  const { settings } = useSettings();
  const whatsappNumber = settings?.whatsappNumber || "+918305385083";
  const whatsappNumberDigits = whatsappNumber.replace(/\D/g, "");
  const openingTime = settings?.openingTime || "10:00";
  const closingTime = settings?.closingTime || "23:00";

  return (
    <section id="contact" className="py-24 bg-secondary/20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          <div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-serif font-bold text-white mb-8"
            >
              Come Find <span className="text-primary italic">Zen</span> In Jabalpur
            </motion.h2>

            <div className="space-y-8">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="flex items-start gap-6 group cursor-pointer"
              >
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary transition-all duration-500 shrink-0">
                  <Phone className="w-6 h-6 text-primary group-hover:text-white" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground uppercase tracking-widest mb-1">Call Us</p>
                  <a href={`tel:${whatsappNumberDigits}`} className="text-2xl font-bold text-white hover:text-primary transition-colors">
                    {whatsappNumber}
                  </a>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="flex items-start gap-6 group cursor-pointer"
              >
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary transition-all duration-500 shrink-0">
                  <MapPin className="w-6 h-6 text-primary group-hover:text-white" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground uppercase tracking-widest mb-1">Visit Us</p>
                  <p className="text-2xl font-bold text-white leading-tight">
                    The Himalayan Pizza,<br />
                    Opposite Ayush Gallery,<br />
                    Shop No. 1,<br />
                    Home Science College Road,<br />
                    Napier Town,<br />
                    Jabalpur, Madhya Pradesh 482001
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="flex items-start gap-6 group cursor-pointer"
              >
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary transition-all duration-500 shrink-0">
                  <Clock className="w-6 h-6 text-primary group-hover:text-white" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground uppercase tracking-widest mb-1">Opening Hours</p>
                  <p className="text-2xl font-bold text-white">
                    Mon - Sun: {openingTime} - {closingTime}
                  </p>
                </div>
              </motion.div>
            </div>

            <div className="mt-12 flex flex-wrap gap-4">
              <Button
                size="lg"
                className="rounded-full bg-primary text-white px-8 ripple"
                asChild
              >
                <a
                  href={`https://wa.me/${whatsappNumberDigits}?text=Hi,%20I%20want%20to%20order%20pizza%20from%20The%20Himalayan%20Pizza`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Chat with The Himalayan Pizza on WhatsApp"
                >
                  <MessageSquare className="w-5 h-5 mr-2" />
                  Chat on WhatsApp
                </a>
              </Button>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative rounded-[3rem] overflow-hidden min-h-[400px] border-4 border-white/5 shadow-2xl"
          >
            {/* Google Maps Iframe */}
            <div className="w-full h-full rounded-2xl overflow-hidden border border-white/10">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d19702.867582367897!2d79.89713279547327!3d23.157999255301775!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3981af9ffd6b4fbb%3A0xf206cc133d8ee3fa!2sThe%20Himalayan%20Pizza!5e0!3m2!1sen!2sin!4v1770488189993!5m2!1sen!2sin"
                className="w-full h-full min-h-[400px]"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="The Himalayan Pizza Location"
                allowFullScreen
              />
            </div>

            {/* Overlay with CTA - appears on hover */}
            <div className="absolute inset-0 bg-black/60 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <div className="text-center p-8">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <MapPin className="w-8 h-8 text-white" />
                </div>
                <h4 className="text-xl font-bold text-white mb-2">Find us on the map</h4>
                <p className="text-white/80 mb-6 text-sm">Get directions to the best pizza in town.</p>
                <Button
                  variant="outline"
                  className="rounded-full border-white/40 text-white hover:bg-white hover:text-black transition-all"
                  asChild
                >
                  <a
                    href="https://www.google.com/maps/search/?api=1&query=The+Himalayan+Pizza,+Opposite+Ayush+Gallery,+Shop+No.+1,+Home+Science+College+Road,+Napier+Town,+Jabalpur,+Madhya+Pradesh+482001"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Open The Himalayan Pizza location in Google Maps"
                  >
                    Open in Google Maps
                  </a>
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
