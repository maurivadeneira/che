'use client';

import { useState, useEffect } from 'react';

export default function DashboardPage() {
  const [userEmail, setUserEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [misKit2, setMisKit2] = useState<any[]>([]);
  const [estadisticas, setEstadisticas] = useState<any>(null);

  const cargarDashboard = async () => {
    if (!userEmail) return;
    
    setLoading(true);
    try {
      // Por ahora simulamos, luego conectaremos a la API
      const res = await fetch(`/api/kit2/mis-kit2?email=${userEmail}`);
      if (res.ok) {
        const data = await res.json();
        setMisKit2(data.kit2 || []);
        setEstadisticas(data.estadisticas || {});
      }
    } catch (error) {
      console.error('Error cargando dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-indigo-900">
          Mi Dashboard Kit2
        </h1>

        {/* Login temporal */}
        {!estadisticas && (
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <div className="max-w-md mx-auto space-y-4">
              <label className="block text-sm font-medium text-gray-700">
                Tu email
              </label>
              <input
                type="email"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                placeholder="tu@email.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
              <button
                onClick={cargarDashboard}
                disabled={!userEmail || loading}
                className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 disabled:bg-gray-300 transition"
              >
                {loading ? 'Cargando...' : 'Ver mi dashboard'}
              </button>
            </div>
          </div>
        )}

        {/* Estadísticas */}
        {estadisticas && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow p-6">
                <div className="text-3xl font-bold text-indigo-600">
                  {estadisticas.total_kit2 || 0}
                </div>
                <div className="text-sm text-gray-600 mt-1">Kit2 Activos</div>
              </div>

              <div className="bg-white rounded-xl shadow p-6">
                <div className="text-3xl font-bold text-green-600">
                  {estadisticas.total_invitados || 0}
                </div>
                <div className="text-sm text-gray-600 mt-1">Invitados Directos</div>
              </div>

              <div className="bg-white rounded-xl shadow p-6">
                <div className="text-3xl font-bold text-purple-600">
                  ${estadisticas.total_comisiones || 0}
                </div>
                <div className="text-sm text-gray-600 mt-1">Comisiones Recibidas</div>
              </div>

              <div className="bg-white rounded-xl shadow p-6">
                <div className="text-3xl font-bold text-orange-600">
                  {estadisticas.nivel_maximo || 0}
                </div>
                <div className="text-sm text-gray-600 mt-1">Nivel en Árbol</div>
              </div>
            </div>

            {/* Lista de Kit2 */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Mis Kit2</h2>
              
              {misKit2.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📦</div>
                  <p className="text-gray-600">Aún no tienes Kit2 activos</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {misKit2.map((kit2, index) => (
                    <div
                      key={index}
                      className="border border-gray-200 rounded-lg p-6 hover:border-indigo-300 transition"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {kit2.nombre_kit2 || 'Kit2'}
                          </h3>
                          <p className="text-sm text-gray-600 font-mono">
                            {kit2.codigo_unico}
                          </p>
                        </div>
                        <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                          Activo
                        </span>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <div className="text-gray-600">Nivel</div>
                          <div className="font-semibold">X{kit2.nivel_xn}</div>
                        </div>
                        <div>
                          <div className="text-gray-600">Invitados</div>
                          <div className="font-semibold">{kit2.total_invitados_directos || 0}</div>
                        </div>
                        <div>
                          <div className="text-gray-600">Comisiones</div>
                          <div className="font-semibold">${kit2.total_comisiones_recibidas || 0}</div>
                        </div>
                        <div>
                          <div className="text-gray-600">Expira</div>
                          <div className="font-semibold">
                            {new Date(kit2.fecha_expiracion).toLocaleDateString()}
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <button className="text-indigo-600 hover:text-indigo-700 font-medium text-sm">
                          Ver detalles →
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}