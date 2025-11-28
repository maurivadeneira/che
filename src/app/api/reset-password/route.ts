import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: NextRequest) {
  try {
    const { userId, newPassword } = await request.json();

    if (!userId || !newPassword) {
      return NextResponse.json(
        { error: 'userId y newPassword requeridos' },
        { status: 400 }
      );
    }

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    // Buscar el auth_user_id vinculado
    const { data: profile } = await supabaseAdmin
      .from('users')  // ← CAMBIO: user_profiles → users
      .select('auth_user_id')
      .eq('id', userId)
      .single();

    if (!profile?.auth_user_id) {
      return NextResponse.json(
        { error: 'Usuario de autenticación no encontrado' },
        { status: 404 }
      );
    }

    // Actualizar contraseña usando el auth_user_id correcto
    const { error } = await supabaseAdmin.auth.admin.updateUserById(
      profile.auth_user_id,
      { password: newPassword }
    );

    if (error) {
      console.error('Error actualizando contraseña:', error);
      return NextResponse.json(
        { error: 'Error al actualizar contraseña' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error general:', error);
    return NextResponse.json(
      { error: 'Error inesperado' },
      { status: 500 }
    );
  }
}