# PROMPT MAESTRO CHE - ESPECIFICACIÓN TÉCNICA COMPLETA

## 1. RESUMEN EJECUTIVO DEL PROYECTO

### 1.1 ENTIDAD JURÍDICA BASE
```
Corporación: CORPORACION HEREJIA ECONOMICA C.H.E. MUNDO LIBRE
Naturaleza: Corporación sin ánimo de lucro, carácter internacional
Fundación: 5 de Marzo de 2014
Sede Principal: Bogotá D.C., Colombia
RUT/NIT: [Por renovar]
Email: contacto@corpherejiaeconomica.com
Dominio: corpherejiaeconomica.com
```

### 1.2 OBJETO CORPORATIVO
**Artículo 4-6:** Divulgar teoría "Herejía Económica" para lograr libertad económica global mediante procesos que permitan generar ingresos, educación virtual, mercadeo multinivel y tecnología limpia.

### 1.3 MODELO DE CONCESIÓN VIGENTE
- Mauricio Rivadeneira: 20% ingresos por explotación obras
- CHE Corporación: 80% para operación y expansión
- Vigencia: 10 años renovables

### 1.4 LOS 11 FONDOS ROTATORIOS ESTATUTARIOS
1. Inversión Empresarial
2. Editorial y Medios Audiovisuales
3. Sanación Emocional (descartado por riesgos legales)
4. Vivienda
5. Recreación Social y Hotelera
6. Sistemas y Plataformas
7. Bancario
8. Proyectos de Ingeniería
9. Comercial
10. Investigación Científica
11. Arte y Cultura

---

## 2. MODELOS DE NEGOCIO

### 2.1 MODELO A: AUTOR INDIVIDUAL
**Flujo:** CHE maneja pagos → CHE entrega contenido (PDFs permanentes) → CHE distribuye comisiones

**Ejemplo:** Kit2 Mauricio Rivadeneira

**Características:**
- Propiedad permanente de archivos
- Exclusividad opcional a CHE
- Reparto: Autor 20-30%, CHE 70-80%

### 2.2 MODELO B: INSTITUCIONAL
**Flujo:** Usuario paga directamente a Instituto X → Instituto entrega su producto → CHE cobra comisión después

**Ejemplo:** Kit2 Instituto Educativo X

**Características:**
- CHE como facilitador puro
- Sin responsabilidad operativa de CHE
- Reparto: Instituto 85-95%, CHE 5-15%

### 2.3 SISTEMA KIT2 UNIVERSAL
**Componentes:**
- PDF catálogo personalizado (nombres obras, no contenido)
- Vigencia: 1 año exacto
- Renovación = nueva compra completa
- Distribución viral: Usuario 0→1→2→3...
- Comisiones configurables por acuerdo
- Usuario puede comprar múltiples Kit2s simultáneamente

---

## 3. ARQUITECTURA DE USUARIOS Y ROLES

### 3.1 ESTRUCTURA BASE
```sql
users/
├── tipo_cuenta: enum('individual', 'institucional')
├── estado: enum('activo', 'pendiente_verificacion', 'suspendido')
└── configuracion_personalizada: json

user_roles/ (múltiples por usuario)
├── comprador (todos por defecto)
├── autor (individual)
├── representante_legal (institucional)
└── admin_institucional
```

### 3.2 REPRESENTANTES AUTORIZADOS
```sql
authorized_representatives/
├── institutional_user_id: FK
├── representative_user_id: FK
├── nivel_autorizacion: enum('basico', 'completo', 'admin')
├── documento_poder: string
└── estado: enum('activo', 'revocado')
```

---

## 4. SISTEMA KIT2 - ESPECIFICACIÓN COMPLETA

