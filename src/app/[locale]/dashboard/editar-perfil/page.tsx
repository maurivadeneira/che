'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

interface UserData {
  id: string;
  email: string;
  nombre: string;
  apellido: string;
  telefono?: string;
  whatsapp?: string;
  pais?: string;
  ciudad?: string;
  direccion?: string;
  fecha_nacimiento?: string;
  genero?: string;
  identificacion?: string;
  tipo_documento?: string;
  tipo_persona?: string;
  razon_social?: string;
  direccion_fiscal?: string;
  nit_rut?: string;
  paypal_email?: string;
}

interface MetodoPago {
  id: string;
  tipo: string;
  categoria: string;
  identificador: string;
  nombre_titular: string;
  pais?: string;
  detalles?: any;
  es_internacional: boolean;
  activa: boolean;
  preferida: boolean;
}

export default function EditarPerfilPage() {
  const router = useRouter();
  const supabase = createClientComponentClient();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [alert, setAlert] = useState<{type: 'success' | 'error', message: string} | null>(null);
  
  // Estados para datos personales
  const [userData, setUserData] = useState<UserData | null>(null);
  const [formData, setFormData] = useState<Partial<UserData>>({});
  
  // Estados para métodos de pago
  const [metodosPago, setMetodosPago] = useState<MetodoPago[]>([]);
  const [showAddMetodo, setShowAddMetodo] = useState(false);
  const [nuevoMetodo, setNuevoMetodo] = useState({
    tipo: '',
    categoria: 'digital',
    identificador: '',
    nombre_titular: '',
    pais: '',
    es_internacional: false,
    detalles: {}
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login');
        return;
      }

      // Cargar datos del usuario
      const resUser = await fetch('/api/user/profile');
      if (resUser.ok) {
        const data = await resUser.json();
        setUserData(data.user);
        setFormData(data.user);
      }

      // Cargar métodos de pago
      const resMetodos = await fetch('/api/user/metodos-pago');
      if (resMetodos.ok) {
        const metodos = await resMetodos.json();
        setMetodosPago(metodos);
      }

    } catch (error) {
      console.error('Error cargando datos:', error);
      showAlert('error', 'Error al cargar información');
    } finally {
      setLoading(false);
    }
  };

  const showAlert = (type: 'success' | 'error', message: string) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 5000);
  };

  const handleSaveDatosPersonales = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/user/update', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        showAlert('success', 'Datos personales actualizados correctamente');
        await loadData();
      } else {
        const error = await response.json();
        showAlert('error', error.error || 'Error al actualizar datos');
      }
    } catch (error) {
      console.error('Error:', error);
      showAlert('error', 'Error al guardar cambios');
    } finally {
      setSaving(false);
    }
  };

  const handleAddMetodoPago = async () => {
    if (!nuevoMetodo.tipo || !nuevoMetodo.identificador || !nuevoMetodo.nombre_titular) {
      showAlert('error', 'Complete todos los campos requeridos');
      return;
    }

    try {
      const response = await fetch('/api/user/metodos-pago', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevoMetodo),
      });

      if (response.ok) {
        showAlert('success', 'Método de pago agregado correctamente');
        setShowAddMetodo(false);
        setNuevoMetodo({
          tipo: '',
          categoria: 'digital',
          identificador: '',
          nombre_titular: '',
          pais: '',
          es_internacional: false,
          detalles: {}
        });
        await loadData();
      } else {
        const error = await response.json();
        showAlert('error', error.error || 'Error al agregar método');
      }
    } catch (error) {
      console.error('Error:', error);
      showAlert('error', 'Error al agregar método de pago');
    }
  };

  const handleToggleMetodo = async (id: string, campo: 'activa' | 'preferida', valor: boolean) => {
    try {
      const response = await fetch('/api/user/metodos-pago', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, [campo]: valor }),
      });

      if (response.ok) {
        showAlert('success', `Método ${campo === 'activa' ? (valor ? 'activado' : 'desactivado') : 'marcado como preferido'}`);
        await loadData();
      } else {
        const error = await response.json();
        showAlert('error', error.error || 'Error al actualizar método');
      }
    } catch (error) {
      console.error('Error:', error);
      showAlert('error', 'Error al actualizar método');
    }
  };

  const handleDeleteMetodo = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este método de pago?')) return;

    try {
      const response = await fetch(`/api/user/metodos-pago?id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        showAlert('success', 'Método de pago eliminado');
        await loadData();
      } else {
        const error = await response.json();
        showAlert('error', error.error || 'Error al eliminar método');
      }
    } catch (error) {
      console.error('Error:', error);
      showAlert('error', 'Error al eliminar método de pago');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando tu perfil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <div className="flex justify-between items-center flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Editar Perfil</h1>
              <p className="text-gray-600 mt-1">{userData?.email}</p>
            </div>
            <button
              onClick={() => router.push('/es/dashboard')}
              className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition font-medium"
            >
              ← Volver al Dashboard
            </button>
          </div>
        </div>

        {/* Alerta */}
        {alert && (
          <div className={`mb-6 p-4 rounded-lg ${alert.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {alert.message}
          </div>
        )}

        {/* SECCIÓN 1: Datos Personales */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <span className="text-3xl mr-3">👤</span>
            Datos Personales
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.nombre || ''}
                onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Apellido <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.apellido || ''}
                onChange={(e) => setFormData({...formData, apellido: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Teléfono
              </label>
              <input
                type="tel"
                value={formData.telefono || ''}
                onChange={(e) => setFormData({...formData, telefono: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                WhatsApp
              </label>
              <input
                type="tel"
                value={formData.whatsapp || ''}
                onChange={(e) => setFormData({...formData, whatsapp: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                PayPal Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={formData.paypal_email || ''}
                onChange={(e) => setFormData({...formData, paypal_email: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                País
              </label>
              <input
                type="text"
                value={formData.pais || ''}
                onChange={(e) => setFormData({...formData, pais: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ciudad
              </label>
              <input
                type="text"
                value={formData.ciudad || ''}
                onChange={(e) => setFormData({...formData, ciudad: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fecha de Nacimiento
              </label>
              <input
                type="date"
                value={formData.fecha_nacimiento || ''}
                onChange={(e) => setFormData({...formData, fecha_nacimiento: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Género
              </label>
              <select
                value={formData.genero || ''}
                onChange={(e) => setFormData({...formData, genero: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">Seleccionar...</option>
                <option value="masculino">Masculino</option>
                <option value="femenino">Femenino</option>
                <option value="otro">Otro</option>
                <option value="prefiero_no_decir">Prefiero no decir</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dirección
              </label>
              <input
                type="text"
                value={formData.direccion || ''}
                onChange={(e) => setFormData({...formData, direccion: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>

          <button
            onClick={handleSaveDatosPersonales}
            disabled={saving}
            className="mt-6 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {saving ? 'Guardando...' : '💾 Guardar Datos Personales'}
          </button>
        </div>

        {/* SECCIÓN 2: Datos de Facturación */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <span className="text-3xl mr-3">📄</span>
            Datos de Facturación
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Documento
              </label>
              <select
                value={formData.tipo_documento || ''}
                onChange={(e) => setFormData({...formData, tipo_documento: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">Seleccionar...</option>
                <option value="cedula">Cédula</option>
                <option value="cedula_extranjeria">Cédula de Extranjería</option>
                <option value="pasaporte">Pasaporte</option>
                <option value="dni">DNI</option>
                <option value="rut">RUT</option>
                <option value="nit">NIT</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Número de Identificación
              </label>
              <input
                type="text"
                value={formData.identificacion || ''}
                onChange={(e) => setFormData({...formData, identificacion: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Persona
              </label>
              <select
                value={formData.tipo_persona || 'natural'}
                onChange={(e) => setFormData({...formData, tipo_persona: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="natural">Persona Natural</option>
                <option value="juridica">Persona Jurídica</option>
              </select>
            </div>

            {formData.tipo_persona === 'juridica' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    NIT / RUT
                  </label>
                  <input
                    type="text"
                    value={formData.nit_rut || ''}
                    onChange={(e) => setFormData({...formData, nit_rut: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Razón Social
                  </label>
                  <input
                    type="text"
                    value={formData.razon_social || ''}
                    onChange={(e) => setFormData({...formData, razon_social: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dirección Fiscal
                  </label>
                  <textarea
                    value={formData.direccion_fiscal || ''}
                    onChange={(e) => setFormData({...formData, direccion_fiscal: e.target.value})}
                    rows={2}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </>
            )}
          </div>

          <button
            onClick={handleSaveDatosPersonales}
            disabled={saving}
            className="mt-6 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {saving ? 'Guardando...' : '💾 Guardar Datos de Facturación'}
          </button>
        </div>

        {/* SECCIÓN 3: Métodos de Pago */}
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
            <span className="text-3xl mr-3">💳</span>
            Métodos de Pago
          </h2>

          {/* Nota explicativa */}
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800 mb-2">
              <strong>💡 Importante:</strong>
            </p>
            <ul className="text-sm text-blue-700 space-y-1 list-disc list-inside">
              <li>PayPal y Wise funcionan <strong>internacionalmente</strong> 🌍</li>
              <li>Nequí, Daviplata, Yape, Plin solo funcionan <strong>en tu país</strong> 🏠</li>
              <li>Por eso <strong>PayPal es obligatorio</strong> (garantiza pagos internacionales)</li>
            </ul>
          </div>

          {/* Nota de seguridad para pagos a CHE */}
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-800 mb-2">
              <strong>🔒 Seguridad en pagos a CHE:</strong>
            </p>
            <ul className="text-sm text-green-700 space-y-1 list-disc list-inside">
              <li>Puedes pagar con tarjeta de forma segura</li>
              <li>El sistema te pedirá el CVV al momento de pagar</li>
              <li><strong>NUNCA</strong> guardamos tu CVV ni datos completos de tarjeta</li>
              <li>Todos los pagos están protegidos por Stripe</li>
            </ul>
          </div>

          {/* Lista de métodos */}
          {metodosPago.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No tienes métodos de pago registrados
            </div>
          ) : (
            <div className="space-y-4 mb-6">
              {metodosPago.map((metodo) => (
                <div
                  key={metodo.id}
                  className="border-2 border-gray-200 rounded-xl p-4 hover:border-green-300 transition"
                >
                  <div className="flex justify-between items-start flex-wrap gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl">
                          {metodo.categoria === 'digital' ? '💰' : '🏦'}
                        </span>
                        <h3 className="text-lg font-bold text-gray-900">{metodo.tipo}</h3>
                        {metodo.es_internacional && (
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                            🌍 Internacional
                          </span>
                        )}
                        {metodo.preferida && (
                          <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                            ⭐ Preferida
                          </span>
                        )}
                        <span className={`px-2 py-1 text-xs rounded-full ${metodo.activa ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                          {metodo.activa ? 'Activa' : 'Inactiva'}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm">
                        <strong>Identificador:</strong> {metodo.identificador}
                      </p>
                      <p className="text-gray-600 text-sm">
                        <strong>Titular:</strong> {metodo.nombre_titular}
                      </p>
                      {metodo.pais && (
                        <p className="text-gray-600 text-sm">
                          <strong>País:</strong> {metodo.pais}
                        </p>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleToggleMetodo(metodo.id, 'activa', !metodo.activa)}
                        className={`px-3 py-1 text-sm rounded-lg transition ${
                          metodo.activa
                            ? 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                            : 'bg-green-100 hover:bg-green-200 text-green-700'
                        }`}
                      >
                        {metodo.activa ? 'Desactivar' : 'Activar'}
                      </button>
                      {!metodo.preferida && metodo.activa && (
                        <button
                          onClick={() => handleToggleMetodo(metodo.id, 'preferida', true)}
                          className="px-3 py-1 text-sm bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-lg transition"
                        >
                          ⭐ Preferida
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteMetodo(metodo.id)}
                        className="px-3 py-1 text-sm bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Agregar nuevo método */}
          {!showAddMetodo ? (
            <button
              onClick={() => setShowAddMetodo(true)}
              className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium"
            >
              + Agregar Método de Pago
            </button>
          ) : (
            <div className="border-2 border-green-300 rounded-xl p-6 bg-green-50">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Nuevo Método de Pago</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Categoría <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={nuevoMetodo.categoria}
                    onChange={(e) => {
                      const esInternacional = e.target.value === 'digital';
                      setNuevoMetodo({...nuevoMetodo, categoria: e.target.value, es_internacional: esInternacional});
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  >
                    <option value="digital">💰 Billetera Digital</option>
                    <option value="banco">🏦 Cuenta Bancaria</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo <span className="text-red-500">*</span>
                  </label>
                  {nuevoMetodo.categoria === 'digital' ? (
                    <select
                      value={nuevoMetodo.tipo}
                      onChange={(e) => {
                        const esInternacional = ['PayPal', 'Wise', 'Payoneer', 'Skrill'].includes(e.target.value);
                        setNuevoMetodo({...nuevoMetodo, tipo: e.target.value, es_internacional: esInternacional});
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    >
                      <option value="">Seleccionar...</option>
                      <option value="PayPal">PayPal (Internacional)</option>
                      <option value="Wise">Wise (Internacional)</option>
                      <option value="Payoneer">Payoneer (Internacional)</option>
                      <option value="Skrill">Skrill (Internacional)</option>
                      <option value="Nequí">Nequí (Colombia)</option>
                      <option value="Daviplata">Daviplata (Colombia)</option>
                      <option value="Yape">Yape (Perú)</option>
                      <option value="Plin">Plin (Perú)</option>
                      <option value="Mercado Pago">Mercado Pago</option>
                      <option value="Otro">Otro</option>
                    </select>
                  ) : (
                    <input
                      type="text"
                      placeholder="Ej: Banco Bogotá, Bancolombia, etc."
                      value={nuevoMetodo.tipo}
                      onChange={(e) => setNuevoMetodo({...nuevoMetodo, tipo: e.target.value, es_internacional: false})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    />
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {nuevoMetodo.categoria === 'digital' ? 'Email / ID / Celular' : 'Número de Cuenta'} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={nuevoMetodo.identificador}
                    onChange={(e) => setNuevoMetodo({...nuevoMetodo, identificador: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre del Titular <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={nuevoMetodo.nombre_titular}
                    onChange={(e) => setNuevoMetodo({...nuevoMetodo, nombre_titular: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    País
                  </label>
                  <input
                    type="text"
                    value={nuevoMetodo.pais}
                    onChange={(e) => setNuevoMetodo({...nuevoMetodo, pais: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleAddMetodoPago}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium"
                >
                  Guardar
                </button>
                <button
                  onClick={() => {
                    setShowAddMetodo(false);
                    setNuevoMetodo({
                      tipo: '',
                      categoria: 'digital',
                      identificador: '',
                      nombre_titular: '',
                      pais: '',
                      es_internacional: false,
                      detalles: {}
                    });
                  }}
                  className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition font-medium"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}