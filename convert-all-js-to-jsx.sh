#!/bin/bash

# Listar archivos a convertir
files=(
  "src/components/common/DevelopmentBanner.js"
  "src/components/svg/FondoEditorialMedios.js"
  "src/components/svg/FondoInversionEmpresarial.js"
  "src/components/svg/FondoProyectosIngenieria.js"
  "src/components/svg/FondoSistemasPlataformas.js"
  "src/fondos/components/ImageLoader.js"
  "src/fondos/inversion-empresarial/FondoInversionEmpresarial.js"
  "src/fondos/inversion-empresarial/index.js"
)

# Convertir cada archivo
for file in "${files[@]}"; do
  directory=$(dirname "$file")
  basename=$(basename "$file" .js)
  newfile="${directory}/${basename}.jsx"
  
  echo "Convirtiendo: $file -> $newfile"
  mv "$file" "$newfile"
done

# Arreglar todas las importaciones
echo "Arreglando importaciones..."
find src -name "*.jsx" -type f | while read file; do
  echo "Procesando: $file"
  sed -i 's/\.js"/.jsx"/' "$file"
done
