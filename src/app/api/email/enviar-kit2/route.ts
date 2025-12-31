import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

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
      .select('id, nombre, email')
      .eq('id', activacion.user_id)
      .single();

    if (!comprador) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    // Crear Kit2 para el nuevo usuario si no existe
    const { data: kit2Existente } = await supabase
      .from('kit2_instances')
      .select('id')
      .eq('user_id', comprador.id)
      .single();

    let kit2Instance;
    if (!kit2Existente) {
      // Generar código único para el nuevo Kit2
      const iniciales = (comprador.nombre || 'NN')
        .split(' ')
        .map((n: string) => n[0])
        .join('')
        .toUpperCase()
        .substring(0, 3);
      const codigo = `AMA-${iniciales}-${String(Date.now()).slice(-3)}`;

      // El beneficiario del nuevo kit2 es el invitador de esta activación
      // Obtener template_id y chain_id del kit2 del invitador
const { data: kit2Invitador } = await supabase
    .from('kit2_instances')
    .select('template_id, chain_id')
    .eq('user_id', activacion.invitador_user_id)
    .single();

const fechaActivacion = new Date();
const fechaExpiracion = new Date();
fechaExpiracion.setFullYear(fechaExpiracion.getFullYear() + 1); // 1 año de validez

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

    // Generar el PDF del Kit2
    const pdfResponse = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/kit2/generar-pdf`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ instance_id: kit2Instance.id })
    });

    if (!pdfResponse.ok) {
      console.error('Error generando PDF');
      return NextResponse.json({ error: 'Error generando PDF' }, { status: 500 });
    }

    const pdfBuffer = await pdfResponse.arrayBuffer();

    // Enviar email con el Kit2
    await transporter.sendMail({
      from: `"${process.env.SMTP_FROM_NAME}" <${process.env.SMTP_FROM}>`,
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
          content: Buffer.from(pdfBuffer),
          contentType: 'application/pdf'
        }
      ]
    });

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