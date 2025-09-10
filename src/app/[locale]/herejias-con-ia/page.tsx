import Image from 'next/image';

export default function HerejiasConIAPage() {
  const dialogosIA = [
    {
      title: 'Cuestionando el Big Bang',
      file: '/documentos/herejiasIA/CUESTIONANDO_BIG_BANG.pdf',
      description: 'Análisis crítico de la teoría del Big Bang desde perspectivas económicas alternativas'
    },
    {
      title: 'Economía vs Ciencia',
      file: '/documentos/herejiasIA/ECONOMIA_vs_CIENCIA.pdf', 
      description: 'La intersección entre modelos económicos y paradigmas científicos'
    },
    {
      title: 'Extraterrestres',
      file: '/documentos/herejiasIA/EXTRATERRESTRES.pdf',
      description: 'Implicaciones económicas del contacto extraterrestre'
    },
    {
      title: 'Cuestionando la Física',
      file: '/documentos/herejiasIA/CUESTIONANDO_LA_FISICA.pdf',
      description: 'Revisión de principios físicos desde la herejía económica'
    }
  ];

  return (
    <div className="p-8">
      <div className="flex items-center gap-4 mb-8">
        <h1 className="text-4xl font-bold">Herejías con IA</h1>
        <div className="relative h-12 w-12">
          <Image
            src="/images/che-mini-logo.svg"
            alt="CHE"
            fill
            className="object-contain"
          />
        </div>
      </div>
      
      <p className="text-lg mb-8">Diálogos con Inteligencia Artificial sobre paradigmas económicos y científicos</p>
      
      <div className="bg-blue-100 p-4 rounded mb-8">
        <p><strong>Estado:</strong> {dialogosIA.length} diálogos disponibles</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {dialogosIA.map((dialogo, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-3 text-blue-700">{dialogo.title}</h2>
            <p className="text-gray-600 mb-4">{dialogo.description}</p>
            <a 
              href={dialogo.file} 
              target="_blank" 
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Leer PDF
            </a>
          </div>
        ))}
      </div>

      <div className="bg-gray-100 p-6 rounded-lg">
        <h3 className="text-xl font-bold mb-4">Sobre estos diálogos</h3>
        <p className="text-gray-700">
          Estos documentos contienen conversaciones con IA explorando teorías no convencionales 
          sobre física, economía y cosmología desde la perspectiva de la Herejía Económica.
        </p>
      </div>
    </div>
  );
}
