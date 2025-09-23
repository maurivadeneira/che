const fs = require('fs');
const path = require('path');

// Traducciones completas por idioma
const translations = {
  pt: {
    editorialMedios: {
      description: "Desenvolvimento de conteúdo editorial e meios audiovisuais para a difusão do conhecimento CHE.",
      objective: { content: "Desenvolver e promover a criação de conteúdo editorial e meios audiovisuais para a difusão do conhecimento CHE." },
      process: { content: "Os interessados podem apresentar suas propostas através do nosso portal especializado, onde serão avaliadas pela nossa equipe de especialistas." },
      items: ["Livros e publicações especializadas", "Vídeos educativos e documentários", "Podcasts e conteúdo de áudio", "Materiais audiovisuais interativos"]
    },
    sanacionEmocional: {
      description: "Programas de bem-estar emocional e cura integral para o desenvolvimento pessoal.",
      objective: { content: "Desenvolver e promover programas de bem-estar emocional e cura integral para o desenvolvimento pessoal." },
      process: { content: "Os interessados podem apresentar suas propostas através do nosso portal especializado, onde serão avaliadas pela nossa equipe de especialistas." },
      items: ["Terapias alternativas", "Programas de bem-estar", "Cura holística", "Desenvolvimento pessoal"]
    },
    vivienda: {
      description: "Soluções habitacionais inovadoras e acessíveis para comunidades globais.",
      objective: { content: "Desenvolver e promover soluções habitacionais inovadoras e acessíveis para comunidades globais." },
      process: { content: "Os interessados podem apresentar suas propostas através do nosso portal especializado, onde serão avaliadas pela nossa equipe de especialistas." },
      items: ["Habitação social", "Projetos sustentáveis", "Desenvolvimento urbano", "Habitação acessível"]
    },
    recreacionSocial: {
      description: "Projetos de turismo, recreação e serviços hoteleiros para o desenvolvimento social.",
      objective: { content: "Desenvolver e promover projetos de turismo, recreação e serviços hoteleiros para o desenvolvimento social." },
      process: { content: "Os interessados podem apresentar suas propostas através do nosso portal especializado, onde serão avaliadas pela nossa equipe de especialistas." },
      items: ["Turismo comunitário", "Centros recreativos", "Serviços hoteleiros", "Desenvolvimento turístico"]
    },
    sistemasPlatformas: {
      description: "Desenvolvimento de tecnologias e plataformas digitais inovadoras.",
      objective: { content: "Desenvolver e promover o desenvolvimento de tecnologias e plataformas digitais inovadoras." },
      process: { content: "Os interessados podem apresentar suas propostas através do nosso portal especializado, onde serão avaliadas pela nossa equipe de especialistas." },
      items: ["Plataformas digitais", "Sistemas tecnológicos", "Soluções informáticas", "Inovação tecnológica"]
    },
    bancario: {
      description: "Serviços financeiros alternativos e banca comunitária.",
      objective: { content: "Desenvolver e promover serviços financeiros alternativos e banca comunitária." },
      process: { content: "Os interessados podem apresentar suas propostas através do nosso portal especializado, onde serão avaliadas pela nossa equipe de especialistas." },
      items: ["Microfinanças", "Banca comunitária", "Serviços financeiros", "Sistemas alternativos"]
    },
    ingenieria: {
      description: "Infraestrutura e projetos de engenharia para o desenvolvimento sustentável.",
      objective: { content: "Desenvolver e promover infraestrutura e projetos de engenharia para o desenvolvimento sustentável." },
      process: { content: "Os interessados podem apresentar suas propostas através do nosso portal especializado, onde serão avaliadas pela nossa equipe de especialistas." },
      items: ["Infraestrutura", "Engenharia civil", "Projetos ambientais", "Desenvolvimento sustentável"]
    },
    comercial: {
      description: "Atividades comerciais e empresariais sob princípios CHE.",
      objective: { content: "Desenvolver e promover atividades comerciais e empresariais sob princípios CHE." },
      process: { content: "Os interessados podem apresentar suas propostas através do nosso portal especializado, onde serão avaliadas pela nossa equipe de especialistas." },
      items: ["Comércio ético", "Empresas sustentáveis", "Comércio justo", "Atividades comerciais"]
    },
    investigacionCientifica: {
      description: "Pesquisa científica e desenvolvimento de conhecimento inovador.",
      objective: { content: "Desenvolver e promover pesquisa científica e desenvolvimento de conhecimento inovador." },
      process: { content: "Os interessados podem apresentar suas propostas através do nosso portal especializado, onde serão avaliadas pela nossa equipe de especialistas." },
      items: ["Pesquisa independente", "Estudos econômicos", "Desenvolvimento científico", "Pesquisa aplicada"]
    },
    arteCultura: {
      description: "Manifestações artísticas e projetos culturais transformadores.",
      objective: { content: "Desenvolver e promover manifestações artísticas e projetos culturais transformadores." },
      process: { content: "Os interessados podem apresentar suas propostas através do nosso portal especializado, onde serão avaliadas pela nossa equipe de especialistas." },
      items: ["Expressões artísticas", "Projetos culturais", "Arte transformadora", "Manifestações criativas"]
    }
  },
  fr: {
    editorialMedios: {
      description: "Développement de contenu éditorial et de médias audiovisuels pour la diffusion des connaissances CHE.",
      objective: { content: "Développer et promouvoir la création de contenu éditorial et de médias audiovisuels pour la diffusion des connaissances CHE." },
      process: { content: "Les intéressés peuvent présenter leurs propositions via notre portail spécialisé, où elles seront évaluées par notre équipe d'experts." },
      items: ["Livres et publications spécialisées", "Vidéos éducatives et documentaires", "Podcasts et contenu audio", "Matériaux audiovisuels interactifs"]
    },
    sanacionEmocional: {
      description: "Programmes de bien-être émotionnel et de guérison intégrale pour le développement personnel.",
      objective: { content: "Développer et promouvoir des programmes de bien-être émotionnel et de guérison intégrale pour le développement personnel." },
      process: { content: "Les intéressés peuvent présenter leurs propositions via notre portail spécialisé, où elles seront évaluées par notre équipe d'experts." },
      items: ["Thérapies alternatives", "Programmes de bien-être", "Guérison holistique", "Développement personnel"]
    },
    vivienda: {
      description: "Solutions d'habitat innovantes et accessibles pour les communautés mondiales.",
      objective: { content: "Développer et promouvoir des solutions d'habitat innovantes et accessibles pour les communautés mondiales." },
      process: { content: "Les intéressés peuvent présenter leurs propositions via notre portail spécialisé, où elles seront évaluées par notre équipe d'experts." },
      items: ["Logement social", "Projets durables", "Développement urbain", "Logement accessible"]
    },
    recreacionSocial: {
      description: "Projets de tourisme, de loisirs et de services hôteliers pour le développement social.",
      objective: { content: "Développer et promouvoir des projets de tourisme, de loisirs et de services hôteliers pour le développement social." },
      process: { content: "Les intéressés peuvent présenter leurs propositions via notre portail spécialisé, où elles seront évaluées par notre équipe d'experts." },
      items: ["Tourisme communautaire", "Centres récréatifs", "Services hôteliers", "Développement touristique"]
    },
    sistemasPlatformas: {
      description: "Développement de technologies et plateformes numériques innovantes.",
      objective: { content: "Développer et promouvoir le développement de technologies et plateformes numériques innovantes." },
      process: { content: "Les intéressés peuvent présenter leurs propositions via notre portail spécialisé, où elles seront évaluées par notre équipe d'experts." },
      items: ["Plateformes numériques", "Systèmes technologiques", "Solutions informatiques", "Innovation technologique"]
    },
    bancario: {
      description: "Services financiers alternatifs et banque communautaire.",
      objective: { content: "Développer et promouvoir des services financiers alternatifs et une banque communautaire." },
      process: { content: "Les intéressés peuvent présenter leurs propositions via notre portail spécialisé, où elles seront évaluées par notre équipe d'experts." },
      items: ["Microfinance", "Banque communautaire", "Services financiers", "Systèmes alternatifs"]
    },
    ingenieria: {
      description: "Infrastructure et projets d'ingénierie pour le développement durable.",
      objective: { content: "Développer et promouvoir l'infrastructure et les projets d'ingénierie pour le développement durable." },
      process: { content: "Les intéressés peuvent présenter leurs propositions via notre portail spécialisé, où elles seront évaluées par notre équipe d'experts." },
      items: ["Infrastructure", "Génie civil", "Projets environnementaux", "Développement durable"]
    },
    comercial: {
      description: "Activités commerciales et entrepreneuriales selon les principes CHE.",
      objective: { content: "Développer et promouvoir des activités commerciales et entrepreneuriales selon les principes CHE." },
      process: { content: "Les intéressés peuvent présenter leurs propositions via notre portail spécialisé, où elles seront évaluées par notre équipe d'experts." },
      items: ["Commerce éthique", "Entreprises durables", "Commerce équitable", "Activités commerciales"]
    },
    investigacionCientifica: {
      description: "Recherche scientifique et développement de connaissances innovantes.",
      objective: { content: "Développer et promouvoir la recherche scientifique et le développement de connaissances innovantes." },
      process: { content: "Les intéressés peuvent présenter leurs propositions via notre portail spécialisé, où elles seront évaluées par notre équipe d'experts." },
      items: ["Recherche indépendante", "Études économiques", "Développement scientifique", "Recherche appliquée"]
    },
    arteCultura: {
      description: "Manifestations artistiques et projets culturels transformateurs.",
      objective: { content: "Développer et promouvoir des manifestations artistiques et des projets culturels transformateurs." },
      process: { content: "Les intéressés peuvent présenter leurs propositions via notre portail spécialisé, où elles seront évaluées par notre équipe d'experts." },
      items: ["Expressions artistiques", "Projets culturels", "Art transformateur", "Manifestations créatives"]
    }
  },
  de: {
    editorialMedios: {
      description: "Entwicklung von redaktionellen Inhalten und audiovisuellen Medien zur Verbreitung von CHE-Wissen.",
      objective: { content: "Entwicklung und Förderung der Erstellung von redaktionellen Inhalten und audiovisuellen Medien zur Verbreitung von CHE-Wissen." },
      process: { content: "Interessierte können ihre Vorschläge über unser spezialisiertes Portal einreichen, wo sie von unserem Expertenteam bewertet werden." },
      items: ["Fachbücher und Publikationen", "Bildungsvideos und Dokumentarfilme", "Podcasts und Audioinhalte", "Interaktive audiovisuelle Materialien"]
    },
    sanacionEmocional: {
      description: "Programme für emotionales Wohlbefinden und ganzheitliche Heilung für die persönliche Entwicklung.",
      objective: { content: "Entwicklung und Förderung von Programmen für emotionales Wohlbefinden und ganzheitliche Heilung für die persönliche Entwicklung." },
      process: { content: "Interessierte können ihre Vorschläge über unser spezialisiertes Portal einreichen, wo sie von unserem Expertenteam bewertet werden." },
      items: ["Alternative Therapien", "Wellness-Programme", "Ganzheitliche Heilung", "Persönliche Entwicklung"]
    },
    vivienda: {
      description: "Innovative und zugängliche Wohnlösungen für globale Gemeinschaften.",
      objective: { content: "Entwicklung und Förderung innovativer und zugänglicher Wohnlösungen für globale Gemeinschaften." },
      process: { content: "Interessierte können ihre Vorschläge über unser spezialisiertes Portal einreichen, wo sie von unserem Expertenteam bewertet werden." },
      items: ["Sozialer Wohnungsbau", "Nachhaltige Projekte", "Stadtentwicklung", "Bezahlbarer Wohnraum"]
    },
    recreacionSocial: {
      description: "Tourismus-, Freizeit- und Hotelprojekte für die soziale Entwicklung.",
      objective: { content: "Entwicklung und Förderung von Tourismus-, Freizeit- und Hotelprojekten für die soziale Entwicklung." },
      process: { content: "Interessierte können ihre Vorschläge über unser spezialisiertes Portal einreichen, wo sie von unserem Expertenteam bewertet werden." },
      items: ["Gemeinschaftstourismus", "Freizeitzentren", "Hoteldienstleistungen", "Tourismusentwicklung"]
    },
    sistemasPlatformas: {
      description: "Entwicklung innovativer Technologien und digitaler Plattformen.",
      objective: { content: "Entwicklung und Förderung innovativer Technologien und digitaler Plattformen." },
      process: { content: "Interessierte können ihre Vorschläge über unser spezialisiertes Portal einreichen, wo sie von unserem Expertenteam bewertet werden." },
      items: ["Digitale Plattformen", "Technologische Systeme", "IT-Lösungen", "Technologische Innovation"]
    },
    bancario: {
      description: "Alternative Finanzdienstleistungen und Gemeinschaftsbanking.",
      objective: { content: "Entwicklung und Förderung alternativer Finanzdienstleistungen und Gemeinschaftsbanking." },
      process: { content: "Interessierte können ihre Vorschläge über unser spezialisiertes Portal einreichen, wo sie von unserem Expertenteam bewertet werden." },
      items: ["Mikrofinanzierung", "Gemeinschaftsbanking", "Finanzdienstleistungen", "Alternative Systeme"]
    },
    ingenieria: {
      description: "Infrastruktur- und Ingenieurprojekte für nachhaltige Entwicklung.",
      objective: { content: "Entwicklung und Förderung von Infrastruktur- und Ingenieurprojekten für nachhaltige Entwicklung." },
      process: { content: "Interessierte können ihre Vorschläge über unser spezialisiertes Portal einreichen, wo sie von unserem Expertenteam bewertet werden." },
      items: ["Infrastruktur", "Bauingenieurwesen", "Umweltprojekte", "Nachhaltige Entwicklung"]
    },
    comercial: {
      description: "Geschäfts- und Unternehmensaktivitäten nach CHE-Prinzipien.",
      objective: { content: "Entwicklung und Förderung von Geschäfts- und Unternehmensaktivitäten nach CHE-Prinzipien." },
      process: { content: "Interessierte können ihre Vorschläge über unser spezialisiertes Portal einreichen, wo sie von unserem Expertenteam bewertet werden." },
      items: ["Ethischer Handel", "Nachhaltige Unternehmen", "Fairer Handel", "Geschäftsaktivitäten"]
    },
    investigacionCientifica: {
      description: "Wissenschaftliche Forschung und Entwicklung innovativen Wissens.",
      objective: { content: "Entwicklung und Förderung wissenschaftlicher Forschung und der Entwicklung innovativen Wissens." },
      process: { content: "Interessierte können ihre Vorschläge über unser spezialisiertes Portal einreichen, wo sie von unserem Expertenteam bewertet werden." },
      items: ["Unabhängige Forschung", "Wirtschaftsstudien", "Wissenschaftliche Entwicklung", "Angewandte Forschung"]
    },
    arteCultura: {
      description: "Künstlerische Ausdrucksformen und transformative Kulturprojekte.",
      objective: { content: "Entwicklung und Förderung künstlerischer Ausdrucksformen und transformativer Kulturprojekte." },
      process: { content: "Interessierte können ihre Vorschläge über unser spezialisiertes Portal einreichen, wo sie von unserem Expertenteam bewertet werden." },
      items: ["Künstlerische Ausdrucksformen", "Kulturprojekte", "Transformative Kunst", "Kreative Manifestationen"]
    }
  },
  it: {
    editorialMedios: {
      description: "Sviluppo di contenuti editoriali e mezzi audiovisivi per la diffusione della conoscenza CHE.",
      objective: { content: "Sviluppare e promuovere la creazione di contenuti editoriali e mezzi audiovisivi per la diffusione della conoscenza CHE." },
      process: { content: "Gli interessati possono presentare le loro proposte attraverso il nostro portale specializzato, dove saranno valutate dal nostro team di esperti." },
      items: ["Libri e pubblicazioni specializzate", "Video educativi e documentari", "Podcast e contenuti audio", "Materiali audiovisivi interattivi"]
    },
    sanacionEmocional: {
      description: "Programmi di benessere emotivo e guarigione integrale per lo sviluppo personale.",
      objective: { content: "Sviluppare e promuovere programmi di benessere emotivo e guarigione integrale per lo sviluppo personale." },
      process: { content: "Gli interessati possono presentare le loro proposte attraverso il nostro portale specializzato, dove saranno valutate dal nostro team di esperti." },
      items: ["Terapie alternative", "Programmi di benessere", "Guarigione olistica", "Sviluppo personale"]
    },
    vivienda: {
      description: "Soluzioni abitative innovative e accessibili per le comunità globali.",
      objective: { content: "Sviluppare e promuovere soluzioni abitative innovative e accessibili per le comunità globali." },
      process: { content: "Gli interessati possono presentare le loro proposte attraverso il nostro portale specializzato, dove saranno valutate dal nostro team di esperti." },
      items: ["Edilizia sociale", "Progetti sostenibili", "Sviluppo urbano", "Abitazioni accessibili"]
    },
    recreacionSocial: {
      description: "Progetti di turismo, ricreazione e servizi alberghieri per lo sviluppo sociale.",
      objective: { content: "Sviluppare e promuovere progetti di turismo, ricreazione e servizi alberghieri per lo sviluppo sociale." },
      process: { content: "Gli interessati possono presentare le loro proposte attraverso il nostro portale specializzato, dove saranno valutate dal nostro team di esperti." },
      items: ["Turismo comunitario", "Centri ricreativi", "Servizi alberghieri", "Sviluppo turistico"]
    },
    sistemasPlatformas: {
      description: "Sviluppo di tecnologie e piattaforme digitali innovative.",
      objective: { content: "Sviluppare e promuovere lo sviluppo di tecnologie e piattaforme digitali innovative." },
      process: { content: "Gli interessati possono presentare le loro proposte attraverso il nostro portale specializzato, dove saranno valutate dal nostro team di esperti." },
      items: ["Piattaforme digitali", "Sistemi tecnologici", "Soluzioni informatiche", "Innovazione tecnologica"]
    },
    bancario: {
      description: "Servizi finanziari alternativi e banca comunitaria.",
      objective: { content: "Sviluppare e promuovere servizi finanziari alternativi e banca comunitaria." },
      process: { content: "Gli interessati possono presentare le loro proposte attraverso il nostro portale specializzato, dove saranno valutate dal nostro team di esperti." },
      items: ["Microfinanza", "Banca comunitaria", "Servizi finanziari", "Sistemi alternativi"]
    },
    ingenieria: {
      description: "Infrastrutture e progetti di ingegneria per lo sviluppo sostenibile.",
      objective: { content: "Sviluppare e promuovere infrastrutture e progetti di ingegneria per lo sviluppo sostenibile." },
      process: { content: "Gli interessati possono presentare le loro proposte attraverso il nostro portale specializzato, dove saranno valutate dal nostro team di esperti." },
      items: ["Infrastrutture", "Ingegneria civile", "Progetti ambientali", "Sviluppo sostenibile"]
    },
    comercial: {
      description: "Attività commerciali e imprenditoriali secondo i principi CHE.",
      objective: { content: "Sviluppare e promuovere attività commerciali e imprenditoriali secondo i principi CHE." },
      process: { content: "Gli interessati possono presentare le loro proposte attraverso il nostro portale specializzato, dove saranno valutate dal nostro team di esperti." },
      items: ["Commercio etico", "Aziende sostenibili", "Commercio equo", "Attività commerciali"]
    },
    investigacionCientifica: {
      description: "Ricerca scientifica e sviluppo di conoscenze innovative.",
      objective: { content: "Sviluppare e promuovere la ricerca scientifica e lo sviluppo di conoscenze innovative." },
      process: { content: "Gli interessati possono presentare le loro proposte attraverso il nostro portale specializzato, dove saranno valutate dal nostro team di esperti." },
      items: ["Ricerca indipendente", "Studi economici", "Sviluppo scientifico", "Ricerca applicata"]
    },
    arteCultura: {
      description: "Manifestazioni artistiche e progetti culturali trasformatori.",
      objective: { content: "Sviluppare e promuovere manifestazioni artistiche e progetti culturali trasformatori." },
      process: { content: "Gli interessati possono presentare le loro proposte attraverso il nostro portale specializzato, dove saranno valutate dal nostro team di esperti." },
      items: ["Espressioni artistiche", "Progetti culturali", "Arte trasformativa", "Manifestazioni creative"]
    }
  }
};

