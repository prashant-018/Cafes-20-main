import { useState, useEffect, useCallback } from 'react';
import socketService, { MenuUpdateEvent } from '../services/socket';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export interface MenuImageLocal {
  id: string;
  name: string;
  filename: string;
  url: string;
  size: number;
  mimeType: string;
  uploadDate: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface UseMenuImagesLocalReturn {
  images: MenuImageLocal[];
  loading: boolean;
  error: string | null;
  refreshImages: () => Promise<void>;
}

export const useMenuImagesLocal = (isAdmin = false): UseMenuImagesLocalReturn => {
  const [images, setImages] = useState<MenuImageLocal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch images
  const fetchImages = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const endpoint = isAdmin
        ? `${API_BASE_URL}/menu-local/admin/all`
        : `${API_BASE_URL}/menu-local`;

      console.log('📥 Fetching menu images from:', endpoint);

      const headers: HeadersInit = {};

      if (isAdmin) {
        const token = localStorage.getItem('adminToken');
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }
      }

      const response = await fetch(endpoint, { headers });
      const data = await response.json();

      console.log('📦 Received menu images:', data);

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to fetch images');
      }

      setImages(data.data || []);
    } catch (err: any) {
      console.error('❌ Error fetching menu images:', err);
      setError(err.message || 'Failed to fetch images');
    } finally {
      setLoading(false);
    }
  }, [isAdmin]);

  // Handle real-time updates
  const handleMenuUpdate = useCallback((event: MenuUpdateEvent) => {
    console.log('📡 Menu update received:', event);

    switch (event.event) {
      case 'imagesAdded':
        if (Array.isArray(event.data)) {
          setImages(prev => [...event.data as MenuImageLocal[], ...prev]);
        }
        break;

      case 'imageDeleted':
        if ('id' in event.data) {
          setImages(prev => prev.filter(img => img.id !== (event.data as { id: string }).id));
        }
        break;

      case 'imageUpdated':
        if ('id' in event.data && 'url' in event.data) {
          setImages(prev => prev.map(img =>
            img.id === (event.data as MenuImageLocal).id ? event.data as MenuImageLocal : img
          ));
        }
        break;
    }
  }, []);

  // Setup real-time updates
  useEffect(() => {
    if (isAdmin) {
      const socket = socketService.connect();
      socketService.joinAdmin();
      socketService.onMenuUpdate(handleMenuUpdate);

      return () => {
        socketService.offMenuUpdate(handleMenuUpdate);
      };
    } else {
      const socket = socketService.connect();
      socketService.joinUser();
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
    refreshImages: fetchImages,
  };
};