### 4.1 ARQUITECTURA KIT2
```sql
kit2_templates/ (configuración base reutilizable)
├── creador_id: FK(user_id)
├── tipo_creador: enum('individual', 'institucional')
├── nombre_kit2: string
├── precio_base_usd: decimal(10,2)
├── configuracion_comisiones: json
└── version_actual: string

kit2_instances/ (cada venta individual)
├── template_id: FK
├── comprador_id: FK(user_id)
├── precio_pagado_usd: decimal(10,2)
├── fecha_compra: timestamp
├── fecha_expiracion: timestamp (+1 año exacto)
├── posicion_cadena: integer
├── referido_por: FK(user_id)
├── estado: enum('activo', 'expirado')
└── archivo_pdf_personalizado_url: string
```

### 4.2 CONTENIDO Y VERSIONING
```sql
content_catalogs/
├── propietario_id: FK(user_id)
├── tipo_propietario: enum('individual', 'institucional')
└── categoria_principal: string

content_items/
├── catalog_id: FK
├── titulo: string
├── tipo_contenido: enum('libro', 'articulo', 'curso', 'video')
├── formato: enum('pdf', 'video', 'audio', 'html')
├── version: string (nunca se quitan obras, solo versiones)
├── precio_sugerido_usd: decimal(10,2)
└── archivo_url: string
```

**REGLA INTEGRIDAD INTELECTUAL:** Nunca quitar obras, solo reemplazar por nueva versión con explicación de cambio.

---

## 5. STACK TECNOLÓGICO ENTERPRISE

### 5.1 FRONTEND
```typescript
Framework: Next.js 14+ (App Router)
├── TypeScript (tipado fuerte)
├── Tailwind CSS + Shadcn/UI
├── React Hook Form + Zod validation
├── Zustand (estado global)
├── React Query (cache/sync)
└── next-i18next (ES/EN)
```

### 5.2 BACKEND
```typescript
Runtime: Node.js + TypeScript
├── tRPC (APIs type-safe)
├── NextAuth.js (auth)
├── Prisma ORM
├── Zod validation
└── Rate limiting + security
```

### 5.3 INFRAESTRUCTURA GRATUITA (DESARROLLO)
```yaml
Hosting: Vercel (gratis hasta 100GB)
Database: Supabase PostgreSQL (gratis hasta 500MB)
Storage: Supabase Storage (gratis 1GB)
Email: Resend (3000 emails gratis)
Cache: Upstash Redis (gratis 10k requests)
Payments: Stripe (solo % transacciones)
```

### 5.4 SERVICIOS ADICIONALES
```typescript
PDF Generation: Puppeteer + React-PDF
Analytics: Posthog (gratis 1M eventos)
Monitoring: Sentry (gratis tier)
Background Jobs: Inngest
Security: reCAPTCHA, rate limiting
Testing: Jest + Playwright
Internationalization: next-i18next
```

---

## 6. BASE DE DATOS DETALLADA

### 6.1 CONFIGURACIONES FLEXIBLES
```sql
commission_configs/
├── entity_id: FK(user_id)
├── tipo_entidad: enum('individual', 'institucional')
├── descuento_base_porcentaje: decimal(5,2)
├── comision_usuarios_porcentaje: decimal(5,2)
├── comision_corporacion_porcentaje: decimal(5,2)
├── vigencia_meses: integer
├── precio_minimo_usd: decimal(10,2)
├── precio_maximo_usd: decimal(10,2)
├── fecha_vigencia_desde: timestamp
├── fecha_vigencia_hasta: timestamp
└── configurado_por: FK(admin_user_id)
```

### 6.2 CONTRATOS DIFERENCIADOS
```sql
contracts/
├── contratante_id: FK(user_id)
├── tipo_contrato: enum('editorial_individual', 'editorial_institucional', 'kit2_individual', 'kit2_institucional')
├── contenido_asociado: json
├── terminos_especificos: json
├── fecha_firma: timestamp
├── fecha_expiracion: timestamp
├── estado: enum('vigente', 'vencido', 'terminado')
├── firma_digital_hash: string
└── documento_pdf_url: string
```

