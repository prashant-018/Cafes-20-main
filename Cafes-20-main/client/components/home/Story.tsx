import { motion } from "framer-motion";
import { Heart, Star, Users, MessageCircle, Volume2, VolumeX } from "lucide-react";
import { useSettings } from "@/contexts/SettingsContext";
import { useRef, useState } from "react";

export function Story() {
  const { settings } = useSettings();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);

  const timelineItems = [
    {
      year: "2015",
      title: "The Beginning",
      desc: "Our journey began in the heart of Himachal Pradesh, where we opened our first outlet inspired by the flavors and spirit of the mountains.",
      icon: Heart,
    },
    {
      year: "2018",
      title: "Trusted Taste",
      desc: "Perfected our secret Himalayan herb-infused dough.",
      icon: Star,
    },
    {
      year: "Today",
      title: "Loved in Jabalpur",
      desc: "The city's favorite spot for authentic, premium pizzas.",
      icon: Users,
    },
  ];

  const sentence =
    settings?.brandStory?.trim().length
      ? settings.brandStory
      : "Every pizza tells a story of heights, heat, and heart. We bring the freshness of the mountains to the bustling streets of Jabalpur, creating a symphony of flavors that resonate with every bite.";

  const words = sentence.split(" ");

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.05, delayChildren: 0.04 * i },
    }),
  };

  const child = {
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring" as const,
        damping: 12,
        stiffness: 100,
      },
    },
    hidden: {
      opacity: 0,
      y: 20,
    },
  };

  return (
    <section id="story" className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div>
            <motion.h2
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-serif font-bold text-white mb-8"
            >
              Our <span className="text-primary italic">Himalayan</span> Story
            </motion.h2>

            <motion.div
              variants={container}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="flex flex-wrap gap-x-2 gap-y-1 mb-12"
            >
              {words.map((word, idx) => (
                <motion.span
                  variants={child}
                  key={idx}
                  className="text-xl md:text-2xl text-muted-foreground leading-relaxed"
                >
                  {word}
                </motion.span>
              ))}
            </motion.div>

            {/* Timeline */}
            <div className="space-y-8 relative">
              <div className="absolute left-6 top-4 bottom-4 w-0.5 bg-primary/20" />

              {timelineItems.map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.2 }}
                  className="flex gap-6 relative"
                >
                  <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center relative z-10 shadow-[0_0_20px_rgba(139,0,0,0.4)]">
                    <item.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <span className="text-primary font-bold">{item.year}</span>
                    <h4 className="text-xl font-bold text-white mb-2">{item.title}</h4>
                    <p className="text-muted-foreground">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="relative">
            {/* Professional Cinematic Video Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, rotate: -5 }}
              whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              whileHover={{ scale: 1.03 }}
              className="relative rounded-[20px] overflow-hidden aspect-[4/5] shadow-2xl group"
            >
              {/* Cinematic Autoplay Video */}
              <video
                ref={videoRef}
                className="w-full h-full object-cover transition-transform duration-700"
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
                poster="https://cdn.builder.io/api/v1/image/assets%2Fd869254f392a4226b2f3507b9db880c1%2Ff2270de8dfe84e6c8ec7341389cde111?format=webp&width=800&height=1200"
              >
                <source src="/story.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>

              {/* Dark gradient overlay for depth */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

              {/* Mute/Unmute Toggle Button - Top Right */}
              <motion.button
                onClick={toggleMute}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center border border-white/10 hover:bg-primary/80 hover:border-primary transition-all duration-300 z-10 group/btn"
                aria-label={isMuted ? "Unmute video" : "Mute video"}
              >
                {isMuted ? (
                  <VolumeX className="w-4 h-4 text-white group-hover/btn:scale-110 transition-transform" />
                ) : (
                  <Volume2 className="w-4 h-4 text-white group-hover/btn:scale-110 transition-transform" />
                )}
              </motion.button>
            </motion.div>

            {/* WhatsApp Contact Button */}
            <motion.a
              href={`https://wa.me/${settings?.whatsappNumber || '919876543210'}?text=Hi! I'd like to know more about The Himalayan Pizza`}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="absolute -bottom-6 -left-6 bg-green-600 hover:bg-green-700 p-6 rounded-2xl shadow-2xl flex items-center gap-4 group transition-all"
            >
              <MessageCircle className="w-8 h-8 text-white group-hover:scale-110 transition-transform" />
              <div>
                <p className="text-white font-bold text-lg">Chat with us</p>
                <p className="text-white/80 text-sm">on WhatsApp</p>
              </div>
            </motion.a>

            {/* Red "9+ Years" Badge */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="absolute -bottom-10 -right-10 bg-primary p-8 rounded-2xl shadow-2xl max-w-[200px] hidden md:block"
            >
              <p className="text-4xl font-serif font-bold text-white mb-2">9+</p>
              <p className="text-white/80 text-sm font-medium">Years of culinary excellence in Jabalpur</p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
