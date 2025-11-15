export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Función para generar contraseña temporal segura
function generateSecurePassword(): string {
  const length = 12;
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
  let password = '';
  for (let i = 0; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return password;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      origen_codigo, 
      email, 
      nombre, 
      apellido, 
      pais,
      telefono,
      whatsapp,
      direccion,
      identificacion,
      cuentas_bancarias, // Array de objetos: [{banco, numero_cuenta, tipo_cuenta}]
      paypal_email // OBLIGATORIO
    } = body;

    // Validaciones básicas
    if (!origen_codigo || !email || !nombre || !paypal_email) {
      return NextResponse.json(
        { error: 'Datos incompletos. Email, nombre y PayPal son obligatorios' },
        { status: 400 }
      );
    }

    // Validar código de origen
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

    let userId: string | null = null;
    let authUserId: string | null = null;
    let temporaryPassword: string | undefined;
    let isNewUser = false;

    // Verificar si el usuario ya existe
    const { data: existingUser } = await supabase
      .from('users')
      .select('id, auth_user_id')
      .eq('email', email)
      .single();

    if (existingUser) {
      // Usuario ya existe
      userId = existingUser.id;
      authUserId = existingUser.auth_user_id;
    } else {
      // Nuevo usuario - crear cuenta de autenticación
      isNewUser = true;
      temporaryPassword = generateSecurePassword();

      // 1. Crear usuario en Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: email,
        password: temporaryPassword,
        email_confirm: true, // Auto-confirmar email
        user_metadata: {
          nombre: nombre,
          apellido: apellido
        }
      });

      if (authError || !authData.user) {
        console.error('Error creando usuario auth:', authError);
        return NextResponse.json(
          { error: 'Error creando cuenta de usuario' },
          { status: 500 }
        );
      }

      authUserId = authData.user.id;

      // 2. Crear usuario en tabla users
      const { data: newUser, error: userError } = await supabase
        .from('users')
        .insert({ 
          auth_user_id: authUserId,
          email, 
          nombre, 
          apellido, 
          pais,
          telefono,
          whatsapp,
          direccion,
          identificacion,
          paypal_email,
          activo: true,
          fecha_registro: new Date().toISOString()
        })
        .select('id')
        .single();

      if (userError || !newUser) {
        // Si falla, intentar eliminar el usuario auth creado
        await supabase.auth.admin.deleteUser(authUserId);
        
        return NextResponse.json(
          { error: 'Error creando usuario en base de datos' },
          { status: 500 }
        );
      }

      userId = newUser.id;

      // 3. Guardar cuentas bancarias si se proporcionaron
      if (cuentas_bancarias && Array.isArray(cuentas_bancarias) && cuentas_bancarias.length > 0) {
        const cuentasToInsert = cuentas_bancarias.map(cuenta => ({
          user_id: userId,
          banco: cuenta.banco,
          numero_cuenta: cuenta.numero_cuenta,
          tipo_cuenta: cuenta.tipo_cuenta || 'ahorros',
          pais: pais,
          es_principal: cuenta.es_principal || false
        }));

        await supabase
          .from('user_cuentas_bancarias')
          .insert(cuentasToInsert);
      }
    }

    // Calcular nivel y beneficiario
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

    // Crear registro de compra
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

    // Registrar evento en cadena
    await supabase.from('chain_events').insert({
      chain_id: origenInstance.chain_id,
      template_id: origenInstance.template_id,
      tipo_evento: 'compra_iniciada',
      user_id: userId,
      purchase_id: purchase.id,
      nivel_xn: nuevoNivel,
      descripcion: `Compra iniciada por ${nombre} desde codigo ${origen_codigo}`,
      metadata: { numero_orden: numeroOrden, email, is_new_user: isNewUser },
      origen: 'usuario',
      tags: ['compra', 'iniciada']
    });

    // Obtener datos del beneficiario para mostrar en respuesta
let beneficiarioData: {
  nombre: string;
  paypal: string;
  cuentas_bancarias?: any[];
} | null = null;

if (beneficiarioId) {
  const { data: beneficiario } = await supabase
    .from('users')
    .select('nombre, apellido, paypal_email')
    .eq('id', beneficiarioId)
    .single();
  
  if (beneficiario) {
    beneficiarioData = {
      nombre: `${beneficiario.nombre} ${beneficiario.apellido}`,
      paypal: beneficiario.paypal_email
    };

    // Obtener cuentas bancarias del beneficiario
    const { data: cuentas } = await supabase
      .from('user_cuentas_bancarias')
      .select('banco, numero_cuenta, tipo_cuenta')
      .eq('user_id', beneficiarioId);
    
    if (cuentas) {
      beneficiarioData.cuentas_bancarias = cuentas;
    }
  }
}
    // Respuesta
    const response: any = {
      success: true,
      is_new_user: isNewUser,
      user_id: userId,
      purchase_id: purchase.id,
      numero_orden: numeroOrden,
      beneficiario: beneficiarioData,
      monto_agradecimiento: contract.monto_agradecimiento_usd,
      monto_productos: contract.precio_producto_usd,
      tiempo_limite: purchase.tiempo_limite_pago
    };

    // Si es nuevo usuario, incluir contraseña temporal
    if (isNewUser && temporaryPassword) {
      response.temporary_password = temporaryPassword;
      response.message = 'Cuenta creada exitosamente. Se ha enviado un correo con tus credenciales de acceso.';
    }

    return NextResponse.json(response);

  } catch (error) {
    console.error('Error iniciando compra:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}