### 6.3 TRANSACCIONES Y PAGOS
```sql
transactions/
├── kit2_instance_id: FK
├── comprador_id: FK(user_id)
├── vendedor_id: FK(user_id)
├── monto_base_usd: decimal(10,2)
├── comision_usuario_usd: decimal(10,2)
├── comision_corporacion_usd: decimal(10,2)
├── monto_autor_usd: decimal(10,2)
├── metodo_pago: enum('paypal', 'stripe', 'directo_institucion')
├── transaction_id_externa: string
├── estado: enum('pendiente', 'completada', 'fallida')
├── fecha_transaccion: timestamp
└── datos_pago: json
```

### 6.4 CADENA DISTRIBUTIVA
```sql
distribution_chain/
├── kit2_template_id: FK
├── nivel_actual: integer
├── ventas_totales: integer
├── ingresos_generados_usd: decimal(12,2)
├── usuarios_activos_cadena: integer
└── fecha_ultima_venta: timestamp

chain_positions/
├── kit2_template_id: FK
├── posicion: integer
├── user_id: FK
├── fecha_ingreso: timestamp
├── ventas_realizadas: integer
└── comisiones_ganadas_usd: decimal(10,2)
```

---

## 7. APIS Y ENDPOINTS

### 7.1 AUTENTICACIÓN
```typescript
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
POST /api/auth/logout
POST /api/auth/verify-email
```

### 7.2 GESTIÓN USUARIOS
```typescript
GET    /api/users/profile
PUT    /api/users/profile
POST   /api/users/upload-documents
GET    /api/users/roles
POST   /api/users/activate-role
```

### 7.3 CONTENIDO Y KIT2s
```typescript
GET    /api/content/catalog
POST   /api/content/upload
PUT    /api/content/update
DELETE /api/content/remove

GET    /api/kit2/templates
POST   /api/kit2/create-template
POST   /api/kit2/purchase
GET    /api/kit2/generate-pdf
GET    /api/kit2/my-instances
```

### 7.4 PAGOS Y COMISIONES
```typescript
POST   /api/payments/create-intent
POST   /api/payments/confirm
GET    /api/payments/history
GET    /api/commissions/calculate
POST   /api/commissions/distribute
```

### 7.5 ADMINISTRACIÓN
```typescript
GET    /api/admin/users
GET    /api/admin/analytics
POST   /api/admin/approve-author
PUT    /api/admin/commission-config
GET    /api/admin/transactions
```

---

## 8. FLUJOS OPERATIVOS COMPLETOS

### 8.1 FLUJO MODELO A (Individual)
1. **Mauricio sube contenido** → Panel editorial
2. **CHE + Mauricio colaboran** → Configuran Kit2 template
3. **CHE genera** → Primer Kit2 personalizado para Mauricio
4. **Mauricio inicia** → Distribución como Usuario 0
5. **Usuario compra** → Pago directo a CHE
6. **CHE entrega** → PDFs permanentes + Kit2 personalizado
7. **Usuario se vuelve** → Vendedor en cadena distributiva

### 8.2 FLUJO MODELO B (Institucional)
1. **Instituto X negocia** → Acuerdo con CHE (comisión %)
2. **CHE crea** → Kit2 template institucional
3. **Usuario clic** → Redirige a pasarela Instituto X
4. **Usuario paga** → Directamente a Instituto X
5. **Instituto entrega** → Su producto (cursos/acceso)
6. **CHE entrega** → Kit2 personalizado al usuario
7. **Instituto paga** → Comisión acordada a CHE

---

## 9. FUNCIONALIDADES POR MÓDULO

### 9.1 MÓDULO AUTENTICACIÓN
- Registro único multi-rol
- Verificación email/SMS
- Autenticación multi-factor
- Gestión sesiones seguras
- Recovery passwords

### 9.2 MÓDULO GESTIÓN CONTENIDO
- Upload múltiples formatos
- Versioning automático
- Metadatos enriquecidos
- Preview generation
- Storage optimizado

### 9.3 MÓDULO KIT2
- Generación PDFs dinámicos
- Personalización automática
- Template management
- Distribution tracking
- Expiration management

### 9.4 MÓDULO PAGOS
- Multi-gateway (Stripe/PayPal)
- Cálculo comisiones automático
- Manejo divisas múltiples
- Fraud detection
- Reconciliación automática

