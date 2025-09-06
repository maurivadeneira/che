import Link from 'next/link';

export default function BibliotecaPage() {
  const libros = [
    { title: 'Análisis Comprehensivo', file: '/documentos/libros/AnalisisComprehensivo.pdf' },
    { title: 'Libro Primero', file: '/documentos/libros/LIBRO_PRIMERO.pdf' },
    { title: 'Libro Segundo', file: '/documentos/libros/LIBRO_SEGUNDO.pdf' },
    { title: 'Comentario Libro Primero', file: '/documentos/libros/ComentarioLibroPrimero.pdf' },
    { title: 'Presentación Libro Segundo', file: '/documentos/libros/PresentacionLibroSegundo.pdf' },
  ];

  const articulos = [
    { title: 'Comprobado', file: '/documentos/articulos/COMPROBADO.pdf' },
    { title: 'Dos Problemas Fundamentales', file: '/documentos/articulos/DOS PROBLEMAS FUNDAMENTALES.pdf' },
    { title: 'Economía Mundial SOS', file: '/documentos/articulos/ECONOMIA MUNDIAL SOS.pdf' },
    { title: 'El Ahorro en Colombia Error Conceptual', file: '/documentos/articulos/EL AHORRO EN COLOMBIA ERROR CONCEPTUAL.pdf' },
    { title: 'El Problema de la Inflación Inercial', file: '/documentos/articulos/EL PROBLEMA DE LA INFLACIÓN INERCIAL.pdf' },
    { title: 'El Problema del Déficit Fiscal', file: '/documentos/articulos/EL PROBLEMA DEL DEFICIT FISCAL.pdf' },
    { title: 'Jaque al Sistema Económico Mundial', file: '/documentos/articulos/JAQUE AL SISTEMA ECONOMICO MUNDIAL.pdf' },
    { title: 'Reflexiones Economista Hereje', file: '/documentos/articulos/ReflexionesEconomistaHereje (1).docx.pdf' },
  ];

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold mb-8">Biblioteca CHE</h1>
      <p className="text-lg mb-8">Acceso completo al material bibliográfico de la Corporación Herejía Económica</p>
      
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-bold mb-6 text-blue-600">Libros ({libros.length})</h2>
          <div className="space-y-4">
            {libros.map((libro, index) => (
              <div key={index} className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition-shadow">
                <h3 className="font-semibold mb-2">{libro.title}</h3>
                <a href={libro.file} target="_blank" className="text-blue-600 hover:underline inline-flex items-center">
                  Ver PDF →
                </a>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-6 text-orange-600">Artículos ({articulos.length})</h2>
          <div className="space-y-4">
            {articulos.map((articulo, index) => (
              <div key={index} className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition-shadow">
                <h3 className="font-semibold mb-2">{articulo.title}</h3>
                <a href={articulo.file} target="_blank" className="text-orange-600 hover:underline inline-flex items-center">
                  Ver PDF →
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-12 bg-blue-50 p-6 rounded-lg">
        <h3 className="text-xl font-bold mb-4">Información Bibliográfica</h3>
        <div className="grid md:grid-cols-2 gap-6 text-sm">
          <div>
            <h4 className="font-semibold mb-2">Colección de Libros</h4>
            <p>Serie completa de publicaciones principales de CHE, incluyendo análisis comprehensivos y comentarios especializados.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Artículos Especializados</h4>
            <p>Artículos de investigación que desarrollan aspectos específicos de la teoría de Herejía Económica.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
