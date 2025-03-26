import { create } from 'zustand';
import axios, { AxiosError } from 'axios';
import useAuth from './Authentication';

// API base URL
const API_URL = import.meta.env.VITE_API_URL || '';

interface PromptState {
  // State
  prompts: Prompt[];
  currentPrompt: Prompt | null;
  loading: boolean;
  error: string | null;
  usageStats: PromptUsageStats | null;
  
  // Actions
  generateImage: (promptText: string, config?: GenerationConfig) => Promise<string>;
  getPrompt: (promptId: string) => Promise<Prompt>;
  getUserPrompts: () => Promise<Prompt[]>;
  getPromptUsage: () => Promise<PromptUsageStats>;
  clearError: () => void;
}

export interface Prompt {
  id: string;
  text: string;
  status: 'pending' | 'completed' | 'failed';
  imageUrl: string | null;
  createdAt: FirestoreTimestamp;
  completedAt: FirestoreTimestamp | null;
}

// Define the Firestore timestamp structure
export interface FirestoreTimestamp {
  seconds: number;
  nanoseconds: number;
  toDate: () => Date;
}

export interface PromptUsageStats {
  totalCount: number;
  dailyCount: number;
  dailyLimit: number;
  lastUsed: FirestoreTimestamp | null;
  dailyReset: FirestoreTimestamp | null;
}

export interface GenerationConfig {
  temperature?: number;
  topP?: number;
  topK?: number;
}

interface ApiErrorResponse {
  message: string;
  code?: string;
}

// Helper function to get auth headers
const getAuthHeaders = () => {
  const { token } = useAuth.getState();
  if (!token) {
    throw new Error('Authentication required');
  }
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};

const usePromptStore = create<PromptState>((set) => ({
  // Initial state
  prompts: [],
  currentPrompt: null,
  loading: false,
  error: null,
  usageStats: null,
  
  // Generate image from prompt
  generateImage: async (promptText, config) => {
    try {
      set({ loading: true, error: null });
      
      // Get authentication token
      const headers = getAuthHeaders();
      
      const response = await axios.post<{
        message: string;
        promptId: string;
        dailyCount: number;
        dailyLimit: number;
      }>(`${API_URL}/api/prompts/generate`, {
        prompt: promptText,
        config
      }, { headers });
      
      // Return the promptId for tracking
      return response.data.promptId;
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      const errorMessage = axiosError.response?.data?.message || 
                          (error instanceof Error ? error.message : 'Failed to generate image');
      set({ error: errorMessage });
      throw new Error(errorMessage);
    } finally {
      set({ loading: false });
    }
  },
  
  // Get a specific prompt by ID
  getPrompt: async (promptId) => {
    try {
      set({ loading: true, error: null });
      
      // Get authentication token
      const headers = getAuthHeaders();
      
      const response = await axios.get<Prompt>(`${API_URL}/api/prompts/${promptId}`, { headers });
      const prompt = response.data;
      
      set({ currentPrompt: prompt });
      return prompt;
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      const errorMessage = axiosError.response?.data?.message || 
                          (error instanceof Error ? error.message : 'Failed to get prompt');
      set({ error: errorMessage });
      throw new Error(errorMessage);
    } finally {
      set({ loading: false });
    }
  },
  
  // Get all prompts for the current user
  getUserPrompts: async () => {
    try {
      set({ loading: true, error: null });
      
      // Get authentication token
      const headers = getAuthHeaders();
      
      const response = await axios.get<{ prompts: Prompt[] }>(`${API_URL}/api/prompts`, { headers });
      const { prompts } = response.data;
      
      set({ prompts });
      return prompts;
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      const errorMessage = axiosError.response?.data?.message || 
                          (error instanceof Error ? error.message : 'Failed to get prompts');
      set({ error: errorMessage });
      throw new Error(errorMessage);
    } finally {
      set({ loading: false });
    }
  },
  
  // Get user's prompt usage statistics
  getPromptUsage: async () => {
    try {
      set({ loading: true, error: null });
      
      // Get authentication token
      const headers = getAuthHeaders();
      
      const response = await axios.get<PromptUsageStats>(`${API_URL}/api/prompts/usage/stats`, { headers });
      const usageStats = response.data;
      
      set({ usageStats });
      return usageStats;
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      const errorMessage = axiosError.response?.data?.message || 
                          (error instanceof Error ? error.message : 'Failed to get prompt usage');
      set({ error: errorMessage });
      throw new Error(errorMessage);
    } finally {
      set({ loading: false });
    }
  },
  
  // Clear error
  clearError: () => set({ error: null })
}));

export default usePromptStore;
