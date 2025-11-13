'use client';

import { useState } from 'react';

export default function VerificarComprobantesPage() {
  const [numeroOrden, setNumeroOrden] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [compra, setCompra] = useState<any>(null);
  const [mensaje, setMensaje] = useState('');

  const buscarOrden = async () => {
    setLoading(true);
    setMensaje('');
    
    try {
      const res = await fetch(`/api/kit2/subir-comprobante?numero_orden=${numeroOrden}`);
      const data = await res.json();
      
      if (res.ok) {
        setCompra(data);
      } else {
        setMensaje(data.error || 'Orden no encontrada');
      }
    } catch (error) {
      setMensaje('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  const confirmarPago = async () => {
    if (!adminEmail) {
      setMensaje('Ingresa tu email de administrador');
      return;
    }

    setLoading(true);
    setMensaje('');
    
    try {
      const res = await fetch('/api/kit2/confirmar-pago', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          numero_orden: numeroOrden,
          verificado_por_email: adminEmail
        })
      });
      
      const data = await res.json();
      
      if (res.ok) {
        setMensaje(`✅ Pago confirmado. Kit2 entregado: ${data.codigo_kit2}`);
        setCompra(null);
        setNumeroOrden('');
      } else {
        setMensaje(`❌ ${data.error}`);
      }
    } catch (error) {
      setMensaje('❌ Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-3xl font-bold text-center mb-8 text-gray-900">
            🔍 Verificar Comprobantes
          </h1>

          {/* Email admin */}
          <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tu email (administrador)
            </label>
            <input
              type="email"
              value={adminEmail}
              onChange={(e) => setAdminEmail(e.target.value)}
              placeholder="admin@corpherejiaeconomica.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Buscar orden */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Número de orden
              </label>
              <input
                type="text"
                value={numeroOrden}
                onChange={(e) => setNumeroOrden(e.target.value)}
                placeholder="ORD-..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              onClick={buscarOrden}
              disabled={!numeroOrden || loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-300 transition"
            >
              {loading ? 'Buscando...' : 'Buscar orden'}
            </button>
          </div>

          {/* Mensaje */}
          {mensaje && (
            <div className={`mt-6 px-4 py-3 rounded-lg ${
              mensaje.startsWith('✅') 
                ? 'bg-green-50 border border-green-200 text-green-800'
                : 'bg-red-50 border border-red-200 text-red-800'
            }`}>
              {mensaje}
            </div>
          )}

          {/* Datos de la compra */}
          {compra && (
            <div className="mt-8 space-y-6">
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Información de la orden
                </h3>
                
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Número de orden:</span>
                    <span className="font-mono font-semibold">{compra.numero_orden}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Estado:</span>
                    <span className="font-semibold">{compra.estado}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Comprobante subido:</span>
                    <span className="font-semibold">{compra.comprobante_subido ? '✅ Sí' : '❌ No'}</span>
                  </div>
                  {compra.fecha_subida && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Fecha de subida:</span>
                      <span className="font-semibold">
                        {new Date(compra.fecha_subida).toLocaleString()}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Verificado:</span>
                    <span className="font-semibold">{compra.comprobante_verificado ? '✅ Sí' : '⏳ Pendiente'}</span>
                  </div>
                </div>
              </div>

              {/* Acción */}
              {compra.comprobante_subido && !compra.comprobante_verificado && (
                <div className="pt-6 border-t border-gray-200">
                  <button
                    onClick={confirmarPago}
                    disabled={!adminEmail || loading}
                    className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-300 transition"
                  >
                    {loading ? 'Confirmando...' : '✅ Confirmar pago y entregar Kit2'}
                  </button>
                  <p className="text-xs text-gray-500 text-center mt-2">
                    Esto creará el Kit2 y lo enviará al comprador
                  </p>
                </div>
              )}

              {compra.comprobante_verificado && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-green-800 text-center font-medium">
                    ✅ Esta orden ya fue verificada y el Kit2 fue entregado
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}