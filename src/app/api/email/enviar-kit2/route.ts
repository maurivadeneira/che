import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { createClient } from '@supabase/supabase-js';
import { generarKit2PDF } from '@/lib/pdf/kit2-generator';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  const resend = new Resend(process.env.RESEND_API_KEY);
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
      subject: '🎉 ¡Tu Kit2 está listo! - Bienvenido al Árbol Mágico del Ahorro',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #2e7d32 0%, #1b5e20 100%); padding: 40px 20px; text-align: center; border-radius: 8px 8px 0 0;">
            <div style="font-size: 60px; margin-bottom: 10px;">🌳</div>
            <h1 style="color: #ffffff; margin: 0; font-size: 28px;">¡Felicitaciones ${comprador.nombre}!</h1>
            <p style="color: #c8e6c9; margin: 10px 0 0 0; font-size: 16px;">Ahora eres parte del Árbol Mágico del Ahorro</p>
          </div>
          
          <!-- Kit2 Info -->
          <div style="background: #f1f8e9; border: 2px solid #aed581; border-radius: 8px; padding: 25px; margin: 20px;">
            <h2 style="color: #33691e; margin-top: 0; font-size: 22px;">📦 Tu Kit2 Personalizado</h2>
            <p style="margin: 15px 0;"><strong style="color: #558b2f;">Código único:</strong> <span style="font-family: monospace; background: #dcedc8; padding: 5px 10px; border-radius: 4px; font-size: 18px;">${kit2Instance.codigo_unico}</span></p>
            <p style="color: #555; line-height: 1.6;">Tu Kit2 está adjunto en este correo en formato PDF. Úsalo para invitar a amigos y familiares a unirse al sistema.</p>
          </div>
          
          <!-- Pasos siguientes -->
          <div style="padding: 0 20px;">
            <h3 style="color: #2e7d32; border-bottom: 2px solid #81c784; padding-bottom: 10px;">🚀 ¿Qué sigue ahora?</h3>
            <ol style="color: #424242; line-height: 1.8; padding-left: 20px;">
              <li><strong>Descarga y guarda</strong> tu Kit2 (PDF adjunto)</li>
              <li><strong>Comparte tu código</strong> con personas interesadas</li>
              <li><strong>Gana $10 USD</strong> por cada persona que active su Kit2 usando tu código</li>
              <li><strong>Aprende y edúcate</strong> con las obras incluidas</li>
            </ol>
          </div>
          
          <!-- Biblioteca -->
          <div style="background: #e3f2fd; border-left: 4px solid #1976d2; padding: 20px; margin: 20px;">
            <h3 style="color: #0d47a1; margin-top: 0; font-size: 18px;">📚 Accede a todas las obras incluidas</h3>
            <p style="color: #555; margin-bottom: 15px;">Tu Kit2 incluye acceso completo a nuestra biblioteca de contenido educativo:</p>
            <ul style="color: #424242; line-height: 1.8; margin: 15px 0;">
              <li>📖 <strong>Libros</strong> en 6 idiomas (ES, EN, PT, FR, DE, IT)</li>
              <li>📄 <strong>Artículos</strong> de economía alternativa</li>
              <li>🎥 <strong>Conferencias</strong> y videos educativos</li>
              <li>🌳 <strong>Guía completa</strong> del Sistema Kit2</li>
            </ul>
            <div style="text-align: center; margin-top: 25px;">
              <a href="https://corpherejiaeconomica.com/es/biblioteca" 
                 style="display: inline-block; background: #1976d2; color: white; padding: 15px 40px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                🔗 Acceder a la Biblioteca
              </a>
            </div>
          </div>
          
          <!-- Tu Link de Referido -->
          <div style="background: #fff3e0; border: 2px solid #ffb74d; border-radius: 8px; padding: 20px; margin: 20px;">
            <h3 style="color: #e65100; margin-top: 0;">🔗 Tu Link de Invitación</h3>
            <p style="color: #555; margin-bottom: 10px;">Comparte este enlace para que otros puedan unirse:</p>
            <div style="background: white; padding: 15px; border-radius: 4px; border: 1px solid #ffb74d; font-family: monospace; word-break: break-all; font-size: 14px; color: #d84315;">
              https://corpherejiaeconomica.com/es/kit2/activar?ref=${kit2Instance.codigo_unico}
            </div>
          </div>
          
          <!-- Soporte -->
          <div style="padding: 20px; text-align: center; color: #757575; font-size: 13px;">
            <p style="margin: 5px 0;">¿Tienes preguntas? Visita nuestra plataforma o contáctanos.</p>
            <p style="margin: 5px 0;"><a href="https://corpherejiaeconomica.com" style="color: #1976d2; text-decoration: none;">www.corpherejiaeconomica.com</a></p>
          </div>
          
          <!-- Footer -->
          <div style="background: #f5f5f5; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; border-top: 1px solid #e0e0e0;">
            <p style="color: #9e9e9e; font-size: 12px; margin: 5px 0; text-transform: uppercase; letter-spacing: 1px; font-weight: bold;">
              Corporación Herejía Económica
            </p>
            <p style="color: #bdbdbd; font-size: 11px; margin: 5px 0;">
              Este email fue enviado porque completaste la activación de tu Kit2.
            </p>
          </div>
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