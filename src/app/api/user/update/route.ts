export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function PATCH(request: NextRequest) {
  try {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

    // Verificar sesión
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const authUserId = session.user.id;
    const body = await request.json();

    // Campos permitidos para actualizar
    const allowedFields = [
      'nombre', 'apellido', 'telefono', 'whatsapp', 'pais', 'ciudad',
      'direccion', 'fecha_nacimiento', 'genero', 'identificacion',
      'tipo_documento', 'tipo_persona', 'razon_social', 'direccion_fiscal',
      'nit_rut', 'paypal_email'
    ];

    // Filtrar solo campos permitidos
    const updateData: any = {};
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updateData[field] = body[field];
      }
    }

    // Agregar updated_at
    updateData.updated_at = new Date().toISOString();

    // Actualizar en public.users
    const { data, error } = await supabase
      .from('users')
      .update(updateData)
      .eq('auth_user_id', authUserId)
      .select()
      .single();

    if (error) {
      console.error('Error actualizando usuario:', error);
      return NextResponse.json(
        { error: 'Error al actualizar: ' + error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, user: data }, { status: 200 });

  } catch (error: any) {
    console.error('Error en PATCH /api/user/update:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}