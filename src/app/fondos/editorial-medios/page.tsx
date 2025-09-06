import Image from 'next/image';

export default function EditorialMediosPage() {
  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <Image 
            src="/images/fondos/02_Editorial_y_Medios.png" 
            alt="Editorial y Medios"
            width={400}
            height={300}
            className="mx-auto rounded-lg shadow-lg"
          />
          <h1 className="text-4xl font-bold mt-6 mb-4">Editorial y Medios Audiovisuales</h1>
          <p className="text-lg text-gray-600">Publicaciones y contenido multimedia</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4">Contenido Disponible</h2>
          <p className="mb-4">
            Este fondo gestiona toda la producción editorial y multimedia de CHE,
            incluyendo libros, artículos, videos y material educativo.
          </p>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">Libros Publicados:</h3>
              <ul className="list-disc pl-6">
                <li>Libro Primero</li>
                <li>Libro Segundo</li>
                <li>Análisis Comprehensivo</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Material Multimedia:</h3>
              <ul className="list-disc pl-6">
                <li>Conferencias grabadas</li>
                <li>Presentaciones del autor</li>
                <li>Material Kit2</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
