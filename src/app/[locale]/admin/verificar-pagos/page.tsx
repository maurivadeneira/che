'use client';

import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';

interface Activacion {
  id: string;
  codigo_referencia: string;
  estado: string;
  user_id: string;
  benefactor_user_id: string;
  pago_x0_comprobante_url: string | null;
  pago_che_comprobante_url: string | null;
  created_at: string;
  comprador?: {
    nombre: string;
    email: string;
  };
  benefactor?: {
    nombre: string;
    email: string;
  };
  metodos_benefactor?: Array<{
    tipo: string;
    identificador: string;
    nombre_titular: string;
  }>;
}

export default function AdminVerificarPagosPage() {
  const supabase = createClientComponentClient();
  const router = useRouter();
  
  const [activaciones, setActivaciones] = useState<Activacion[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pendientes');
  const [imagenAmpliada, setImagenAmpliada] = useState<string | null>(null);

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
      query = query.in('estado', ['pago_x0_verificado', 'activo']);
    }

    const { data, error } = await query;
    
    if (error) {
      console.error('Error cargando activaciones:', error);
      setLoading(false);
      return;
    }

    // Cargar datos adicionales para cada activación
    const activacionesCompletas = await Promise.all(
      (data || []).map(async (act) => {
        // Cargar datos del comprador
        const { data: comprador } = await supabase
          .from('users')
          .select('nombre, email')
          .eq('id', act.user_id)
          .single();

        // Cargar datos del benefactor
        const { data: benefactor } = await supabase
          .from('users')
          .select('nombre, email')
          .eq('id', act.benefactor_user_id)
          .single();

        // Cargar métodos de pago del benefactor
        const { data: metodos } = await supabase
          .from('user_metodos_pago')
          .select('tipo, identificador, nombre_titular')
          .eq('user_id', act.benefactor_user_id);

        return {
          ...act,
          comprador,
          benefactor,
          metodos_benefactor: metodos || []
        };
      })
    );

    setActivaciones(activacionesCompletas);
    setLoading(false);
  };

  const verificarPago = async (activacionId: string, tipoPago: string, aprobar: boolean) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      
      let updateData;
      if (tipoPago === 'x0') {
        updateData = {
          pago_x0_fecha_verificacion: new Date().toISOString(),
          pago_x0_verificado_por: user.id,
          estado: aprobar ? 'pago_x0_verificado' : 'pago_x0_rechazado',
          paso_actual: aprobar ? 'pago_che' : 'pago_x0'
        };
      } else {
        updateData = {
          pago_che_fecha_verificacion: new Date().toISOString(),
          pago_che_verificado_por: user.id,
          estado: aprobar ? 'activo' : 'pago_che_rechazado',
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
        
        {/* Modal para imagen ampliada */}
        {imagenAmpliada && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
            onClick={() => setImagenAmpliada(null)}
          >
            <div className="max-w-4xl max-h-[90vh] overflow-auto">
              <img 
                src={imagenAmpliada} 
                alt="Comprobante ampliado" 
                className="max-w-full h-auto"
              />
              <p className="text-white text-center mt-2">Clic para cerrar</p>
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            🔍 Panel Admin - Verificar Pagos Kit2
          </h1>
          <p className="text-gray-600">
            Pendientes de verificación: {activaciones.filter(a => 
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
              ⏳ Pendientes
            </button>
            <button
              onClick={() => setFilter('verificados')}
              className={`px-4 py-2 rounded-lg ${
                filter === 'verificados'
                  ? 'bg-green-100 text-green-800 font-semibold'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              ✅ Verificados
            </button>
            <button
              onClick={() => setFilter('todos')}
              className={`px-4 py-2 rounded-lg ${
                filter === 'todos'
                  ? 'bg-blue-100 text-blue-800 font-semibold'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              📋 Todos
            </button>
          </div>
        </div>

        <div className="space-y-6">
          {activaciones.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
              No hay activaciones para mostrar
            </div>
          ) : (
            activaciones.map((act) => (
              <div key={act.id} className="bg-white rounded-lg shadow-lg p-6">
                {/* Encabezado */}
                <div className="flex items-start justify-between mb-4 pb-4 border-b">
                  <div>
                    <p className="text-sm text-gray-500">Código de referencia</p>
                    <h3 className="text-lg font-bold text-gray-800">
                      {act.codigo_referencia}
                    </h3>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(act.created_at).toLocaleString()}
                    </p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                    act.estado === 'activo' ? 'bg-green-100 text-green-700' :
                    act.estado === 'pago_x0_verificado' ? 'bg-blue-100 text-blue-700' :
                    act.estado.includes('rechazado') ? 'bg-red-100 text-red-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {act.estado.replace(/_/g, ' ').toUpperCase()}
                  </div>
                </div>

                {/* Info del comprador y benefactor */}
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div className="bg-blue-50 rounded-lg p-3">
                    <p className="text-xs text-blue-600 font-semibold mb-1">👤 COMPRADOR</p>
                    <p className="font-medium">{act.comprador?.nombre || 'N/A'}</p>
                    <p className="text-sm text-gray-600">{act.comprador?.email || 'N/A'}</p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-3">
                    <p className="text-xs text-green-600 font-semibold mb-1">💰 BENEFACTOR (debe recibir $10 USD)</p>
                    <p className="font-medium">{act.benefactor?.nombre || 'N/A'}</p>
                    <p className="text-sm text-gray-600">{act.benefactor?.email || 'N/A'}</p>
                  </div>
                </div>

                {/* Métodos de pago del benefactor */}
                {act.metodos_benefactor && act.metodos_benefactor.length > 0 && (
                  <div className="bg-gray-50 rounded-lg p-3 mb-4">
                    <p className="text-xs text-gray-600 font-semibold mb-2">
                      📋 CUENTAS DEL BENEFACTOR (verificar que el comprobante coincida):
                    </p>
                    <div className="grid md:grid-cols-3 gap-2">
                      {act.metodos_benefactor.map((metodo, idx) => (
                        <div key={idx} className="bg-white border rounded p-2 text-sm">
                          <p className="font-medium">{metodo.tipo}</p>
                          <p className="text-gray-600">{metodo.identificador}</p>
                          <p className="text-xs text-gray-500">{metodo.nombre_titular}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Comprobantes y acciones */}
                <div className="grid md:grid-cols-2 gap-4">
                  {/* Pago X0 (al benefactor) */}
                  <div className={`border rounded-lg p-4 ${
                    act.estado === 'pago_x0_subido' ? 'border-yellow-400 bg-yellow-50' : 'border-gray-200'
                  }`}>
                    <p className="font-semibold text-gray-700 mb-2">
                      Paso 1: Pago al Benefactor ($10 USD)
                    </p>
                    
                    {act.pago_x0_comprobante_url ? (
                      <div>
                        <img 
                          src={act.pago_x0_comprobante_url} 
                          alt="Comprobante X0"
                          className="w-full h-40 object-cover rounded cursor-pointer hover:opacity-80"
                          onClick={() => setImagenAmpliada(act.pago_x0_comprobante_url)}
                        />
                        <p className="text-xs text-blue-600 mt-1 cursor-pointer" onClick={() => setImagenAmpliada(act.pago_x0_comprobante_url)}>
                          🔍 Clic para ampliar
                        </p>
                        
                        {act.estado === 'pago_x0_subido' && (
                          <div className="flex gap-2 mt-3">
                            <button
                              onClick={() => verificarPago(act.id, 'x0', true)}
                              className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 px-3 rounded-lg text-sm font-medium"
                            >
                              ✅ Aprobar
                            </button>
                            <button
                              onClick={() => verificarPago(act.id, 'x0', false)}
                              className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 px-3 rounded-lg text-sm font-medium"
                            >
                              ❌ Rechazar
                            </button>
                          </div>
                        )}
                        
                        {act.estado === 'pago_x0_verificado' && (
                          <p className="text-green-600 text-sm mt-2">✅ Verificado</p>
                        )}
                      </div>
                    ) : (
                      <p className="text-gray-400 text-sm">Sin comprobante</p>
                    )}
                  </div>

                  {/* Pago CHE */}
                  <div className={`border rounded-lg p-4 ${
                    act.estado === 'pago_che_subido' ? 'border-yellow-400 bg-yellow-50' : 'border-gray-200'
                  }`}>
                    <p className="font-semibold text-gray-700 mb-2">
                      Paso 2: Pago a CHE ($25 USD)
                    </p>
                    
                    {act.pago_che_comprobante_url ? (
                      <div>
                        <img 
                          src={act.pago_che_comprobante_url} 
                          alt="Comprobante CHE"
                          className="w-full h-40 object-cover rounded cursor-pointer hover:opacity-80"
                          onClick={() => setImagenAmpliada(act.pago_che_comprobante_url)}
                        />
                        <p className="text-xs text-blue-600 mt-1 cursor-pointer" onClick={() => setImagenAmpliada(act.pago_che_comprobante_url)}>
                          🔍 Clic para ampliar
                        </p>
                        
                        {act.estado === 'pago_che_subido' && (
                          <div className="flex gap-2 mt-3">
                            <button
                              onClick={() => verificarPago(act.id, 'che', true)}
                              className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 px-3 rounded-lg text-sm font-medium"
                            >
                              ✅ Aprobar
                            </button>
                            <button
                              onClick={() => verificarPago(act.id, 'che', false)}
                              className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 px-3 rounded-lg text-sm font-medium"
                            >
                              ❌ Rechazar
                            </button>
                          </div>
                        )}
                        
                        {act.estado === 'activo' && (
                          <p className="text-green-600 text-sm mt-2">✅ Verificado - Kit2 Activo</p>
                        )}
                      </div>
                    ) : (
                      <p className="text-gray-400 text-sm">Sin comprobante</p>
                    )}
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