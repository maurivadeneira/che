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

    // Obtener datos del usuario de la tabla users
    const { data: userData, error: userError } = await supabase
      .from('users')
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

    // Obtener Kit2 activos del usuario
    const { data: kit2Data, error: kit2Error } = await supabase
      .from('kit2_instances')
      .select(`
        id,
        codigo_unico,
        nivel_xn,
        estado,
        fecha_creacion,
        fecha_expiracion,
        template:template_id (
          nombre,
          descripcion
        )
      `)
      .eq('user_id', userData.id)
      .order('fecha_creacion', { ascending: false });

    if (kit2Error) {
      console.error('Error obteniendo Kit2:', kit2Error);
    }

    // Obtener cuentas bancarias
    const { data: cuentasData, error: cuentasError } = await supabase
      .from('user_cuentas_bancarias')
      .select('*')
      .eq('user_id', userData.id);

    if (cuentasError) {
      console.error('Error obteniendo cuentas:', cuentasError);
    }

    // Obtener estadísticas básicas
    const { data: bonificaciones, error: bonifError } = await supabase
      .from('kit2_purchases')
      .select('agradecimiento_monto_usd, fecha_compra, estado')
      .eq('beneficiario_user_id', userData.id)
      .eq('estado', 'completado');

    const totalBonificaciones = bonificaciones?.reduce(
      (sum, b) => sum + (parseFloat(b.agradecimiento_monto_usd) || 0), 
      0
    ) || 0;

    // Contar invitados directos
    const { data: invitadosDirectos, error: invError } = await supabase
      .from('kit2_purchases')
      .select('id')
      .eq('invitador_user_id', userData.id)
      .eq('estado', 'completado');

    const totalInvitados = invitadosDirectos?.length || 0;

    // Construir respuesta
    const response = {
      user: {
        id: userData.id,
        email: userData.email,
        nombre: userData.nombre,
        apellido: userData.apellido,
        nombre_completo: `${userData.nombre} ${userData.apellido}`,
        telefono: userData.telefono,
        whatsapp: userData.whatsapp,
        pais: userData.pais,
        ciudad: userData.ciudad,
        direccion: userData.direccion,
        identificacion: userData.identificacion,
        paypal_email: userData.paypal_email,
        fecha_nacimiento: userData.fecha_nacimiento,
        genero: userData.genero,
        activo: userData.activo,
        email_verificado: userData.email_verificado,
        idioma_preferido: userData.idioma_preferido,
        created_at: userData.created_at,
      },
      kit2: kit2Data || [],
      cuentas_bancarias: cuentasData || [],
      estadisticas: {
        total_kit2_activos: kit2Data?.filter(k => k.estado === 'activo').length || 0,
        total_bonificaciones_recibidas: totalBonificaciones,
        total_invitados_directos: totalInvitados,
        cantidad_bonificaciones: bonificaciones?.length || 0,
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