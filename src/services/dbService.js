import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import useAppStore from '../store/useAppStore';

/**
 * dbService handles data synchronization between local Zustand store and remote Supabase
 * When Supabase is not configured, it gracefully defaults to local store only.
 */
export const dbService = {
  // Sync User Profile
  async syncUserProfile(userId, profileData) {
    if (!isSupabaseConfigured) return profileData;
    
    try {
      const { data, error } = await supabase
        .from('users')
        .upsert({ id: userId, ...profileData, updated_at: new Date().toISOString() });
        
      if (error) throw error;
      return data;
    } catch (err) {
      console.error("Supabase syncUserProfile error:", err);
      return profileData;
    }
  },

  // Fetch Feed Posts
  async fetchPosts() {
    if (!isSupabaseConfigured) {
      return useAppStore.getState().posts;
    }
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*, author:users(name, avatar, role)')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      if (data && data.length > 0) {
         useAppStore.getState().setPosts(data);
      }
      return data;
    } catch (err) {
      console.error("Supabase fetchPosts error:", err);
      return useAppStore.getState().posts;
    }
  },
  
  // Create New Post
  async createPost(postObject) {
    if (!isSupabaseConfigured) {
      const currentPosts = useAppStore.getState().posts;
      useAppStore.getState().setPosts([postObject, ...currentPosts]);
      return postObject;
    }
    
    try {
      const { data, error } = await supabase.from('posts').insert([postObject]).select();
      if (error) throw error;
      return data;
    } catch (err) {
      console.error("Supabase createPost error:", err);
      return null;
    }
  }
};
