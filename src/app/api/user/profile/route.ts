export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  try {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

    // Obtener la sesión actual
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    if (sessionError || !session) {
      console.error('No hay sesión activa:', sessionError);
      return NextResponse.json(
        { error: 'No autorizado. Por favor inicia sesión.' },
        { status: 401 }
      );
    }

    const authUserId = session.user.id;

    // Obtener datos del usuario de la tabla user_profiles (CAMBIADO)
    const { data: userData, error: userError } = await supabase
      .from('user_profiles')  // ← CAMBIADO de 'users' a 'user_profiles'
      .select('*')
      .eq('auth_user_id', authUserId)
      .single();

    if (userError || !userData) {
      console.error('Error obteniendo usuario:', userError);
      return NextResponse.json(
        { error: 'Usuario no encontrado en la base de datos' },
        { status: 404 }
      );
    }

    // Separar nombre y apellido del nombre_completo
    const nombreCompleto = userData.nombre_completo || '';
    const partesNombre = nombreCompleto.split(' ');
    const nombre = partesNombre[0] || '';
    const apellido = partesNombre.slice(1).join(' ') || '';

    // Obtener Kit2 activos del usuario (por ahora vacío, se implementará después)
    const kit2Data: any[] = [];

    // Obtener cuentas bancarias (por ahora vacío)
    const cuentasData: any[] = [];

    // Estadísticas básicas (por ahora en 0)
    const totalBonificaciones = 0;
    const totalInvitados = 0;

    // Construir respuesta
    const response = {
      user: {
        id: userData.id,
        email: userData.email,
        nombre,
        apellido,
        nombre_completo: userData.nombre_completo,
        telefono: userData.telefono || '',
        whatsapp: userData.telefono || '', // Usar teléfono como whatsapp por ahora
        pais: userData.pais || '',
        ciudad: '', // No existe en user_profiles aún
        direccion: '', // No existe en user_profiles aún
        identificacion: '', // No existe en user_profiles aún
        paypal_email: '', // No existe en user_profiles aún
        fecha_nacimiento: '', // No existe en user_profiles aún
        genero: '', // No existe en user_profiles aún
        activo: true, // Por defecto true
        email_verificado: userData.verificado || false,
        idioma_preferido: 'es', // Por defecto español
        created_at: userData.created_at,
      },
      kit2: kit2Data,
      cuentas_bancarias: cuentasData,
      estadisticas: {
        total_kit2_activos: 0,
        total_bonificaciones_recibidas: totalBonificaciones,
        total_invitados_directos: totalInvitados,
        cantidad_bonificaciones: 0,
      },
    };

    return NextResponse.json(response, { status: 200 });

  } catch (error) {
    console.error('Error en GET /api/user/profile:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}