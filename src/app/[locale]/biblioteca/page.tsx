'use client';

import Link from 'next/link';
import { useTranslation } from '@/components/providers/TranslationProvider';
import { useParams } from 'next/navigation';

export default function BibliotecaPage() {
  const { t } = useTranslation();
  const params = useParams();
  const locale = params.locale as string;

  // Función para obtener el PDF correcto según el idioma
  const getAnalysisComprehensivePDF = (currentLocale: string) => {
    const pdfPaths: { [key: string]: string } = {
      'es': '/documentos/analisis-comprehensivo/ANALISIS_COMPREHENSIVO.pdf',
      'en': '/documentos/analisis-comprehensivo/en/ANALISIS_COMPREHENSIVO.pdf',
      'pt': '/documentos/analisis-comprehensivo/pt/ANALISIS_COMPREHENSIVO.pdf',
      'fr': '/documentos/analisis-comprehensivo/fr/ANALISIS_COMPREHENSIVO.pdf',
      'de': '/documentos/analisis-comprehensivo/de/ANALISIS_COMPREHENSIVO.pdf',
      'it': '/documentos/analisis-comprehensivo/it/ANALISIS_COMPREHENSIVO.pdf'
    };
    return pdfPaths[currentLocale] || pdfPaths['es'];

  // Función para obtener el PDF del Comentario según idioma
  const getComentarioLibroPrimeroPDF = (currentLocale: string) => {
    const pdfPaths: { [key: string]: string } = {
      'es': '/documentos/comentario-libro-primero/COMENTARIO_LIBRO_PRIMERO.pdf',
      'en': '/documentos/comentario-libro-primero/en/COMENTARIO_LIBRO_PRIMERO.pdf',
      'pt': '/documentos/comentario-libro-primero/pt/COMENTARIO_LIBRO_PRIMERO.pdf',
      'fr': '/documentos/comentario-libro-primero/fr/COMENTARIO_LIBRO_PRIMERO.pdf',
      'de': '/documentos/comentario-libro-primero/de/COMENTARIO_LIBRO_PRIMERO.pdf',
      'it': '/documentos/comentario-libro-primero/it/COMENTARIO_LIBRO_PRIMERO.pdf'
    };
    return pdfPaths[currentLocale] || pdfPaths['es'];
  };
  };

  const libros = [
    { titleKey: 'analisisComprehensivo', file: getAnalysisComprehensivePDF(locale), useCustomTranslation: true },
    { titleKey: 'comentarioLibroPrimero', file: getComentarioLibroPrimeroPDF(locale), useCustomTranslation: true },
    { titleKey: 'firstBook', file: '/documentos/libros/LIBRO_PRIMERO.pdf' },
    { titleKey: 'secondBook', file: '/documentos/libros/LIBRO_SEGUNDO.pdf' },
    { titleKey: 'firstBookCommentary', file: '/documentos/libros/ComentarioLibroPrimero.pdf' },
    { titleKey: 'secondBookPresentation', file: '/documentos/libros/PresentacionLibroSegundo.pdf' },
  ];

  const articulos = [
    { titleKey: 'proven', file: '/documentos/articulos/COMPROBADO.pdf' },
    { titleKey: 'twoFundamentalProblems', file: '/documentos/articulos/DOS PROBLEMAS FUNDAMENTALES.pdf' },
    { titleKey: 'worldEconomySOS', file: '/documentos/articulos/ECONOMIA MUNDIAL SOS.pdf' },
    { titleKey: 'savingsInColombia', file: '/documentos/articulos/EL AHORRO EN COLOMBIA ERROR CONCEPTUAL.pdf' },
    { titleKey: 'inertialInflation', file: '/documentos/articulos/EL PROBLEMA DE LA INFLACIÓN INERCIAL.pdf' },
    { titleKey: 'fiscalDeficit', file: '/documentos/articulos/EL PROBLEMA DEL DEFICIT FISCAL.pdf' },
    { titleKey: 'checkToWorldSystem', file: '/documentos/articulos/JAQUE AL SISTEMA ECONOMICO MUNDIAL.pdf' },
    { titleKey: 'hereticEconomistReflections', file: '/documentos/articulos/ReflexionesEconomistaHereje (1).docx.pdf' },
  ];

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">{t('library.title')}</h1>
        
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-6 text-blue-600">{t('library.books')}</h2>
            <div className="space-y-4">
              {libros.map((libro, index) => (
                <div key={index} className="border-l-4 border-blue-200 pl-4 py-2">
                  <Link 
                    href={libro.file} 
                    target="_blank"
                    className="text-lg font-medium hover:text-blue-600 transition-colors block"
                  >
                    {libro.useCustomTranslation 
                      ? t(`biblioteca.${libro.titleKey}`)
                      : t(`library.bookTitles.${libro.titleKey}`)
                    }
                  </Link>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-6 text-green-600">{t('library.articles')}</h2>
            <div className="space-y-4">
              {articulos.map((articulo, index) => (
                <div key={index} className="border-l-4 border-green-200 pl-4 py-2">
                  <Link 
                    href={articulo.file} 
                    target="_blank"
                    className="text-lg font-medium hover:text-green-600 transition-colors block"
                  >
                    {t(`library.articleTitles.${articulo.titleKey}`)}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
