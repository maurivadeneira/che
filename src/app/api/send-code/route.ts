import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: NextRequest) {
  try {
    // 🔍 DEBUG - Ver variables de entorno
    console.log('=== DEBUG SMTP CONFIG ===');
    console.log('SMTP_HOST:', process.env.SMTP_HOST);
    console.log('SMTP_PORT:', process.env.SMTP_PORT);
    console.log('SMTP_USER:', process.env.SMTP_USER);
    console.log('SMTP_PASSWORD:', process.env.SMTP_PASSWORD ? 'EXISTS' : 'UNDEFINED');
    console.log('========================');
    
    const { email, code } = await request.json();

    if (!email || !code) {
      return NextResponse.json(
        { error: 'Email y codigo requeridos' },
        { status: 400 }
      );
    }

    // Configurar transporter de nodemailer
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    // Enviar email
    await transporter.sendMail({
      from: `"${process.env.SMTP_FROM_NAME}" <${process.env.SMTP_FROM}>`,
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
      text: `
Tu código de recuperación de contraseña es: ${code}

Este código expira en 10 minutos.
Si no solicitaste este código, ignora este mensaje.

CHE - Corporación Herejía Económica
corpherejiaeconomica.com
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error enviando email:', error);
    return NextResponse.json(
      { error: 'Error al enviar email: ' + error.message },
      { status: 500 }
    );
  }
}
