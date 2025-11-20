import { createClient } from '@supabase/supabase-js';

export function getSupabaseClient() {
  // Hardcodeado temporalmente para debug
  const supabaseUrl = 'https://cthwfjcgqo21bcuagsfem.supabase.co';
  const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN0aHdmamNncW8yMWJjdWFnc2ZlbSIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzMyNjg1NDM2LCJleHAiOjIwNDgyNjE0MzZ9.YWN1YWdzZmttlwcm9ZS16ImF1bZ4LlCJpYXQ1OjE3MjIyNlYyMDIzaEwAcCTe0M3ANz';

  return createClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  });
}