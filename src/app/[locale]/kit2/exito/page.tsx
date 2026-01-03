'use client';
import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function ExitoPage() {
    const supabase = createClientComponentClient();
    const [nombre, setNombre] = useState('');

    useEffect(() => {
        const fetchUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { data } = await supabase.from('users').select('nombre').eq('id', user.id).single();
                setNombre(data?.nombre || 'Miembro');
            }
        };
        fetchUser();
    }, []);

    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
            <div className="mb-6 text-6xl">🎉</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">¡Activación Exitosa!</h1>
            <p className="text-gray-500 mb-8 max-w-xs">Bienvenido <span className="text-green-600 font-bold">{nombre}</span>. Tu Kit2 ya fue enviado a tu correo y también puedes descargarlo aquí:</p>

            <div className="w-full max-w-sm bg-gray-50 p-8 rounded-[40px] border border-gray-100 shadow-inner">
                <a 
                    href="/kit2.pdf" 
                    download="Mi_Kit2_CHE.pdf"
                    className="block w-full bg-green-500 hover:bg-green-600 text-white font-bold py-5 rounded-3xl shadow-lg transition-all transform active:scale-95"
                >
                    📥 DESCARGAR KIT2
                </a>
                
                <button 
                    onClick={() => window.location.href = '/'}
                    className="mt-6 text-sm text-gray-400 font-medium hover:text-gray-600"
                >
                    Volver al Inicio
                </button>
            </div>

            <p className="mt-12 text-[10px] text-gray-300 uppercase tracking-widest">Corporación Heredia Económica</p>
        </div>
    );
}