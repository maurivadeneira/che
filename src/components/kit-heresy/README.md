# Componente Kit Heresy

Este componente implementa la funcionalidad del Kit de la Herejía, un sistema basado en donaciones que permite la distribución de conocimiento y valor de manera equitativa.

## Características

- Explicación en 5 pasos del funcionamiento del Kit
- Sistema de transmisión mediante enlaces directos de invitación
- Proceso de activación simplificado sin códigos
- Configuración inicial para el propietario de la obra
- Simulación del proceso de verificación de donaciones
- Generación de enlaces personalizados para invitar a otros

## Estructura

- **KitHeresy.js**: Componente principal que muestra la información y el wizard
- **KitHeresy.css**: Estilos para el componente principal
- **KitActivation.js**: Funcionalidad de activación del Kit
- **KitActivation.css**: Estilos para el componente de activación
- **OwnerSetup.js**: Configuración inicial para el propietario de la obra
- **OwnerSetup.css**: Estilos para el componente de configuración del propietario

## Flujo de funcionamiento

### Para el propietario original:

1. El propietario accede a la información del Kit
2. Al llegar al paso 5, hace clic en "SOY EL PROPIETARIO DE LA OBRA"
3. Completa sus datos y la información de pago para recibir donaciones futuras
4. Recibe un enlace único de invitación para compartir
5. Puede distribuir este enlace a sus contactos (via email, WhatsApp, etc.)

### Para usuarios regulares:

1. Reciben el enlace de invitación del propietario o de otro usuario
2. Al hacer clic en el enlace, llegan directamente al formulario de registro
3. Completan sus datos y confirman las donaciones:
   - A la Corporación
   - A la persona designada (inicialmente la que indicó el propietario)
4. Reciben su propio enlace único para continuar la cadena de distribución

## Características Técnicas

- El sistema mantiene automáticamente la trazabilidad de quién invitó a quién
- Los enlaces de invitación contienen la información necesaria para redirigir las donaciones
- El flujo se adapta automáticamente según el tipo de usuario (propietario o invitado)
- El sistema está diseñado para ser reutilizable con diferentes obras y configuraciones