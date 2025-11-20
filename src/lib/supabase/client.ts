import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

// Cliente de Supabase optimizado para Next.js
export function getSupabaseClient() {
  // DEBUG: Ver qué variables están disponibles
  console.log('🔍 DEBUG Supabase Client:');
  console.log('URL disponible:', !!process.env.NEXT_PUBLIC_SUPABASE_URL);
  console.log('URL value:', process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 30) + '...');
  console.log('KEY disponible:', !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  
  return createClientComponentClient();
}