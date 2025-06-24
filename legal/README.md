# Kit2 Herejía Económica - Documentación Legal

## 📁 Estructura de Archivos Legales

```
legal/
├── contrato-autor-kit2.md      # Contrato principal de autor
└── README.md                   # Esta documentación

models/
├── Contract.js                 # Schema MongoDB para contratos
└── User.js                     # Schema actualizado de usuarios

scripts/
└── init-contracts.js          # Script para inicializar contratos en DB
```

## 📋 Contratos Disponibles

### Contrato de Autor (v1.0)
- **Archivo:** `legal/contrato-autor-kit2.md`
- **Tipo:** Persona Natural / Persona Jurídica
- **Características:**
  - Sistema Kit2 autorreplicante
  - Distribución 20% autor / 80% corporación
  - Inmutabilidad post-lanzamiento
  - Non-exclusividad
  - Pagos trimestrales

## 🔧 Uso del Sistema de Contratos

### Inicializar Contratos en MongoDB
```bash
node init-contracts.js
```

### Verificar Contratos Activos
Los contratos se almacenan en la colección `contracts` con:
- Versionado automático
- Registro de revisiones
- Estados (draft/active/deprecated)
- Aceptaciones de usuarios

## ⚖️ Consideraciones Legales

- **Revisión profesional requerida** antes de uso en producción
- **Adaptación a jurisdicciones locales** necesaria
- **Verificación de cumplimiento** con leyes de derechos de autor
- **Consulta legal especializada** recomendada

## 🔄 Proceso de Actualización

1. Modificar archivo markdown
2. Crear nueva versión en DB
3. Deprecar versión anterior
4. Notificar a usuarios activos

---

*Documentación generada automáticamente - Kit2 Herejía Económica*