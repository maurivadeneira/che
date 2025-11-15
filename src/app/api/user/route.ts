export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      auth_user_id,
      email, 
      nombre, 
      apellido,
    } = body;

    // Validaciones básicas
    if (!auth_user_id || !email || !nombre || !apellido) {
      return NextResponse.json(
        { error: 'Datos incompletos. Se requiere auth_user_id, email, nombre y apellido' },
        { status: 400 }
      );
    }

    // Verificar si el usuario ya existe en la tabla users
    const { data: existingUser, error: checkError } = await supabase
      .from('users')
      .select('id')
      .eq('auth_user_id', auth_user_id)
      .single();

    if (existingUser) {
      return NextResponse.json(
        { error: 'Usuario ya existe en la base de datos' },
        { status: 400 }
      );
    }

    // Crear entrada en la tabla users
    const { data: newUser, error: insertError } = await supabase
      .from('users')
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
        { error: 'Error al crear usuario en la base de datos: ' + insertError.message },
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