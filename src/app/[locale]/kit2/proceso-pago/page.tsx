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
    telefono?: string | null;
}

interface UserRelation {
    email: string;
    pais?: string;
    user_profiles: UserProfile | null;
}

interface ActivacionData {
    id: string; 
    estado: string; 
    paso_actual: string; 
    invitador: UserRelation;
    benefactor: UserRelation; 
    pago_x0_comprobante_url: string | null;
    pago_che_comprobante_url: string | null;
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
    const [uploadingX0, setUploadingX0] = useState(false);
    const [uploadingChe, setUploadingChe] = useState(false);
    const [error, setError] = useState('');
    const [tasaCambio, setTasaCambio] = useState<number | null>(null);
    const [monedaLocal, setMonedaLocal] = useState<string>('USD');

    useEffect(() => {
        cargarDatos();
        obtenerTasaCambio();
    }, []);

    const obtenerTasaCambio = async () => {
        try {
            const geoResponse = await fetch('https://ipapi.co/json/');
            const geoData = await geoResponse.json();
            const moneda = geoData.currency || 'USD';
            setMonedaLocal(moneda);
            
            if (moneda !== 'USD') {
                const rateResponse = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
                const rateData = await rateResponse.json();
                const tasa = rateData.rates[moneda];
                if (tasa) setTasaCambio(tasa);
            }
        } catch (error) {
            console.error('Error obteniendo tasa de cambio:', error);
        }
    };

