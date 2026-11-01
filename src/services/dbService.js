import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { db, isFirebaseConfigured } from '../utils/firebase';
import { doc, setDoc, collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import useAppStore from '../store/useAppStore';

/**
 * dbService handles data synchronization between local Zustand store, provisioned Firebase Firestore, and optional Supabase.
 */
export const dbService = {
  // Sync User Profile
  async syncUserProfile(userId, profileData) {
    if (isFirebaseConfigured && db && userId) {
      try {
        const userRef = doc(db, 'users', String(userId));
        await setDoc(
          userRef,
          { ...profileData, updated_at: new Date().toISOString() },
          { merge: true }
        );
      } catch (fsErr) {
        console.warn('[dbService] Firestore syncUserProfile warning:', fsErr?.message);
      }
    }

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
    if (isFirebaseConfigured && db) {
      try {
        const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'), limit(50));
        const snap = await getDocs(q);
        if (!snap.empty) {
          const fsPosts = snap.docs.map(d => ({ id: d.id, ...d.data() }));
          const currentPosts = useAppStore.getState().posts || [];
          const existingIds = new Set(fsPosts.map(p => String(p.id)));
          const merged = [...fsPosts, ...currentPosts.filter(p => !existingIds.has(String(p.id)))];
          useAppStore.getState().setPosts(merged);
          return merged;
        }
      } catch (fsErr) {
        console.warn('[dbService] Firestore fetchPosts warning:', fsErr?.message);
      }
    }

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
    if (isFirebaseConfigured && db && postObject?.id) {
      try {
        const postRef = doc(db, 'posts', String(postObject.id));
        await setDoc(postRef, {
          ...postObject,
          createdAt: postObject.createdAt || new Date().toISOString()
        });
      } catch (fsErr) {
        console.warn('[dbService] Firestore createPost warning:', fsErr?.message);
      }
    }

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
