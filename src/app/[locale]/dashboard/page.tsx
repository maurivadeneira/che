'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

interface UserData {
  user: {
    id: string;
    email: string;
    nombre: string;
    apellido: string;
    nombre_completo: string;
    telefono?: string;
    whatsapp?: string;
    pais?: string;
    ciudad?: string;
    paypal_email?: string;
    activo: boolean;
  };
  kit2: Array<{
    id: string;
    codigo_unico: string;
    nivel_xn: number;
    estado: string;
    fecha_creacion: string;
    fecha_expiracion: string;
    template?: {
      nombre: string;
    };
  }>;
  estadisticas: {
    total_kit2_activos: number;
    total_bonificaciones_recibidas: number;
    total_invitados_directos: number;
    cantidad_bonificaciones: number;
  };
}

export default function DashboardPage() {
  const router = useRouter();
  const supabase = createClientComponentClient();
  
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    checkAuthAndLoadData();
  }, []);

  const checkAuthAndLoadData = async () => {
    try {
      // Verificar si hay sesión activa
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session) {
        // No hay sesión, redirigir a login
        router.push('/login');
        return;
      }

      // Cargar datos del usuario
      await loadUserData();
    } catch (err) {
      console.error('Error verificando autenticación:', err);
      setError('Error al cargar datos');
      setLoading(false);
    }
  };

  const loadUserData = async () => {
    try {
      const res = await fetch('/api/user/profile');
      
      if (!res.ok) {
        if (res.status === 401) {
          // No autorizado, redirigir a login
          router.push('/login');
          return;
        }
        throw new Error('Error al cargar datos');
      }

      const data = await res.json();
      setUserData(data);
    } catch (err) {
      console.error('Error cargando datos:', err);
      setError('Error al cargar información del usuario');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      router.push('/login');
    } catch (err) {
      console.error('Error al cerrar sesión:', err);
    }
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'activo':
        return 'bg-green-100 text-green-800';
      case 'inactivo':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getDiasRestantes = (fechaExpiracion: string) => {
    const hoy = new Date();
    const expira = new Date(fechaExpiracion);
    const diff = expira.getTime() - hoy.getTime();
    const dias = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return dias;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando tu dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md">
          <div className="text-red-600 text-6xl mb-4 text-center">⚠️</div>
          <p className="text-gray-800 text-center mb-4">{error}</p>
          <button
            onClick={() => router.push('/login')}
            className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
          >
            Volver al login
          </button>
        </div>
      </div>
    );
  }

  if (!userData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <div className="flex justify-between items-center flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                ¡Hola, {userData.user.nombre}! 👋
              </h1>
              <p className="text-gray-600 mt-1">{userData.user.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>

        {/* Tarjetas de Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-4xl">🌳</span>
              <div className="text-3xl font-bold text-green-600">
                {userData.estadisticas.total_kit2_activos}
              </div>
            </div>
            <div className="text-sm text-gray-600 font-medium">Kit2 Activos</div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-4xl">👥</span>
              <div className="text-3xl font-bold text-blue-600">
                {userData.estadisticas.total_invitados_directos}
              </div>
            </div>
            <div className="text-sm text-gray-600 font-medium">Invitados Directos</div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-4xl">💰</span>
              <div className="text-3xl font-bold text-purple-600">
                ${userData.estadisticas.total_bonificaciones_recibidas.toFixed(2)}
              </div>
            </div>
            <div className="text-sm text-gray-600 font-medium">Bonificaciones Recibidas</div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-4xl">🎁</span>
              <div className="text-3xl font-bold text-orange-600">
                {userData.estadisticas.cantidad_bonificaciones}
              </div>
            </div>
            <div className="text-sm text-gray-600 font-medium">Total de Pagos</div>
          </div>
        </div>

        {/* Información Personal */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Tu Información</h2>
            <button 
  onClick={() => {
    console.log('Click en Editar Datos');
    router.push('/es/dashboard/editar-perfil');
  }}
  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm font-medium"
>
  Editar Datos
</button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="text-sm text-gray-600 font-medium">Nombre Completo</label>
              <p className="text-gray-900 font-semibold mt-1">{userData.user.nombre_completo}</p>
            </div>
            <div>
              <label className="text-sm text-gray-600 font-medium">Email</label>
              <p className="text-gray-900 font-semibold mt-1">{userData.user.email}</p>
            </div>
            {userData.user.telefono && (
              <div>
                <label className="text-sm text-gray-600 font-medium">Teléfono</label>
                <p className="text-gray-900 font-semibold mt-1">{userData.user.telefono}</p>
              </div>
            )}
            {userData.user.whatsapp && (
              <div>
                <label className="text-sm text-gray-600 font-medium">WhatsApp</label>
                <p className="text-gray-900 font-semibold mt-1">{userData.user.whatsapp}</p>
              </div>
            )}
            {userData.user.paypal_email && (
              <div>
                <label className="text-sm text-gray-600 font-medium">PayPal</label>
                <p className="text-gray-900 font-semibold mt-1">{userData.user.paypal_email}</p>
              </div>
            )}
            {userData.user.pais && (
              <div>
                <label className="text-sm text-gray-600 font-medium">País</label>
                <p className="text-gray-900 font-semibold mt-1">{userData.user.pais}</p>
              </div>
            )}
          </div>
        </div>

        {/* Mis Kit2 */}
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Mis Kit2 🌱</h2>
          
          {userData.kit2.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📦</div>
              <p className="text-gray-600 text-lg mb-4">Aún no tienes Kit2 activos</p>
              <button className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium">
                Obtener Mi Kit2
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {userData.kit2.map((kit2) => {
                const diasRestantes = getDiasRestantes(kit2.fecha_expiracion);
                const porExpirar = diasRestantes <= 30 && diasRestantes > 0;
                const expirado = diasRestantes <= 0;

                return (
                  <div
                    key={kit2.id}
                    className="border-2 border-gray-200 rounded-xl p-6 hover:border-green-300 transition"
                  >
                    <div className="flex justify-between items-start mb-4 flex-wrap gap-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">
                          {kit2.template?.nombre || 'Kit2'}
                        </h3>
                        <p className="text-sm text-gray-600 font-mono bg-gray-100 px-3 py-1 rounded mt-2 inline-block">
                          {kit2.codigo_unico}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className={`px-4 py-1 ${getEstadoColor(kit2.estado)} text-sm rounded-full font-medium inline-block mb-2`}>
                          {kit2.estado.charAt(0).toUpperCase() + kit2.estado.slice(1)}
                        </span>
                        <p className="text-sm text-gray-600">Nivel X{kit2.nivel_xn}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm mb-4">
                      <div>
                        <div className="text-gray-600">Creado</div>
                        <div className="font-semibold text-gray-900">
                          {new Date(kit2.fecha_creacion).toLocaleDateString('es-ES', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-600">Expira</div>
                        <div className={`font-semibold ${expirado ? 'text-red-600' : porExpirar ? 'text-orange-600' : 'text-gray-900'}`}>
                          {new Date(kit2.fecha_expiracion).toLocaleDateString('es-ES', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-600">Días Restantes</div>
                        <div className={`font-semibold ${expirado ? 'text-red-600' : porExpirar ? 'text-orange-600' : 'text-green-600'}`}>
                          {diasRestantes > 0 ? diasRestantes : 'Expirado'}
                        </div>
                      </div>
                    </div>

                    {porExpirar && !expirado && (
                      <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-4">
                        <p className="text-sm text-orange-800">
                          ⚠️ Tu Kit2 expira pronto. Renueva ahora para mantener tu árbol activo.
                        </p>
                      </div>
                    )}

                    {expirado && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                        <p className="text-sm text-red-800">
                          ❌ Este Kit2 ha expirado. Renueva para reactivar tu cuenta.
                        </p>
                      </div>
                    )}

                    <div className="flex gap-3 pt-4 border-t border-gray-200">
                      <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm font-medium">
                        Re-descargar Kit2
                      </button>
                      <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-sm font-medium">
                        Ver Árbol
                      </button>
                      {(porExpirar || expirado) && (
                        <button className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition text-sm font-medium">
                          Renovar
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}