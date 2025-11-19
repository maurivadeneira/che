export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: NextRequest) {
  try {
    // ✅ MOVIDO AQUÍ - Crear cliente DENTRO de la función POST
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const formData = await request.formData();
    const numero_orden = formData.get('numero_orden') as string;
    const archivo = formData.get('archivo') as File;

    if (!numero_orden || !archivo) {
      return NextResponse.json(
        { error: 'Datos incompletos' },
        { status: 400 }
      );
    }

    // Buscar compra
    const { data: purchase, error: purchaseError } = await supabase
      .from('kit2_purchases')
      .select('*')
      .eq('numero_orden', numero_orden)
      .single();

    if (purchaseError || !purchase) {
      return NextResponse.json(
        { error: 'Orden no encontrada' },
        { status: 404 }
      );
    }

    if (purchase.estado === 'completado') {
      return NextResponse.json(
        { error: 'Esta orden ya fue completada' },
        { status: 400 }
      );
    }

    // Subir archivo a Supabase Storage
    const fileExt = archivo.name.split('.').pop();
    const fileName = `${numero_orden}-${Date.now()}.${fileExt}`;
    const filePath = `comprobantes/${fileName}`;

    const arrayBuffer = await archivo.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('kit2-files')
      .upload(filePath, buffer, {
        contentType: archivo.type,
        upsert: false
      });

    if (uploadError) {
      console.error('Error subiendo archivo:', uploadError);
      return NextResponse.json(
        { error: 'Error subiendo archivo' },
        { status: 500 }
      );
    }

    // Obtener URL pública
    const { data: urlData } = supabase.storage
      .from('kit2-files')
      .getPublicUrl(filePath);

    // Actualizar compra
    const { error: updateError } = await supabase
      .from('kit2_purchases')
      .update({
        comprobante_archivo_url: urlData.publicUrl,
        comprobante_subido_at: new Date().toISOString(),
        agradecimiento_estado: 'pendiente_verificacion',
        estado: 'esperando_verificacion'
      })
      .eq('id', purchase.id);

    if (updateError) {
      return NextResponse.json(
        { error: 'Error actualizando orden' },
        { status: 500 }
      );
    }

    // Registrar evento
    await supabase.from('chain_events').insert({
      chain_id: purchase.chain_id,
      template_id: purchase.template_id,
      tipo_evento: 'comprobante_subido',
      user_id: purchase.comprador_user_id,
      purchase_id: purchase.id,
      nivel_xn: purchase.nivel_xn_calculado,
      descripcion: `Comprobante subido para orden ${numero_orden}`,
      metadata: { archivo_url: urlData.publicUrl },
      origen: 'usuario',
      tags: ['comprobante', 'subido']
    });

    return NextResponse.json({
      success: true,
      comprobante_url: urlData.publicUrl,
      estado: 'esperando_verificacion',
      mensaje: 'Comprobante recibido. Lo verificaremos pronto.'
    });

  } catch (error) {
    console.error('Error subiendo comprobante:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // ✅ MOVIDO AQUÍ - Crear cliente DENTRO de la función GET
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const searchParams = request.nextUrl.searchParams;
    const numero_orden = searchParams.get('numero_orden');

    if (!numero_orden) {
      return NextResponse.json(
        { error: 'Numero de orden requerido' },
        { status: 400 }
      );
    }

    const { data: purchase, error } = await supabase
      .from('kit2_purchases')
      .select('numero_orden, estado, comprobante_archivo_url, comprobante_subido_at, comprobante_verificado_at')
      .eq('numero_orden', numero_orden)
      .single();

    if (error || !purchase) {
      return NextResponse.json(
        { error: 'Orden no encontrada' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      numero_orden: purchase.numero_orden,
      estado: purchase.estado,
      comprobante_subido: !!purchase.comprobante_archivo_url,
      comprobante_verificado: !!purchase.comprobante_verificado_at,
      fecha_subida: purchase.comprobante_subido_at,
      fecha_verificacion: purchase.comprobante_verificado_at
    });

  } catch (error) {
    console.error('Error consultando comprobante:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}