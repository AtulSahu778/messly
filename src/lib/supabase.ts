import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Debug logging
console.log('Supabase URL:', supabaseUrl ? 'Set' : 'Not set');
console.log('Supabase Key:', supabaseAnonKey ? 'Set' : 'Not set');

/**
 * Supabase Client Configuration
 * 
 * UI Theme Integration:
 * - All Supabase Auth UI uses Finance-Optimized iOS Dark Palette
 * - Primary Background: #070A09
 * - Card Surface: #111513
 * - Section Panel: #1A1F1D
 * - Money Green (CTA): #30D158
 * - Expense Red (Errors): #FF453A
 * 
 * The client is only created if credentials are provided in .env
 * This allows the app to work in localStorage-only mode without Supabase
 */
export const supabase: SupabaseClient | null = 
  supabaseUrl && supabaseAnonKey 
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

if (!supabase) {
  console.warn('⚠️ Supabase client not initialized. Running in localStorage-only mode.');
  console.warn('To enable sync, add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env and restart dev server.');
}
