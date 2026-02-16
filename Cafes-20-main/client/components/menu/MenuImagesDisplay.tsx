import { motion } from 'framer-motion';
import { Loader2, AlertCircle, ImageOff, RefreshCw } from 'lucide-react';
import { useMenuSimple } from '@/hooks/useMenuSimple';
import { Button } from '@/components/ui/button';

export function MenuImagesDisplay() {
  const { images, loading, error, refetch } = useMenuSimple();

  console.log('🎨 MenuImagesDisplay render:', {
    imagesCount: images.length,
    loading,
    error
  });

  // Loading state
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
        <p className="text-gray-400">Loading menu images...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <p className="text-red-400 font-medium mb-2">Failed to load menu images</p>
        <p className="text-gray-500 text-sm mb-4">{error}</p>
        <Button
          onClick={refetch}
          variant="outline"
          className="border-red-500 text-red-500 hover:bg-red-500/10"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Try Again
        </Button>
      </div>
    );
  }

  // Empty state
  if (images.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <ImageOff className="w-12 h-12 text-gray-600 mb-4" />
        <p className="text-gray-400 font-medium mb-2">No menu images available</p>
        <p className="text-gray-500 text-sm mb-4">Check back soon for our latest menu!</p>
        <Button
          onClick={refetch}
          variant="outline"
          className="border-gray-600 text-gray-400 hover:bg-gray-800"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>
    );
  }

  // Display images
  return (
    <div className="space-y-8">
      {/* Refresh button */}
      <div className="flex justify-end">
        <Button
          onClick={refetch}
          variant="outline"
          size="sm"
          className="border-gray-700 text-gray-400 hover:bg-gray-800"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh ({images.length})
        </Button>
      </div>

      {/* Images grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {images.map((image, index) => (
          <motion.div
            key={image.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group relative"
          >
            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden border border-white/10 bg-gray-900 shadow-xl">
              <img
                src={image.url}
                alt={image.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                onLoad={() => console.log('✅ Image loaded:', image.url)}
                onError={(e) => {
                  console.error('❌ Image load error:', image.url);
                  (e.target as HTMLImageElement).src = '/placeholder-menu.png';
                }}
              />

              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <p className="text-white font-medium text-lg truncate">{image.name}</p>
                  <p className="text-gray-300 text-sm mt-1">
                    Uploaded {new Date(image.uploadDate).toLocaleDateString()}
                  </p>
                  <p className="text-gray-400 text-xs mt-1">
                    Click to view full size
                  </p>
                </div>
              </div>
            </div>

            {/* Click to open full size */}
            <button
              onClick={() => {
                console.log('🖼️ Opening image:', image.url);
                window.open(image.url, '_blank');
              }}
              className="absolute inset-0 cursor-pointer"
              aria-label={`View ${image.name} in full size`}
            />
          </motion.div>
        ))}
      </div>

      {/* Debug info (only in development) */}
      {import.meta.env.DEV && (
        <div className="mt-8 p-4 bg-gray-900 rounded-lg border border-gray-800">
          <p className="text-gray-400 text-xs font-mono">
            Debug: Loaded {images.length} images from API
          </p>
          <p className="text-gray-500 text-xs font-mono mt-1">
            API: {import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/menu-simple
          </p>
        </div>
      )}
    </div>
  );
}
