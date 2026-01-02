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
    const [paisUsuario, setPaisUsuario] = useState<string>('');

    useEffect(() => {
        cargarDatos();
        obtenerTasaCambio();
    }, []);

    const obtenerTasaCambio = async () => {
        try {
            const geoResponse = await fetch('https://ipapi.co/json/');
            const geoData = await geoResponse.json();
            const pais = geoData.country_name || '';
            const moneda = geoData.currency || 'USD';
            
            setPaisUsuario(pais);
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
            if (!user.id) throw new Error("ID de usuario no disponible.");
            
            const { data: activacionData, error: actError } = await supabase
                .from('user_kit2_activaciones')
                .select('*')
                .eq('user_id', user.id)
                .eq('codigo_referencia', codigoRef)
                .maybeSingle();

            if (actError) throw actError;

            let currentAct = activacionData;

            if (!activacionData) {
                const { data: kit2Instance, error: kit2Error } = await supabase
                    .from('kit2_instances')
                    .select('id, user_id, beneficiario_asignado_id')
                    .eq('codigo_unico', codigoRef)
                    .single();

                if (kit2Error || !kit2Instance) {
                    setError('Código de referencia inválido.');
                    setLoading(false);
                    return;
                }

                const { data: nuevaActivacion, error: createError } = await supabase
                    .from('user_kit2_activaciones')
                    .insert({
                        user_id: user.id,
                        codigo_referencia: codigoRef,
                        kit2_instance_id: kit2Instance.id,
                        invitador_user_id: kit2Instance.user_id,
                        benefactor_user_id: kit2Instance.beneficiario_asignado_id,
                        estado: 'pago_x0_pendiente',
                        paso_actual: 'pago_x0'
                    })
                    .select()
                    .single();

                if (createError) throw createError;
                currentAct = nuevaActivacion;
            }

            // Cargar perfiles relacionados
            const { data: invData } = await supabase.from('users').select('email, nombre').eq('id', currentAct.invitador_user_id).single();
            const { data: benData } = await supabase.from('users').select('email, nombre, pais').eq('id', currentAct.benefactor_user_id).single();

            setActivacion({
                ...currentAct,
                invitador: { email: invData?.email || '', user_profiles: { nombre_completo: invData?.nombre || '' } },
                benefactor: { email: benData?.email || '', pais: benData?.pais || '', user_profiles: { nombre_completo: benData?.nombre || '' } }
            });

            // Cargar métodos
            const { data: mBen } = await supabase.from('user_metodos_pago').select('*').eq('user_id', currentAct.benefactor_user_id);
            if (mBen) setBenefactorMetodos(mBen as MetodoPago[]);

            setCheMetodos([
                { tipo: 'PayPal', identificador: 'maurivadeneira@yahoo.es', categoria: 'digital' },
                { tipo: 'Nequi', identificador: '3045558862', categoria: 'digital' }
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
        setError('');

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('No auth');
            
            const filename = `${user.id}_${tipo}_${Date.now()}`;
            const { error: upErr } = await supabase.storage.from('comprobantes-pago').upload(filename, file);
            if (upErr) throw upErr;

            const { data: { publicUrl } } = supabase.storage.from('comprobantes-pago').getPublicUrl(filename);

            const updateData = tipo === 'x0' 
                ? { pago_x0_comprobante_url: publicUrl, estado: 'pago_x0_verificado', paso_actual: 'pago_che' }
                : { pago_che_comprobante_url: publicUrl, estado: 'activo' };

            await supabase.from('user_kit2_activaciones').update(updateData).eq('id', activacion.id);
            await cargarDatos();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setUploadingX0(false);
            setUploadingChe(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
        </div>
    );

    const pasoX0Completado = activacion?.estado !== 'pago_x0_pendiente';
    const pasoCheCompletado = activacion?.estado === 'activo';

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-xl mx-auto">
                
                {/* CABECERA */}
                <div className="bg-white rounded-2xl shadow-sm p-6 mb-6 text-center">
                    <span className="text-4xl">🌱</span>
                    <h1 className="text-2xl font-bold text-gray-800 mt-2">Finaliza tu Activación</h1>
                    <p className="text-gray-500 text-sm">Invitado por {activacion?.invitador?.user_profiles?.nombre_completo}</p>
                </div>

                {error && <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 text-sm border border-red-100">{error}</div>}

                {/* PASO 1: BENEFACTOR */}
                <section className={`bg-white rounded-2xl shadow-sm p-6 mb-6 border-2 ${!pasoX0Completado ? 'border-blue-500' : 'border-transparent'}`}>
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h2 className="font-bold text-lg text-gray-800">1. Pago de Agradecimiento</h2>
                            <p className="text-green-600 font-bold">$10.00 USD 
                                {tasaCambio && ` ≈ ${(10 * tasaCambio).toLocaleString()} ${monedaLocal}`}
                            </p>
                        </div>
                        {pasoX0Completado && <span className="bg-green-100 text-green-700 text-xs py-1 px-3 rounded-full font-bold">✓ RECIBIDO</span>}
                    </div>

                    {!pasoX0Completado && (
                        <div className="space-y-4">
                            <div className="bg-blue-50 p-4 rounded-xl">
                                <p className="text-xs text-blue-700">Paga a <strong>{activacion?.benefactor?.user_profiles?.nombre_completo}</strong> usando:</p>
                                <div className="mt-3 space-y-2">
                                    {benefactorMetodos.map((m, i) => (
                                        <div key={i} className="bg-white p-3 rounded-lg text-sm border border-blue-100">
                                            <p className="font-bold">{m.tipo}</p>
                                            <p className="text-gray-600 select-all">{m.identificador}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* UPLOAD AREA */}
                            <div 
                                onClick={() => document.getElementById('fileX0')?.click()}
                                className="border-2 border-dashed border-gray-200 rounded-2xl p-8 text-center bg-gray-50 active:bg-blue-50 transition-colors cursor-pointer"
                            >
                                <input id="fileX0" type="file" className="hidden" accept="image/*,application/pdf" onChange={(e) => e.target.files?.[0] && handleUploadComprobante('x0', e.target.files[0])} />
                                <span className="text-3xl">📸</span>
                                <p className="text-sm font-bold text-gray-700 mt-2">Toca aquí para subir el comprobante</p>
                                <p className="text-xs text-gray-400 mt-1">Foto de la pantalla o Galería</p>
                                {uploadingX0 && <div className="mt-2 animate-pulse text-blue-600 font-bold text-xs">Subiendo archivo...</div>}
                            </div>
                        </div>
                    )}
                </section>

                {/* PASO 2: CHE */}
                <section className={`bg-white rounded-2xl shadow-sm p-6 mb-6 border-2 ${pasoX0Completado && !pasoCheCompletado ? 'border-blue-500' : 'border-transparent'} ${!pasoX0Completado ? 'opacity-40 pointer-events-none' : ''}`}>
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h2 className="font-bold text-lg text-gray-800">2. Pago de Contenido CHE</h2>
                            <p className="text-green-600 font-bold">$25.00 USD 
                                {tasaCambio && ` ≈ ${(25 * tasaCambio).toLocaleString()} ${monedaLocal}`}
                            </p>
                        </div>
                        {pasoCheCompletado && <span className="bg-green-100 text-green-700 text-xs py-1 px-3 rounded-full font-bold">✓ RECIBIDO</span>}
                    </div>

                    {!pasoCheCompletado && pasoX0Completado && (
                        <div className="space-y-4">
                            <div className="bg-blue-50 p-4 rounded-xl">
                                <p className="text-xs text-blue-700">Cuentas oficiales de la Corporación:</p>
                                <div className="mt-3 space-y-2">
                                    {cheMetodos.map((m, i) => (
                                        <div key={i} className="bg-white p-3 rounded-lg text-sm border border-blue-100">
                                            <p className="font-bold">{m.tipo}</p>
                                            <p className="text-gray-600 select-all">{m.identificador}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div 
                                onClick={() => document.getElementById('fileChe')?.click()}
                                className="border-2 border-dashed border-gray-200 rounded-2xl p-8 text-center bg-gray-50 active:bg-blue-50 transition-colors cursor-pointer"
                            >
                                <input id="fileChe" type="file" className="hidden" accept="image/*,application/pdf" onChange={(e) => e.target.files?.[0] && handleUploadComprobante('che', e.target.files[0])} />
                                <span className="text-3xl">🧾</span>
                                <p className="text-sm font-bold text-gray-700 mt-2">Toca aquí para subir el comprobante</p>
                                <p className="text-xs text-gray-400 mt-1">Sube el pago de los $25 USD</p>
                                {uploadingChe && <div className="mt-2 animate-pulse text-blue-600 font-bold text-xs">Subiendo archivo...</div>}
                            </div>
                        </div>
                    )}
                </section>

                <p className="text-center text-xs text-gray-400 px-8">
                    Una vez subidos, nuestro sistema verificará los pagos y recibirás tu Kit2 por correo electrónico.
                </p>
            </div>
        </div>
    );
}