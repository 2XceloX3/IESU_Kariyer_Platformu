import { createClient } from '@supabase/supabase-js';

// NOT: Supabase entegrasyonu için .env dosyası oluşturmanız gerekmektedir.
// Kök dizinde .env adında bir dosya oluşturup içine şu bilgileri ekleyin:
// VITE_SUPABASE_URL=your_supabase_project_url
// VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder_key';

// Mock veya Production modunu tespit et
export const isSupabaseConfigured = 
  supabaseUrl !== 'https://placeholder.supabase.co' && 
  supabaseAnonKey !== 'placeholder_key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * DataService - Veritabanı adaptörü
 * Eğer Supabase kurulu değilse localStorage mock verisini kullanır, kuruluysa Supabase'e bağlanır.
 */
export const DataService = {
  async getPosts() {
    if (!isSupabaseConfigured) {
      console.warn("Supabase kurulu değil. Mock veri dönülüyor.");
      return JSON.parse(localStorage.getItem('igu_posts') || '[]');
    }
    const { data, error } = await supabase.from('posts').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },
  
  async createPost(postData) {
    if (!isSupabaseConfigured) {
      console.warn("Supabase kurulu değil. Mock veriye ekleniyor.");
      return postData;
    }
    const { data, error } = await supabase.from('posts').insert([postData]).select();
    if (error) throw error;
    return data;
  }
};
