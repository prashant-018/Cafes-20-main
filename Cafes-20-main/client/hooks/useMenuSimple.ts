import { useState, useEffect } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export interface MenuImageSimple {
  id: string;
  name: string;
  filename: string;
  url: string;
  size: number;
  uploadDate: string;
  createdAt: string;
  updatedAt: string;
}

interface UseMenuSimpleReturn {
  images: MenuImageSimple[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useMenuSimple = (): UseMenuSimpleReturn => {
  const [images, setImages] = useState<MenuImageSimple[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchImages = async () => {
    console.log('\n========================================');
    console.log('🔄 FETCHING MENU IMAGES');
    console.log('========================================');

    try {
      setLoading(true);
      setError(null);

      const url = `${API_BASE_URL}/menu-simple`;
      console.log('📥 GET request to:', url);

      const response = await fetch(url);
      console.log('📦 Response status:', response.status);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('📦 Response data:', data);

      if (data.success) {
        console.log(`✅ Successfully fetched ${data.count} images`);
        setImages(data.data || []);
      } else {
        throw new Error(data.message || 'Failed to fetch images');
      }
    } catch (err: any) {
      console.error('❌ Fetch error:', err);
      setError(err.message || 'Failed to fetch images');
      setImages([]);
    } finally {
      setLoading(false);
      console.log('========================================\n');
    }
  };

  // Fetch images on mount
  useEffect(() => {
    console.log('🎯 useMenuSimple hook mounted - fetching images...');
    fetchImages();
  }, []);

  return {
    images,
    loading,
    error,
    refetch: fetchImages
  };
};
