export default function ExplicacionKit2Page() {
  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold mb-8">Explicación Kit2</h1>
      <p className="text-lg mb-8">Sistema Kit2 modernizado para la distribución de contenido CHE</p>
      
      <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
        <h2 className="text-2xl font-bold mb-4">¿Qué es Kit2?</h2>
        <p className="mb-4">
          El sistema Kit2 es una innovación de CHE para la distribución viral de contenido educativo
          con un modelo de comisiones que beneficia a toda la cadena distributiva.
        </p>
        
        <h3 className="text-xl font-semibold mb-2">Características principales:</h3>
        <ul className="list-disc pl-6 space-y-2">
          <li>PDF personalizado con nombre del usuario</li>
          <li>Vigencia de 1 año exacto</li>
          <li>Comisiones configurables por acuerdo</li>
          <li>Distribución viral: Usuario 0→1→2→3...</li>
          <li>Posibilidad de múltiples Kit2s simultáneos</li>
        </ul>
      </div>

      <div className="bg-yellow-100 p-6 rounded-lg">
        <h3 className="font-bold mb-2">Documentos Kit2 existentes:</h3>
        <a href="/documentos/kit2/Guia-Familiar-Sistema-Kit2.pdf" 
           target="_blank" className="text-blue-600 hover:underline">
          Ver Guía Familiar Sistema Kit2 →
        </a>
      </div>
    </div>
  );
}
