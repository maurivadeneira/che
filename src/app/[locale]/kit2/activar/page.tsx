'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

interface InvitadorInfo {
  nombre: string;
  email: string;
  beneficiario_nombre: string;
  beneficiario_email: string;
}

export default function ActivarKit2Page() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const supabase = createClientComponentClient();

  const [codigoRef, setCodigoRef] = useState('');
  const [instanceId, setInstanceId] = useState('');
  const [invitadorId, setInvitadorId] = useState('');
  const [benefactorId, setBenefactorId] = useState('');
  const [invitadorInfo, setInvitadorInfo] = useState<InvitadorInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLogin, setIsLogin] = useState(false);
  const [error, setError] = useState('');
  const [mensajeConfirmacion, setMensajeConfirmacion] = useState('');

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    nombre: '',
    apellido: '',
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
  }, [searchParams]);

  const verificarCodigo = async (codigo: string) => {
    try {
      const { data: instance, error: instanceError } = await supabase
        .from('kit2_instances')
        .select(`id, codigo_unico, user_id, beneficiario_asignado_id`)
        .eq('codigo_unico', codigo)
        .eq('estado', 'activo')
        .single();

      if (instanceError || !instance) {
        setError('Código de referencia no válido o expirado');
        setLoading(false);
        return;
      }

      setInstanceId(instance.id);
      setInvitadorId(instance.user_id);
      setBenefactorId(instance.beneficiario_asignado_id);

      // Obtener datos del dueño del Kit2 (invitador)
      const { data: dueno } = await supabase
        .from('users')
        .select('nombre, apellido, email')
        .eq('id', instance.user_id)
        .single();

      // Obtener datos del beneficiario
      let beneficiario = { nombre: 'CHE', apellido: '', email: 'info@corpherejiaeconomica.com' };
      if (instance.beneficiario_asignado_id) {
        const { data: benefData } = await supabase
          .from('users')
          .select('nombre, apellido, email')
          .eq('id', instance.beneficiario_asignado_id)
          .single();
        if (benefData) beneficiario = benefData;
      }

      setInvitadorInfo({
        nombre: `${dueno?.nombre || ''} ${dueno?.apellido || ''}`.trim() || 'Usuario',
        email: dueno?.email || '',
        beneficiario_nombre: `${beneficiario.nombre} ${beneficiario.apellido}`.trim(),
        beneficiario_email: beneficiario.email
      });

      // Si ya hay sesión, verificar si tiene activación existente
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data: activacion } = await supabase
          .from('user_kit2_activaciones')
          .select('*')
          .eq('user_id', session.user.id)
          .single();

        if (activacion) {
          router.push(`/es/kit2/proceso-pago?ref=${codigo}`);
          return;
        }
      }

      setLoading(false);
    } catch (err) {
      console.error('Error verificando código:', err);
      setError('Error al verificar el código');
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setMensajeConfirmacion('');
    setLoading(true);

    try {
      if (isLogin) {
        // --- LOGIN ---
        const { data, error: loginError } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password
        });
        if (loginError) throw loginError;
        if (data.user) await crearActivacion(data.user.id);

      } else {
        // --- REGISTRO ---
        const { data, error: signUpError } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback?next=/es/kit2/proceso-pago?ref=${codigoRef}`,
            data: {
              nombre: formData.nombre,
              apellido: formData.apellido,
              telefono: formData.telefono
            }
          }
        });

        if (signUpError) throw signUpError;
        
        if (data.user && !data.session) {
          // Usuario creado pero necesita confirmar email
          setMensajeConfirmacion('✅ Revisa tu correo electrónico para confirmar tu cuenta. Luego podrás continuar con el proceso de pago.');
          setLoading(false);
          return;
        }
        
        if (data.user && data.session) {
          // Usuario confirmado automáticamente (raro, pero posible)
          await crearActivacion(data.user.id);
        }
      }
    } catch (err: any) {
      console.error('Error:', err);
      setError(err.message || 'Ocurrió un error inesperado');
      setLoading(false);
    }
  };

  const crearActivacion = async (userId: string) => {
    try {
      // Verificar si ya existe una activación para este usuario
      const { data: existingActivacion } = await supabase
        .from('user_kit2_activaciones')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (!existingActivacion) {
        // Crear nueva activación usando user_kit2_activaciones
        const { error } = await supabase
          .from('user_kit2_activaciones')
          .insert({
            user_id: userId,
            codigo_referencia: codigoRef,
            kit2_instance_id: instanceId,
            invitador_user_id: invitadorId,
            benefactor_user_id: benefactorId,
            estado: 'pago_x0_pendiente',
            paso_actual: 'pago_x0'
          });

        if (error) throw error;
      }

      router.push(`/es/kit2/proceso-pago?ref=${codigoRef}`);
    } catch (err) {
      console.error('Error creando activación:', err);
      throw err;
    }
  };

  if (loading && !invitadorInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Verificando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12 px-4">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6 text-center">
          <div className="text-5xl mb-4">🌳</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">El Árbol Mágico del Ahorro</h1>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-4">
            <p className="text-sm text-gray-600">Te invitó:</p>
            <p className="text-lg font-bold text-green-700">{invitadorInfo?.nombre}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          {mensajeConfirmacion ? (
            <div className="bg-green-50 border border-green-300 rounded-lg p-6 text-center">
              <div className="text-4xl mb-4">📧</div>
              <p className="text-green-700 font-medium">{mensajeConfirmacion}</p>
              <p className="text-sm text-gray-500 mt-4">Una vez confirmes, regresa aquí y haz clic en "Ya tengo cuenta" para continuar.</p>
            </div>
          ) : (
            <>
              <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
                <button 
                  onClick={() => setIsLogin(false)} 
                  className={`flex-1 py-2 px-4 rounded-md transition-all ${!isLogin ? 'bg-white text-green-600 shadow' : 'text-gray-600'}`}
                >
                  Registrarse
                </button>
                <button 
                  onClick={() => setIsLogin(true)} 
                  className={`flex-1 py-2 px-4 rounded-md transition-all ${isLogin ? 'bg-white text-green-600 shadow' : 'text-gray-600'}`}
                >
                  Ya tengo cuenta
                </button>
              </div>

              {error && <p className="text-red-600 text-sm mb-4 bg-red-50 p-3 rounded-lg">{error}</p>}

              <form onSubmit={handleSubmit} className="space-y-4">
                {!isLogin && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <input 
                        type="text" 
                        placeholder="Nombre" 
                        required 
                        value={formData.nombre} 
                        onChange={(e) => setFormData({...formData, nombre: e.target.value})} 
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" 
                      />
                      <input 
                        type="text" 
                        placeholder="Apellido" 
                        required 
                        value={formData.apellido} 
                        onChange={(e) => setFormData({...formData, apellido: e.target.value})} 
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" 
                      />
                    </div>
                    <input 
                      type="tel" 
                      placeholder="Teléfono (WhatsApp)" 
                      required 
                      value={formData.telefono} 
                      onChange={(e) => setFormData({...formData, telefono: e.target.value})} 
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" 
                    />
                  </>
                )}
                <input 
                  type="email" 
                  placeholder="Correo electrónico" 
                  required 
                  value={formData.email} 
                  onChange={(e) => setFormData({...formData, email: e.target.value})} 
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" 
                />
                <input 
                  type="password" 
                  placeholder="Contraseña (mínimo 6 caracteres)" 
                  required 
                  minLength={6} 
                  value={formData.password} 
                  onChange={(e) => setFormData({...formData, password: e.target.value})} 
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" 
                />
                <button 
                  type="submit" 
                  disabled={loading} 
                  className="w-full bg-green-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-green-700 disabled:bg-gray-400 transition-all transform active:scale-98"
                >
                  {loading ? 'Procesando...' : isLogin ? '🚀 Entrar y Continuar' : '✨ Registrarse y Continuar'}
                </button>
              </form>
            </>
          )}
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          Corporación Herejía Económica © 2026
        </p>
      </div>
    </div>
  );
}