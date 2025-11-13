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
    const { origen_codigo, email, nombre, apellido, pais } = body;

    if (!origen_codigo || !email || !nombre) {
      return NextResponse.json(
        { error: 'Datos incompletos' },
        { status: 400 }
      );
    }

    const { data: origenInstance, error: origenError } = await supabase
      .from('kit2_instances')
      .select('*, template:template_id(*, contract:contract_id(*))')
      .eq('codigo_unico', origen_codigo)
      .eq('estado', 'activo')
      .single();

    if (origenError || !origenInstance) {
      return NextResponse.json(
        { error: 'Codigo origen no valido' },
        { status: 404 }
      );
    }

    let userId;
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    if (existingUser) {
      userId = existingUser.id;
    } else {
      const { data: newUser, error: userError } = await supabase
        .from('users')
        .insert({ email, nombre, apellido, pais, activo: true })
        .select('id')
        .single();

      if (userError || !newUser) {
        return NextResponse.json(
          { error: 'Error creando usuario' },
          { status: 500 }
        );
      }
      userId = newUser.id;
    }

    const nuevoNivel = origenInstance.nivel_xn + 1;
    const beneficiarioId = nuevoNivel >= 2 
      ? (await supabase
          .from('kit2_instances')
          .select('user_id')
          .eq('chain_id', origenInstance.chain_id)
          .eq('nivel_xn', nuevoNivel - 2)
          .single()).data?.user_id
      : null;

    const contract = origenInstance.template.contract;
    const numeroOrden = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    const { data: purchase, error: purchaseError } = await supabase
      .from('kit2_purchases')
      .insert({
        numero_orden: numeroOrden,
        comprador_user_id: userId,
        template_id: origenInstance.template_id,
        chain_id: origenInstance.chain_id,
        origen_codigo_kit2: origen_codigo,
        origen_instance_id: origenInstance.id,
        origen_user_id: origenInstance.user_id,
        nivel_xn_calculado: nuevoNivel,
        beneficiario_user_id: beneficiarioId,
        invitador_user_id: origenInstance.user_id,
        estado: 'iniciado',
        agradecimiento_monto_usd: contract.monto_agradecimiento_usd,
        productos_monto_usd: contract.precio_producto_usd,
        tiempo_limite_pago: new Date(Date.now() + 48 * 60 * 60 * 1000),
        comision_autor_porcentaje: contract.comision_contratista_porcentaje,
        comision_autor_monto_usd: (contract.precio_producto_usd * contract.comision_contratista_porcentaje) / 100,
        comision_che_porcentaje: contract.comision_che_porcentaje,
        comision_che_monto_usd: (contract.precio_producto_usd * contract.comision_che_porcentaje) / 100
      })
      .select()
      .single();

    if (purchaseError || !purchase) {
      return NextResponse.json(
        { error: 'Error creando compra' },
        { status: 500 }
      );
    }

    await supabase.from('chain_events').insert({
      chain_id: origenInstance.chain_id,
      template_id: origenInstance.template_id,
      tipo_evento: 'compra_iniciada',
      user_id: userId,
      purchase_id: purchase.id,
      nivel_xn: nuevoNivel,
      descripcion: `Compra iniciada por ${nombre} desde codigo ${origen_codigo}`,
      metadata: { numero_orden: numeroOrden, email },
      origen: 'usuario',
      tags: ['compra', 'iniciada']
    });

    return NextResponse.json({
      success: true,
      purchase_id: purchase.id,
      numero_orden: numeroOrden,
      beneficiario_id: beneficiarioId,
      monto_agradecimiento: contract.monto_agradecimiento_usd,
      monto_productos: contract.precio_producto_usd,
      tiempo_limite: purchase.tiempo_limite_pago
    });

  } catch (error) {
    console.error('Error iniciando compra:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}