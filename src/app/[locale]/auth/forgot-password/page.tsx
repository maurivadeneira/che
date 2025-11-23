'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const normalizePhone = (phoneNumber: string): string => {
    return phoneNumber.replace(/[\s\-\+\(\)]/g, '');
  };

  const handleValidateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    console.log('=== INICIO VALIDACIÓN ===');
    console.log('Email ingresado:', email);
    console.log('Teléfono ingresado:', phone);

    const normalizedPhone = normalizePhone(phone);
    console.log('Teléfono normalizado:', normalizedPhone);

    try {
      // Buscar usuario por EMAIL Y TELÉFONO
      const { data: profileResults, error: profileError } = await supabase
        .from('user_profiles')
        .select('id, nombre_completo, telefono, email')
        .eq('telefono', normalizedPhone)
        .eq('email', email)
        .limit(1);

      const profileData = profileResults?.[0];

      console.log('Resultado query user_profiles:', { profileData, profileError });

      if (profileError || !profileData) {
        console.error('Error en query:', profileError);
        setError('Los datos no coinciden.');
        setLoading(false);
        return;
      }

      console.log('Perfil encontrado:', profileData);
      const userId = profileData.id;

      const recoveryCode = Math.floor(100000 + Math.random() * 900000).toString();
      console.log('Código generado:', recoveryCode);

      const { error: codeError } = await supabase
        .from('kit2_codes')
        .insert({
          created_by: userId,
          code: recoveryCode,
          expires_at: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
        });

      if (codeError) {
        console.error('Error guardando código:', codeError);
        setError('Error al generar código de recuperación.');
        setLoading(false);
        return;
      }

      console.log('Código guardado en BD');

      const emailResponse = await fetch('/api/send-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code: recoveryCode }),
      });

      const emailResult = await emailResponse.json();
      console.log('Respuesta envío email:', emailResult);

      if (!emailResponse.ok) {
        setError('Error al enviar el código por email.');
        setLoading(false);
        return;
      }

      setSuccess('Código enviado a tu email. Revisa tu bandeja de entrada.');
      setStep(2);
    } catch (err) {
      console.error('Error general:', err);
      setError('Error inesperado. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const normalizedPhone = normalizePhone(phone);

      // Buscar usuario por EMAIL Y TELÉFONO
      const { data: profileResults } = await supabase
        .from('user_profiles')
        .select('id')
        .eq('telefono', normalizedPhone)
        .eq('email', email)
        .limit(1);

      const profileData = profileResults?.[0];

      if (!profileData) {
        setError('Error de validación.');
        setLoading(false);
        return;
      }

      const { data: codeData, error } = await supabase
        .from('kit2_codes')
        .select('*')
        .eq('created_by', profileData.id)
        .eq('code', code)
        .gte('expires_at', new Date().toISOString())
        .maybeSingle();

      if (error || !codeData) {
        setError('Código inválido o expirado.');
        setLoading(false);
        return;
      }

      setSuccess('Código verificado. Ingresa tu nueva contraseña.');
      setStep(3);
    } catch (err) {
      setError('Error al verificar el código.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const normalizedPhone = normalizePhone(phone);

      // Buscar usuario por EMAIL Y TELÉFONO
      const { data: profileResults } = await supabase
        .from('user_profiles')
        .select('id')
        .eq('telefono', normalizedPhone)
        .eq('email', email)
        .limit(1);

      const profileData = profileResults?.[0];

      if (!profileData) {
        setError('Error de validación.');
        setLoading(false);
        return;
      }

      console.log('=== ACTUALIZAR CONTRASEÑA ===');
      console.log('UserId:', profileData.id);
      console.log('Nueva contraseña length:', newPassword.length);

      const resetResponse = await fetch('/api/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userId: profileData.id, 
          newPassword 
        }),
      });

      console.log('Reset response status:', resetResponse.status);
      const resetResult = await resetResponse.json();
      console.log('Reset response body:', resetResult);

      if (!resetResponse.ok) {
        setError(resetResult.error || 'Error al actualizar la contraseña.');
        setLoading(false);
        return;
      }

      await supabase
        .from('kit2_codes')
        .delete()
        .eq('created_by', profileData.id)
        .eq('code', code);

      setSuccess('Contraseña actualizada exitosamente. Redirigiendo...');
      setTimeout(() => {
        router.push('/es/auth/login');
      }, 2000);
    } catch (err) {
      console.error('Error al restablecer la contraseña:', err);
      setError('Error al restablecer la contraseña.');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setError('');
    setSuccess('');
    setStep(step - 1);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Recuperar contraseña</h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {success}
          </div>
        )}

        {step === 1 && (
          <form onSubmit={handleValidateUser}>
            <p className="text-gray-600 mb-4">Ingresa tus datos registrados</p>
            
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 mb-2">Teléfono</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="573045558862"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <p className="text-sm text-gray-500 mt-1">Sin espacios ni símbolos</p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 disabled:bg-gray-400"
            >
              {loading ? 'Validando...' : 'Continuar'}
            </button>

            <button
              type="button"
              onClick={() => router.push('/es/auth/login')}
              className="w-full mt-3 text-blue-600 hover:underline"
            >
              Volver al login
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleVerifyCode}>
            <p className="text-gray-600 mb-4">Ingresa el código enviado a tu email</p>
            
            <div className="mb-6">
              <label className="block text-gray-700 mb-2">Código de 6 dígitos</label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                maxLength={6}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 disabled:bg-gray-400"
            >
              {loading ? 'Verificando...' : 'Verificar código'}
            </button>

            <button
              type="button"
              onClick={handleBack}
              className="w-full mt-3 text-blue-600 hover:underline"
            >
              Volver
            </button>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handleResetPassword}>
            <p className="text-gray-600 mb-4">Ingresa tu nueva contraseña</p>
            
            <div className="mb-6">
              <label className="block text-gray-700 mb-2">Nueva contraseña</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                minLength={6}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <p className="text-sm text-gray-500 mt-1">Mínimo 6 caracteres</p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 disabled:bg-gray-400"
            >
              {loading ? 'Actualizando...' : 'Actualizar contraseña'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}