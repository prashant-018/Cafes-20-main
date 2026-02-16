import { motion } from 'framer-motion';
import { Loader2, AlertCircle, ImageOff } from 'lucide-react';
import { useMenuImagesLocal } from '@/hooks/useMenuImagesLocal';

export function MenuDisplay() {
  const { images, loading, error } = useMenuImagesLocal(false);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
        <p className="text-gray-400">Loading menu images...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <p className="text-red-400 font-medium mb-2">Failed to load menu images</p>
        <p className="text-gray-500 text-sm">{error}</p>
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <ImageOff className="w-12 h-12 text-gray-600 mb-4" />
        <p className="text-gray-400">No menu images available</p>
        <p className="text-gray-500 text-sm mt-2">Check back soon for our latest menu!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {images.map((image, index) => (
        <motion.div
          key={image.id}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.1 }}
          className="group relative"
        >
          <div className="relative aspect-[3/4] rounded-2xl overflow-hidden border border-white/10 bg-gray-900">
            <img
              src={image.url}
              alt={image.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              onError={(e) => {
                console.error('Image load error:', image.url);
                (e.target as HTMLImageElement).src = '/placeholder-menu.png';
              }}
            />

            {/* Overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <p className="text-white font-medium text-lg">{image.name}</p>
                <p className="text-gray-300 text-sm mt-1">
                  Click to view full size
                </p>
              </div>
            </div>
          </div>

          {/* Click to open full size */}
          <button
            onClick={() => window.open(image.url, '_blank')}
            className="absolute inset-0 cursor-pointer"
            aria-label={`View ${image.name} in full size`}
          />
        </motion.div>
      ))}
    </div>
  );
}
