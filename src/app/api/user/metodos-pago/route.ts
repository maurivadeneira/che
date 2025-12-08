import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

// GET - Listar todos los métodos de pago del usuario
export async function GET(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    // Obtener user_id de la tabla users usando auth_user_id
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('auth_user_id', session.user.id)
      .single();

    if (userError || !userData) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    // Obtener métodos de pago
    const { data: metodos, error: metodosError } = await supabase
      .from('user_metodos_pago')
      .select('*')
      .eq('user_id', userData.id)
      .order('preferida', { ascending: false })
      .order('created_at', { ascending: false });

    if (metodosError) {
      console.error('Error obteniendo métodos:', metodosError);
      return NextResponse.json({ error: 'Error al cargar métodos de pago' }, { status: 500 });
    }

    return NextResponse.json(metodos || []);

  } catch (error) {
    console.error('Error en GET /api/user/metodos-pago:', error);
    return NextResponse.json({ error: 'Error del servidor' }, { status: 500 });
  }
}

// POST - Agregar nuevo método de pago
export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    // Obtener user_id
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('auth_user_id', session.user.id)
      .single();

    if (userError || !userData) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    const body = await request.json();
    const { tipo, categoria, identificador, nombre_titular, pais, detalles, es_internacional, preferida } = body;

    // Validación
    if (!tipo || !categoria || !identificador || !nombre_titular) {
      return NextResponse.json({ 
        error: 'Faltan campos requeridos: tipo, categoria, identificador, nombre_titular' 
      }, { status: 400 });
    }

    // Si se marca como preferida, desmarcar otros
    if (preferida) {
      await supabase
        .from('user_metodos_pago')
        .update({ preferida: false })
        .eq('user_id', userData.id)
        .eq('preferida', true);
    }

    // Insertar nuevo método
    const { data: nuevoMetodo, error: insertError } = await supabase
      .from('user_metodos_pago')
      .insert({
        user_id: userData.id,
        tipo,
        categoria,
        identificador,
        nombre_titular,
        pais: pais || null,
        detalles: detalles || null,
        es_internacional: es_internacional || false,
        activa: true,
        preferida: preferida || false,
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error insertando método:', insertError);
      return NextResponse.json({ error: 'Error al crear método de pago' }, { status: 500 });
    }

    return NextResponse.json(nuevoMetodo, { status: 201 });

  } catch (error) {
    console.error('Error en POST /api/user/metodos-pago:', error);
    return NextResponse.json({ error: 'Error del servidor' }, { status: 500 });
  }
}

// PATCH - Actualizar método de pago (activar/desactivar, marcar preferida)
export async function PATCH(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    // Obtener user_id
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('auth_user_id', session.user.id)
      .single();

    if (userError || !userData) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    const body = await request.json();
    const { id, activa, preferida } = body;

    if (!id) {
      return NextResponse.json({ error: 'Se requiere el ID del método' }, { status: 400 });
    }

    // Si se marca como preferida, desmarcar otros
    if (preferida === true) {
      await supabase
        .from('user_metodos_pago')
        .update({ preferida: false })
        .eq('user_id', userData.id)
        .eq('preferida', true);
    }

    // Actualizar método
    const updateData: any = { updated_at: new Date().toISOString() };
    if (activa !== undefined) updateData.activa = activa;
    if (preferida !== undefined) updateData.preferida = preferida;

    const { data: metodoActualizado, error: updateError } = await supabase
      .from('user_metodos_pago')
      .update(updateData)
      .eq('id', id)
      .eq('user_id', userData.id)
      .select()
      .single();

    if (updateError) {
      console.error('Error actualizando método:', updateError);
      return NextResponse.json({ error: 'Error al actualizar método de pago' }, { status: 500 });
    }

    return NextResponse.json(metodoActualizado);

  } catch (error) {
    console.error('Error en PATCH /api/user/metodos-pago:', error);
    return NextResponse.json({ error: 'Error del servidor' }, { status: 500 });
  }
}

// DELETE - Eliminar método de pago
export async function DELETE(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    // Obtener user_id
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('auth_user_id', session.user.id)
      .single();

    if (userError || !userData) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Se requiere el ID del método' }, { status: 400 });
    }

    // Verificar que el método pertenece al usuario antes de eliminar
    const { data: metodo, error: checkError } = await supabase
      .from('user_metodos_pago')
      .select('id, tipo, categoria')
      .eq('id', id)
      .eq('user_id', userData.id)
      .single();

    if (checkError || !metodo) {
      return NextResponse.json({ error: 'Método no encontrado' }, { status: 404 });
    }

    // No permitir eliminar PayPal si es el único método internacional
    if (metodo.categoria === 'digital' && metodo.tipo.toLowerCase() === 'paypal') {
      const { data: metodosInternacionales } = await supabase
        .from('user_metodos_pago')
        .select('id')
        .eq('user_id', userData.id)
        .eq('es_internacional', true);

      if (metodosInternacionales && metodosInternacionales.length <= 1) {
        return NextResponse.json({ 
          error: 'No puedes eliminar tu único método de pago internacional. PayPal es obligatorio.' 
        }, { status: 400 });
      }
    }

    // Eliminar método
    const { error: deleteError } = await supabase
      .from('user_metodos_pago')
      .delete()
      .eq('id', id)
      .eq('user_id', userData.id);

    if (deleteError) {
      console.error('Error eliminando método:', deleteError);
      return NextResponse.json({ error: 'Error al eliminar método de pago' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Método eliminado exitosamente' });

  } catch (error) {
    console.error('Error en DELETE /api/user/metodos-pago:', error);
    return NextResponse.json({ error: 'Error del servidor' }, { status: 500 });
  }
}