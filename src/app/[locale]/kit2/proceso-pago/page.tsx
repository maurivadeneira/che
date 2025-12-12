'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

// --- NUEVAS INTERFACES PARA TIPADO (CORRECCIÓN) ---

// Define la estructura de un método de pago, basada en cómo se usa en el código.
interface MetodoPago {
    tipo: string;
    identificador: string;
    categoria: 'digital' | 'banco';
    nombre_titular?: string; 
}

// Define la estructura para el perfil de usuario anidado en la activación.
interface UserProfile {
    nombre_completo: string | null;
    telefono?: string | null;
}

// Define la estructura para las relaciones de usuario (Invitador/Benefactor).
interface UserRelation {
    email: string;
    user_profiles: UserProfile | null;
}

// Define la estructura principal de los datos de la Activación.
// Es crucial para tipar el estado 'activacion'.
interface ActivacionData {
    id: string; 
    estado: string; // Ej: 'pago_x0_pendiente', 'pago_che_subido', 'activo'
    paso_actual: string; 
    invitador: UserRelation;
    benefactor: UserRelation; // Simplificado, pero cubre los campos usados
    pago_x0_comprobante_url: string | null;
    pago_che_comprobante_url: string | null;
    benefactor_user_id: string; // Necesario para la carga de métodos
    // ... otros campos que pueda tener la tabla user_kit2_activaciones
}

// --- FIN INTERFACES ---

export default function ProcesoPagoPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const supabase = createClientComponentClient();
    
    const [loading, setLoading] = useState(true);
    // CORRECCIÓN 1: Tipado del estado 'activacion'
    const [activacion, setActivacion] = useState<ActivacionData | null>(null);
    // CORRECCIÓN 2: Tipado del estado 'benefactorMetodos'
    const [benefactorMetodos, setBenefactorMetodos] = useState<MetodoPago[]>([]);
    // CORRECCIÓN 3: Tipado del estado 'cheMetodos'
    const [cheMetodos, setCheMetodos] = useState<MetodoPago[]>([]);
    const [uploadingX0, setUploadingX0] = useState(false);
    const [uploadingChe, setUploadingChe] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        cargarDatos();
    }, []);

    const cargarDatos = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.push('/');
                return;
            }

            const codigoRef = searchParams.get('ref');
            
            // 4. CORRECCIÓN de aserción: Asegurarse que user.id no es null/undefined
            if (!user.id) {
                throw new Error("ID de usuario no disponible.");
            }
            
            const { data: activacionData, error: actError } = await supabase
    .from('user_kit2_activaciones')
    .select('*')
    .eq('user_id', user.id)
    .eq('codigo_referencia', codigoRef)
    .maybeSingle();

            if (actError) throw actError;
            // Aserción de tipo para usar ActivacionData
            setActivacion(activacionData as ActivacionData);

            // 5. CORRECCIÓN de lógica: Usar el ID de benefactor de la data recién cargada
            const benefactorId = (activacionData as ActivacionData).benefactor_user_id;

            // Temporal - métodos vacíos hasta que haya usuarios reales
