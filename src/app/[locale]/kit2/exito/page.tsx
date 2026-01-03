'use client';
import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function ExitoPage() {
    const supabase = createClientComponentClient();
    const [nombre, setNombre] = useState('');
    const [enviando, setEnviando] = useState(false);

    useEffect(() => {
        const inicializarExito = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            // 1. Obtener nombre del usuario
            const { data: profile } = await supabase
                .from('users')
                .select('nombre')
                .eq('id', user.id)
                .single();
            
            setNombre(profile?.nombre || 'Miembro');

            // 2. LÓGICA DE FUERZA BRUTA PARA DAIRO:
            // Buscamos su activación para disparar el email si el estado es activo
            const { data: act } = await supabase
                .from('user_kit2_activaciones')
                .select('id, estado')
                .eq('user_id', user.id)
                .single();

            if (act && act.estado === 'activo') {
                setEnviando(true);
                try {
                    // Esto dispara tu API que genera el PDF y envía el correo
                    await fetch('/api/email/enviar-kit2', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ activacion_id: act.id })
                    });
                    console.log("Solicitud de envío de Kit procesada");
                } catch (error) {
                    console.error("Error al disparar el envío:", error);
                } finally {
                    setEnviando(false);
                }
            }
        };

        inicializarExito();
    }, []);

    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
            <div className="mb-6 text-6xl animate-bounce">🎉</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">¡Activación Exitosa!</h1>
            
            <p className="text-gray-500 mb-8 max-w-xs">
                Bienvenido <span className="text-green-600 font-bold">{nombre}</span>. 
                {enviando ? ' Estamos generando tu Kit...' : ' Tu Kit2 ya fue enviado a tu correo y también puedes descargarlo aquí:'}
            </p>

            <div className="w-full max-w-sm bg-gray-50 p-8 rounded-[40px] border border-gray-100 shadow-inner">
                {/* Nota: Asegúrate de que esta ruta /api/pdf/descargar exista o usa tu ruta de generación */}
                <button 
                    onClick={() => window.open(`/api/pdf/generar-kit2`, '_blank')}
                    className="block w-full bg-green-500 hover:bg-green-600 text-white font-bold py-5 rounded-3xl shadow-lg transition-all transform active:scale-95"
                >
                    📥 DESCARGAR MI KIT2
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
                {enviando && <p className="text-[10px] text-blue-400 animate-pulse">Verificando envío de correo...</p>}
            </div>
        </div>
    );
}