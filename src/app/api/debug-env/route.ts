import { NextResponse } from 'next/server';

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'NO_SET';
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'NO_SET';
  
  return NextResponse.json({
    url_length: url.length,
    url_first_30: url.substring(0, 30),
    url_last_10: url.substring(url.length - 10),
    anon_length: anonKey.length,
    anon_first_30: anonKey.substring(0, 30),
  });
}