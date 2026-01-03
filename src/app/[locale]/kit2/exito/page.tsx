'use client';
import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function ExitoPage() {
    const supabase = createClientComponentClient();
    const [nombre, setNombre] = useState('');

    useEffect(() => {
        const obtenerUsuario = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { data } = await supabase.from('users').select('nombre').eq('id', user.id).single();
                setNombre(data?.nombre || 'Usuario CHE');
            }
        };
        obtenerUsuario();
    }, []);

    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                <span className="text-4xl">🎉</span>
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-2">¡Activación Exitosa!</h1>
            <p className="text-gray-600 mb-8">Bienvenido a la comunidad, <span className="font-bold text-green-600">{nombre}</span>. Tu cuenta ya está activa.</p>

            <div className="w-full max-w-sm bg-gray-50 border border-gray-100 rounded-3xl p-8 space-y-4">
                <p className="text-sm font-medium text-gray-500 uppercase tracking-widest">Tu Material:</p>
                
                {/* BOTÓN DE DESCARGA AUTOMÁTICA */}
                <a 
                    href="/ruta-a-tu-pdf-o-carpeta/kit2.pdf" 
                    download
                    className="block w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 rounded-2xl shadow-lg transition-transform active:scale-95"
                >
                    📥 Descargar mi Kit2
                </a>

                <button 
                    onClick={() => window.location.href = '/es/dashboard'}
                    className="block w-full bg-white border border-gray-200 text-gray-700 font-semibold py-3 rounded-2xl hover:bg-gray-50"
                >
                    Ir al Dashboard
                </button>
            </div>

            <p className="mt-10 text-xs text-gray-400">Si tienes problemas con la descarga, contacta a soporte.</p>
        </div>
    );
}