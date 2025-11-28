'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/components/providers/TranslationProvider';
import { useParams } from 'next/navigation';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const { t } = useTranslation();
  const params = useParams();
  const locale = params.locale as string;
  
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
      const { data: profileResults, error: profileError } = await supabase
        .from('users')
        .select('id, nombre, apellido, telefono, email')
        .eq('telefono', normalizedPhone)
        .eq('email', email)
        .limit(1);

      const profileData = profileResults?.[0];

      console.log('Resultado query user_profiles:', { profileData, profileError });

      if (profileError || !profileData) {
        console.error('Error en query:', profileError);
        setError(t('auth.forgotPassword.messages.userNotFound'));
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
        setError(t('auth.forgotPassword.messages.genericError'));
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
        setError(t('auth.forgotPassword.messages.genericError'));
        setLoading(false);
        return;
      }

      setSuccess(t('auth.forgotPassword.messages.codeSent'));
      setStep(2);
    } catch (err) {
      console.error('Error general:', err);
      setError(t('auth.forgotPassword.messages.genericError'));
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

      const { data: profileResults } = await supabase
        .from('users')
        .select('id')
        .eq('telefono', normalizedPhone)
        .eq('email', email)
        .limit(1);

      const profileData = profileResults?.[0];

      if (!profileData) {
        setError(t('auth.forgotPassword.messages.genericError'));
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
        setError(t('auth.forgotPassword.messages.invalidCode'));
        setLoading(false);
        return;
      }

      setSuccess(t('auth.forgotPassword.messages.codeVerified'));
      setStep(3);
    } catch (err) {
      setError(t('auth.forgotPassword.messages.genericError'));
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (newPassword.length < 6) {
      setError(t('auth.forgotPassword.messages.passwordTooShort'));
      return;
    }
    
    setLoading(true);

    try {
      const normalizedPhone = normalizePhone(phone);

      const { data: profileResults } = await supabase
        .from('users')
        .select('id')
        .eq('telefono', normalizedPhone)
        .eq('email', email)
        .limit(1);

      const profileData = profileResults?.[0];

      if (!profileData) {
        setError(t('auth.forgotPassword.messages.genericError'));
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
        setError(resetResult.error || t('auth.forgotPassword.messages.genericError'));
        setLoading(false);
        return;
      }

      await supabase
        .from('kit2_codes')
        .delete()
        .eq('created_by', profileData.id)
        .eq('code', code);

      setSuccess(t('auth.forgotPassword.messages.passwordUpdated'));
      setTimeout(() => {
        router.push(`/${locale}/auth/login`);
      }, 2000);
    } catch (err) {
      console.error('Error al restablecer la contraseña:', err);
      setError(t('auth.forgotPassword.messages.genericError'));
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 py-12 px-4">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {t('auth.forgotPassword.title')}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {t('auth.forgotPassword.subtitle')}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-xl p-8">
          {error && (
            <div className="rounded-md bg-red-50 p-4 mb-4">
              <div className="text-sm text-red-700">{error}</div>
            </div>
          )}

          {success && (
            <div className="rounded-md bg-green-50 p-4 mb-4">
              <div className="text-sm text-green-700">{success}</div>
            </div>
          )}

          {step === 1 && (
            <form onSubmit={handleValidateUser} className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {t('auth.forgotPassword.step1.title')}
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  {t('auth.forgotPassword.step1.description')}
                </p>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  {t('auth.forgotPassword.step1.emailLabel')}
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('auth.forgotPassword.step1.emailPlaceholder')}
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                  required
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  {t('auth.forgotPassword.step1.phoneLabel')}
                </label>
                <input
                  id="phone"
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder={t('auth.forgotPassword.step1.phonePlaceholder')}
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? t('auth.forgotPassword.step1.sendingButton') : t('auth.forgotPassword.step1.sendCodeButton')}
              </button>

              <div className="text-center">
                <Link 
                  href={`/${locale}/auth/login`}
                  className="text-sm font-medium text-green-600 hover:text-green-500"
                >
                  {t('auth.forgotPassword.backToLogin')}
                </Link>
              </div>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleVerifyCode} className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {t('auth.forgotPassword.step2.title')}
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  {t('auth.forgotPassword.step2.description')}
                </p>
              </div>

              <div>
                <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-1">
                  {t('auth.forgotPassword.step2.codeLabel')}
                </label>
                <input
                  id="code"
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder={t('auth.forgotPassword.step2.codePlaceholder')}
                  maxLength={6}
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                  required
                />
                <p className="mt-2 text-xs text-gray-500">
                  {t('auth.forgotPassword.step2.resendCode')}
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? t('auth.forgotPassword.step2.verifyingButton') : t('auth.forgotPassword.step2.verifyButton')}
              </button>

              <button
                type="button"
                onClick={handleBack}
                className="w-full text-sm font-medium text-gray-600 hover:text-gray-500"
              >
                {t('auth.forgotPassword.backToLogin')}
              </button>
            </form>
          )}

          {step === 3 && (
            <form onSubmit={handleResetPassword} className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {t('auth.forgotPassword.step3.title')}
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  {t('auth.forgotPassword.step3.description')}
                </p>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  {t('auth.forgotPassword.step3.passwordLabel')}
                </label>
                <input
                  id="password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder={t('auth.forgotPassword.step3.passwordPlaceholder')}
                  minLength={6}
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                  required
                />
                <p className="mt-1 text-xs text-gray-500">
                  {t('auth.forgotPassword.step3.passwordHint')}
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? t('auth.forgotPassword.step3.updatingButton') : t('auth.forgotPassword.step3.updateButton')}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}