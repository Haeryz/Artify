import { useCallback } from 'react';
import useAuth from './Authentication';

// Define the Paddle window interface
// Define Paddle event data interface
interface PaddleEventData {
  event: string;
  [key: string]: unknown;
}

declare global {
    interface Window {
      Paddle?: {
        Setup: (options: { vendor: number; eventCallback?: (data: PaddleEventData) => void }) => void;
        Checkout: {
          open: (options: PaddleCheckoutOptions) => void;
        };
      };
    }
  }
  
  interface PaddleCheckoutOptions {
    product?: string;
    plan?: string;
    email?: string;
    passthrough?: string;
    successCallback?: () => void;
    closeCallback?: () => void;
    // Add any other options used in Paddle documentation
}

export function usePaddleCheckout() {
  const { user, token, isAuthenticated } = useAuth();

  const initiatePaddleCheckout = useCallback(
    async (productId: string, isAnnual: boolean = false) => {
      if (!isAuthenticated || !user || !token) {
        console.error('User must be authenticated to start checkout');
        return { success: false, error: 'Authentication required' };
      }

      try {
        // Get checkout params from your backend
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/payments/checkout`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            productId: isAnnual ? undefined : productId,
            planId: isAnnual ? productId : undefined, // Use planId for subscriptions
            customData: {
              userId: user.uid,
              isAnnual,
            },
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to create checkout');
        }

        const data = await response.json();

        // Check if Paddle is loaded
        if (!window.Paddle) {
          console.error('Paddle.js is not loaded');
          return { success: false, error: 'Payment provider not available' };
        }

        // Open Paddle checkout
        window.Paddle.Checkout.open({
          product: isAnnual ? undefined : productId,
          plan: isAnnual ? productId : undefined,
          email: user.email,
          passthrough: JSON.stringify({
            checkoutId: data.checkoutId,
            userId: user.uid,
          }),
          successCallback: () => {
            console.log('Checkout completed successfully');
          },
          closeCallback: () => {
            console.log('Checkout closed without completion');
          },
        });

        return { success: true, checkoutId: data.checkoutId };
      } catch (error) {
        console.error('Error initiating checkout:', error);
        return { 
          success: false, 
          error: error instanceof Error ? error.message : 'Unknown error' 
        };
      }
    },
    [isAuthenticated, token, user]
  );

  return { initiatePaddleCheckout };
}

export default usePaddleCheckout;
