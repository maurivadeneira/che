<!-- Archivo: src/templates/kitAutor.handlebars -->
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Kit2 de La Herejía Económica</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      margin: 20px;
    }
    .header {
      text-align: center;
      margin-bottom: 30px;
    }
    .logo {
      max-width: 200px;
      margin-bottom: 10px;
    }
    h1, h2, h3 {
      color: #0055a4;
    }
    .section {
      margin-bottom: 25px;
      padding-bottom: 15px;
      border-bottom: 1px solid #eee;
    }
    .info-block {
      margin-bottom: 15px;
    }
    .info-label {
      font-weight: bold;
    }
    .info-value {
      margin-left: 10px;
    }
    .info-row {
      display: flex;
      margin-bottom: 8px;
    }
    .payment-method {
      margin-bottom: 15px;
      padding: 10px;
      background: #f9f9f9;
      border-radius: 5px;
    }
    .equivalencia {
      font-size: 0.9em;
      color: #666;
      font-style: italic;
    }
    .activation-button {
      display: block;
      margin: 30px auto;
      padding: 15px 25px;
      background-color: #0055a4;
      color: white;
      text-align: center;
      text-decoration: none;
      font-weight: bold;
      border-radius: 5px;
      width: 200px;
    }
    .footer {
      margin-top: 40px;
      font-size: 0.8em;
      text-align: center;
      color: #666;
    }
    
    /* NUEVOS ESTILOS PARA OBRAS DIGITALES */
    .obras-digitales {
      background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
      padding: 20px;
      border-radius: 10px;
      margin: 25px 0;
    }
    .obra-categoria {
      margin-bottom: 20px;
    }
    .obra-categoria h4 {
      color: #0055a4;
      border-bottom: 2px solid #0055a4;
      padding-bottom: 5px;
      margin-bottom: 10px;
    }
    .obra-lista {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 10px;
    }
    .obra-item {
      background: white;
      padding: 12px;
      border-radius: 6px;
      border-left: 4px solid #0055a4;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .obra-titulo {
      font-weight: bold;
      color: #0055a4;
      margin-bottom: 5px;
    }
    .obra-descripcion {
      font-size: 0.9em;
      color: #666;
      margin-bottom: 8px;
    }
    .obra-formato {
      font-size: 0.8em;
      background: #e9ecef;
      padding: 2px 8px;
      border-radius: 3px;
      color: #495057;
    }
    .contenido-destacado {
      background: #fff3cd;
      border: 1px solid #ffeaa7;
      border-radius: 8px;
      padding: 15px;
      margin: 20px 0;
    }
    .valor-total {
      background: #d4edda;
      border: 1px solid #c3e6cb;
      border-radius: 8px;
      padding: 15px;
      margin: 20px 0;
      text-align: center;
    }
    .precio-normal {
      text-decoration: line-through;
      color: #dc3545;
      font-size: 1.2em;
    }
    .precio-kit {
      color: #28a745;
      font-size: 1.5em;
      font-weight: bold;
    }
  </style>
