export default function ContactoPage() {
  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Contacto</h1>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Información de Contacto</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold">Email Principal</h3>
                <p className="text-blue-600">contacto@corpherejiaeconomica.com</p>
              </div>
              <div>
                <h3 className="font-semibold">Sede Principal</h3>
                <p>Bogotá D.C., Colombia</p>
              </div>
              <div>
                <h3 className="font-semibold">Sitio Web</h3>
                <p className="text-blue-600">corpherejiaeconomica.com</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Formulario de Contacto</h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Nombre</label>
                <input type="text" className="w-full border rounded px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input type="email" className="w-full border rounded px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Mensaje</label>
                <textarea className="w-full border rounded px-3 py-2 h-24"></textarea>
              </div>
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                Enviar Mensaje
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
