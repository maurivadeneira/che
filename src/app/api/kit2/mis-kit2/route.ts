export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(request: NextRequest) {
  try {
    // ✅ MOVIDO AQUÍ - Crear cliente DENTRO de la función
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const searchParams = request.nextUrl.searchParams;
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json(
        { error: 'Email requerido' },
        { status: 400 }
      );
    }

    // Buscar usuario
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    if (userError || !user) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    // Obtener todos los Kit2 del usuario
    const { data: kit2, error: kit2Error } = await supabase
      .from('kit2_instances')
      .select(`
        *,
        template:template_id(
          contract:contract_id(nombre_distintivo)
        )
      `)
      .eq('user_id', user.id)
      .eq('estado', 'activo')
      .order('created_at', { ascending: false });

    if (kit2Error) {
      console.error('Error obteniendo Kit2:', kit2Error);
      return NextResponse.json(
        { error: 'Error obteniendo datos' },
        { status: 500 }
      );
    }

    // Calcular estadísticas
    const totalKit2 = kit2?.length || 0;
    const totalInvitados = kit2?.reduce((sum, k) => sum + (k.total_invitados_directos || 0), 0) || 0;
    const totalComisiones = kit2?.reduce((sum, k) => sum + (k.total_comisiones_recibidas || 0), 0) || 0;
    const nivelMaximo = kit2?.reduce((max, k) => Math.max(max, k.nivel_xn), 0) || 0;

    // Formatear datos
    const kit2Formatted = kit2?.map(k => ({
      codigo_unico: k.codigo_unico,
      nombre_kit2: k.template?.contract?.nombre_distintivo,
      nivel_xn: k.nivel_xn,
      total_invitados_directos: k.total_invitados_directos,
      total_comisiones_recibidas: k.total_comisiones_recibidas,
      fecha_expiracion: k.fecha_expiracion,
      fecha_activacion: k.fecha_activacion
    })) || [];

    return NextResponse.json({
      kit2: kit2Formatted,
      estadisticas: {
        total_kit2: totalKit2,
        total_invitados: totalInvitados,
        total_comisiones: totalComisiones,
        nivel_maximo: nivelMaximo
      }
    });

  } catch (error) {
    console.error('Error en dashboard:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}