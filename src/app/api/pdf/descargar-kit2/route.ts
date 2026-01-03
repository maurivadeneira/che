import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { generarKit2PDF } from '@/lib/pdf/kit2-generator';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  try {
    // Obtener el usuario autenticado
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    // Extraer user_id del token (simplificado - usar session del cliente)
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('user_id');

    if (!userId) {
      return NextResponse.json({ error: 'user_id requerido' }, { status: 400 });
    }

    // Obtener datos del usuario
    const { data: comprador } = await supabase
      .from('users')
      .select('id, nombre, apellido, email')
      .eq('id', userId)
      .single();

    if (!comprador) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    // Buscar Kit2 del usuario
    const { data: kit2Instance } = await supabase
      .from('kit2_instances')
      .select('id, codigo_unico, invitador_user_id, beneficiario_asignado_id')
      .eq('user_id', comprador.id)
      .single();

    if (!kit2Instance) {
      return NextResponse.json({ error: 'Kit2 no encontrado' }, { status: 404 });
    }

    // Obtener datos del invitador (X1)
    const { data: invitador } = await supabase
      .from('users')
      .select('nombre, apellido')
      .eq('id', kit2Instance.invitador_user_id)
      .single();

    // Obtener datos del beneficiario (X0)
    let beneficiario = { nombre: 'CHE', apellido: '' };
    if (kit2Instance.beneficiario_asignado_id) {
      const { data: benefData } = await supabase
        .from('users')
        .select('nombre, apellido')
        .eq('id', kit2Instance.beneficiario_asignado_id)
        .single();
      if (benefData) beneficiario = benefData;
    }

    // Obtener obras incluidas
    const { data: obras } = await supabase
      .from('kit2_documentos')
      .select('titulo, autor')
      .eq('activo', true)
      .order('orden');

    // Generar PDF
    const pdfBuffer = await generarKit2PDF({
      nombreDueno: `${comprador.nombre || ''} ${comprador.apellido || ''}`.trim() || 'Usuario',
      nombreBeneficiario: `${beneficiario.nombre} ${beneficiario.apellido}`.trim(),
      nombreInvitador: `${invitador?.nombre || ''} ${invitador?.apellido || ''}`.trim() || 'CHE',
      codigoUnico: kit2Instance.codigo_unico,
      linkActivacion: `https://corpherejiaeconomica.com/es/kit2/activar?ref=${kit2Instance.codigo_unico}`,
      obras: obras || [],
    });

    // Retornar PDF como descarga
    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="Kit2-${kit2Instance.codigo_unico}.pdf"`,
      },
    });

  } catch (error: any) {
    console.error('Error generando PDF:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}