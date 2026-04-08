import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface BackgroundContextType {
  currentBackgroundUrl: string | null;
  setCurrentBackgroundUrl: (url: string | null) => void;
}

const BackgroundContext = createContext<BackgroundContextType | undefined>(undefined);

export const useBackground = () => {
  const context = useContext(BackgroundContext);
  if (context === undefined) {
    throw new Error('useBackground must be used within a BackgroundProvider');
  }
  return context;
};

interface BackgroundProviderProps {
  children: ReactNode;
}

export const BackgroundProvider: React.FC<BackgroundProviderProps> = ({ children }) => {
  const [currentBackgroundUrl, setCurrentBackgroundUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchBackgroundOnce = async () => {
      if (currentBackgroundUrl) return;
      try {
        const response = await fetch('https://api.github.com/repos/silkbeauty/ssart/contents/zzz');
        if (!response.ok) {
          throw new Error('Failed to fetch images from GitHub');
        }

        const files = await response.json();
        const imageFiles = files.filter((file: any) =>
          file.type === 'file' &&
          /\.(jpg|jpeg|png|gif|webp)$/i.test(file.name)
        );

        const imageUrls = imageFiles.map((file: any) => file.download_url);
        if (imageUrls.length > 0) {
          const randomIndex = Math.floor(Math.random() * imageUrls.length);
          setCurrentBackgroundUrl(imageUrls[randomIndex]);
        }
      } catch (error) {
        console.error('Error fetching background image:', error);
        if (!currentBackgroundUrl) {
          setCurrentBackgroundUrl('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800');
        }
      }
    };

    fetchBackgroundOnce();
  }, [currentBackgroundUrl]);

  return (
    <BackgroundContext.Provider value={{ currentBackgroundUrl, setCurrentBackgroundUrl }}>
      {children}
    </BackgroundContext.Provider>
  );
}; 
