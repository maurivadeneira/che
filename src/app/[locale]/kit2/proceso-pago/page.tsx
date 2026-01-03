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
    
    // Estados de carga separados para feedback visual
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
            const moneda = geoData.currency || 'USD';
            
            setPaisUsuario(geoData.country_name || '');
            setMonedaLocal(moneda);
            
            if (moneda !== 'USD') {
                const rateResponse = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
                const rateData = await rateResponse.json();
                setTasaCambio(rateData.rates[moneda]);
            }
        } catch (error) {
            console.error('Error tasa cambio:', error);
        }
    };

    const cargarDatos = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return router.push('/');

            const codigoRef = searchParams.get('ref');
            if (!user.id) throw new Error("ID usuario no disponible.");
            
            // 1. Buscar activación existente
            const { data: actData, error: actError } = await supabase
                .from('user_kit2_activaciones')
                .select('*')
                .eq('user_id', user.id)
                .maybeSingle();

            if (actError) throw actError;

            // Si ya está activo, mandar al éxito
            if (actData?.estado === 'activo') {
                router.push('/es/kit2/exito');
                return;
            }

            let currentAct = actData;

            // 2. Si no existe, crearla
            if (!actData) {
                if (!codigoRef) throw new Error("Falta código de referencia");

                const { data: kitInst } = await supabase
                    .from('kit2_instances')
                    .select('id, user_id, beneficiario_asignado_id')
                    .eq('codigo_unico', codigoRef)
                    .single();

                if (!kitInst) {
                    setError('Código de referencia inválido.');
                    setLoading(false);
                    return;
                }

                const { data: nueva } = await supabase
                    .from('user_kit2_activaciones')
                    .insert({
                        user_id: user.id,
                        codigo_referencia: codigoRef,
                        kit2_instance_id: kitInst.id,
                        invitador_user_id: kitInst.user_id,
                        benefactor_user_id: kitInst.beneficiario_asignado_id,
                        estado: 'pago_x0_pendiente',
                        paso_actual: 'pago_x0'
                    })
                    .select()
                    .single();
                currentAct = nueva;
            }

            // 3. Cargar datos relacionales (Invitador, Benefactor, Métodos)
            const [inv, ben, metodos] = await Promise.all([
                supabase.from('users').select('email, nombre').eq('id', currentAct.invitador_user_id).single(),
                supabase.from('users').select('email, nombre, pais').eq('id', currentAct.benefactor_user_id).single(),
                supabase.from('user_metodos_pago').select('*').eq('user_id', currentAct.benefactor_user_id)
            ]);

            setActivacion({
                ...currentAct,
                invitador: { email: inv.data?.email, user_profiles: { nombre_completo: inv.data?.nombre } },
                benefactor: { email: ben.data?.email, pais: ben.data?.pais, user_profiles: { nombre_completo: ben.data?.nombre } }
            });

            setBenefactorMetodos(metodos.data || []);
            
            // Métodos fijos de la Corporación
            setCheMetodos([
                { tipo: 'PayPal', identificador: 'maurivadeneira@yahoo.es', categoria: 'digital' },
                { tipo: 'Nequi', identificador: '3045558862', categoria: 'digital' }
            ]);

            setLoading(false);

        } catch (err: any) {
            console.error(err);
            setError(err.message || 'Error cargando información');
            setLoading(false);
        }
    };

    const handleUploadComprobante = async (tipo: 'x0' | 'che', file: File) => {
        if (!activacion?.id) return;
        
        if (tipo === 'x0') setUploadingX0(true);
        else setUploadingChe(true);
        
        setError('');

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('No autenticado');
            
            // 1. Subir archivo
            const filename = `${user.id}_${tipo}_${Date.now()}`;
            const { error: upErr } = await supabase.storage.from('comprobantes-pago').upload(filename, file);
            if (upErr) throw upErr;

            const { data: { publicUrl } } = supabase.storage.from('comprobantes-pago').getPublicUrl(filename);

            // 2. Preparar actualización DB
            const updateData = tipo === 'x0' 
                ? { 
                    pago_x0_comprobante_url: publicUrl, 
                    estado: 'pago_x0_verificado', 
                    paso_actual: 'pago_che',
                    pago_x0_fecha_subida: new Date().toISOString()
                  }
                : { 
                    pago_che_comprobante_url: publicUrl, 
                    estado: 'activo', 
                    fecha_activacion: new Date().toISOString() 
                  };

            const { error: dbErr } = await supabase
                .from('user_kit2_activaciones')
                .update(updateData)
                .eq('id', activacion.id);

            if (dbErr) throw dbErr;

            // 3. Acciones finales
            if (tipo === 'che') {
                // Disparar envío de Kit2 (Tu lógica original)
                try {
                    await fetch('/api/email/enviar-kit2', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ activacion_id: activacion.id })
                    });
                } catch (e) { console.error('Error trigger email:', e); }

                // REDIRECCIÓN INMEDIATA AL ÉXITO
                router.push('/es/kit2/exito');
            } else {
                // Recargar para mostrar paso 2
                await cargarDatos();
            }

        } catch (err: any) {
            console.error(err);
            setError(err.message || 'Error al subir. Intenta de nuevo.');
        } finally {
            setUploadingX0(false);
            setUploadingChe(false);
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-10 w-10 border-green-500 border-t-2"></div></div>;

    const pasoX0Completado = activacion?.estado !== 'pago_x0_pendiente';
    const pasoCheCompletado = activacion?.estado === 'activo';

    return (
        <div className="min-h-screen bg-gray-50 py-10 px-4">
            <div className="max-w-2xl mx-auto space-y-8">
                
                <header className="text-center">
                    <h1 className="text-3xl font-bold text-gray-800">Activación Kit2</h1>
                    <p className="text-gray-500">Invitado por: <span className="font-semibold">{activacion?.invitador?.user_profiles?.nombre_completo}</span></p>
                </header>

                {error && <div className="bg-red-50 text-red-600 p-4 rounded-xl text-center">{error}</div>}

                {/* --- PASO 1: BENEFACTOR --- */}
                <div className={`bg-white rounded-3xl p-6 shadow-sm border-2 transition-all ${pasoX0Completado ? 'border-green-500' : 'border-blue-500'}`}>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-bold text-gray-800">1. Pago Benefactor ($10)</h2>
                        {pasoX0Completado && <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">✓ COMPLETADO</span>}
                    </div>

                    {!pasoX0Completado && (
                        <div className="space-y-4">
                            <div className="bg-blue-50 p-4 rounded-xl text-sm space-y-2">
                                <p className="font-bold text-blue-900">Datos de {activacion?.benefactor?.user_profiles?.nombre_completo}:</p>
                                {benefactorMetodos.map((m, i) => (
                                    <div key={i} className="bg-white p-2 rounded border border-blue-100">
                                        <span className="font-bold">{m.tipo}:</span> {m.identificador}
                                    </div>
                                ))}
                            </div>

                            {/* BOTÓN "TODO TERRENO" PARA MÓVILES */}
                            <div className="relative h-40 w-full border-4 border-dashed border-blue-200 rounded-[32px] bg-blue-50/50 flex flex-col items-center justify-center overflow-hidden transition-all active:scale-95">
                                <input 
                                    type="file" 
                                    accept="image/*"
                                    className="absolute inset-0 opacity-0 z-30 cursor-pointer w-full h-full" 
                                    disabled={uploadingX0}
                                    onChange={(e) => e.target.files?.[0] && handleUploadComprobante('x0', e.target.files[0])} 
                                />
                                <div className="text-center z-10 pointer-events-none">
                                    <span className="text-4xl mb-2 block">📸</span>
                                    <p className="text-sm font-bold text-blue-700 uppercase px-4">
                                        {uploadingX0 ? 'SUBIENDO...' : 'TOCA AQUÍ PARA SUBIR FOTO'}
                                    </p>
                                    {!uploadingX0 && <p className="text-[10px] text-blue-500 mt-1">Abre cámara o galería</p>}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* --- PASO 2: CORPORACIÓN --- */}
                <div className={`bg-white rounded-3xl p-6 shadow-sm border-2 transition-all ${!pasoX0Completado ? 'opacity-50 grayscale' : 'border-green-500'}`}>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-bold text-gray-800">2. Pago CHE ($25)</h2>
                        {pasoCheCompletado && <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">✓ COMPLETADO</span>}
                    </div>

                    {pasoX0Completado && !pasoCheCompletado && (
                        <div className="space-y-4">
                            <div className="bg-green-50 p-4 rounded-xl text-sm space-y-2">
                                <p className="font-bold text-green-900">Cuentas Corporativas:</p>
                                {cheMetodos.map((m, i) => (
                                    <div key={i} className="bg-white p-2 rounded border border-green-100">
                                        <span className="font-bold">{m.tipo}:</span> {m.identificador}
                                    </div>
                                ))}
                            </div>

                            {/* BOTÓN "TODO TERRENO" VERDE */}
                            <div className="relative h-40 w-full border-4 border-dashed border-green-200 rounded-[32px] bg-green-50/50 flex flex-col items-center justify-center overflow-hidden transition-all active:scale-95">
                                <input 
                                    type="file" 
                                    accept="image/*"
                                    className="absolute inset-0 opacity-0 z-30 cursor-pointer w-full h-full" 
                                    disabled={uploadingChe}
                                    onChange={(e) => e.target.files?.[0] && handleUploadComprobante('che', e.target.files[0])} 
                                />
                                <div className="text-center z-10 pointer-events-none">
                                    <span className="text-4xl mb-2 block">🧾</span>
                                    <p className="text-sm font-bold text-green-700 uppercase px-4">
                                        {uploadingChe ? 'PROCESANDO...' : 'TOCA AQUÍ PARA PAGO FINAL'}
                                    </p>
                                    {!uploadingChe && <p className="text-[10px] text-green-500 mt-1">Generará tu Kit2 Automáticamente</p>}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}