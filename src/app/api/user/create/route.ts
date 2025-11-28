export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const body = await request.json();
    const { auth_user_id, email, nombre, apellido, telefono } = body;

    if (!auth_user_id || !email || !nombre || !apellido || !telefono) {
      return NextResponse.json(
        { error: 'Datos incompletos' },
        { status: 400 }
      );
    }

    // Verificar si ya existe en public.users
    const { data: existingUser } = await supabase
      .from('users')  // ← CAMBIO: user_profiles → users
      .select('id')
      .eq('auth_user_id', auth_user_id)
      .single();

    if (existingUser) {
      return NextResponse.json(
        { error: 'Usuario ya existe' },
        { status: 400 }
      );
    }

    // Generar UUID manualmente
    const userId = crypto.randomUUID();

    // Insertar en public.users
    const { data: newUser, error: insertError } = await supabase
      .from('users')  // ← CAMBIO: user_profiles → users
      .insert([
        {
          id: userId,
          auth_user_id,
          email,
          nombre,  // ← CAMBIO: separado en lugar de nombre_completo
          apellido,  // ← CAMBIO: campo separado
          telefono,
          activo: true,  // ← NUEVO: campo de public.users
          email_verificado: false,  // ← NUEVO: campo de public.users
        }
      ])
      .select()
      .single();

    if (insertError) {
      console.error('Error insertando usuario:', insertError);
      return NextResponse.json(
        { error: 'Error al crear usuario: ' + insertError.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { 
        success: true,
        user: {
          id: newUser.id,
          email: newUser.email,
          nombre: newUser.nombre,
          apellido: newUser.apellido,
          telefono: newUser.telefono,
        }
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Error en POST /api/user/create:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}