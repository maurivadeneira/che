import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    const body = await request.json();
    const { activacion_id, tipo } = body;

    return NextResponse.json({ 
      success: true, 
      message: 'Generación de PDF pendiente de implementar con pdfkit'
    });

  } catch (error) {
    console.error('Error generando Kit2:', error);
    return NextResponse.json(
      { error: 'Error generando Kit2' },
      { status: 500 }
    );
  }
}