import { create } from 'zustand';
import axios, { AxiosError } from 'axios';
import { persist } from 'zustand/middleware';

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, displayName: string) => Promise<void>;
  logout: () => Promise<void>;
  googleLogin: (idToken: string) => Promise<void>;
  getCurrentUser: () => Promise<void>;
  clearError: () => void;
}

export interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string | null;
}

interface ApiErrorResponse {
  message: string;
  code?: string;
}

// Create auth store with persistence
const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      token: null,
      loading: false,
      error: null,
      
      // Login with email and password
      login: async (email, password) => {
        try {
          set({ loading: true, error: null });
          
          const response = await axios.post('/api/auth/login', { email, password });
          const { token, user } = response.data;
          
          // Set authorization header for all future requests
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          set({ user, token });
        } catch (error) {
          const axiosError = error as AxiosError<ApiErrorResponse>;
          const errorMessage = axiosError.response?.data?.message || 'Failed to login';
          set({ error: errorMessage });
          throw new Error(errorMessage);
        } finally {
          set({ loading: false });
        }
      },
      
      // Sign up new user
      signup: async (email, password, displayName) => {
        try {
          set({ loading: true, error: null });
          
          await axios.post('/api/auth/signup', { 
            email, 
            password, 
            displayName 
          });
          
          // After signup, log the user in
          await get().login(email, password);
        } catch (error) {
          const axiosError = error as AxiosError<ApiErrorResponse>;
          const errorMessage = axiosError.response?.data?.message || 'Failed to signup';
          set({ error: errorMessage });
          throw new Error(errorMessage);
        } finally {
          set({ loading: false });
        }
      },
      
      // Log out user
      logout: async () => {
        try {
          set({ loading: true, error: null });
          
          await axios.post('/api/auth/logout');
          
          // Remove authorization header
          delete axios.defaults.headers.common['Authorization'];
          
          set({ user: null, token: null });
        } catch (error) {
          const axiosError = error as AxiosError<ApiErrorResponse>;
          const errorMessage = axiosError.response?.data?.message || 'Failed to logout';
          set({ error: errorMessage });
        } finally {
          set({ loading: false });
        }
      },
      
      // Google login
      googleLogin: async (idToken) => {
        try {
          set({ loading: true, error: null });
          
          const response = await axios.post('/api/auth/google-login', { idToken });
          const { token, user } = response.data;
          
          // Set authorization header for all future requests
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          set({ user, token });
        } catch (error) {
          const axiosError = error as AxiosError<ApiErrorResponse>;
          const errorMessage = axiosError.response?.data?.message || 'Failed to login with Google';
          set({ error: errorMessage });
          throw new Error(errorMessage);
        } finally {
          set({ loading: false });
        }
      },
      
      // Get current user profile
      getCurrentUser: async () => {
        // Skip if no token
        if (!get().token) return;
        
        try {
          set({ loading: true, error: null });
          
          const response = await axios.get('/api/auth/me');
          const { user } = response.data;
          
          set({ user });
        } catch (error) {
          const axiosError = error as AxiosError<ApiErrorResponse>;
          
          // If unauthorized, clear user and token
          if (axiosError.response?.status === 401) {
            set({ user: null, token: null });
          }
          
          const errorMessage = axiosError.response?.data?.message || 'Failed to get user profile';
          set({ error: errorMessage });
        } finally {
          set({ loading: false });
        }
      },
      
      // Clear error
      clearError: () => set({ error: null })
    }),
    {
      name: 'auth-storage', // localStorage key
      partialize: (state) => ({ 
        user: state.user, 
        token: state.token 
      })
    }
  )
);

// Set Authorization header when the app loads if token exists
const token = useAuthStore.getState().token;
if (token) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

export default useAuthStore;
