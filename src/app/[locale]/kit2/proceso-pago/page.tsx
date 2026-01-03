'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function ProcesoPagoPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const supabase = createClientComponentClient();
    
    const [loading, setLoading] = useState(true);
    const [activacion, setActivacion] = useState<any>(null);
    const [benefactorMetodos, setBenefactorMetodos] = useState<any[]>([]);
    const [uploading, setUploading] = useState<'x0' | 'che' | null>(null);

    useEffect(() => {
        cargarDatos();
    }, []);

    const cargarDatos = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return router.push('/');

            const { data: actData } = await supabase
                .from('user_kit2_activaciones')
                .select('*')
                .eq('user_id', user.id)
                .maybeSingle();

            if (actData?.estado === 'activo') return router.push('/es/kit2/exito');

            const [inv, ben, metodos] = await Promise.all([
                supabase.from('users').select('nombre').eq('id', actData.invitador_user_id).single(),
                supabase.from('users').select('nombre').eq('id', actData.benefactor_user_id).single(),
                supabase.from('user_metodos_pago').select('*').eq('user_id', actData.benefactor_user_id)
            ]);

            setActivacion({ 
                ...actData, 
                invitador_nombre: inv.data?.nombre, 
                benefactor_nombre: ben.data?.nombre 
            });
            setBenefactorMetodos(metodos.data || []);
            setLoading(false);
        } catch (e) { 
            console.error(e);
            setLoading(false); 
        }
    };

    // FUNCIÓN QUE CONECTA CON TU API DE RESEND
    const enviarEmailActivacion = async (email: string, nombre: string) => {
        try {
            await fetch('/api/send', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: email,
                    userName: nombre,
                    tipo: 'kit2'
                }),
            });
        } catch (error) {
            console.error("Error al disparar Resend:", error);
        }
    };

    const handleUpload = async (tipo: 'x0' | 'che', file: File) => {
        setUploading(tipo);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("No hay sesión");

            const fileName = `${user.id}/${tipo}_${Date.now()}`;
            const { error: storageError } = await supabase.storage.from('comprobantes-pago').upload(fileName, file);
            if (storageError) throw storageError;

            const { data: { publicUrl } } = supabase.storage.from('comprobantes-pago').getPublicUrl(fileName);

            const updateData = tipo === 'x0' 
                ? { pago_x0_comprobante_url: publicUrl, estado: 'pago_x0_verificado', paso_actual: 'pago_che' }
                : { pago_che_comprobante_url: publicUrl, estado: 'activo', paso_actual: 'finalizado' };

            const { error: dbError } = await supabase.from('user_kit2_activaciones').update(updateData).eq('id', activacion.id);
            if (dbError) throw dbError;

            if (tipo === 'che') {
                // DISPARAR RESEND JUSTO ANTES DE REDIRIGIR
                await enviarEmailActivacion(user.email!, user.user_metadata?.nombre || 'Usuario CHE');
                router.push('/es/kit2/exito');
            } else {
                await cargarDatos();
            }
        } catch (err: any) {
            alert("Error: " + err.message);
        } finally {
            setUploading(null);
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-white italic">Cargando proceso...</div>;

    const esPasoX0 = activacion?.estado === 'pago_x0_pendiente';

    return (
        <div className="min-h-screen bg-gray-50 py-10 px-4">
            <div className="max-w-md mx-auto space-y-6">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-serif italic font-bold">CHE</h1>
                    <p className="text-gray-500 text-sm">Proceso de Activación</p>
                </div>

                {/* PASO 1 */}
                <div className={`bg-white p-6 rounded-3xl shadow-sm border-2 transition-all ${esPasoX0 ? 'border-blue-500 shadow-blue-100' : 'opacity-50 border-transparent'}`}>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="font-bold text-gray-800">1. Pago Agradecimiento ($10)</h2>
                        {!esPasoX0 && <span className="text-green-500 font-bold text-xs">✓ LISTO</span>}
                    </div>
                    {esPasoX0 && (
                        <div className="relative h-32 border-2 border-dashed border-blue-100 rounded-2xl bg-blue-50/30 flex flex-col items-center justify-center">
                            <input type="file" className="absolute inset-0 opacity-0 z-20 cursor-pointer" onChange={(e) => e.target.files?.[0] && handleUpload('x0', e.target.files[0])} />
                            <span className="text-2xl mb-1">📸</span>
                            <p className="text-xs font-bold text-blue-600">{uploading === 'x0' ? 'SUBIENDO...' : 'SUBIR COMPROBANTE'}</p>
                        </div>
                    )}
                </div>

                {/* PASO 2 */}
                <div className={`bg-white p-6 rounded-3xl shadow-sm border-2 transition-all ${!esPasoX0 ? 'border-green-500 shadow-green-100' : 'opacity-50 border-transparent'}`}>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="font-bold text-gray-800">2. Contenido CHE ($25)</h2>
                        {activacion?.estado === 'activo' && <span className="text-green-500 font-bold text-xs">✓ LISTO</span>}
                    </div>
                    {!esPasoX0 && activacion?.estado !== 'activo' && (
                        <div className="relative h-32 border-2 border-dashed border-green-100 rounded-2xl bg-green-50/30 flex flex-col items-center justify-center">
                            <input type="file" className="absolute inset-0 opacity-0 z-20 cursor-pointer" onChange={(e) => e.target.files?.[0] && handleUpload('che', e.target.files[0])} />
                            <span className="text-2xl mb-1">🧾</span>
                            <p className="text-xs font-bold text-green-600">{uploading === 'che' ? 'SUBIENDO...' : 'SUBIR PAGO FINAL'}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}