setBenefactorMetodos([]);

            // El array de cheMetodos ya tenía el tipo correcto inferido de MetodoPago
            setCheMetodos([
                {
                    tipo: 'PayPal',
                    identificador: 'che@corpherejiaeconomica.com',
                    categoria: 'digital'
                },
                {
                    tipo: 'Bancolombia',
                    identificador: '12345678901',
                    nombre_titular: 'Corporación Herejía Económica',
                    categoria: 'banco'
                }
            ]);

            setLoading(false);
        } catch (err: any) {
            console.error('Error cargando datos:', err);
            setError(err.message || 'Error cargando información');
            setLoading(false);
        }
    };

    // CORRECCIÓN 7: Tipado de parámetros 'tipo' y 'file'
    const handleUploadComprobante = async (tipo: 'x0' | 'che', file: File) => {
        if (!activacion || !activacion.id) {
             setError('Error: Datos de activación incompletos.');
             return;
        }

        if (tipo === 'x0') setUploadingX0(true);
        else setUploadingChe(true);
        
        setError('');

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('Usuario no autenticado.');
            
            const filename = `${user.id}_${tipo}_${Date.now()}_${file.name}`;
            const { data, error: uploadError } = await supabase.storage
                .from('comprobantes-pago')
                .upload(filename, file);

            if (uploadError) throw uploadError;

            // La obtención de la URL pública también puede ser tipada
            const { data: { publicUrl } } = supabase.storage
                .from('comprobantes-pago')
                .getPublicUrl(filename);

            const updateData = tipo === 'x0' 
                ? {
                    pago_x0_comprobante_url: publicUrl,
                    pago_x0_fecha_subida: new Date().toISOString(),
                    estado: 'pago_x0_subido',
                    paso_actual: 'pago_che'
                }
                : {
                    pago_che_comprobante_url: publicUrl,
                    pago_che_fecha_subida: new Date().toISOString(),
                    estado: 'pago_che_subido',
                    paso_actual: 'verificacion'
                };

            const { error: updateError } = await supabase
                .from('user_kit2_activaciones')
                .update(updateData)
                .eq('id', activacion.id);

            if (updateError) throw updateError;

            await cargarDatos();
            
            if (tipo === 'che') {
                router.push('/kit2/verificacion');
            }

        } catch (err: any) {
            console.error('Error subiendo comprobante:', err);
            setError(err.message || 'Error al subir el comprobante. Intenta de nuevo.');
        } finally {
            setUploadingX0(false);
            setUploadingChe(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Cargando información...</p>
                </div>
            </div>
        );
    }

    const pasoX0Completado = activacion?.estado !== 'pago_x0_pendiente';
    const pasoCheCompletado = activacion?.estado === 'pago_che_subido' || 
                                activacion?.estado === 'verificacion_completa' || 
                                activacion?.estado === 'activo';

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12 px-4">
            <div className="max-w-3xl mx-auto">
                
                <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                    <div className="text-center">
                        <div className="text-5xl mb-4">🌳</div>
                        <h1 className="text-2xl font-bold text-gray-800 mb-2">
                            Activa tu Kit2
                        </h1>
                        <p className="text-gray-600">
                            Invitado por: <strong>{activacion?.invitador?.user_profiles?.nombre_completo}</strong>
                        </p>
                    </div>

                    <div className="mt-6 flex items-center justify-between">
                        <div className={`flex-1 text-center ${pasoX0Completado ? 'text-green-600' : 'text-blue-600'}`}>
                            <div className={`w-10 h-10 rounded-full mx-auto mb-2 flex items-center justify-center ${
                                pasoX0Completado ? 'bg-green-500' : 'bg-blue-500'
                            } text-white font-bold`}>
                                {pasoX0Completado ? '✓' : '1'}
                            </div>
                            <p className="text-xs font-medium">Pago a Benefactor</p>
                        </div>
                        <div className={`flex-1 border-t-2 ${pasoX0Completado ? 'border-green-500' : 'border-gray-300'}`}></div>
                        <div className={`flex-1 text-center ${pasoCheCompletado ? 'text-green-600' : pasoX0Completado ? 'text-blue-600' : 'text-gray-400'}`}>
                            <div className={`w-10 h-10 rounded-full mx-auto mb-2 flex items-center justify-center ${
                                pasoCheCompletado ? 'bg-green-500' : pasoX0Completado ? 'bg-blue-500' : 'bg-gray-300'
                            } text-white font-bold`}>
                                {pasoCheCompletado ? '✓' : '2'}
                            </div>
                            <p className="text-xs font-medium">Pago a CHE</p>
                        </div>
                        <div className={`flex-1 border-t-2 ${pasoCheCompletado ? 'border-green-500' : 'border-gray-300'}`}></div>
                        <div className={`flex-1 text-center ${pasoCheCompletado ? 'text-blue-600' : 'text-gray-400'}`}>
                            <div className={`w-10 h-10 rounded-full mx-auto mb-2 flex items-center justify-center ${
                                pasoCheCompletado ? 'bg-blue-500' : 'bg-gray-300'
                            } text-white font-bold`}>
                                3
                            </div>
                            <p className="text-xs font-medium">Verificación</p>
                        </div>
                    </div>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                        <p className="text-red-600">{error}</p>
                    </div>
                )}

                <div className={`bg-white rounded-lg shadow-lg p-6 mb-6 ${!pasoX0Completado ? 'ring-2 ring-blue-500' : ''}`}>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-gray-800">
                            Paso 1: Pagar $10 a tu Benefactor
                        </h2>
                        {pasoX0Completado && (
                            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                                ✓ Completado
                            </span>
                        )}
                    </div>

                    {!pasoX0Completado && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                            <p className="text-sm text-blue-800">
                                <strong>¿Por qué pagar al benefactor?</strong><br/>
                                El benefactor ({activacion?.benefactor?.user_profiles?.nombre_completo}) es quien 
                                está DOS niveles arriba de ti en el árbol. Ya trabajó antes y merece su recompensa.
                            </p>
                        </div>
                    )}

                    <div className="space-y-4">
                        <div className="bg-gray-50 rounded-lg p-4">
                            <p className="font-semibold text-gray-700 mb-2">
                                Benefactor: {activacion?.benefactor?.user_profiles?.nombre_completo}
                            </p>
                            <p className="text-sm text-gray-600 mb-4">
                                Email: {activacion?.benefactor?.email}
                            </p>

                            <div className="space-y-3">
                                {benefactorMetodos.map((metodo, idx) => (
                                    <div key={idx} className="bg-white border border-gray-200 rounded-lg p-3">
                                        <p className="font-medium text-gray-800">
                                            {metodo.categoria === 'digital' ? '💳' : '🏦'} {metodo.tipo}
                                        </p>
                                        <p className="text-sm text-gray-600 mt-1">
                                            {metodo.identificador}
                                        </p>
                                        {metodo.nombre_titular && (
                                            <p className="text-xs text-gray-500 mt-1">
                                                Titular: {metodo.nombre_titular}
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {!pasoX0Completado ? (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Subir comprobante de pago ($10)
                                </label>
                                <input
                                    type="file"
                                    accept="image/*,.pdf"
                                    onChange={(e) => {
                                        if (e.target.files && e.target.files[0]) {
                                            handleUploadComprobante('x0', e.target.files[0]);
                                        }
                                    }}
                                    disabled={uploadingX0}
                                    className="block w-full text-sm text-gray-500
                                        file:mr-4 file:py-2 file:px-4
                                        file:rounded-lg file:border-0
                                        file:text-sm file:font-semibold
                                        file:bg-green-50 file:text-green-700
                                        hover:file:bg-green-100
                                        disabled:opacity-50"
                                />
                                {uploadingX0 && (
                                    <p className="text-sm text-blue-600 mt-2">Subiendo...</p>
                                )}
                            </div>
                        ) : (
                            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                                <p className="text-sm text-green-700">
                                    ✓ Comprobante recibido. Esperando verificación.
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                <div className={`bg-white rounded-lg shadow-lg p-6 ${pasoX0Completado && !pasoCheCompletado ? 'ring-2 ring-blue-500' : ''} ${!pasoX0Completado ? 'opacity-50' : ''}`}>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-gray-800">
                            Paso 2: Pagar $25 a CHE
                        </h2>
                        {pasoCheCompletado && (
                            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                                ✓ Completado
                            </span>
                        )}
                    </div>

                    {!pasoCheCompletado && pasoX0Completado && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                            <p className="text-sm text-blue-800">
                                <strong>¿Por qué pagar a CHE?</strong><br/>
                                Este pago es por el contenido educativo completo: libros, artículos, conferencias 
                                y tu Kit2 personalizado.
                            </p>
                        </div>
                    )}

                    <div className="space-y-4">
                        <div className="bg-gray-50 rounded-lg p-4">
                            <p className="font-semibold text-gray-700 mb-2">
                                Corporación Herejía Económica
                            </p>

                            <div className="space-y-3">
                                {cheMetodos.map((metodo, idx) => (
                                    <div key={idx} className="bg-white border border-gray-200 rounded-lg p-3">
                                        <p className="font-medium text-gray-800">
                                            {metodo.categoria === 'digital' ? '💳' : '🏦'} {metodo.tipo}
                                        </p>
                                        <p className="text-sm text-gray-600 mt-1">
                                            {metodo.identificador}
                                        </p>
                                        {metodo.nombre_titular && (
                                            <p className="text-xs text-gray-500 mt-1">
                                                Titular: {metodo.nombre_titular}
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {pasoX0Completado && !pasoCheCompletado ? (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Subir comprobante de pago ($25)
                                </label>
                                <input
                                    type="file"
                                    accept="image/*,.pdf"
                                    onChange={(e) => {
                                        if (e.target.files && e.target.files[0]) {
                                            handleUploadComprobante('che', e.target.files[0]);
                                        }
                                    }}
                                    disabled={uploadingChe}
                                    className="block w-full text-sm text-gray-500
                                        file:mr-4 file:py-2 file:px-4
                                        file:rounded-lg file:border-0
                                        file:text-sm file:font-semibold
                                        file:bg-green-50 file:text-green-700
                                        hover:file:bg-green-100
                                        disabled:opacity-50"
                                />
                                {uploadingChe && (
                                    <p className="text-sm text-blue-600 mt-2">Subiendo...</p>
                                )}
                            </div>
                        ) : pasoCheCompletado ? (
                            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                                <p className="text-sm text-green-700">
                                    ✓ Comprobante recibido. Esperando verificación.
                                </p>
                            </div>
                        ) : null}
                    </div>
                </div>

                <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-800">
                        <strong>🔒 Seguridad:</strong> Tus comprobantes serán verificados por nuestro equipo. 
                        Te notificaremos por email cuando tu Kit2 esté listo para descargar.
                    </p>
                </div>
            </div>
        </div>
    );
}