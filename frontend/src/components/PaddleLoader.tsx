import { useEffect } from 'react';

interface PaddleLoaderProps {
  vendorId: string;
  environment?: 'sandbox' | 'production';
}

export function PaddleLoader({ vendorId, environment = 'sandbox' }: PaddleLoaderProps) {
  useEffect(() => {
    // Don't load Paddle script if it's already loaded
    if (window.Paddle) {
      return;
    }

    // Create script element
    const script = document.createElement('script');
    script.src = environment === 'sandbox' 
      ? 'https://cdn.paddle.com/paddle/paddle.js' 
      : 'https://cdn.paddle.com/paddle/paddle.js';
    script.async = true;
    
    // Setup Paddle when loaded
    script.onload = () => {
      if (window.Paddle) {
        window.Paddle.Setup({ vendor: parseInt(vendorId) });
        console.log('Paddle initialized with vendor ID:', vendorId);
      }
    };
    
    // Handle errors
    script.onerror = () => {
      console.error('Failed to load Paddle.js');
    };
    
    // Add script to document
    document.body.appendChild(script);
    
    // Cleanup on unmount
    return () => {
      // We don't remove the script once loaded as it might be needed elsewhere
    };
  }, [vendorId, environment]);

  return null; // This component doesn't render anything
}

export default PaddleLoader;
