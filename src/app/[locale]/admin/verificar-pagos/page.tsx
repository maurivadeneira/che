'use client';

import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';

export default function AdminVerificarPagosPage() {
  const supabase = createClientComponentClient();
  const router = useRouter();
  
  const [activaciones, setActivaciones] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pendientes');

  useEffect(() => {
    verificarAdmin();
    cargarActivaciones();
  }, [filter]);

  const verificarAdmin = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || user.email !== 'maurivadeneira@yahoo.es') {
      router.push('/dashboard');
    }
  };

  const cargarActivaciones = async () => {
    setLoading(true);
    
    let query = supabase
      .from('user_kit2_activaciones')
      .select('*')
      .order('created_at', { ascending: false });

    if (filter === 'pendientes') {
      query = query.in('estado', ['pago_x0_subido', 'pago_che_subido']);
    } else if (filter === 'verificados') {
      query = query.eq('estado', 'activo');
    }

    const { data, error } = await query;
    
    if (error) {
      console.error('Error cargando activaciones:', error);
    } else {
      setActivaciones(data || []);
    }
    
    setLoading(false);
  };

  const verificarPago = async (activacionId, tipoPago, aprobar) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      let updateData;
      if (tipoPago === 'x0') {
        updateData = {
          pago_x0_fecha_verificacion: new Date().toISOString(),
          pago_x0_verificado_por: user.id,
          estado: aprobar ? 'pago_x0_verificado' : 'rechazado'
        };
      } else {
        updateData = {
          pago_che_fecha_verificacion: new Date().toISOString(),
          pago_che_verificado_por: user.id,
          estado: aprobar ? 'activo' : 'rechazado',
          fecha_activacion: aprobar ? new Date().toISOString() : null
        };
      }

      const { error } = await supabase
        .from('user_kit2_activaciones')
        .update(updateData)
        .eq('id', activacionId);

      if (error) throw error;

      await cargarActivaciones();
      
    } catch (err) {
      console.error('Error verificando pago:', err);
      alert('Error al verificar pago');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando activaciones...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Panel Admin - Verificar Pagos Kit2
          </h1>
          <p className="text-gray-600">
            Total de activaciones pendientes: {activaciones.filter(a => 
              a.estado === 'pago_x0_subido' || a.estado === 'pago_che_subido'
            ).length}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-4 mb-6">
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('pendientes')}
              className={`px-4 py-2 rounded-lg ${
                filter === 'pendientes'
                  ? 'bg-yellow-100 text-yellow-800 font-semibold'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Pendientes
            </button>
            <button
              onClick={() => setFilter('verificados')}
              className={`px-4 py-2 rounded-lg ${
                filter === 'verificados'
                  ? 'bg-green-100 text-green-800 font-semibold'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Verificados
            </button>
            <button
              onClick={() => setFilter('todos')}
              className={`px-4 py-2 rounded-lg ${
                filter === 'todos'
                  ? 'bg-blue-100 text-blue-800 font-semibold'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Todos
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {activaciones.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
              No hay activaciones para mostrar
            </div>
          ) : (
            activaciones.map((act) => (
              <div key={act.id} className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">
                      Activación {act.id}
                    </h3>
                    <p className="text-xs text-gray-400 mt-1">
                      Código: {act.codigo_referencia}
                    </p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                    act.estado === 'activo' ? 'bg-green-100 text-green-700' :
                    act.estado === 'rechazado' ? 'bg-red-100 text-red-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {act.estado.replace(/_/g, ' ').toUpperCase()}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}