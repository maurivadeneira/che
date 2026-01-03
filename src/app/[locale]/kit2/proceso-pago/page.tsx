'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

// --- INTERFACES ---
interface MetodoPago {
    tipo: string;
    identificador: string;
    categoria: 'digital' | 'banco';
    nombre_titular?: string; 
}

interface UserProfile {
    nombre_completo: string | null;
}

interface UserRelation {
    email: string;
    user_profiles: UserProfile | null;
}

interface ActivacionData {
    id: string; 
    estado: string; 
    paso_actual: string; 
    invitador: UserRelation;
    benefactor: UserRelation; 
    benefactor_user_id: string; 
}

export default function ProcesoPagoPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const supabase = createClientComponentClient();
    
    const [loading, setLoading] = useState(true);
    const [activacion, setActivacion] = useState<ActivacionData | null>(null);
    const [benefactorMetodos, setBenefactorMetodos] = useState<MetodoPago[]>([]);
    const [cheMetodos, setCheMetodos] = useState<MetodoPago[]>([]);
    const [uploading, setUploading] = useState<'x0' | 'che' | null>(null);
    const [error, setError] = useState('');
    const [tasaCambio, setTasaCambio] = useState<number | null>(null);
    const [monedaLocal, setMonedaLocal] = useState<string>('USD');

    useEffect(() => {
        cargarDatos();
        obtenerTasaCambio();
    }, []);

    const obtenerTasaCambio = async () => {
        try {
            const geo = await fetch('https://ipapi.co/json/').then(res => res.json());
            const moneda = geo.currency || 'USD';
            setMonedaLocal(moneda);
            if (moneda !== 'USD') {
                const rates = await fetch('https://api.exchangerate-api.com/v4/latest/USD').then(res => res.json());
                setTasaCambio(rates.rates[moneda]);
            }
        } catch (e) { console.error("Error tasa:", e); }
    };

    const cargarDatos = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return router.push('/');

            // 1. Buscar activación existente
            const { data: actData } = await supabase
                .from('user_kit2_activaciones')
                .select('*')
                .eq('user_id', user.id)
                .maybeSingle();

            if (actData?.estado === 'activo') {
                router.push('/es/kit2/exito'); // Si ya es activo, enviarlo al éxito
                return;
            }

            let currentAct = actData;

            // 2. Si no existe y hay ref, crearla (con la lógica del Trigger ya lista)
            if (!actData && searchParams.get('ref')) {
                const { data: kitInst } = await supabase
                    .from('kit2_instances')
                    .select('*')
                    .eq('codigo_unico', searchParams.get('ref'))
                    .single();

                if (kitInst) {
                    const { data: nueva } = await supabase.from('user_kit2_activaciones').insert({
                        user_id: user.id,
                        codigo_referencia: searchParams.get('ref'),
                        kit2_instance_id: kitInst.id,
                        invitador_user_id: kitInst.user_id,
                        benefactor_user_id: kitInst.beneficiario_asignado_id,
                        estado: 'pago_x0_pendiente',
                        paso_actual: 'pago_x0'
                    }).select().single();
                    currentAct = nueva;
                }
            }

            if (!currentAct) throw new Error("No se pudo cargar la activación.");

            // 3. Cargar Perfiles y Métodos
            const [inv, ben, metodos] = await Promise.all([
                supabase.from('users').select('email, nombre').eq('id', currentAct.invitador_user_id).single(),
                supabase.from('users').select('email, nombre').eq('id', currentAct.benefactor_user_id).single(),
                supabase.from('user_metodos_pago').select('*').eq('user_id', currentAct.benefactor_user_id)
            ]);

            setActivacion({
                ...currentAct,
                invitador: { email: inv.data?.email, user_profiles: { nombre_completo: inv.data?.nombre } },
                benefactor: { email: ben.data?.email, user_profiles: { nombre_completo: ben.data?.nombre } }
            });

            setBenefactorMetodos(metodos.data || []);
            setCheMetodos([
                { tipo: 'Bco Caja social', identificador: '24076843666', categoria: 'banco', nombre_titular: 'Mauricio Rivadeneira' },
                { tipo: 'Nequi', identificador: '573045558862', categoria: 'digital' },
                { tipo: 'PayPal', identificador: 'maurivadeneira@yahoo.es', categoria: 'digital' }
            ]);

            setLoading(false);
        } catch (err: any) {
            setError(err.message);
            setLoading(false);
        }
    };

    const handleUpload = async (tipo: 'x0' | 'che', file: File) => {
        if (!activacion) return;
        setUploading(tipo);
        
        try {
            const { data: { user } } = await supabase.auth.getUser();
            const fileName = `${user?.id}/${tipo}_${Date.now()}`;

            const { error: upErr } = await supabase.storage.from('comprobantes-pago').upload(fileName, file);
            if (upErr) throw upErr;

            const { data: { publicUrl } } = supabase.storage.from('comprobantes-pago').getPublicUrl(fileName);

            // Actualización de estado y paso
            const updateData = tipo === 'x0' 
                ? { pago_x0_comprobante_url: publicUrl, estado: 'pago_x0_verificado', paso_actual: 'pago_che' }
                : { pago_che_comprobante_url: publicUrl, estado: 'activo', paso_actual: 'finalizado' };

            const { error: dbErr } = await supabase.from('user_kit2_activaciones').update(updateData).eq('id', activacion.id);
            if (dbErr) throw dbErr;

            if (tipo === 'che') {
                router.push('/es/kit2/exito'); // Redirección automática al finalizar
            } else {
                await cargarDatos();
            }
        } catch (err: any) {
            alert("Error: " + err.message);
        } finally {
            setUploading(null);
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-white"><div className="animate-spin rounded-full h-10 w-10 border-t-2 border-green-500"></div></div>;

    const esPasoX0 = activacion?.estado === 'pago_x0_pendiente';

    return (
        <div className="min-h-screen bg-gray-50 py-10 px-4">
            <div className="max-w-md mx-auto space-y-6">
                
                <header className="text-center pb-4">
                    <h1 className="text-3xl font-serif font-bold italic text-gray-900">CHE</h1>
                    <p className="text-gray-500 text-sm mt-1 font-medium">Activación de Cuenta Oficial</p>
                </header>

                {/* PASO 1: BENEFACTOR */}
                <div className={`bg-white rounded-3xl p-6 shadow-xl border-2 transition-all ${esPasoX0 ? 'border-blue-500 scale-100' : 'border-transparent opacity-60 scale-95'}`}>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="font-bold text-gray-800">1. Agradecimiento ($10 USD)</h2>
                        {!esPasoX0 && <span className="text-green-500 font-bold text-sm">✓ COMPLETADO</span>}
                    </div>

                    {esPasoX0 && (
                        <div className="space-y-4">
                            <div className="bg-blue-50 rounded-2xl p-4 space-y-3">
                                <p className="text-xs text-blue-600 font-bold uppercase">Pagar a: {activacion?.benefactor?.user_profiles?.nombre_completo}</p>
                                {benefactorMetodos.map((m, i) => (
                                    <div key={i} className="bg-white p-3 rounded-xl border border-blue-100 text-sm">
                                        <p className="font-bold text-blue-900">{m.tipo}</p>
                                        <p className="text-gray-600">{m.identificador}</p>
                                    </div>
                                ))}
                            </div>
                            
                            <div className="relative h-32 border-2 border-dashed border-blue-200 rounded-2xl bg-blue-50/20 flex flex-col items-center justify-center overflow-hidden">
                                <input type="file" className="absolute inset-0 opacity-0 z-20 cursor-pointer" accept="image/*" onChange={(e) => e.target.files?.[0] && handleUpload('x0', e.target.files[0])} />
                                <span className="text-2xl">📸</span>
                                <p className="text-xs font-bold text-blue-700 mt-2">{uploading === 'x0' ? 'SUBIENDO...' : 'TOCA PARA SUBIR COMPROBANTE'}</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* PASO 2: CORPORACIÓN */}
                <div className={`bg-white rounded-3xl p-6 shadow-xl border-2 transition-all ${!esPasoX0 ? 'border-green-500' : 'border-transparent opacity-40 grayscale'}`}>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="font-bold text-gray-800">2. Contenido CHE ($25 USD)</h2>
                        {activacion?.estado === 'activo' && <span className="text-green-500 font-bold text-sm">✓ COMPLETADO</span>}
                    </div>

                    {!esPasoX0 && activacion?.estado !== 'activo' && (
                        <div className="space-y-4">
                            <div className="bg-green-50 rounded-2xl p-4 space-y-3">
                                {cheMetodos.map((m, i) => (
                                    <div key={i} className="bg-white p-3 rounded-xl border border-green-100 text-sm">
                                        <p className="font-bold text-green-900">{m.tipo}</p>
                                        <p className="text-gray-600">{m.identificador}</p>
                                        {m.nombre_titular && <p className="text-[10px] text-gray-400">{m.nombre_titular}</p>}
                                    </div>
                                ))}
                            </div>
                            
                            <div className="relative h-32 border-2 border-dashed border-green-200 rounded-2xl bg-green-50/20 flex flex-col items-center justify-center overflow-hidden">
                                <input type="file" className="absolute inset-0 opacity-0 z-20 cursor-pointer" accept="image/*" onChange={(e) => e.target.files?.[0] && handleUpload('che', e.target.files[0])} />
                                <span className="text-2xl">🧾</span>
                                <p className="text-xs font-bold text-green-700 mt-2">{uploading === 'che' ? 'SUBIENDO...' : 'TOCA PARA SUBIR PAGO FINAL'}</p>
                            </div>
                        </div>
                    )}
                </div>

                <p className="text-center text-[10px] text-gray-400 uppercase tracking-widest">Sistema de Activación Automática CHE v2.0</p>
            </div>
        </div>
    );
}