### 9.5 MÓDULO ANALYTICS
- Dashboard tiempo real
- Métricas conversión
- Tracking cadenas distributivas
- Reportes financieros
- Export datos

### 9.6 MÓDULO ADMIN
- Gestión usuarios/roles
- Configuración comisiones
- Aprobación contenido
- Monitoring sistema
- Audit trails

---

## 10. CONFIGURACIÓN DEPLOYMENT

### 10.1 VARIABLES DE ENTORNO
```env
# Database
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."

# Auth
NEXTAUTH_SECRET="..."
NEXTAUTH_URL="https://corpherejiaeconomica.com"

# Payments
STRIPE_SECRET_KEY="sk_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Email
RESEND_API_KEY="re_..."

# Storage
SUPABASE_URL="https://..."
SUPABASE_ANON_KEY="..."

# Analytics
POSTHOG_KEY="..."
```

### 10.2 DEPLOYMENT VERCEL
```json
{
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/next"
    }
  ],
  "env": {
    "DATABASE_URL": "@database-url",
    "NEXTAUTH_SECRET": "@nextauth-secret"
  }
}
```

---

## 11. SEGURIDAD Y COMPLIANCE

### 11.1 MEDIDAS SEGURIDAD
- HTTPS obligatorio
- Rate limiting APIs
- Input validation (Zod)
- SQL injection prevention
- XSS protection
- CSRF tokens
- File upload restrictions

### 11.2 PROTECCIÓN DATOS
- Encriptación datos sensibles
- PII anonymization
- Audit logs
- GDPR compliance ready
- Data retention policies

### 11.3 BACKUP Y RECOVERY
- Automated daily backups
- Point-in-time recovery
- Disaster recovery plan
- Multi-region redundancy

---

## 12. PLAN DE DESARROLLO ENTERPRISE

### 12.1 FASE 1: DESARROLLO LIMPIO (Meses 1-4)
- Crear proyecto Next.js 14 completamente nuevo
- Implementar stack enterprise completo
- Migrar solo contenido (archivos) del proyecto anterior
- Zero legacy code
- Clean architecture desde inicio

### 12.2 FASE 2: FEATURES AVANZADAS (Meses 5-8)
- Dashboard analytics completo
- Panel admin robusto
- Multi-idioma (ES/EN)
- Optimizaciones performance
- Testing automatizado completo

### 12.3 FASE 3: ESCALAMIENTO (Meses 9-12)
- Modelo B institucional completo
- APIs documentadas y públicas
- Integraciones avanzadas
- Monitoring y alertas
- Go-to-market strategy

### 12.4 FASE 4: EXPANSIÓN GLOBAL (Meses 13-18)
- Multi-región deployment
- Compliance internacional
- AI/ML features
- Mobile applications
- Enterprise features

---

## 13. CONSIDERACIONES FINALES

### 13.1 FRONTEND MODIFICACIONES
- **Cambiar:** "Kit Heresy" → "Explicación Kit2"
- **Agregar:** Barra navegación superior: "Registrarse | Mi Cuenta | Login"
- **Mantener:** 11 fondos rotatorios en sidebar exactamente como están
- **Preservar:** Branding y diseño actual

### 13.2 MÉTRICAS DE ÉXITO
- **Año 1:** 1000+ usuarios registrados, 100+ Kit2s vendidos/mes
- **Año 2:** $10k+ ingresos mensuales, 5+ instituciones integradas
- **Año 3:** Expansión internacional, múltiples idiomas

### 13.3 DIFERENCIAS CRÍTICAS CON PROYECTO ANTERIOR
- **Arquitectura PDF:** PDF cliente + Servidor CHE (no PDF autónomo)
- **Propiedad contenido:** Compra = posesión permanente (no acceso temporal)
- **Flexibilidad total:** Acuerdos case-by-case, no modelos rígidos
- **Protección derechos:** CHE nunca propietaria de derechos de autor

