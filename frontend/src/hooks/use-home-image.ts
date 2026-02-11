import { useState, useEffect } from 'react';
import { getHomeImage, uploadHomeImage, deleteHomeImage } from '@/api/client';

export function useHomeImage() {
  const [image, setImage] = useState<string | null>(null);

  // Initialize: Fetch current image URL from backend
  useEffect(() => {
    getHomeImage()
      .then((res) => {
        if (res.url) {
          // Append timestamp to prevent caching
          setImage(`${res.url}?t=${Date.now()}`);
        } else {
          setImage(null);
        }
      })
      .catch((err) => console.error('Failed to fetch home image:', err));
  }, []);

  const saveImage = async (file: File) => {
    try {
      const res = await uploadHomeImage(file);
      if (res.url) {
        // Append timestamp to force refresh
        setImage(`${res.url}?t=${Date.now()}`);
      }
    } catch (err) {
      console.error('Failed to upload home image:', err);
    }
  };

  const clearImage = async () => {
    try {
      await deleteHomeImage();
      setImage(null);
    } catch (err) {
      console.error('Failed to delete home image:', err);
    }
  };

  return {
    image,
    saveImage,
    clearImage,
  };
}
