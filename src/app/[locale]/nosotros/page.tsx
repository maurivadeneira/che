export default function NosotrosPage() {
  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Nosotros</h1>
        
        <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
          <h2 className="text-2xl font-bold mb-4">CHE - Corporación Herejía Económica</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Información Corporativa</h3>
              <ul className="space-y-2 text-gray-600">
                <li><strong>Fundación:</strong> 5 de Marzo de 2014</li>
                <li><strong>Sede Principal:</strong> Bogotá D.C., Colombia</li>
                <li><strong>Naturaleza:</strong> Corporación sin ánimo de lucro</li>
                <li><strong>Carácter:</strong> Internacional</li>
                <li><strong>RUT/NIT:</strong> [Por renovar]</li>
                <li><strong>Email:</strong> contacto@corpherejiaeconomica.com</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Modelo de Concesión</h3>
              <ul className="space-y-2 text-gray-600">
                <li><strong>Mauricio Rivadeneira:</strong> 20% ingresos</li>
                <li><strong>CHE Corporación:</strong> 80% operación</li>
                <li><strong>Vigencia:</strong> 10 años renovables</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4">Objeto Corporativo</h2>
          <p className="text-gray-600">
            Divulgar teoría "Herejía Económica" para lograr libertad económica global 
            mediante procesos que permitan generar ingresos, educación virtual, 
            mercadeo multinivel y tecnología limpia.
          </p>
        </div>
      </div>
    </div>
  );
}
