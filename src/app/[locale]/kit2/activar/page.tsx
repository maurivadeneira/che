'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ActivarKit2Page() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [codigo, setCodigo] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [datosKit2, setDatosKit2] = useState<any>(null);
  const [formData, setFormData] = useState({
    email: '',
    nombre: '',
    apellido: '',
    pais: 'Colombia'
  });

  const validarCodigo = async () => {
    setLoading(true);
    setError('');
    
    try {
      const res = await fetch(`/api/kit2/validar-codigo?codigo=${codigo}`);
      const data = await res.json();
      
      if (!res.ok) {
        setError(data.error || 'Codigo no valido');
        return;
      }
      
      setDatosKit2(data);
      setStep(2);
    } catch (err) {
      setError('Error de conexion');
    } finally {
      setLoading(false);
    }
  };

  const iniciarCompra = async () => {
    setLoading(true);
    setError('');
    
    try {
      const res = await fetch('/api/kit2/iniciar-compra', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          origen_codigo: codigo,
          ...formData
        })
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        setError(data.error || 'Error al procesar');
        return;
      }
      
      setStep(3);
      setDatosKit2({ ...datosKit2, ...data });
    } catch (err) {
      setError('Error de conexion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-3xl font-bold text-center mb-8 text-indigo-900">
            Activar Kit2
          </h1>

          {/* PASO 1: Validar código */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Código de invitación
                </label>
                <input
                  type="text"
                  value={codigo}
                  onChange={(e) => setCodigo(e.target.value.toUpperCase())}
                  placeholder="HE-K2-XXXXX"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}

              <button
                onClick={validarCodigo}
                disabled={!codigo || loading}
                className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
              >
                {loading ? 'Validando...' : 'Continuar'}
              </button>
            </div>
          )}

          {/* PASO 2: Formulario de datos */}
          {step === 2 && datosKit2 && (
            <div className="space-y-6">
              <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                <p className="text-sm text-indigo-800">
                  Invitado por: <span className="font-semibold">{datosKit2.invitador.nombre} {datosKit2.invitador.apellido}</span>
                </p>
                <p className="text-sm text-indigo-800 mt-1">
                  Kit2: <span className="font-semibold">{datosKit2.kit2.nombre}</span>
                </p>
                <p className="text-sm text-indigo-800 mt-1">
                  Precio: <span className="font-semibold">${datosKit2.kit2.precio} USD</span>
                </p>
                {datosKit2.beneficiario && (
                  <p className="text-sm text-indigo-800 mt-1">
                    Beneficiario: <span className="font-semibold">{datosKit2.beneficiario.nombre} {datosKit2.beneficiario.apellido}</span>
                  </p>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre *
                  </label>
                  <input
                    type="text"
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Apellido *
                  </label>
                  <input
                    type="text"
                    value={formData.apellido}
                    onChange={(e) => setFormData({ ...formData, apellido: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    País
                  </label>
                  <input
                    type="text"
                    value={formData.pais}
                    onChange={(e) => setFormData({ ...formData, pais: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}

              <button
                onClick={iniciarCompra}
                disabled={!formData.email || !formData.nombre || !formData.apellido || loading}
                className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
              >
                {loading ? 'Procesando...' : 'Continuar al pago'}
              </button>
            </div>
          )}

          {/* PASO 3: Confirmación */}
          {step === 3 && datosKit2 && (
            <div className="space-y-6 text-center">
              <div className="text-6xl">🎉</div>
              <h2 className="text-2xl font-bold text-gray-900">¡Compra iniciada!</h2>
              
              <div className="bg-gray-50 rounded-lg p-6 text-left space-y-2">
                <p className="text-sm text-gray-600">
                  Número de orden: <span className="font-mono font-semibold">{datosKit2.numero_orden}</span>
                </p>
                <p className="text-sm text-gray-600">
                  Total a pagar: <span className="font-semibold">${datosKit2.monto_agradecimiento + datosKit2.monto_productos} USD</span>
                </p>
                <p className="text-sm text-gray-600">
                  Agradecimiento: <span className="font-semibold">${datosKit2.monto_agradecimiento} USD</span>
                </p>
                <p className="text-sm text-gray-600">
                  Productos: <span className="font-semibold">${datosKit2.monto_productos} USD</span>
                </p>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800">
                  Recibirás un email con las instrucciones de pago.
                </p>
              </div>

              <button
                onClick={() => router.push('/')}
                className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
              >
                Volver al inicio
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}