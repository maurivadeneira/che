export default function HomePage() {
  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold mb-4">CHE - Corporación Herejía Económica</h1>
      <p className="text-lg mb-4">Un proyecto social global para desarrollo en el mundo entero</p>
      <div className="bg-yellow-100 p-4 rounded mb-4">
        <p><strong>Estado:</strong> Base enterprise funcionando correctamente</p>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-bold text-blue-600">Explicación Kit2</h3>
          <p>Sistema modernizado</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-bold text-orange-600">Fondos Rotatorios</h3>
          <p>11 fondos operativos</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-bold text-green-600">Biblioteca</h3>
          <p>Contenido educativo</p>
        </div>
      </div>
    </div>
  );
}
