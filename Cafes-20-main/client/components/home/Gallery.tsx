import { motion } from "framer-motion";
import { useState } from "react";
import { VisitUsButton } from "@/components/ui/VisitUsButton";

interface GalleryImage {
  id: number;
  src: string;
  alt: string;
  caption: string;
}

const galleryImages: GalleryImage[] = [
  {
    id: 1,
    src: "/gallery/himalayan-1.jpg",
    alt: "Happy customers enjoying authentic Himalayan pizza",
    caption: "Authentic flavors bringing smiles"
  },
  {
    id: 2,
    src: "/gallery/himalayan-2.jpg",
    alt: "Family dining experience at The Himalayan Pizza",
    caption: "Creating memories with every bite"
  },
  {
    id: 3,
    src: "/gallery/himalayan-3.jpg",
    alt: "Fresh ingredients and traditional cooking methods",
    caption: "Crafted with passion and tradition"
  },
  {
    id: 4,
    src: "/gallery/himalayan-4.jpg",
    alt: "Cozy atmosphere and warm hospitality",
    caption: "Where every guest feels at home"
  }
];

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <section className="py-20 bg-gradient-to-b from-background via-background/95 to-secondary/10 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,107,0,0.1),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,107,0,0.05),transparent_50%)]" />

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
            Moments at{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-400">
              The Himalayan Pizza
            </span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-primary to-orange-400 mx-auto mb-6 rounded-full" />
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Real moments, authentic flavors, and genuine connections.
            These are the stories our customers create every day at our restaurant.
          </p>
          <p className="text-base text-muted-foreground/80 mt-4 max-w-2xl mx-auto">
            From family celebrations to casual dinners, every visit becomes a cherished memory
          </p>
        </motion.div>

        {/* Desktop Grid Layout */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8"
        >
          {galleryImages.map((image, index) => (
            <motion.div
              key={image.id}
              variants={itemVariants}
              className={`group relative overflow-hidden rounded-2xl shadow-2xl cursor-pointer ${index === 0 || index === 3 ? 'lg:row-span-2' : ''
                }`}
              onClick={() => setSelectedImage(image)}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <div className="aspect-square lg:aspect-auto lg:h-full relative overflow-hidden">
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Caption */}
                <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                  <p className="text-white font-medium text-lg mb-2">
                    {image.caption}
                  </p>
                  <div className="w-12 h-0.5 bg-primary rounded-full" />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Mobile Horizontal Scroll */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="md:hidden"
        >
          <div className="flex gap-4 overflow-x-auto pb-6 scrollbar-hide">
            {galleryImages.map((image) => (
              <motion.div
                key={image.id}
                className="group relative flex-shrink-0 w-72 h-80 overflow-hidden rounded-2xl shadow-2xl cursor-pointer"
                onClick={() => setSelectedImage(image)}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-cover transition-transform duration-700 group-active:scale-110"
                  loading="lazy"
                />

                {/* Mobile Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                {/* Mobile Caption */}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <p className="text-white font-medium text-base">
                    {image.caption}
                  </p>
                  <div className="w-8 h-0.5 bg-primary rounded-full mt-2" />
                </div>
              </motion.div>
            ))}
          </div>
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
            Ready to create your own memorable moments?
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              // Open Google Maps with The Himalayan Pizza, Jabalpur location
              const mapsUrl = "https://www.google.com/maps/search/The+Himalayan+Pizza+Jabalpur/@23.1815,79.9864,15z";
              window.open(mapsUrl, '_blank', 'noopener,noreferrer');
            }}
            className="bg-gradient-to-r from-red-600 via-primary to-red-500 hover:from-red-700 hover:via-red-600 hover:to-red-600 text-white px-8 py-4 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 active:translate-y-0 flex items-center gap-3 mx-auto"
          >
            <svg
              className="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
            </svg>
            Visit Us Today
            <svg
              className="w-4 h-4 opacity-70"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </motion.button>
        </motion.div>
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="relative max-w-4xl max-h-[90vh] rounded-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedImage.src}
              alt={selectedImage.alt}
              className="w-full h-full object-cover"
            />

            {/* Modal Caption */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
              <h3 className="text-white text-xl font-semibold mb-2">
                {selectedImage.caption}
              </h3>
              <p className="text-white/80 text-sm">
                {selectedImage.alt}
              </p>
            </div>

            {/* Close Button */}
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 w-10 h-10 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white transition-colors duration-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </motion.div>
        </motion.div>
      )}

      {/* Custom Scrollbar Styles */}
      <style>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
};

export default Gallery;