### 13.4 ARQUITECTURA PDF + SERVIDOR SEGURA
```
Kit2.pdf contiene:
├── Contenido (catálogo obras)
├── Personalización (nombre usuario, cadena)
├── Botones de acción → che.com/comprar?ref=ABC123
└── Códigos únicos de referencia

Servidor CHE maneja:
├── Pagos seguros
├── Cadenas distributivas
├── Cálculo comisiones
├── Entrega contenido real
└── Toda la lógica crítica de negocio
```

---

## 14. CONSIDERACIONES LEGALES Y OPERATIVAS

### 14.1 PROTECCIÓN CORPORATIVA
- **CHE nunca propietaria:** De derechos de autor (protección ante demandas)
- **Contratos de cesión:** No exclusiva con posibilidad revocación
- **Separación responsabilidades:** Modelo B institucional
- **Auditoría completa:** Histórico de cambios y decisiones

### 14.2 CASOS DE USO ESPECÍFICOS
- **Renovación Kit2:** No obligatoria, decisión consciente del usuario
- **Múltiples Kit2s:** Usuario puede tener varios simultáneamente
- **Contenido igual:** No problema si autor no actualiza obras
- **Compras repetidas:** Usuario puede comprar mismo Kit2 múltiples veces

---

## 15. ELEMENTOS DE NAVEGACIÓN Y UI

### 15.1 ACTIVE STATES (Estados Activos)
```css
/* Indicador de página actual en navegación */
.nav-item.active {
  background-color: #0066cc;
  color: white;
  font-weight: bold;
  border-bottom: 3px solid #ff6600;
}

/* Ejemplo: cuando usuario está en "Biblioteca" */
.nav-biblioteca.active {
  background: linear-gradient(45deg, #0066cc, #004499);
}
```

### 15.2 BREADCRUMBS (Migas de Pan)
```typescript
// Navegación jerárquica
interface Breadcrumb {
  label: string;
  url: string;
  active: boolean;
}

// Ejemplos:
"Inicio > Mi Cuenta > Kit2s Activos"
"Inicio > Biblioteca > Economía > Herejía Económica"
"Inicio > Admin > Usuarios > Aprobar Autores"
"Inicio > Fondos Rotatorios > Editorial > Mauricio Rivadeneira"
```

### 15.3 SWITCHES Y TOGGLES
```typescript
// Cambios de rol (si usuario tiene múltiples)
<RoleSwitch>
  Comprador | Autor | Admin
</RoleSwitch>

// Cambios de vista
<ViewToggle>
  Lista ⋮⋮⋮ | Grid ⬜⬜⬜
</ViewToggle>

// Idioma
<LanguageSwitch>
  ES | EN
</LanguageSwitch>

// Tema
<ThemeToggle>
  ☀️ Claro | 🌙 Oscuro
</ThemeToggle>
```

### 15.4 INDICADORES DE ESTADO
```typescript
// Estados de Kit2
<StatusBadge status="activo">Kit2 Activo ✓</StatusBadge>
<StatusBadge status="expirado">Kit2 Expirado ⚠️</StatusBadge>
<StatusBadge status="pendiente">Pago Pendiente ⏳</StatusBadge>

// Estados de usuario
<UserStatus verified={true}>Usuario Verificado ✅</UserStatus>
<ContractStatus>Contrato Firmado 📝</ContractStatus>
<PaymentStatus>Último Pago: Exitoso 💳</PaymentStatus>

// Estados de contenido
<ContentStatus>Publicado ✓</ContentStatus>
<ContentStatus>En Revisión 👀</ContentStatus>
<ContentStatus>Rechazado ❌</ContentStatus>
```

### 15.5 NAVEGACIÓN CONTEXTUAL
```typescript
// Sidebar adaptativo según rol
interface SidebarConfig {
  comprador: ['Mi Cuenta', 'Mis Kit2s', 'Historial', 'Renovaciones'];
  autor: ['Mi Cuenta', 'Mis Obras', 'Kit2 Template', 'Estadísticas', 'Contratos'];
  admin: ['Dashboard', 'Usuarios', 'Contenido', 'Transacciones', 'Reportes'];
  institucional: ['Mi Cuenta', 'Catálogo', 'Kit2 Institucional', 'Comisiones', 'Estudiantes'];
}

// Menú contextual por página
interface ContextMenu {
  biblioteca: ['Filtrar', 'Ordenar', 'Buscar', 'Categorías'];
  kit2: ['Personalizar', 'Vista Previa', 'Comprar', 'Compartir'];
  admin_usuarios: ['Aprobar', 'Suspender', 'Ver Detalle', 'Historial'];
}
```

