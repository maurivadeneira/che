#!/bin/bash

# Buscar todos los .jsx que importan .js
find src -name "*.jsx" -type f | while read file; do
  echo "Procesando: $file"
  # Reemplazar .js" con .jsx" en todas las importaciones
  sed -i 's/\.js"/.jsx"/' "$file"
done

# Verificar que no quedan imports .js
echo "Revisando archivos restantes con importaciones .js:"
grep -r "\.js\"" src || echo "¡No hay

cat > fix-all-imports.sh << 'EOF'
#!/bin/bash

# Buscar todos los .jsx que importan .js
find src -name "*.jsx" -type f | while read file; do
  echo "Procesando: $file"
  # Reemplazar .js" con .jsx" en todas las importaciones
  sed -i 's/\.js"/.jsx"/' "$file"
done

# Verificar que no quedan imports .js
echo "Revisando archivos restantes con importaciones .js:"
grep -r "\.js\"" src || echo "¡No hay más importaciones .js!"