</head>
<body>
  <div class="header">
    <img src="data:image/png;base64,{{logoBase64}}" alt="Logo Herejía Económica" class="logo">
    <h1>Kit2 de La Herejía Económica</h1>
    <p>ID: {{kitId}} | Fecha: {{fechaCreacion}}</p>
  </div>

  <!-- NUEVA SECCIÓN: CONTENIDO DEL KIT2 -->
  <div class="section obras-digitales">
    <h2>📚 CONTENIDO COMPLETO DEL KIT2</h2>
    <div class="contenido-destacado">
      <p><strong>¡Acceso completo a toda la biblioteca digital de La Herejía Económica!</strong></p>
      <p>Más de 13 obras fundamentales que transformarán tu comprensión económica.</p>
    </div>

    <div class="obra-categoria">
      <h4>📖 LIBROS COMPLETOS (5 obras)</h4>
      <div class="obra-lista">
        <div class="obra-item">
          <div class="obra-titulo">LIBRO PRIMERO</div>
          <div class="obra-descripcion">Fundamentos de la nueva economía post-capitalista</div>
          <span class="obra-formato">PDF • {{#if obrasDigitales.libros.libro1.paginas}}{{obrasDigitales.libros.libro1.paginas}} páginas{{else}}Extenso{{/if}}</span>
        </div>
        <div class="obra-item">
          <div class="obra-titulo">LIBRO SEGUNDO</div>
          <div class="obra-descripcion">Análisis profundo del sistema económico actual</div>
          <span class="obra-formato">PDF • {{#if obrasDigitales.libros.libro2.paginas}}{{obrasDigitales.libros.libro2.paginas}} páginas{{else}}Extenso{{/if}}</span>
        </div>
        <div class="obra-item">
          <div class="obra-titulo">LIBRO TERCERO</div>
          <div class="obra-descripcion">Propuestas para el nuevo paradigma económico</div>
          <span class="obra-formato">PDF • {{#if obrasDigitales.libros.libro3.paginas}}{{obrasDigitales.libros.libro3.paginas}} páginas{{else}}Extenso{{/if}}</span>
        </div>
        <div class="obra-item">
          <div class="obra-titulo">LIBRO CUARTO</div>
          <div class="obra-descripcion">Implementación práctica de los nuevos modelos</div>
          <span class="obra-formato">PDF • {{#if obrasDigitales.libros.libro4.paginas}}{{obrasDigitales.libros.libro4.paginas}} páginas{{else}}Extenso{{/if}}</span>
        </div>
        <div class="obra-item">
          <div class="obra-titulo">LIBRO QUINTO</div>
          <div class="obra-descripcion">El futuro de la economía mundial</div>
          <span class="obra-formato">PDF • {{#if obrasDigitales.libros.libro5.paginas}}{{obrasDigitales.libros.libro5.paginas}} páginas{{else}}Extenso{{/if}}</span>
        </div>
      </div>
    </div>

    <div class="obra-categoria">
      <h4>📄 ARTÍCULOS ESPECIALIZADOS (8+ obras)</h4>
      <div class="obra-lista">
        <div class="obra-item">
          <div class="obra-titulo">COMPROBADO</div>
          <div class="obra-descripcion">Evidencias irrefutables del nuevo modelo económico</div>
          <span class="obra-formato">PDF • Artículo académico</span>
        </div>
        <div class="obra-item">
          <div class="obra-titulo">DOS PROBLEMAS FUNDAMENTALES</div>
          <div class="obra-descripcion">Análisis crítico de las fallas del sistema actual</div>
          <span class="obra-formato">PDF • Investigación profunda</span>
        </div>
        {{#each obrasDigitales.articulos}}
        <div class="obra-item">
          <div class="obra-titulo">{{titulo}}</div>
          <div class="obra-descripcion">{{descripcion}}</div>
          <span class="obra-formato">PDF • {{tipo}}</span>
        </div>
        {{/each}}
      </div>
    </div>

    {{#if obrasDigitales.videos}}
    <div class="obra-categoria">
      <h4>🎥 CONFERENCIAS Y VIDEOS</h4>
      <div class="obra-lista">
        {{#each obrasDigitales.videos}}
        <div class="obra-item">
          <div class="obra-titulo">{{titulo}}</div>
          <div class="obra-descripcion">{{descripcion}}</div>
          <span class="obra-formato">VIDEO • {{duracion}}</span>
        </div>
        {{/each}}
      </div>
    </div>
    {{/if}}

    <div class="valor-total">
      <h3>💰 VALOR REAL DEL CONTENIDO</h3>
      <p>Valor individual de cada obra: <span class="precio-normal">US$150+ cada una</span></p>
      <p>Valor total del Kit2: <span class="precio-normal">US$2,000+</span></p>
      <p>Tu inversión en el Kit2: <span class="precio-kit">US$27 total</span></p>
      <p><strong>¡Más del 98% de descuento por tiempo limitado!</strong></p>
    </div>
  </div>

  <div class="section">
    <h2>Información del Propietario</h2>
    <div class="info-block">
      <div class="info-row">
        <span class="info-label">Nombre:</span>
        <span class="info-value">{{autor.nombre}}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Email:</span>
        <span class="info-value">{{autor.email}}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Teléfono:</span>
        <span class="info-value">{{autor.telefono}}</span>
      </div>
      <div class="info-row">
        <span class="info-label">País:</span>
        <span class="info-value">{{autor.pais}}</span>
      </div>
    </div>
    
    <h3>Métodos de Pago del Propietario</h3>
    {{#each autor.metodosPago}}
      <div class="payment-method">
        <div class="info-row">
          <span class="info-label">Tipo:</span>
          <span class="info-value">{{tipo}}</span>
        </div>
        {{#if banco}}
        <div class="info-row">
          <span class="info-label">Banco:</span>
          <span class="info-value">{{banco}}</span>
        </div>
        {{/if}}
        {{#if numeroCuenta}}
        <div class="info-row">
          <span class="info-label">Número de Cuenta:</span>
          <span class="info-value">{{numeroCuenta}}</span>
        </div>
        {{/if}}
        {{#if tipoCuenta}}
        <div class="info-row">
          <span class="info-label">Tipo de Cuenta:</span>
          <span class="info-value">{{tipoCuenta}}</span>
        </div>
        {{/if}}
        {{#if email}}
        <div class="info-row">
          <span class="info-label">Email:</span>
          <span class="info-value">{{email}}</span>
        </div>
        {{/if}}
        {{#if direccionCripto}}
        <div class="info-row">
          <span class="info-label">Dirección:</span>
          <span class="info-value">{{direccionCripto}}</span>
        </div>
        {{/if}}
        {{#if red}}
        <div class="info-row">
          <span class="info-label">Red:</span>
          <span class="info-value">{{red}}</span>
        </div>
        {{/if}}
        {{#if monedaPreferida}}
        <div class="info-row">
          <span class="info-label">Moneda Preferida:</span>
          <span class="info-value">{{monedaPreferida}}</span>
        </div>
        {{/if}}
      </div>
    {{/each}}
  </div>
  
  <div class="section">
    <h2>Información del Beneficiario</h2>
    <div class="info-block">
      <div class="info-row">
        <span class="info-label">Nombre:</span>
        <span class="info-value">{{beneficiario.nombre}}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Email:</span>
        <span class="info-value">{{beneficiario.email}}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Teléfono:</span>
        <span class="info-value">{{beneficiario.telefono}}</span>
      </div>
      <div class="info-row">
        <span class="info-label">País:</span>
        <span class="info-value">{{beneficiario.pais}}</span>
      </div>
    </div>
    
    <h3>Métodos de Pago del Beneficiario</h3>
    {{#each beneficiario.metodosPago}}
      <div class="payment-method">
        <div class="info-row">
          <span class="info-label">Tipo:</span>
          <span class="info-value">{{tipo}}</span>
        </div>
        {{#if banco}}
        <div class="info-row">
          <span class="info-label">Banco:</span>
          <span class="info-value">{{banco}}</span>
        </div>
        {{/if}}
        {{#if numeroCuenta}}
        <div class="info-row">
          <span class="info-label">Número de Cuenta:</span>
          <span class="info-value">{{numeroCuenta}}</span>
        </div>
        {{/if}}
        {{#if tipoCuenta}}
        <div class="info-row">
          <span class="info-label">Tipo de Cuenta:</span>
          <span class="info-value">{{tipoCuenta}}</span>
        </div>
        {{/if}}
        {{#if email}}
        <div class="info-row">
          <span class="info-label">Email:</span>
          <span class="info-value">{{email}}</span>
        </div>
        {{/if}}
        {{#if direccionCripto}}
        <div class="info-row">
          <span class="info-label">Dirección:</span>
          <span class="info-value">{{direccionCripto}}</span>
        </div>
        {{/if}}
        {{#if red}}
        <div class="info-row">
          <span class="info-label">Red:</span>
          <span class="info-value">{{red}}</span>
        </div>
        {{/if}}
        {{#if monedaPreferida}}
        <div class="info-row">
          <span class="info-label">Moneda Preferida:</span>
          <span class="info-value">{{monedaPreferida}}</span>
        </div>
        {{/if}}
      </div>
    {{/each}}
  </div>
  
  <div class="section">
    <h2>DONACIONES REQUERIDAS</h2>
    <p>Para adquirir el Kit2, debe realizar dos donaciones:</p>
    <ul>
      <li>
        {{donacionesRequeridas.beneficiario.monto}} a {{donacionesRequeridas.beneficiario.nombre}}
        {{#if donacionesRequeridas.beneficiario.montoUSD}}
          <span class="equivalencia">(equivalente a {{donacionesRequeridas.beneficiario.montoUSD}})</span>
        {{/if}}
      </li>
      <li>
        {{donacionesRequeridas.corporacion.monto}} a la Corporación Herejía Económica
        {{#if donacionesRequeridas.corporacion.montoUSD}}
          <span class="equivalencia">(equivalente a {{donacionesRequeridas.corporacion.montoUSD}})</span>
        {{/if}}
      </li>
    </ul>

    {{#if observaciones}}
    <h3>Observaciones</h3>
    <p>{{observaciones}}</p>
    {{/if}}
  </div>
  
  <a href="{{activationUrl}}/activate-kit?id={{kitId}}" class="activation-button">
    QUIERO MI KIT2
  </a>
  
  <div class="footer">
    <p>Este Kit2 es parte de La Herejía Económica. Todos los derechos reservados.</p>
    <p>Para más información visita <a href="https://corpherejiaeconomica.com">corpherejiaeconomica.com</a></p>
  </div>
</body>
</html>