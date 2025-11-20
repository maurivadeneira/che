import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error(
      'Faltan variables de entorno de Supabase. ' +
      'Asegúrate de tener NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY configuradas.'
    );
  }

  return createClientComponentClient({
    supabaseUrl,
    supabaseKey,
  });
}