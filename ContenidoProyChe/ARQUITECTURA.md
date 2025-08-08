# Arquitectura del Sistema Kit de la Herejía

## 1. Visión General

Sistema de distribución basado en donaciones que permite la adquisición y distribución del "Kit de la Herejía" mediante un modelo de referidos y donaciones distribuidas.

- **Dominio**: corpherejiaeconomica.com
- **Base de datos**: MongoDB en la nube (MongoDB Atlas)
- **Stack tecnológico**: MERN (MongoDB, Express, React, Node.js)

## 2. Arquitectura del Sistema

### 2.1 Componentes Principales

1. **Frontend**:
   - React.js como SPA (Single Page Application)
   - Interfaz de usuario para registro, activación y seguimiento del Kit
   - Panel de administración para gestión del sistema

2. **Backend**:
   - Node.js/Express para API RESTful
   - Servicios de autenticación y autorización
   - Generación dinámica de PDFs
   - Integración con servicios de email y WhatsApp

3. **Base de Datos**:
   - MongoDB Atlas (en la nube)
   - Escalable globalmente
   - Respaldos automáticos

4. **Servicios Externos**:
   - Pasarelas de pago (Stripe, PayPal, Mercado Pago, Wompi)
   - Servicios de email (SendGrid/Mailjet)
   - WhatsApp Business API
   - Almacenamiento de archivos (AWS S3/Google Cloud Storage)

### 2.2 Flujo de Trabajo del Sistema

1. **Registro del Usuario**:
   - Usuario se registra (nivel 1)
   - Recibe email de verificación
   - Cuenta básica activada

2. **Invitación al Sistema Kit**:
   - Usuario con kit activo genera una invitación
   - Sistema registra la invitación en la BD
   - Se envía email con link único al invitado

3. **Activación del Kit**:
   - Invitado sigue el link y completa información nivel 2
   - Sistema muestra información de pago para donaciones
   - Usuario confirma donaciones (sube comprobantes)
   - Admin/sistema verifica las donaciones
   - Sistema genera PDF personalizado
   - Envío automático del PDF por email

4. **Generación de Invitaciones**:
   - Usuario con kit activo puede generar múltiples invitaciones
   - Sistema registra todas las invitaciones y su estado
   - Sistema permite seguimiento de la cadena de referidos

## 3. Modelo de Datos

### 3.1 Usuarios

