// En src/lib/supabase/client.ts
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

// Cliente de Supabase optimizado para Next.js
export function getSupabaseClient() {
  return createClientComponentClient();
}