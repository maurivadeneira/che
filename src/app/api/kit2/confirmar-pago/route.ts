export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { numero_orden, verificado_por_email } = body;

    if (!numero_orden) {
      return NextResponse.json(
        { error: 'Numero de orden requerido' },
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

    // Buscar verificador (admin/autor)
    let verificadorId = null;
    if (verificado_por_email) {
      const { data: verificador } = await supabase
        .from('users')
        .select('id')
        .eq('email', verificado_por_email)
        .single();
      verificadorId = verificador?.id;
    }

    // Generar código Kit2
    const template = await supabase
      .from('kit2_templates')
      .select('contract:contract_id(codigo_prefijo)')
      .eq('id', purchase.template_id)
      .single();

    const prefijo = template.data?.contract?.[0]?.codigo_prefijo || 'K2';
    const codigoKit2 = `${prefijo}-K2-${Date.now().toString(36).toUpperCase()}${Math.random().toString(36).substr(2, 4).toUpperCase()}`;

    // Crear instance (Kit2 del comprador)
    const { data: newInstance, error: instanceError } = await supabase
      .from('kit2_instances')
      .insert({
        codigo_unico: codigoKit2,
        user_id: purchase.comprador_user_id,
        template_id: purchase.template_id,
        chain_id: purchase.chain_id,
        nivel_xn: purchase.nivel_xn_calculado,
        beneficiario_user_id: purchase.beneficiario_user_id,
        invitador_user_id: purchase.invitador_user_id,
        fecha_activacion: new Date().toISOString(),
        fecha_expiracion: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
        estado: 'activo',
        activado_mediante: 'compra',
        compra_id: purchase.id
      })
      .select()
      .single();

    if (instanceError || !newInstance) {
      console.error('Error creando instance:', instanceError);
      return NextResponse.json(
        { error: 'Error creando Kit2' },
        { status: 500 }
      );
    }

    // Actualizar compra
    const { error: updateError } = await supabase
      .from('kit2_purchases')
      .update({
        estado: 'completado',
        agradecimiento_estado: 'verificado',
        productos_estado: 'entregado',
        comprobante_verificado_at: new Date().toISOString(),
        comprobante_verificado_por: verificadorId,
        pago_confirmado_at: new Date().toISOString(),
        kit2_instance_id: newInstance.id,
        kit2_entregado_at: new Date().toISOString(),
        completado_at: new Date().toISOString()
      })
      .eq('id', purchase.id);

    if (updateError) {
      console.error('Error actualizando compra:', updateError);
    }

    // Actualizar estadísticas del invitador
const { data: origenInstance } = await supabase
  .from('kit2_instances')
  .select('total_invitados_directos, total_invitados_activos')
  .eq('id', purchase.origen_instance_id)
  .single();

if (origenInstance) {
  await supabase
    .from('kit2_instances')
    .update({
      total_invitados_directos: (origenInstance.total_invitados_directos || 0) + 1,
      total_invitados_activos: (origenInstance.total_invitados_activos || 0) + 1
    })
    .eq('id', purchase.origen_instance_id);
}

    // Actualizar chain
    await supabase
      .from('kit2_chains')
      .update({
        total_participantes: supabase.raw('total_participantes + 1'),
        nivel_mas_profundo: Math.max(purchase.nivel_xn_calculado, purchase.nivel_mas_profundo || 0),
        ultima_venta: new Date().toISOString()
      })
      .eq('id', purchase.chain_id);

    // Registrar evento de entrega
    await supabase.from('chain_events').insert({
      chain_id: purchase.chain_id,
      template_id: purchase.template_id,
      tipo_evento: 'kit2_entregado',
      user_id: purchase.comprador_user_id,
      instance_id: newInstance.id,
      purchase_id: purchase.id,
      nivel_xn: purchase.nivel_xn_calculado,
      descripcion: `Kit2 entregado a usuario con codigo ${codigoKit2}`,
      metadata: { 
        numero_orden,
        codigo_kit2: codigoKit2,
        verificado_por: verificado_por_email 
      },
      origen: 'sistema',
      tags: ['kit2', 'entregado', 'completado']
    });

    // Si hay beneficiario, registrar comisión
    if (purchase.beneficiario_user_id) {
      await supabase
        .from('kit2_instances')
        .update({
          total_comisiones_recibidas: supabase.raw(`total_comisiones_recibidas + ${purchase.agradecimiento_monto_usd}`)
        })
        .eq('user_id', purchase.beneficiario_user_id)
        .eq('chain_id', purchase.chain_id);

      await supabase.from('chain_events').insert({
        chain_id: purchase.chain_id,
        template_id: purchase.template_id,
        tipo_evento: 'comision_recibida',
        user_id: purchase.beneficiario_user_id,
        purchase_id: purchase.id,
        nivel_xn: purchase.nivel_xn_calculado - 2,
        descripcion: `Comision recibida de ${purchase.agradecimiento_monto_usd} USD`,
        monto_usd: purchase.agradecimiento_monto_usd,
        origen: 'sistema',
        tags: ['comision', 'agradecimiento']
      });
    }

    return NextResponse.json({
      success: true,
      codigo_kit2: codigoKit2,
      instance_id: newInstance.id,
      mensaje: 'Pago confirmado y Kit2 entregado exitosamente'
    });

  } catch (error) {
    console.error('Error confirmando pago:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}