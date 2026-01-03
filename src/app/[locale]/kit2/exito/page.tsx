'use client';
import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function ExitoPage() {
    const supabase = createClientComponentClient();
    const [nombre, setNombre] = useState('');
    const [userId, setUserId] = useState('');
    const [codigoKit2, setCodigoKit2] = useState('');
    const [enviando, setEnviando] = useState(false);
    const [descargando, setDescargando] = useState(false);

    useEffect(() => {
        const inicializarExito = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            setUserId(user.id);

            // 1. Obtener nombre del usuario
            const { data: profile } = await supabase
                .from('users')
                .select('nombre')
                .eq('id', user.id)
                .single();
            
            setNombre(profile?.nombre || 'Miembro');

            // 2. Obtener código del Kit2
            const { data: kit2 } = await supabase
                .from('kit2_instances')
                .select('codigo_unico')
                .eq('user_id', user.id)
                .single();
            
            if (kit2) setCodigoKit2(kit2.codigo_unico);

            // 3. LÓGICA DE ENVÍO POR EMAIL (en segundo plano)
            const { data: act } = await supabase
                .from('user_kit2_activaciones')
                .select('id, estado, email_kit2_enviado')
                .eq('user_id', user.id)
                .single();

            // Solo intentar enviar si está activo y NO se ha enviado antes
            if (act && act.estado === 'activo' && !act.email_kit2_enviado) {
                setEnviando(true);
                try {
                    await fetch('/api/email/enviar-kit2', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ activacion_id: act.id })
                    });
                    console.log("Kit2 enviado por email");
                } catch (error) {
                    console.error("Error al enviar email:", error);
                } finally {
                    setEnviando(false);
                }
            }
        };

        inicializarExito();
    }, []);

    const descargarKit2 = async () => {
        if (!userId) {
            alert('Error: No se pudo identificar el usuario');
            return;
        }

        setDescargando(true);
        try {
            const response = await fetch(`/api/pdf/descargar-kit2?user_id=${userId}`);
            
            if (!response.ok) {
                throw new Error('Error al generar el PDF');
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `Kit2-${codigoKit2 || 'CHE'}.pdf`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (error) {
            console.error('Error descargando Kit2:', error);
            alert('Error al descargar el Kit2. Por favor intenta de nuevo o contacta soporte.');
        } finally {
            setDescargando(false);
        }
    };

    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
            <div className="mb-6 text-6xl animate-bounce">🎉</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">¡Activación Exitosa!</h1>
            
            <p className="text-gray-500 mb-2 max-w-xs">
                Bienvenido <span className="text-green-600 font-bold">{nombre}</span>.
            </p>

            {codigoKit2 && (
                <p className="text-sm text-gray-400 mb-4">
                    Tu código: <span className="font-mono font-bold text-blue-600">{codigoKit2}</span>
                </p>
            )}

            <p className="text-gray-500 mb-8 max-w-md text-sm">
                {enviando 
                    ? '📧 Enviando tu Kit2 por email...' 
                    : '✅ Tu Kit2 está listo. Revisa tu email o descárgalo aquí:'}
            </p>

            <div className="w-full max-w-sm bg-gray-50 p-8 rounded-[40px] border border-gray-100 shadow-inner">
                <button 
                    onClick={descargarKit2}
                    disabled={descargando}
                    className="block w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-5 rounded-3xl shadow-lg transition-all transform active:scale-95"
                >
                    {descargando ? '⏳ GENERANDO PDF...' : '📥 DESCARGAR MI KIT2'}
                </button>
                
                <button 
                    onClick={() => window.location.href = '/'}
                    className="mt-6 text-sm text-gray-400 font-medium hover:text-gray-600 block w-full"
                >
                    Ir al Dashboard
                </button>
            </div>

            <div className="mt-12 space-y-2">
                <p className="text-[10px] text-gray-300 uppercase tracking-widest font-bold">Corporación Herejía Económica</p>
                {enviando && <p className="text-[10px] text-blue-400 animate-pulse">📧 Enviando a tu correo...</p>}
            </div>

            {/* Instrucciones adicionales */}
            <div className="mt-8 max-w-md bg-blue-50 border border-blue-200 rounded-2xl p-4">
                <p className="text-xs text-blue-800 font-bold mb-2">📝 IMPORTANTE:</p>
                <ul className="text-xs text-blue-700 text-left space-y-1">
                    <li>✓ Revisa tu email (y carpeta de SPAM)</li>
                    <li>✓ Descarga tu Kit2 en PDF</li>
                    <li>✓ Comparte tu código con amigos y familia</li>
                    <li>✓ Cuando ellos se registren, recibirás $10 USD</li>
                </ul>
            </div>
        </div>
    );
}