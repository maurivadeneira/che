const fs = require('fs');
const path = require('path');

// Traducciones específicas para inversionEmpresarial
const translations = {
  pt: {
    description: "Projetos de investimento e empreendedorismo para o desenvolvimento econômico.",
    objective: { content: "Facilitar o acesso ao capital de investimento para empreendedores e empresas que buscam expandir suas operações ou desenvolver novos projetos inovadores." },
    process: { content: "Os interessados podem apresentar suas propostas de investimento através do nosso portal online, onde serão avaliadas pela nossa equipe de especialistas." },
    items: ["Capital semente para startups", "Expansão de empresas existentes", "Projetos de inovação tecnológica", "Investimentos em economia sustentável"]
  },
  fr: {
    description: "Projets d'investissement et d'entrepreneuriat pour le développement économique.",
    objective: { content: "Faciliter l'accès au capital d'investissement pour les entrepreneurs et les entreprises cherchant à étendre leurs opérations ou développer de nouveaux projets innovants." },
    process: { content: "Les intéressés peuvent présenter leurs propositions d'investissement via notre portail en ligne, où elles seront évaluées par notre équipe d'experts." },
    items: ["Capital d'amorçage pour les startups", "Expansion d'entreprises existantes", "Projets d'innovation technologique", "Investissements en économie durable"]
  },
  de: {
    description: "Investment- und Unternehmertumsprojekte für die wirtschaftliche Entwicklung.",
    objective: { content: "Erleichterung des Zugangs zu Investitionskapital für Unternehmer und Firmen, die ihre Geschäfte erweitern oder neue innovative Projekte entwickeln möchten." },
    process: { content: "Interessierte können ihre Investitionsvorschläge über unser Online-Portal einreichen, wo sie von unserem Expertenteam bewertet werden." },
    items: ["Startkapital für Startups", "Erweiterung bestehender Unternehmen", "Technologische Innovationsprojekte", "Investitionen in nachhaltige Wirtschaft"]
  },
  it: {
    description: "Progetti di investimento e imprenditoria per lo sviluppo economico.",
    objective: { content: "Facilitare l'accesso al capitale di investimento per imprenditori e aziende che cercano di espandere le loro operazioni o sviluppare nuovi progetti innovativi." },
    process: { content: "Gli interessati possono presentare le loro proposte di investimento attraverso il nostro portale online, dove saranno valutate dal nostro team di esperti." },
    items: ["Capitale iniziale per startup", "Espansione di aziende esistenti", "Progetti di innovazione tecnologica", "Investimenti in economia sostenibile"]
  }
};

function actualizarInversionEmpresarial() {
  console.log('🎯 Corrigiendo traducciones de inversionEmpresarial...\n');

  ['pt', 'fr', 'de', 'it'].forEach(idioma => {
    const rutaArchivo = path.join(__dirname, 'public', 'locales', idioma, 'common.json');
    
    try {
      const contenidoActual = fs.readFileSync(rutaArchivo, 'utf8');
      const data = JSON.parse(contenidoActual);
      
      console.log(`📝 Actualizando ${idioma.toUpperCase()}...`);
      
      if (data.funds && data.funds.individual && data.funds.individual.inversionEmpresarial) {
        // Actualizar campos específicos
        data.funds.individual.inversionEmpresarial.description = translations[idioma].description;
        data.funds.individual.inversionEmpresarial.objective.content = translations[idioma].objective.content;
        data.funds.individual.inversionEmpresarial.process.content = translations[idioma].process.content;
        data.funds.individual.inversionEmpresarial.items = translations[idioma].items;
        
        console.log(`  ✅ inversionEmpresarial actualizado`);
        
        // Escribir archivo
        fs.writeFileSync(rutaArchivo, JSON.stringify(data, null, 2), 'utf8');
        console.log(`💾 Archivo ${idioma}/common.json guardado\n`);
      }
    } catch (error) {
      console.error(`❌ Error procesando ${idioma}:`, error.message);
    }
  });
  
  console.log('🎉 ¡Corrección completada para inversionEmpresarial!');
}

actualizarInversionEmpresarial();