```javascript
{
  _id: ObjectId,
  email: String (único, indexado),
  nombre: String,
  contraseña: String (hash),
  fechaRegistro: Date,
  nivelAcceso: Number (1: básico, 2: kit activado),
  verificado: Boolean,
  últimoAcceso: Date
}
3.2 Perfiles Kit
javascript{
  _id: ObjectId,
  usuarioId: ObjectId (referencia a Usuarios),
  informacionCompleta: {
    dirección: String,
    teléfono: String,
    país: String,
    ciudad: String,
    documentoIdentidad: String
  },
  datosPago: {
    metodosPago: [
      {
        tipo: String (paypal, banco, etc.),
        detalles: {
          cuenta: String,
          titular: String,
          banco: String,
          swift: String,
          adicional: String
        },
        fechaCreacion: Date,
        activo: Boolean,
        pais: String,
        monedaPreferida: String
      }
    ],
    historialCambios: [
      {
        fecha: Date,
        tipoCambio: String,
        detallesAnteriores: Object,
        detallesNuevos: Object
      }
    ]
  },
  kitInfo: {
    fechaActivación: Date,
    referidoPor: ObjectId (quién lo invitó),
    kitId: String (identificador único del kit),
    estado: String (activo, suspendido, etc.)
  },
  estadísticas: {
    personasReferidas: Number,
    donacionesRecibidas: Number,
    donacionesTotales: Number
  }
}
3.3 Invitaciones
javascript{
  _id: ObjectId,
  invitadorId: ObjectId (quién envió la invitación),
  email: String (email del invitado),
  enlaceUnico: String,
  fechaCreación: Date,
  estado: String (pendiente, aceptada, completada),
  fechaActivación: Date
}
3.4 Transacciones
javascript{
  _id: ObjectId,
  tipo: String (donacion, comision, reembolso),
  donadorId: ObjectId,
  receptorId: ObjectId,
  monto: Number,
  monedaOriginal: String,
  montoEquivalenteUSD: Number,
  tasaCambioAplicada: Number,
  fechaTransaccion: Date,
  metodoPago: {
    proveedor: String,
    referenciaPago: String,
    estado: String
  },
  verificacion: {
    verificado: Boolean,
    fechaVerificacion: Date,
    verificadoPor: String (sistema, admin, automático)
  },
  metadatos: Object // Para datos específicos del proveedor
}
3.5 PDF Personalizados
javascript{
  _id: ObjectId,
  usuarioId: ObjectId,
  kitId: String,
  urlArchivo: String,
  fechaCreación: Date,
  versionDocumento: String,
  activo: Boolean
}
3.6 Configuración de Pasarelas
javascript{
  _id: ObjectId,
  proveedor: String,
  paisesDisponibles: [String],
  monedasSoportadas: [String],
  comisionPorcentaje: Number,
  comisionFija: Number,
  activo: Boolean,
  configuracion: Object, // Configuración específica del proveedor
  limitesTransaccion: {
    minimo: Number,
    maximo: Number
  }
}
3.7 Progresión de Red
javascript{
  _id: ObjectId,
  usuarioRaiz: ObjectId,
  fechaInicio: Date,
  nivelActual: Number,
  estadoRed: String (creciendo, estable, decreciendo),
  nodos: [
    {
      usuarioId: ObjectId,
      nivel: Number,
      padreId: ObjectId,
      fechaActivacion: Date,
      estadoActividad: String,
      hijosDirectos: Number,
      totalDescendientes: Number
    }
  ],
  metricas: {
    tasaCrecimiento: Number,
    tiempoPromedioActivacion: Number,
    conversionInvitaciones: Number,
    donacionesTotales: Number
  },
  ultimaActualizacion: Date
}
4. Seguridad

Autenticación: JWT con rotación de tokens
Contraseñas: Hashing con bcrypt
Conexiones: HTTPS para toda la aplicación
API: Rate limiting y protección contra ataques
Datos sensibles: Encriptación de datos en reposo
Acceso a la base de datos: IP whitelisting
Auditoría: Logs de todas las transacciones críticas

5. Respaldo y Persistencia

Copias de Seguridad Automáticas:

Backups diarios de la base de datos completa
Backups incrementales cada 6 horas
Retención: diarios (30 días), semanales (3 meses), mensuales (1 año)


Versionado de Documentos:

Historial de cambios para documentos importantes
Sistema de versionado para no sobrescribir datos críticos


Registro de Auditoría:

Logging extensivo de todas las operaciones críticas
Registro inmutable para cambios sensibles
Dashboard de auditoría para administradores



6. Plan de Implementación
Fase 1: Infraestructura Base (2-3 semanas)

Configuración de servidores y MongoDB Atlas
Estructura básica de la API con Express
Sistema de autenticación y autorización
Frontend básico con React

Fase 2: Funcionalidad del Kit (3-4 semanas)

Sistema de invitaciones y referidos
Generación de PDFs personalizados
Integración con email y WhatsApp
Panel de usuario básico

Fase 3: Sistema de Pagos (2-3 semanas)

Integración con pasarelas de pago iniciales (Stripe, PayPal)
Sistema de verificación de donaciones
Panel de administración para transacciones

Fase 4: Análisis y Expansión (3-4 semanas)

Visualización de la red y progresión
Estadísticas y reportes avanzados
Integración con pasarelas locales adicionales
Optimización y escalabilidad

Fase 5: Refinamiento y Lanzamiento (2 semanas)

Pruebas de seguridad y rendimiento
Documentación completa
Capacitación para administradores
Lanzamiento y monitoreo inicial