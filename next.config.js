/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      // Manejar archivos estáticos con prefijo de idioma
      {
        source: '/:locale/images/:path*',
        destination: '/images/:path*'
      },
      {
        source: '/:locale/documentos/:path*', 
        destination: '/documentos/:path*'
      },
      {
        source: '/:locale/ContenidoProyChe/:path*',
        destination: '/ContenidoProyChe/:path*'
      },
      // También sin prefijo (por si acaso)
      {
        source: '/images/:path*',
        destination: '/images/:path*'
      },
      {
        source: '/documentos/:path*',
        destination: '/documentos/:path*'
      },
      {
        source: '/ContenidoProyChe/:path*',
        destination: '/ContenidoProyChe/:path*'
      }
    ];
  }
};
module.exports = nextConfig;
