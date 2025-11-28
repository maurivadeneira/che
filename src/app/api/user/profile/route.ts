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

    // Obtener datos del usuario de public.users
    const { data: userData, error: userError } = await supabase
      .from('users')  // ← CAMBIO: user_profiles → users
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

    // public.users ya tiene nombre y apellido separados
    const nombre = userData.nombre || '';
    const apellido = userData.apellido || '';
    const nombreCompleto = `${nombre} ${apellido}`.trim();

    // Obtener Kit2 activos del usuario (por ahora vacío)
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
        nombre_completo: nombreCompleto,
        telefono: userData.telefono || '',
        whatsapp: userData.whatsapp || userData.telefono || '',
        pais: userData.pais || '',
        ciudad: userData.ciudad || '',
        direccion: userData.direccion || '',
        identificacion: userData.identificacion || '',
        paypal_email: userData.paypal_email || '',
        fecha_nacimiento: userData.fecha_nacimiento || '',
        genero: userData.genero || '',
        activo: userData.activo !== false,
        email_verificado: userData.email_verificado || false,
        idioma_preferido: userData.idioma_preferido || 'es',
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