import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// User interface
interface User {
  uid: string;
  email: string;
  displayName: string;
}

// Authentication state interface
interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Authentication methods
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, displayName: string) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

// API base URL
const API_URL = import.meta.env.VITE_API_URL || '';

// Create authentication store with persistence
const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Login method
      login: async (email: string, password: string) => {
        try {
          set({ isLoading: true, error: null });
          
          const response = await fetch(`${API_URL}/api/auth/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
          });

          const data = await response.json();
          
          if (!response.ok) {
            throw new Error(data.message || 'Failed to login');
          }
          
          set({ 
            user: data.user,
            token: data.token,
            isAuthenticated: true,
            isLoading: false,
          });
          
        } catch (error) {
          console.error('Login error:', error);
          set({ 
            error: error instanceof Error ? error.message : 'An unknown error occurred',
            isLoading: false,
          });
        }
      },

      // Register method
      register: async (email: string, password: string, displayName: string) => {
        try {
          set({ isLoading: true, error: null });
          
          const response = await fetch(`${API_URL}/api/auth/signup`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password, displayName }),
          });

          const data = await response.json();
          
          if (!response.ok) {
            throw new Error(data.message || 'Failed to register');
          }
          
          // After registration, automatically log in
          await get().login(email, password);
          
        } catch (error) {
          console.error('Registration error:', error);
          set({ 
            error: error instanceof Error ? error.message : 'An unknown error occurred',
            isLoading: false,
          });
        }
      },

      // Logout method
      logout: async () => {
        try {
          set({ isLoading: true });
          
          const token = get().token;
          if (token) {
            await fetch(`${API_URL}/api/auth/logout`, {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
            });
          }

          // Clear user state regardless of API response
          set({ 
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
          });
          
        } catch (error) {
          console.error('Logout error:', error);
          // Still clear the user state even if the API call fails
          set({ 
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      },

      // Clear error
      clearError: () => set({ error: null }),
    }),
    {
      name: 'artify-auth-storage', // Name for localStorage
      partialize: (state) => ({ 
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export default useAuth;
