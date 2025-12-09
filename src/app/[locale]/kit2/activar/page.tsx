'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function ActivarKit2Page() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const supabase = createClientComponentClient();
  
  const [codigoRef, setCodigoRef] = useState('');
  const [invitadorInfo, setInvitadorInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLogin, setIsLogin] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    nombre: '',
    telefono: ''
  });

  useEffect(() => {
    const codigo = searchParams.get('ref');
    if (codigo) {
      setCodigoRef(codigo);
      verificarCodigo(codigo);
    } else {
      setError('Código de referencia no válido');
      setLoading(false);
    }
    
    verificarSesion();
  }, [searchParams]);

  const verificarSesion = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      router.push(`/kit2/proceso-pago?ref=${codigoRef}`);
    }
  };

  const verificarCodigo = async (codigo) => {
    try {
      const { data, error } = await supabase
        .from('user_kit2_creation')
        .select(`
          *,
          users:user_id (
            email,
            user_profiles (nombre_completo)
          )
        `)
        .eq('codigo_referencia', codigo)
        .eq('estado', 'completado')
        .single();

      if (error || !data) {
        setError('Código de referencia no válido o expirado');
        setLoading(false);
        return;
      }

      setInvitadorInfo({
        nombre: data.users.user_profiles?.nombre_completo || data.users.email,
        email: data.users.email,
        benefactor_nombre: data.benefactor_nombre,
        benefactor_email: data.benefactor_email
      });
      
      setLoading(false);
    } catch (err) {
      console.error('Error verificando código:', err);
      setError('Error al verificar el código');
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password
        });

        if (error) throw error;

        const { data: activacion } = await supabase
          .from('user_kit2_activaciones')
          .select('*')
          .eq('user_id', data.user.id)
          .eq('codigo_referencia', codigoRef)
          .single();

        if (activacion) {
          router.push(`/kit2/proceso-pago?ref=${codigoRef}`);
        } else {
          await crearActivacion(data.user.id);
        }
        
      } else {
        const { data, error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              nombre_completo: formData.nombre,
              telefono: formData.telefono
            }
          }
        });

        if (error) throw error;

        await supabase.from('user_profiles').insert({
          user_id: data.user.id,
          nombre_completo: formData.nombre,
          telefono: formData.telefono
        });

        await crearActivacion(data.user.id);
      }
    } catch (err) {
      console.error('Error:', err);
      setError(err.message);
      setLoading(false);
    }
  };

  const crearActivacion = async (userId) => {
    try {
      const { data: invitador } = await supabase
        .from('user_kit2_creation')
        .select('user_id, benefactor_user_id')
        .eq('codigo_referencia', codigoRef)
        .single();

      const { error } = await supabase
        .from('user_kit2_activaciones')
        .insert({
          user_id: userId,
          codigo_referencia: codigoRef,
          invitador_user_id: invitador.user_id,
          benefactor_user_id: invitador.benefactor_user_id,
          estado: 'pago_x0_pendiente',
          paso_actual: 'pago_x0',
          fecha_expiracion: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
        });

      if (error) throw error;

      router.push(`/kit2/proceso-pago?ref=${codigoRef}`);
      
    } catch (err) {
      console.error('Error creando activación:', err);
      throw err;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Verificando código...</p>
        </div>
      </div>
    );
  }

  if (error && !invitadorInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-red-50 border border-red-200 rounded-lg p-6">
          <h2 className="text-xl font-bold text-red-800 mb-2">Error</h2>
          <p className="text-red-600">{error}</p>
          <button
            onClick={() => router.push('/')}
            className="mt-4 w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12 px-4">
      <div className="max-w-md mx-auto">
        
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="text-center">
            <div className="text-5xl mb-4">🌳</div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              El Árbol Mágico del Ahorro
            </h1>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-4">
              <p className="text-sm text-gray-600 mb-2">Te invitó:</p>
              <p className="text-lg font-bold text-green-700">
                {invitadorInfo?.nombre}
              </p>
              <p className="text-sm text-gray-500">{invitadorInfo?.email}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          
          <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2 px-4 rounded-md transition-colors ${
                !isLogin 
                  ? 'bg-white text-green-600 font-semibold shadow'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Registrarse
            </button>
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2 px-4 rounded-md transition-colors ${
                isLogin 
                  ? 'bg-white text-green-600 font-semibold shadow'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Ya tengo cuenta
            </button>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {!isLogin && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre completo
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.nombre}
                    onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Tu nombre completo"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.telefono}
                    onChange={(e) => setFormData({...formData, telefono: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Tu número de teléfono"
                  />
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="tu@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contraseña
              </label>
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Mínimo 6 caracteres"
                minLength={6}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:bg-gray-400"
            >
              {loading ? 'Procesando...' : isLogin ? 'Iniciar Sesión' : 'Registrarse'}
            </button>
          </form>

          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>🔒 Tu seguridad:</strong> Solo verás los métodos de pago después de registrarte. 
              Nunca pediremos contraseñas de bancos.
            </p>
          </div>
        </div>

        <div className="mt-6 text-center text-sm text-gray-600">
          <p>Al registrarte aceptas los términos y condiciones</p>
          <p className="mt-2">¿Necesitas ayuda? <a href="/contacto" className="text-green-600 hover:underline">Contáctanos</a></p>
        </div>
      </div>
    </div>
  );
}