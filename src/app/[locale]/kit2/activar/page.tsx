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
  const [invitadorInfo, setInvitadorInfo] = useState<InvitadorInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLogin, setIsLogin] = useState(false);
  const [error, setError] = useState('');

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
        .select(`id, codigo_unico, user_id, beneficiario_asignado_id, invitador_user_id`)
        .eq('codigo_unico', codigo)
        .eq('estado', 'activo')
        .single();

      if (instanceError || !instance) {
        setError('Código de referencia no válido o expirado');
        setLoading(false);
        return;
      }

      setInstanceId(instance.id);

      const { data: dueno } = await supabase
        .from('users')
        .select('nombre, apellido, email')
        .eq('id', instance.user_id)
        .single();

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

      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data: activacion } = await supabase
          .from('kit2_purchases')
          .select('*')
          .eq('comprador_user_id', session.user.id)
          .eq('origen_instance_id', instance.id)
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
    setLoading(true);

    try {
      if (isLogin) {
        // --- LOGIN ---
        const { data, error: loginError } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password
        });
        if (loginError) throw loginError;
        if (data.user) await crearOContinuarCompra(data.user.id);

      } else {
        // --- REGISTRO ---
        const { data, error: signUpError } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              nombre: formData.nombre,
              apellido: formData.apellido,
              telefono: formData.telefono
            }
          }
        });

        if (signUpError) throw signUpError;
        if (data.user) {
          // El Trigger SQL ya creó el perfil en 'public.users' automáticamente
          await crearOContinuarCompra(data.user.id);
        }
      }
    } catch (err: any) {
      console.error('Error:', err);
      setError(err.message || 'Ocurrió un error inesperado');
      setLoading(false);
    }
  };

  const crearOContinuarCompra = async (userId: string) => {
    try {
      const { data: existingPurchase } = await supabase
        .from('kit2_purchases')
        .select('*')
        .eq('comprador_user_id', userId)
        .eq('origen_instance_id', instanceId)
        .single();

      if (!existingPurchase) {
        const { data: instance } = await supabase
          .from('kit2_instances')
          .select('user_id, beneficiario_asignado_id')
          .eq('id', instanceId)
          .single();

        const numeroOrden = `K2-${Date.now().toString(36).toUpperCase()}`;

        const { error } = await supabase
          .from('kit2_purchases')
          .insert({
            comprador_user_id: userId,
            origen_instance_id: instanceId,
            origen_codigo_kit2: codigoRef,
            origen_user_id: instance?.user_id,
            beneficiario_user_id: instance?.beneficiario_asignado_id,
            invitador_user_id: instance?.user_id,
            estado: 'pendiente',
            agradecimiento_estado: 'pendiente',
            productos_estado: 'pendiente',
            agradecimiento_monto_usd: 10,
            productos_monto_usd: 25,
            numero_orden: numeroOrden,
            template_id: 'b0000001-0000-0000-0000-000000000001',
            nivel_xn_calculado: 1,
            chain_id: 'c0000001-0000-0000-0000-000000000001',
            iniciado_at: new Date().toISOString()
          });

        if (error) throw error;
      }

      router.push(`/es/kit2/proceso-pago?ref=${codigoRef}`);
    } catch (err) {
      console.error('Error creando compra:', err);
      throw err;
    }
  };

  // --- RENDER (Sin cambios, solo validación de loading) ---
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
          <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
            <button onClick={() => setIsLogin(false)} className={`flex-1 py-2 px-4 rounded-md ${!isLogin ? 'bg-white text-green-600 shadow' : 'text-gray-600'}`}>Registrarse</button>
            <button onClick={() => setIsLogin(true)} className={`flex-1 py-2 px-4 rounded-md ${isLogin ? 'bg-white text-green-600 shadow' : 'text-gray-600'}`}>Ya tengo cuenta</button>
          </div>

          {error && <p className="text-red-600 text-sm mb-4 bg-red-50 p-2 rounded">{error}</p>}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <input type="text" placeholder="Nombre" required value={formData.nombre} onChange={(e) => setFormData({...formData, nombre: e.target.value})} className="w-full px-4 py-2 border rounded-lg" />
                  <input type="text" placeholder="Apellido" required value={formData.apellido} onChange={(e) => setFormData({...formData, apellido: e.target.value})} className="w-full px-4 py-2 border rounded-lg" />
                </div>
                <input type="tel" placeholder="Teléfono" required value={formData.telefono} onChange={(e) => setFormData({...formData, telefono: e.target.value})} className="w-full px-4 py-2 border rounded-lg" />
              </>
            )}
            <input type="email" placeholder="Email" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full px-4 py-2 border rounded-lg" />
            <input type="password" placeholder="Contraseña" required minLength={6} value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} className="w-full px-4 py-2 border rounded-lg" />
            <button type="submit" disabled={loading} className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-400">
              {loading ? 'Procesando...' : isLogin ? 'Entrar y Continuar' : 'Registrarse y Continuar'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}