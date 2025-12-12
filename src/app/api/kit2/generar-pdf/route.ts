import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { generarKit2PDF } from '@/lib/pdf/kit2-generator';

export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    const body = await request.json();
    const { instance_id } = body;

    if (!instance_id) {
      return NextResponse.json({ error: 'instance_id requerido' }, { status: 400 });
    }

    // Obtener datos de la instancia con joins
    const { data: instance, error: instanceError } = await supabase
      .from('kit2_instances')
      .select(`
        id,
        codigo_unico,
        user_id,
        invitador_user_id,
        nivel_xn
      `)
      .eq('id', instance_id)
      .single();

    if (instanceError || !instance) {
      return NextResponse.json({ error: 'Instancia no encontrada' }, { status: 404 });
    }

    // Obtener datos del dueño
    const { data: dueno } = await supabase
      .from('users')
      .select('nombre, apellido')
      .eq('id', instance.user_id)
      .single();

    // Obtener datos del invitador (X1)
    const { data: invitador } = await supabase
      .from('users')
      .select('nombre, apellido')
      .eq('id', instance.invitador_user_id)
      .single();

    // Obtener datos del beneficiario (X0) - el invitador del invitador
    let beneficiario = { nombre: 'CHE', apellido: '' };
    if (instance.invitador_user_id) {
      const { data: invitadorInstance } = await supabase
        .from('kit2_instances')
        .select('invitador_user_id')
        .eq('user_id', instance.invitador_user_id)
        .single();
      
      if (invitadorInstance?.invitador_user_id) {
        const { data: benefData } = await supabase
          .from('users')
          .select('nombre, apellido')
          .eq('id', invitadorInstance.invitador_user_id)
          .single();
        if (benefData) beneficiario = benefData;
      }
    }

    // Obtener obras incluidas
    const { data: obras } = await supabase
      .from('kit2_documentos')
      .select('titulo, autor')
      .eq('activo', true)
      .order('orden');

    // Generar PDF
    const pdfBuffer = await generarKit2PDF({
      nombreDueno: `${dueno?.nombre || ''} ${dueno?.apellido || ''}`.trim() || 'Usuario',
      nombreBeneficiario: `${beneficiario.nombre} ${beneficiario.apellido}`.trim(),
      nombreInvitador: `${invitador?.nombre || ''} ${invitador?.apellido || ''}`.trim() || 'CHE',
      codigoUnico: instance.codigo_unico,
      linkActivacion: `https://corpherejiaeconomica.com/es/kit2/activar?ref=${instance.codigo_unico}`,
      obras: obras || [],
    });

    // Retornar PDF como descarga
    return new NextResponse(new Uint8Array(pdfBuffer), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="kit2-${instance.codigo_unico}.pdf"`,
      },
    });

  } catch (error) {
    console.error('Error generando Kit2 PDF:', error);
    return NextResponse.json(
      { error: 'Error generando PDF' },
      { status: 500 }
    );
  }
}