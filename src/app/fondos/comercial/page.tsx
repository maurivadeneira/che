import Image from 'next/image';

export default function ComercialPage() {
  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <Image 
            src="/images/fondos/09_Comercial.png" 
            alt="Comercial"
            width={400}
            height={300}
            className="mx-auto rounded-lg shadow-lg"
          />
          <h1 className="text-4xl font-bold mt-6 mb-4">Comercial</h1>
          <p className="text-lg text-gray-600">Actividades comerciales</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4">Actividades Comerciales</h2>
          <p className="mb-4">
            Desarrollo de actividades comerciales que generen ingresos
            sostenibles para CHE y sus miembros.
          </p>
        </div>
      </div>
    </div>
  );
}
