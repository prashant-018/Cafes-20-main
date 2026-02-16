import { useState, useEffect, useCallback } from 'react';
import { menuAPI, MenuImage } from '../services/api';
import socketService, { MenuUpdateEvent } from '../services/socket';

interface UseMenuImagesReturn {
  images: MenuImage[];
  loading: boolean;
  error: string | null;
  uploadImages: (files: FileList) => Promise<void>;
  deleteImage: (id: string) => Promise<void>;
  updateImage: (id: string, data: { name?: string; isActive?: boolean }) => Promise<void>;
  refreshImages: () => Promise<void>;
  uploadProgress: number;
}

export const useMenuImages = (isAdmin = false): UseMenuImagesReturn => {
  const [images, setImages] = useState<MenuImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Fetch images
  const fetchImages = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = isAdmin
        ? await menuAPI.getAllMenuImages()
        : await menuAPI.getMenuImages();

      if (response.success && response.data) {
        setImages(response.data);
      } else {
        setError(response.message || 'Failed to fetch images');
      }
    } catch (err: any) {
      console.error('Error fetching menu images:', err);
      setError(err.response?.data?.message || 'Failed to fetch images');
    } finally {
      setLoading(false);
    }
  }, [isAdmin]);

  // Upload images
  const uploadImages = useCallback(async (files: FileList) => {
    try {
      console.log('🎯 useMenuImages: Starting upload for', files.length, 'file(s)');
      console.log('📊 Current images count BEFORE upload:', images.length);
      setUploadProgress(0);
      setError(null);

      const response = await menuAPI.uploadMenuImages(files);

      if (response.success && response.data) {
        console.log('✅ useMenuImages: Upload successful, received', response.data.length, 'new image(s)');
        console.log('📊 Previous images count:', images.length);
        console.log('➕ Adding new images to existing list...');

        // IMPORTANT: Add new images to the BEGINNING of existing list (prepend)
        // This preserves all old images and shows new ones first
        setImages(prev => {
          const newList = [...response.data!, ...prev];
          console.log('✅ Updated images list. Total count:', newList.length);
          return newList;
        });

        setUploadProgress(100);

        // Reset progress after a delay
        setTimeout(() => setUploadProgress(0), 2000);
      } else {
        console.error('❌ useMenuImages: Upload failed:', response.message);
        setError(response.message || 'Failed to upload images');
      }
    } catch (err: any) {
      console.error('❌ useMenuImages: Upload error:', err);
      setError(err.response?.data?.message || err.message || 'Failed to upload images');
      setUploadProgress(0);
    }
  }, [images.length]);

  // Delete image
  const deleteImage = useCallback(async (id: string) => {
    try {
      setError(null);

      const response = await menuAPI.deleteMenuImage(id);

      if (response.success) {
        // Remove image from the list
        setImages(prev => prev.filter(img => img.id !== id));
      } else {
        setError(response.message || 'Failed to delete image');
      }
    } catch (err: any) {
      console.error('Error deleting image:', err);
      setError(err.response?.data?.message || 'Failed to delete image');
    }
  }, []);

  // Update image
  const updateImage = useCallback(async (id: string, data: { name?: string; isActive?: boolean }) => {
    try {
      setError(null);

      const response = await menuAPI.updateMenuImage(id, data);

      if (response.success && response.data) {
        // Update image in the list
        setImages(prev => prev.map(img =>
          img.id === id ? response.data! : img
        ));
      } else {
        setError(response.message || 'Failed to update image');
      }
    } catch (err: any) {
      console.error('Error updating image:', err);
      setError(err.response?.data?.message || 'Failed to update image');
    }
  }, []);

  // Handle real-time updates
  const handleMenuUpdate = useCallback((event: MenuUpdateEvent) => {
    console.log('🔔 Real-time menu update received:', event);

    switch (event.event) {
      case 'imagesAdded':
        if (Array.isArray(event.data)) {
          console.log('➕ Adding', event.data.length, 'new images via Socket.IO');
          console.log('📊 Current images before Socket update:', images.length);
          
          setImages(prev => {
            // Prepend new images to existing list
            const newList = [...event.data as MenuImage[], ...prev];
            console.log('✅ Images after Socket update:', newList.length);
            return newList;
          });
        }
        break;

      case 'imageDeleted':
        if ('id' in event.data) {
          console.log('🗑️ Removing image via Socket.IO:', (event.data as { id: string }).id);
          setImages(prev => prev.filter(img => img.id !== (event.data as { id: string }).id));
        }
        break;

      case 'imageUpdated':
        if ('id' in event.data && 'url' in event.data) {
          console.log('✏️ Updating image via Socket.IO:', (event.data as MenuImage).id);
          setImages(prev => prev.map(img =>
            img.id === (event.data as MenuImage).id ? event.data as MenuImage : img
          ));
        }
        break;
    }
  }, [images.length]);

  // Setup real-time updates
  useEffect(() => {
    if (isAdmin) {
      // Connect socket and join admin room
      const socket = socketService.connect();
      socketService.joinAdmin();

      // Listen for menu updates
      socketService.onMenuUpdate(handleMenuUpdate);

      return () => {
        socketService.offMenuUpdate(handleMenuUpdate);
      };
    } else {
      // For user website, connect and join user room
      const socket = socketService.connect();
      socketService.joinUser();

      // Listen for menu updates
      socketService.onMenuUpdate(handleMenuUpdate);

      return () => {
        socketService.offMenuUpdate(handleMenuUpdate);
      };
    }
  }, [isAdmin, handleMenuUpdate]);

  // Initial fetch
  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  return {
    images,
    loading,
    error,
    uploadImages,
    deleteImage,
    updateImage,
    refreshImages: fetchImages,
    uploadProgress,
  };
};