// Lista de fondos a actualizar
const fondos = [
  'editorialMedios', 'sanacionEmocional', 'vivienda', 'recreacionSocial',
  'sistemasPlatformas', 'bancario', 'ingenieria', 'comercial',
  'investigacionCientifica', 'arteCultura'
];

// Lista de idiomas a procesar
const idiomas = ['pt', 'fr', 'de', 'it'];

function actualizarTraducciones() {
  console.log('🚀 Iniciando actualización de traducciones...\n');

  idiomas.forEach(idioma => {
    const rutaArchivo = path.join(__dirname, 'public', 'locales', idioma, 'common.json');
    
    try {
      // Leer archivo actual
      const contenidoActual = fs.readFileSync(rutaArchivo, 'utf8');
      const data = JSON.parse(contenidoActual);
      
      console.log(`📝 Procesando ${idioma.toUpperCase()}...`);
      
      // Verificar que existe la estructura
      if (!data.funds || !data.funds.individual) {
        console.error(`❌ Error: Estructura funds.individual no encontrada en ${idioma}`);
        return;
      }
      
      // Actualizar cada fondo
      fondos.forEach(fondo => {
        if (data.funds.individual[fondo] && translations[idioma][fondo]) {
          // Actualizar solo los campos específicos
          data.funds.individual[fondo].description = translations[idioma][fondo].description;
          data.funds.individual[fondo].objective.content = translations[idioma][fondo].objective.content;
          data.funds.individual[fondo].process.content = translations[idioma][fondo].process.content;
          data.funds.individual[fondo].items = translations[idioma][fondo].items;
          
          console.log(`  ✅ ${fondo} actualizado`);
        }
      });
      
      // Escribir archivo actualizado
      fs.writeFileSync(rutaArchivo, JSON.stringify(data, null, 2), 'utf8');
      console.log(`💾 Archivo ${idioma}/common.json guardado\n`);
      
    } catch (error) {
      console.error(`❌ Error procesando ${idioma}:`, error.message);
    }
  });
  
  console.log('🎉 ¡Actualización completada!');
  console.log('📊 Traducciones aplicadas:');
  console.log(`   - ${fondos.length} fondos`);
  console.log(`   - ${idiomas.length} idiomas`);
  console.log(`   - ${fondos.length * idiomas.length * 4} campos actualizados`);
}

// Ejecutar script
actualizarTraducciones();