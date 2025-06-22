# Estructura de directorios legales para Kit2 Herejía Económica

## 📁 Organización:

```
legal/
├── contracts/              # Contratos base
│   ├── author-contract-v1.0.md
│   ├── user-terms-v1.0.md (futuro)
│   └── privacy-policy-v1.0.md (futuro)
├── templates/              # Plantillas dinámicas
│   ├── contract-generator.js
│   └── digital-signature.js
├── signed-contracts/       # Contratos firmados (NO en Git)
│   ├── [autor-id]/
│   └── [fecha]/
└── load-contracts.js       # Script para cargar a MongoDB
```

## 🛡️ Seguridad:

- **✅ En Git:** Contratos base (templates)
- **❌ NO en Git:** Contratos firmados con datos reales
- **🔐 MongoDB:** Todos los contratos para la aplicación

## 🚀 Uso:

```bash
# Cargar contratos a MongoDB
node legal/load-contracts.js

# En la aplicación
const contract = await LegalDocument.findOne({
  documentType: 'author_contract',
  version: '1.0',
  status: 'active'
});
```