'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSupabaseClient } from '@/lib/supabase/client';
import Link from 'next/link';

// Force new bundle
const BUILD_VERSION = '2025-11-21-mejoras-ux';

type ErrorType = 'email_not_confirmed' | 'invalid_credentials' | 'user_not_found' | 'network_error' | 'unknown';

export default function LoginPage() {
  const router = useRouter();
  const supabase = getSupabaseClient();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendingEmail, setResendingEmail] = useState(false);
  const [error, setError] = useState('');
  const [errorType, setErrorType] = useState<ErrorType | null>(null);
  const [successMessage, setSuccessMessage] = useState('');

  const handleResendConfirmation = async () => {
    if (!email) {
      setError('Por favor, ingresa tu email primero');
      return;
    }

    setResendingEmail(true);
    setError('');
    setSuccessMessage('');

    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
      });

      if (error) {
        setError('Error al reenviar email. Intenta de nuevo.');
      } else {
        setSuccessMessage('✅ Email reenviado. Revisa tu bandeja de entrada y spam.');
      }
    } catch (err) {
      setError('Error al reenviar email. Intenta de nuevo.');
      console.error('Error resending:', err);
    } finally {
      setResendingEmail(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setErrorType(null);
    setSuccessMessage('');

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        if (signInError.message.includes('Email not confirmed')) {
          setErrorType('email_not_confirmed');
          setError('⚠️ Confirma tu email antes de iniciar sesión.');
        } else if (signInError.message.includes('Invalid login credentials')) {
          setErrorType('invalid_credentials');
          setError('❌ Contraseña incorrecta.');
        } else if (signInError.message.includes('User not found')) {
          setErrorType('user_not_found');
          setError('❌ No existe cuenta con este email.');
        } else {
          setErrorType('network_error');
          setError('⚠️ Error de conexión. Por favor, intenta de nuevo.');
        }
        return;
      }

      router.push('/dashboard');
      router.refresh();
    } catch (err) {
      setErrorType('unknown');
      setError('⚠️ Error de conexión. Por favor, intenta de nuevo.');
      console.error('Error login:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 py-12 px-4">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Inicia sesión
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Kit2 - Árbol Mágico del Ahorro
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          {successMessage && (
            <div className="rounded-md bg-green-50 p-4">
              <div className="text-sm text-green-700">{successMessage}</div>
            </div>
          )}

          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="text-sm text-red-700">{error}</div>
              
              {errorType === 'email_not_confirmed' && (
                <div className="mt-3">
                  <button
                    type="button"
                    onClick={handleResendConfirmation}
                    disabled={resendingEmail}
                    className="text-sm font-medium text-green-600 hover:text-green-500 disabled:opacity-50"
                  >
                    {resendingEmail ? 'Reenviando...' : 'Reenviar email de confirmación'}
                  </button>
                </div>
              )}
            </div>
          )}

          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="email-address" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                placeholder="tu@email.com"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Contraseña
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm">
              <Link href="/auth/forgot-password" className="font-medium text-green-600 hover:text-green-500">
                ¿Olvidaste tu contraseña?
              </Link>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
            </button>
          </div>

          <div className="text-center text-sm text-gray-600">
            <p>
              ¿No tienes cuenta?{' '}
              <Link href="/auth/register" className="font-medium text-green-600 hover:text-green-500">
                Regístrate aquí
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
