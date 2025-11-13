# 🌳 Sistema Kit2 - Árbol Mágico del Ahorro

Sistema de distribución viral de contenidos educativos mediante cadenas de agradecimiento.

## 🎯 Concepto

Kit2 es un sistema peer-to-peer donde:
- Cada usuario compra usando el código de quien lo invitó
- Paga "agradecimiento" al usuario 2 niveles arriba (X-2)
- Recibe su propio código para invitar a otros
- Forma parte de un árbol genealógico de distribución

## 📊 Arquitectura

### Base de Datos (Supabase)

**Tablas principales:**
- `users` - Usuarios del sistema
- `kit2_contracts` - Contratos con autores/editoriales
- `kit2_templates` - Plantillas de productos
- `obras` - Contenidos digitales
- `kit2_chains` - Árboles genealógicos
- `kit2_instances` - Kit2 individuales (códigos activos)
- `kit2_purchases` - Registros de compras
- `chain_events` - Auditoría completa

### APIs Disponibles

#### 1. Validar Código
```
GET /api/kit2/validar-codigo?codigo=HE-K2-TRUNK1
```
Retorna información del invitador, beneficiario y producto.

#### 2. Iniciar Compra
```
POST /api/kit2/iniciar-compra
Body: {
  "origen_codigo": "HE-K2-TRUNK1",
  "email": "nuevo@usuario.com",
  "nombre": "Juan",
  "apellido": "Pérez",
  "pais": "Colombia"
}
```
Crea registro de compra y calcula beneficiario automáticamente.

#### 3. Subir Comprobante
```
POST /api/kit2/subir-comprobante
FormData: {
  "numero_orden": "ORD-...",
  "archivo": File
}
```
Sube comprobante de pago a Supabase Storage.

#### 4. Confirmar Pago
```
POST /api/kit2/confirmar-pago
Body: {
  "numero_orden": "ORD-...",
  "verificado_por_email": "admin@email.com"
}
```
Verifica pago, crea Kit2, actualiza estadísticas y registra comisiones.

#### 5. Mis Kit2
```
GET /api/kit2/mis-kit2?email=usuario@email.com
```
Retorna todos los Kit2 activos del usuario con estadísticas.

### Páginas Frontend

#### `/kit2/activar`
Flujo completo de activación en 3 pasos:
1. Validar código de invitación
2. Ingresar datos personales
3. Confirmación y siguiente paso

#### `/dashboard`
Panel personal del usuario mostrando:
- Kit2 activos
- Estadísticas de invitaciones
- Comisiones recibidas
- Nivel en el árbol

#### `/admin/verificar`
Panel de administración para:
- Buscar órdenes por número
- Ver comprobantes subidos
- Confirmar pagos
- Entregar Kit2 automáticamente

## 🎮 Flujo Completo

1. **Usuario A** tiene código `HE-K2-TRUNK1`
2. **Usuario B** lo usa en `/kit2/activar`
3. Sistema calcula que **Usuario C** (2 niveles arriba) es beneficiario
4. **Usuario B** paga $35 USD total:
   - $10 USD agradecimiento → Usuario C
   - $25 USD productos → Autor/CHE
5. **Usuario B** sube comprobante
6. Admin verifica en `/admin/verificar`
7. Sistema entrega Kit2 a **Usuario B** con código único
8. **Usuario B** puede invitar a otros con su código
9. Cuando alguien 2 niveles abajo compra, **Usuario B** recibe $10 USD

## 📈 Modelo Económico

### Ejemplo: Herejía Económica
- Precio producto: $25 USD
- Agradecimiento: $10 USD
- Total: $35 USD

**Distribución:**
- 20% autor ($5 USD)
- 80% CHE ($20 USD)
- Agradecimiento va a X-2

### Niveles en el Árbol
```
X0 (Daniel) ← Semilla
 └─ X1 (Mauricio) ← Tronco
     ├─ X2 (Usuario A)
     │   ├─ X3 (Usuario B) → paga a X1
     │   └─ X3 (Usuario C) → paga a X1
     └─ X2 (Usuario D)
         └─ X3 (Usuario E) → paga a X1
```

## 🔧 Configuración

### Variables de Entorno Necesarias
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

### Supabase Storage

Crear bucket `kit2-files` con:
- Carpeta `comprobantes/`
- Política pública de lectura
- Upload solo autenticado

## 🧪 Testing

### Datos de Prueba
```
Usuario: mauricio@corpherejiaeconomica.com
Código Kit2: HE-K2-TRUNK1
```

### Probar Flujo Completo

1. Ir a: `https://corpherejiaeconomica.com/kit2/activar`
2. Ingresar código: `HE-K2-TRUNK1`
3. Completar formulario
4. Simular pago y subir comprobante
5. Admin verifica en `/admin/verificar`

## 📝 Próximos Pasos

- [ ] Generación automática de PDFs personalizados
- [ ] Sistema de notificaciones por email
- [ ] Dashboard admin completo
- [ ] Exportación de reportes
- [ ] Integración con pasarelas de pago
- [ ] App móvil

## 👥 Equipo

**Fundador:** Mauricio Rivadeneira  
**Organización:** Corporación Herejía Económica  
**Año:** 2025

---

*Sistema desarrollado con Next.js 14, Supabase, TypeScript y Tailwind CSS*