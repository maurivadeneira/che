// API endpoint para envío de códigos de verificación
   import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const { email, code } = await request.json();

    if (!email || !code) {
      return NextResponse.json(
        { error: 'Email y codigo requeridos' },
        { status: 400 }
      );
    }

    // Enviar email usando Resend
    const { data, error } = await resend.emails.send({
      from: 'CHE MundoLibre <che.mundolibre@corpherejiaeconomica.com>',
      to: email,
      subject: 'Código de recuperación - CHE',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f4f4f4;">
            <div style="background-color: white; padding: 30px; border-radius: 10px;">
              <h1 style="color: #16a34a; margin-bottom: 20px;">Recuperación de Contraseña</h1>
              
              <p>Has solicitado recuperar tu contraseña en CHE - Corporación Herejía Económica.</p>
              
              <div style="background-color: #f0fdf4; border: 2px solid #16a34a; border-radius: 8px; padding: 20px; margin: 30px 0; text-align: center;">
                <p style="margin: 0 0 10px 0; font-size: 14px; color: #666;">Tu código de verificación es:</p>
                <p style="font-size: 36px; font-weight: bold; color: #16a34a; letter-spacing: 8px; margin: 0;">${code}</p>
              </div>
              
              <p style="color: #666; font-size: 14px;">
                Este código expira en 10 minutos.<br>
                Si no solicitaste este código, ignora este mensaje.
              </p>
              
              <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 30px 0;">
              
              <p style="color: #999; font-size: 12px; text-align: center;">
                CHE - Corporación Herejía Económica<br>
                <a href="https://corpherejiaeconomica.com" style="color: #16a34a;">corpherejiaeconomica.com</a>
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    if (error) {
      console.error('Error enviando email con Resend:', error);
      return NextResponse.json(
        { error: 'Error al enviar email: ' + error.message },
        { status: 500 }
      );
    }

    console.log('Email enviado exitosamente:', data);
    return NextResponse.json({ success: true });
    
  } catch (error: any) {
    console.error('Error en send-code:', error);
    return NextResponse.json(
      { error: 'Error al enviar email: ' + error.message },
      { status: 500 }
    );
  }
}