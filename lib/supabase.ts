import { createClient } from '@supabase/supabase-js';

// Safe access to environment variables with multiple fallbacks
const getEnv = (key: string) => {
  try {
    if (typeof import.meta !== 'undefined' && (import.meta as any).env && (import.meta as any).env[key]) {
      return (import.meta as any).env[key];
    }
  } catch (e) {}

  try {
    if (typeof process !== 'undefined' && process.env && process.env[key]) {
      return process.env[key];
    }
  } catch (e) {}
  
  return undefined;
};

// Fallbacks hardcodés pour assurer le fonctionnement sur Vercel si les variables d'env ne sont pas injectées au build
const SUPABASE_URL = getEnv('VITE_SUPABASE_URL') || "https://pfrgbuqifhhhpbskwtuo.supabase.co";
const SUPABASE_ANON_KEY = getEnv('VITE_SUPABASE_ANON_KEY') || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBmcmdidXFpZmhoaHBic2t3dHVvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM3MzQzMDcsImV4cCI6MjA3OTMxMDMwN30.PRkZUAcHX0F0ryO4q_RkFAZ5Fvx5XRHC82j5f6OiPgs";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export const isSupabaseConfigured = () => !!supabase;