### 15.6 BOTONES DE ACCIÓN DINÁMICOS
```typescript
// Botones que cambian según estado
<ActionButton 
  primary={user.canBuy ? "Comprar Kit2" : "Login Requerido"}
  secondary={user.hasKit2 ? "Ver Mi Kit2" : "Conocer Más"}
  disabled={!user.verified}
/>

// Botones de proceso
<ProcessButton step="payment">
  {step === 1 && "Seleccionar Kit2"}
  {step === 2 && "Confirmar Datos"}  
  {step === 3 && "Procesar Pago"}
  {step === 4 && "Completado ✓"}
</ProcessButton>
```

### 15.7 PROGRESS INDICATORS
```typescript
// Proceso de registro
<ProgressBar steps={[
  "Datos Básicos",
  "Verificación Email", 
  "Documentos",
  "Aprobación",
  "Activo"
]} current={2} />

// Proceso de compra Kit2
<StepIndicator>
  1. Seleccionar → 2. Pagar → 3. Recibir → 4. Distribuir
</StepIndicator>

// Progreso de perfil
<ProfileCompletion percentage={75}>
  Perfil 75% completo
</ProfileCompletion>
```

### 15.8 NOTIFICACIONES Y ALERTS
```typescript
// Tipos de notificaciones
interface NotificationTypes {
  success: "Kit2 adquirido exitosamente ✓";
  warning: "Kit2 expira en 7 días ⚠️";
  error: "Error en el pago ❌";
  info: "Nueva versión de obras disponible ℹ️";
  commission: "Comisión recibida: $25 USD 💰";
}

// Posicionamiento
<NotificationContainer position="top-right" />
<ToastContainer position="bottom-center" />
```

### 15.9 FILTROS Y BÚSQUEDA
```typescript
// Filtros dinámicos
<FilterPanel>
  <CategoryFilter options={["Todos", "Libros", "Artículos", "Cursos"]} />
  <PriceFilter min={0} max={500} />
  <LanguageFilter options={["ES", "EN", "PT"]} />
  <StatusFilter options={["Activo", "Expirado", "Pendiente"]} />
</FilterPanel>

// Búsqueda inteligente
<SearchBox 
  placeholder="Buscar obras, autores, instituciones..."
  suggestions={true}
  filters={true}
/>
```

### 15.10 RESPONSIVE NAVIGATION
```typescript
// Mobile menu hamburger
<MobileNav>
  <HamburgerButton />
  <SlideMenu>
    <NavItems />
    <UserActions />
    <LanguageSwitch />
  </SlideMenu>
</MobileNav>

// Desktop navigation
<DesktopNav>
  <MainMenu horizontal />
  <UserMenu dropdown />
  <QuickActions />
</DesktopNav>
```

### 15.11 ACCESIBILIDAD Y UX
```typescript
// Navegación por teclado
- Tab navigation entre elementos
- Enter/Space para activar botones
- Escape para cerrar modales
- Arrow keys para menús desplegables

// Screen reader support
<nav aria-label="Navegación principal">
<button aria-pressed={isActive} aria-describedby="tooltip-id">
<div role="tabpanel" aria-labelledby="tab-id">

// Focus management
- Focus visible en elementos activos
- Skip links para saltar navegación
- Focus trap en modales
```

---

**PROYECTO ENTERPRISE COMPLETO - LISTO PARA DESARROLLO INMEDIATO**

*Este documento constituye la especificación técnica maestra para el desarrollo de la plataforma CHE. Conservar como referencia permanente para todo el ciclo de desarrollo.*