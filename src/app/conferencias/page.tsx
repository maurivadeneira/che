'use client';

import { useState } from 'react';

export default function ConferenciasPage() {
  const conferencias = [
    {
      title: "Introducción a la Herejía Económica",
      descripcion: "Conferencia introductoria a la Herejía Económica",
      fecha: "5/9/2025",
      enlace: "https://youtu.be/m9rDQNNp6is?si=wpkoQXiK6sQRHMR2",
      tipo: "Conferencia"
    },
    {
      title: "Fundamentos de la Herejía Económica", 
      descripcion: "Fundamentos de la Herejía Económica",
      fecha: "5/9/2025",
      enlace: "https://www.youtube.com/watch?v=S6vZCz20t9s&t=1s",
      tipo: "Conferencia"
    },
    {
      title: "Kit de Herejía Económica",
      descripcion: "Herramientas para el análisis económico alternativo",
      fecha: "5/9/2025",
      enlace: "https://www.youtube.com/watch?v=B6zuFjeFNMQ",
      tipo: "Video"
    },
    {
      title: "Presentación del Autor",
      descripcion: "Biografía y trayectoria del autor",
      fecha: "5/9/2025",
      enlace: "https://www.youtube.com/watch?v=9ZnozV3EgwE",
      tipo: "Video"
    }
  ];

  const handleWatchVideo = (enlace) => {
    window.open(enlace, '_blank');
  };

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold mb-8">Conferencias</h1>
      <p className="text-lg mb-8">Conferencias y presentaciones sobre Herejía Económica y otros temas de interés.</p>
      
      <div className="space-y-8">
        {conferencias.map((item, index) => (
          <div key={index} className="bg-white">
            <h3 className="font-semibold mb-2 text-xl">{item.title}</h3>
            <p className="text-gray-600 mb-2">{item.descripcion}</p>
            <p className="text-gray-500 mb-4 text-sm">Fecha: {item.fecha}</p>
            
            <button 
              onClick={() => handleWatchVideo(item.enlace)}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors text-sm font-medium"
            >
              Ver video
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
