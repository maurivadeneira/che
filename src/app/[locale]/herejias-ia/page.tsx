export default function HerejiasIAPage() {
  const documentos = [
    { title: 'Cuestionando Big Bang', file: '/documentos/herejiasIA/CUESTIONANDO_BIG_BANG.pdf' },
    { title: 'Cuestionando la Física', file: '/documentos/herejiasIA/CUESTIONANDO_LA_FISICA.pdf' },
    { title: 'Economía vs Ciencia', file: '/documentos/herejiasIA/ECONOMIA_vs_CIENCIA.pdf' },
    { title: 'Extraterrestres', file: '/documentos/herejiasIA/EXTRATERRESTRES.pdf' },
  ];

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold mb-8">Herejías con IA</h1>
      <p className="text-lg mb-8">Documentos generados con inteligencia artificial explorando teorías alternativas</p>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {documentos.map((doc, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
            <h3 className="font-semibold mb-4 text-purple-600">{doc.title}</h3>
            <a href={doc.file} target="_blank" className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">
              Ver Documento →
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
