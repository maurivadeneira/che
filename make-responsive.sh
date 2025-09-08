#!/bin/bash

echo "🔧 Haciendo todos los fondos responsive..."

fondos=(
  "inversion-empresarial"
  "editorial-medios" 
  "sanacion-emocional"
  "vivienda"
  "recreacion-hotelera"
  "sistemas-plataformas"
  "bancario"
  "ingenieria"
  "comercial"
  "investigacion-cientifica"
  "arte-cultura"
)

for fondo in "${fondos[@]}"; do
  echo "📱 Procesando: $fondo"
  
  # Backup del archivo original
  cp "src/app/fondos/$fondo/page.tsx" "src/app/fondos/$fondo/page.tsx.backup-responsive"
  
  # 1. Hacer contenedor principal responsive
  sed -i 's/max-w-6xl mx-auto p-8/max-w-6xl mx-auto p-4 sm:p-6 md:p-8/g' "src/app/fondos/$fondo/page.tsx"
  
  # 2. Hacer imágenes responsive (altura)
  sed -i 's/h-40 sm:h-56 md:h-80 w-full/h-32 sm:h-48 md:h-64 lg:h-80 w-full/g' "src/app/fondos/$fondo/page.tsx"
  sed -i 's/h-48 md:h-80 w-full/h-32 sm:h-48 md:h-64 lg:h-80 w-full/g' "src/app/fondos/$fondo/page.tsx"
  sed -i 's/h-80 w-full/h-32 sm:h-48 md:h-64 lg:h-80 w-full/g' "src/app/fondos/$fondo/page.tsx"
  
  # 3. Hacer títulos responsive
  sed -i 's/text-xl sm:text-2xl md:text-4xl font-bold/text-lg sm:text-xl md:text-2xl lg:text-4xl font-bold/g' "src/app/fondos/$fondo/page.tsx"
  sed -i 's/text-2xl md:text-4xl font-bold/text-lg sm:text-xl md:text-2xl lg:text-4xl font-bold/g' "src/app/fondos/$fondo/page.tsx"
  sed -i 's/text-4xl font-bold/text-lg sm:text-xl md:text-2xl lg:text-4xl font-bold/g' "src/app/fondos/$fondo/page.tsx"
  
  # 4. Hacer subtítulos responsive
  sed -i 's/text-2xl font-semibold/text-lg sm:text-xl md:text-2xl font-semibold/g' "src/app/fondos/$fondo/page.tsx"
  
  # 5. Hacer texto principal responsive
  sed -i 's/text-lg mb-8/text-sm sm:text-base md:text-lg mb-4 md:mb-8/g' "src/app/fondos/$fondo/page.tsx"
  sed -i 's/text-lg/text-sm sm:text-base md:text-lg/g' "src/app/fondos/$fondo/page.tsx"
  
  # 6. Espaciado responsive
  sed -i 's/mb-3 sm:mb-4 md:mb-8/mb-3 sm:mb-4 md:mb-6 lg:mb-8/g' "src/app/fondos/$fondo/page.tsx"
  sed -i 's/mb-4 md:mb-8/mb-3 sm:mb-4 md:mb-6 lg:mb-8/g' "src/app/fondos/$fondo/page.tsx"
  sed -i 's/mb-8/mb-4 sm:mb-6 md:mb-8/g' "src/app/fondos/$fondo/page.tsx"
  sed -i 's/space-y-6/space-y-3 sm:space-y-4 md:space-y-6/g' "src/app/fondos/$fondo/page.tsx"
  
  # 7. Padding responsive para contenido
  sed -i 's/p-4 rounded-lg/p-3 sm:p-4 rounded-lg/g' "src/app/fondos/$fondo/page.tsx"
  
  # 8. Mini-logo responsive
  sed -i 's/h-10 w-10/h-8 w-8 sm:h-10 sm:w-10/g' "src/app/fondos/$fondo/page.tsx"
  
done

echo "✅ Responsive aplicado exitosamente a todos los fondos!"
echo "📁 Backups guardados con extensión .backup-responsive"