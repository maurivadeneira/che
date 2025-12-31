import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { createClient } from '@supabase/supabase-js';
import { generarKit2PDF } from '@/lib/pdf/kit2-generator';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const { activacion_id } = await request.json();

    // Obtener datos de la activación
    const { data: activacion, error: actError } = await supabase
      .from('user_kit2_activaciones')
      .select('*')
      .eq('id', activacion_id)
      .single();

    if (actError || !activacion) {
      return NextResponse.json({ error: 'Activación no encontrada' }, { status: 404 });
    }

    // Obtener datos del comprador
    const { data: comprador } = await supabase
      .from('users')
      .select('id, nombre, apellido, email')
      .eq('id', activacion.user_id)
      .single();

    if (!comprador) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    // Buscar Kit2 existente del comprador
    const { data: kit2Existente } = await supabase
      .from('kit2_instances')
      .select('id, codigo_unico, invitador_user_id, beneficiario_asignado_id')
      .eq('user_id', comprador.id)
      .single();

    let kit2Instance;
    if (!kit2Existente) {
      // Obtener template_id y chain_id del kit2 del invitador
      const { data: kit2Invitador } = await supabase
        .from('kit2_instances')
        .select('template_id, chain_id')
        .eq('user_id', activacion.invitador_user_id)
        .single();

      // Generar código único para el nuevo Kit2
      const iniciales = (comprador.nombre || 'NN')
        .split(' ')
        .map((n: string) => n[0])
        .join('')
        .toUpperCase()
        .substring(0, 3);
      const codigo = `AMA-${iniciales}-${String(Date.now()).slice(-3)}`;

      const fechaActivacion = new Date();
      const fechaExpiracion = new Date();
      fechaExpiracion.setFullYear(fechaExpiracion.getFullYear() + 1);

      const { data: nuevoKit2, error: kit2Error } = await supabase
        .from('kit2_instances')
        .insert({
          user_id: comprador.id,
          codigo_unico: codigo,
          template_id: kit2Invitador?.template_id || 'd0000001-0000-0000-0000-000000000001',
          chain_id: kit2Invitador?.chain_id || 'c0000001-0000-0000-0000-000000000001',
          nivel_xn: 1,
          beneficiario_asignado_id: activacion.invitador_user_id,
          invitador_user_id: activacion.invitador_user_id,
          fecha_activacion: fechaActivacion.toISOString(),
          fecha_expiracion: fechaExpiracion.toISOString(),
          estado: 'activo'
        })
        .select()
        .single();

      if (kit2Error) {
        console.error('Error creando Kit2:', kit2Error);
        return NextResponse.json({ error: 'Error creando Kit2' }, { status: 500 });
      }
      kit2Instance = nuevoKit2;
    } else {
      kit2Instance = kit2Existente;
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

    // Generar PDF directamente
    const pdfBuffer = await generarKit2PDF({
      nombreDueno: `${comprador.nombre || ''} ${comprador.apellido || ''}`.trim() || 'Usuario',
      nombreBeneficiario: `${beneficiario.nombre} ${beneficiario.apellido}`.trim(),
      nombreInvitador: `${invitador?.nombre || ''} ${invitador?.apellido || ''}`.trim() || 'CHE',
      codigoUnico: kit2Instance.codigo_unico,
      linkActivacion: `https://corpherejiaeconomica.com/es/kit2/activar?ref=${kit2Instance.codigo_unico}`,
      obras: obras || [],
    });

    // Enviar email con Resend
    const { error: emailError } = await resend.emails.send({
      from: 'CHE - Corporación Herejía Económica <onboarding@resend.dev>',
      to: comprador.email,
      subject: '🎉 ¡Tu Kit2 está listo! - Corporación Herejía Económica',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #16a34a;">¡Felicitaciones ${comprador.nombre}!</h1>
          <p>Tu compra ha sido completada exitosamente. Ahora eres parte del Árbol Mágico del Ahorro.</p>
          
          <div style="background: #f0fdf4; border: 1px solid #86efac; border-radius: 8px; padding: 20px; margin: 20px 0;">
            <h2 style="color: #166534; margin-top: 0;">Tu Kit2 Personalizado</h2>
            <p><strong>Código único:</strong> ${kit2Instance.codigo_unico}</p>
            <p>Adjunto encontrarás tu Kit2 en PDF. Compártelo con amigos y familiares para que ellos también puedan participar.</p>
          </div>
          
          <h3>¿Qué sigue?</h3>
          <ol>
            <li>Descarga y guarda tu Kit2 (PDF adjunto)</li>
            <li>Comparte tu Kit2 con personas interesadas</li>
            <li>Cuando alguien active un Kit2 usando tu código, recibirás $10 USD</li>
          </ol>
          
          <p>También puedes acceder a todo el contenido educativo en nuestra plataforma:</p>
          <p><a href="https://www.corpherejiaeconomica.com/es/biblioteca" style="background: #16a34a; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Ir a la Biblioteca</a></p>
          
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
          <p style="color: #6b7280; font-size: 12px;">
            Corporación Herejía Económica<br>
            Este email fue enviado porque completaste la compra de un Kit2.
          </p>
        </div>
      `,
      attachments: [
        {
          filename: `Kit2-${kit2Instance.codigo_unico}.pdf`,
          content: Buffer.from(pdfBuffer).toString('base64'),
        }
      ]
    });

    if (emailError) {
      console.error('Error enviando email:', emailError);
      return NextResponse.json({ error: 'Error enviando email: ' + emailError.message }, { status: 500 });
    }

    // Marcar que el email fue enviado
    await supabase
      .from('user_kit2_activaciones')
      .update({ email_kit2_enviado: true, fecha_email_enviado: new Date().toISOString() })
      .eq('id', activacion_id);

    return NextResponse.json({ success: true, message: 'Kit2 enviado por email' });

  } catch (error: any) {
    console.error('Error enviando Kit2:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}