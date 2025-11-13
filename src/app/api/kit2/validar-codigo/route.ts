export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const codigo = searchParams.get('codigo');

    if (!codigo) {
      return NextResponse.json(
        { error: 'Codigo requerido' },
        { status: 400 }
      );
    }

    const { data: instance, error } = await supabase
      .from('kit2_instances')
      .select('*, user:user_id(email, nombre, apellido), beneficiario:beneficiario_user_id(email, nombre, apellido), template:template_id(contract:contract_id(nombre_distintivo, precio_producto_usd, monto_agradecimiento_usd))')
      .eq('codigo_unico', codigo)
      .eq('estado', 'activo')
      .single();

    if (error || !instance) {
      return NextResponse.json(
        { error: 'Codigo no valido o expirado' },
        { status: 404 }
      );
    }

    const ahora = new Date();
    const expiracion = new Date(instance.fecha_expiracion);
    
    if (expiracion < ahora) {
      return NextResponse.json(
        { error: 'Kit2 expirado' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      valido: true,
      invitador: {
        nombre: instance.user.nombre,
        apellido: instance.user.apellido
      },
      beneficiario: instance.beneficiario ? {
        nombre: instance.beneficiario.nombre,
        apellido: instance.beneficiario.apellido
      } : null,
      kit2: {
        nombre: instance.template.contract.nombre_distintivo,
        precio: instance.template.contract.precio_producto_usd,
        agradecimiento: instance.template.contract.monto_agradecimiento_usd
      },
      nivel_xn: instance.nivel_xn
    });

  } catch (error) {
    console.error('Error validando codigo:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}