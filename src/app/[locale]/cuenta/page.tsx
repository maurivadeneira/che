export default function CuentaPage() {
  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Mi Cuenta</h1>
        
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4">Panel de Usuario CHE</h2>
          <p className="mb-4">Funcionalidad en desarrollo - Sistema de autenticación enterprise próximamente.</p>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Mis Kit2s</h3>
              <p className="text-gray-600">Gestiona tus Kit2s activos y vencidos</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Comisiones</h3>
              <p className="text-gray-600">Revisa tus ganancias por distribución</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