    const cargarDatos = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.push('/');
                return;
            }

            const codigoRef = searchParams.get('ref');
            
            const { data: activacionData, error: actError } = await supabase
                .from('user_kit2_activaciones')
                .select('*')
                .eq('user_id', user.id)
                .maybeSingle();

            if (actError) throw actError;

            let currentAct = activacionData;

            if (!activacionData && codigoRef) {
                const { data: kit2Instance } = await supabase
                    .from('kit2_instances')
                    .select('id, user_id, beneficiario_asignado_id')
                    .eq('codigo_unico', codigoRef)
                    .single();

                if (kit2Instance) {
                    const { data: nueva } = await supabase
                        .from('user_kit2_activaciones')
                        .insert({
                            user_id: user.id,
                            codigo_referencia: codigoRef,
                            kit2_instance_id: kit2Instance.id,
                            invitador_user_id: kit2Instance.user_id,
                            benefactor_user_id: kit2Instance.beneficiario_asignado_id,
                            estado: 'pago_x0_pendiente',
                            paso_actual: 'pago_x0'
                        }).select().single();
                    currentAct = nueva;
                }
            }

            if (!currentAct) {
                setError('No se encontró una activación activa.');
                setLoading(false);
                return;
            }

            const { data: invData } = await supabase.from('users').select('email, nombre').eq('id', currentAct.invitador_user_id).single();
            const { data: benData } = await supabase.from('users').select('email, nombre').eq('id', currentAct.benefactor_user_id).single();

            setActivacion({
                ...currentAct,
                invitador: { email: invData?.email || '', user_profiles: { nombre_completo: invData?.nombre || '' } },
                benefactor: { email: benData?.email || '', user_profiles: { nombre_completo: benData?.nombre || '' } }
            });

            const { data: mBen } = await supabase.from('user_metodos_pago').select('*').eq('user_id', currentAct.benefactor_user_id);
            setBenefactorMetodos(mBen || []);
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

    const handleUploadComprobante = async (tipo: 'x0' | 'che', file: File) => {
        if (!activacion) return;
        tipo === 'x0' ? setUploadingX0(true) : setUploadingChe(true);
        
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('Sesión expirada');
            
            const fileExt = file.name.split('.').pop();
            const fileName = `${user.id}/${tipo}_${Date.now()}.${fileExt}`;

            const { error: upErr } = await supabase.storage.from('comprobantes-pago').upload(fileName, file);
            if (upErr) throw upErr;

            const { data: { publicUrl } } = supabase.storage.from('comprobantes-pago').getPublicUrl(fileName);

            const updateData = tipo === 'x0' 
                ? { pago_x0_comprobante_url: publicUrl, estado: 'pago_x0_verificado', paso_actual: 'pago_che' }
                : { pago_che_comprobante_url: publicUrl, estado: 'activo' };

            await supabase.from('user_kit2_activaciones').update(updateData).eq('id', activacion.id);
            await cargarDatos();
        } catch (err: any) {
            alert("Error al subir: " + err.message);
        } finally {
            setUploadingX0(false);
            setUploadingChe(false);
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-white"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div></div>;

    const pasoX0Completado = activacion?.estado !== 'pago_x0_pendiente';
    const pasoCheCompletado = activacion?.estado === 'activo';

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-xl mx-auto">
                <div className="bg-white rounded-2xl shadow-sm p-6 mb-6 text-center border border-gray-100">
                    <span className="text-4xl italic font-serif">CHE</span>
                    <h1 className="text-xl font-bold text-gray-800 mt-2">Finaliza tu Activación</h1>
                    <p className="text-gray-400 text-xs">Invitado por {activacion?.invitador?.user_profiles?.nombre_completo}</p>
                </div>

                {/* PASO 1 */}
                <section className={`bg-white rounded-2xl shadow-sm p-6 mb-6 border-2 transition-all ${!pasoX0Completado ? 'border-blue-500 ring-4 ring-blue-50' : 'border-transparent'}`}>
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h2 className="font-bold text-gray-800">1. Pago de Agradecimiento</h2>
                            <p className="text-green-600 font-bold">$10.00 USD {tasaCambio && `≈ ${(10 * tasaCambio).toLocaleString()} ${monedaLocal}`}</p>
                        </div>
                        {pasoX0Completado && <span className="bg-green-100 text-green-700 text-xs py-1 px-3 rounded-full font-bold">✓ RECIBIDO</span>}
                    </div>

                    {!pasoX0Completado && (
                        <div className="space-y-4">
                            <div className="bg-blue-50 p-4 rounded-xl space-y-2">
                                {benefactorMetodos.map((m, i) => (
                                    <div key={i} className="bg-white p-3 rounded-lg text-sm border border-blue-100">
                                        <p className="font-bold text-blue-900">{m.tipo}</p>
                                        <p className="text-gray-600 break-all">{m.identificador}</p>
                                    </div>
                                ))}
                            </div>

                            {/* BOTÓN INVISIBLE PARA MÓVILES */}
                            <div className="relative overflow-hidden border-2 border-dashed border-blue-200 rounded-2xl p-8 text-center bg-blue-50/30 hover:bg-blue-50 transition-colors">
                                <input 
                                    type="file" 
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                    accept="image/*"
                                    onChange={(e) => e.target.files?.[0] && handleUploadComprobante('x0', e.target.files[0])}
                                />
                                <div className="relative z-0">
                                    <span className="text-3xl">📸</span>
                                    <p className="text-sm font-bold text-blue-700 mt-2">Toca aquí para subir el comprobante</p>
                                    <p className="text-xs text-blue-400">Foto de la pantalla o Galería</p>
                                    {uploadingX0 && <div className="mt-2 animate-pulse text-blue-600 font-bold">Subiendo...</div>}
                                </div>
                            </div>
                        </div>
                    )}
                </section>

                {/* PASO 2 */}
                <section className={`bg-white rounded-2xl shadow-sm p-6 mb-6 border-2 transition-all ${pasoX0Completado && !pasoCheCompletado ? 'border-green-500 ring-4 ring-green-50' : 'border-transparent'} ${!pasoX0Completado ? 'opacity-40 grayscale' : ''}`}>
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h2 className="font-bold text-gray-800">2. Pago de Contenido CHE</h2>
                            <p className="text-green-600 font-bold">$25.00 USD {tasaCambio && `≈ ${(25 * tasaCambio).toLocaleString()} ${monedaLocal}`}</p>
                        </div>
                        {pasoCheCompletado && <span className="bg-green-100 text-green-700 text-xs py-1 px-3 rounded-full font-bold">✓ RECIBIDO</span>}
                    </div>

                    {!pasoCheCompletado && pasoX0Completado && (
                        <div className="space-y-4">
                            <div className="bg-gray-50 p-4 rounded-xl space-y-2">
                                {cheMetodos.map((m, i) => (
                                    <div key={i} className="bg-white p-3 rounded-lg text-sm border border-gray-200">
                                        <p className="font-bold text-gray-800">{m.tipo}</p>
                                        <p className="text-gray-600 break-all">{m.identificador}</p>
                                        {m.nombre_titular && <p className="text-[10px] text-gray-400 uppercase">{m.nombre_titular}</p>}
                                    </div>
                                ))}
                            </div>

                            <div className="relative overflow-hidden border-2 border-dashed border-green-200 rounded-2xl p-8 text-center bg-green-50/30">
                                <input 
                                    type="file" 
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                    accept="image/*"
                                    onChange={(e) => e.target.files?.[0] && handleUploadComprobante('che', e.target.files[0])}
                                />
                                <div className="relative z-0">
                                    <span className="text-3xl">🧾</span>
                                    <p className="text-sm font-bold text-green-700 mt-2">Toca aquí para subir el comprobante</p>
                                    {uploadingChe && <div className="mt-2 animate-pulse text-green-600 font-bold">Subiendo...</div>}
                                </div>
                            </div>
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}