export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: NextRequest) {
  try {
    // ✅ MOVIDO AQUÍ - Crear cliente DENTRO de la función
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const body = await request.json();
    const { auth_user_id, email, nombre, apellido } = body;

    if (!auth_user_id || !email || !nombre || !apellido) {
      return NextResponse.json(
        { error: 'Datos incompletos' },
        { status: 400 }
      );
    }

    const { data: existingUser } = await supabase
      .from('user_profiles')  // ← CAMBIADO: era 'users'
      .select('id')
      .eq('auth_user_id', auth_user_id)
      .single();

    if (existingUser) {
      return NextResponse.json(
        { error: 'Usuario ya existe' },
        { status: 400 }
      );
    }

    const { data: newUser, error: insertError } = await supabase
      .from('user_profiles')  // ← CAMBIADO: era 'users'
      .insert([
        {
          auth_user_id,
          email,
          nombre,
          apellido,
          activo: true,
          email_verificado: false,
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