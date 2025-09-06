import Image from 'next/image';

export default function BancarioPage() {
  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <Image 
            src="/images/fondos/07_Bancario.png" 
            alt="Bancario"
            width={400}
            height={300}
            className="mx-auto rounded-lg shadow-lg"
          />
          <h1 className="text-4xl font-bold mt-6 mb-4">Bancario</h1>
          <p className="text-lg text-gray-600">Servicios financieros</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4">Servicios Financieros</h2>
          <p className="mb-4">
            Desarrollo de servicios financieros alternativos que promuevan
            la libertad económica y la inclusión financiera.
          </p>
        </div>
      </div>
    </div>
  );
}
