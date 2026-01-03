'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

// --- INTERFACES DE LOGICA DE NEGOCIO ---
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
            if (!user) { router.push('/'); return; }

            const codigoRef = searchParams.get('ref');
            if (!user.id) throw new Error("ID de usuario no disponible.");

            const { data: activacionData, error: actError } = await supabase
                .from('user_kit2_activaciones')
                .select('*')
                .eq('user_id', user.id)
                .maybeSingle();

            if (actError) throw actError;

            let benefactorIdParaMetodos: string | null = null;

            if (!activacionData) {
                const { data: kit2Instance } = await supabase
                    .from('kit2_instances')
                    .select('id, user_id, beneficiario_asignado_id, codigo_unico')
                    .eq('codigo_unico', codigoRef)
                    .single();

                if (!kit2Instance) {
                    setError('Código de referencia inválido.');
                    setLoading(false);
                    return;
                }

                const { data: inv } = await supabase.from('users').select('id, email, nombre').eq('id', kit2Instance.user_id).single();
                const { data: ben } = await supabase.from('users').select('id, email, nombre, pais').eq('id', kit2Instance.beneficiario_asignado_id).single();

                if (!inv || !ben) {
                    setError('No se encontró información del invitador o benefactor.');
                    setLoading(false);
                    return;
                }

                const { data: nueva } = await supabase.from('user_kit2_activaciones').insert({
                    user_id: user.id,
                    codigo_referencia: codigoRef,
                    kit2_instance_id: kit2Instance.id,
                    invitador_user_id: kit2Instance.user_id,
                    benefactor_user_id: kit2Instance.beneficiario_asignado_id,
                    estado: 'pago_x0_pendiente',
                    paso_actual: 'pago_x0'
                }).select().single();

                benefactorIdParaMetodos = kit2Instance.beneficiario_asignado_id;

                setActivacion({ ...nueva,
                    invitador: { email: inv.email, user_profiles: { nombre_completo: inv.nombre }},
                    benefactor: { email: ben.email, pais: ben.pais, user_profiles: { nombre_completo: ben.nombre }}
                } as ActivacionData);
            } else {
                const { data: inv } = await supabase.from('users').select('email, nombre').eq('id', activacionData.invitador_user_id).single();
                const { data: ben } = await supabase.from('users').select('email, nombre, pais').eq('id', activacionData.benefactor_user_id).single();

                if (!inv || !ben) {
                    setError('No se encontró información del invitador o benefactor.');
                    setLoading(false);
                    return;
                }

                benefactorIdParaMetodos = activacionData.benefactor_user_id;

                setActivacion({ ...activacionData,
                    invitador: { email: inv.email, user_profiles: { nombre_completo: inv.nombre }},
                    benefactor: { email: ben.email, pais: ben.pais, user_profiles: { nombre_completo: ben.nombre }}
                } as ActivacionData);
            }

            // Cargar métodos de pago del benefactor
            if (benefactorIdParaMetodos) {
                const { data: met } = await supabase.from('user_metodos_pago').select('*').eq('user_id', benefactorIdParaMetodos);
                setBenefactorMetodos(met || []);
            }

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
        try {
            const { data: { user } } = await supabase.auth.getUser();
            const filename = `${user?.id}_${tipo}_${Date.now()}`;
            await supabase.storage.from('comprobantes-pago').upload(filename, file);
            const { data: { publicUrl } } = supabase.storage.from('comprobantes-pago').getPublicUrl(filename);

            const updateData = tipo === 'x0'
                ? { pago_x0_comprobante_url: publicUrl, estado: 'pago_x0_verificado', paso_actual: 'pago_che' }
                : { pago_che_comprobante_url: publicUrl, estado: 'activo', fecha_activacion: new Date().toISOString() };

            await supabase.from('user_kit2_activaciones').update(updateData).eq('id', activacion.id);

            if (tipo === 'che') {
                await fetch('/api/email/enviar-kit2', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ activacion_id: activacion.id }) });
                router.push('/kit2/exito');
            } else {
                await cargarDatos();
            }
        } catch (err) { setError('Error al subir comprobante'); }
        finally { setUploadingX0(false); setUploadingChe(false); }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center">Cargando sistema de pagos...</div>;

    const pasoX0Completado = activacion?.estado !== 'pago_x0_pendiente';

    return (
        <div className="min-h-screen bg-slate-50 py-10 px-4">
            <div className="max-w-3xl mx-auto space-y-8">

                {/* CABECERA CORPORATIVA */}
                <div className="bg-white rounded-3xl shadow-xl p-8 text-center border border-slate-100">
                    <div className="text-6xl mb-4">🌳</div>
                    <h1 className="text-4xl font-black text-slate-800 tracking-tight italic">ACTIVA TU KIT2</h1>
                    <p className="text-slate-500 mt-2 text-lg">Invitación de: <span className="text-blue-600 font-bold">{activacion?.invitador?.user_profiles?.nombre_completo}</span></p>
                </div>

                {error && <div className="bg-red-100 border-l-4 border-red-500 p-4 text-red-700 font-bold rounded-r-xl">{error}</div>}

                {/* PASO 1: BENEFACTOR (DISEÑO TACTIL Y DIVISAS) */}
                <div className={`bg-white rounded-[2.5rem] shadow-2xl p-8 border-4 transition-all ${!pasoX0Completado ? 'border-blue-500 scale-100' : 'border-transparent opacity-80'}`}>
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-black text-slate-800 italic uppercase">Paso 1: Pago al Benefactor</h2>
                        {pasoX0Completado && <span className="bg-green-500 text-white px-6 py-2 rounded-full font-black text-sm">✓ RECIBIDO</span>}
                    </div>

                    {!pasoX0Completado && (
                        <div className="space-y-6">
                            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-8 text-center shadow-lg transform transition-transform hover:scale-[1.02]">
                                <p className="text-white/80 text-xs font-black uppercase tracking-widest mb-2">Monto Requerido</p>
                                <p className="text-white text-5xl font-black">$10.00 USD</p>
                                {tasaCambio && (
                                    <div className="mt-4 bg-yellow-400/20 py-3 rounded-2xl border border-yellow-400/30">
                                        <p className="text-yellow-300 font-black text-2xl">
                                            ≈ $ {(10 * tasaCambio).toLocaleString()} {monedaLocal}
                                        </p>
                                        <p className="text-white/60 text-[10px] uppercase mt-1">Conversión automática del sistema</p>
                                    </div>
                                )}
                            </div>

                            <div className="bg-slate-50 rounded-3xl p-6 border border-slate-200">
                                <p className="font-black text-slate-700 mb-4 uppercase text-sm">Cuentas Autorizadas de {activacion?.benefactor?.user_profiles?.nombre_completo}:</p>
                                <div className="grid grid-cols-1 gap-4">
                                    {benefactorMetodos.map((m, i) => (
                                        <div key={i} className="bg-white p-5 rounded-2xl border-2 border-slate-100 flex justify-between items-center shadow-sm">
                                            <div>
                                                <p className="text-[10px] text-blue-500 font-black uppercase tracking-tighter">{m.tipo}</p>
                                                <p className="text-xl font-mono font-bold text-slate-800">{m.identificador}</p>
                                            </div>
                                            <span className="text-3xl grayscale-[0.5]">{m.categoria === 'digital' ? '💳' : '🏦'}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* BOTÓN GIGANTE DE SUBIDA PASO 1 */}
                            <div
                                onClick={() => document.getElementById('file-upload-x0')?.click()}
                                className="w-full bg-blue-50 hover:bg-blue-100 border-4 border-dashed border-blue-400 p-12 rounded-[2rem] text-center cursor-pointer transition-all active:scale-95 group shadow-inner"
                            >
                                <div className="text-7xl mb-4 group-hover:scale-110 transition-transform">📸</div>
                                <p className="text-2xl font-black text-blue-700 italic uppercase">Toca para subir comprobante</p>
                                <p className="text-blue-500 font-bold opacity-70">Cámara o Galería</p>
                                {uploadingX0 && <div className="mt-4 font-black text-blue-600 animate-pulse text-xl">PROCESANDO...</div>}
                                <input id="file-upload-x0" type="file" className="hidden" accept="image/*,.pdf" onChange={(e) => e.target.files?.[0] && handleUploadComprobante('x0', e.target.files[0])} />
                            </div>
                        </div>
                    )}
                </div>

                {/* PASO 2: CORPORACIÓN CHE (DISEÑO TACTIL Y DIVISAS) */}
                <div className={`bg-white rounded-[2.5rem] shadow-2xl p-8 border-4 transition-all ${pasoX0Completado && !uploadingChe ? 'border-green-500' : 'opacity-40 pointer-events-none'}`}>
                    <h2 className="text-2xl font-black text-slate-800 italic uppercase mb-6">Paso 2: Pago a Corporación CHE</h2>

                    {pasoX0Completado && (
                        <div className="space-y-6">
                            <div className="bg-gradient-to-br from-green-600 to-emerald-700 rounded-3xl p-8 text-center shadow-lg">
                                <p className="text-white/80 text-xs font-black uppercase tracking-widest mb-2">Monto Kit2 Completo</p>
                                <p className="text-white text-5xl font-black">$25.00 USD</p>
                                {tasaCambio && (
                                    <div className="mt-4 bg-white/10 py-3 rounded-2xl">
                                        <p className="text-white font-black text-2xl">
                                            ≈ $ {(25 * tasaCambio).toLocaleString()} {monedaLocal}
                                        </p>
                                    </div>
                                )}
                            </div>

                            <div className="bg-slate-50 rounded-3xl p-6 border border-slate-200">
                                <p className="font-black text-slate-700 mb-4 uppercase text-sm italic">Cuentas Corporativas CHE:</p>
                                <div className="space-y-3">
                                    {cheMetodos.map((m, i) => (
                                        <div key={i} className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200">
                                            <span className="font-black text-slate-600 uppercase text-xs">{m.tipo}:</span>
                                            <span className="font-bold text-slate-800">{m.identificador}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* BOTÓN GIGANTE DE SUBIDA PASO 2 */}
                            <div
                                onClick={() => document.getElementById('file-upload-che')?.click()}
                                className="w-full bg-green-600 hover:bg-green-700 p-12 rounded-[2rem] text-center cursor-pointer shadow-2xl transition-all active:scale-95 group"
                            >
                                <div className="text-7xl mb-4 group-hover:rotate-12 transition-transform">🚀</div>
                                <p className="text-2xl font-black text-white italic uppercase tracking-tight">Finalizar y activar Kit2</p>
                                <p className="text-white/80 font-bold">Sube el comprobante de $25 aquí</p>
                                {uploadingChe && <div className="mt-4 font-black text-white animate-bounce text-xl">ACTIVANDO...</div>}
                                <input id="file-upload-che" type="file" className="hidden" accept="image/*,.pdf" onChange={(e) => e.target.files?.[0] && handleUploadComprobante('che', e.target.files[0])} />
                            </div>
                        </div>
                    )}
                </div>

                {/* PIE DE PÁGINA SEGURIDAD */}
                <div className="bg-slate-900 rounded-3xl p-8 text-white text-center shadow-2xl">
                    <p className="text-[10px] uppercase tracking-[0.4em] font-black text-blue-400 mb-2">Transacción Segura y Encriptada</p>
                    <p className="text-xs opacity-40 font-medium">Corporación Herejía Económica © 2026 - Gestión Global de Kit2</p>
                </div>
            </div>
        </div>
    );
}
