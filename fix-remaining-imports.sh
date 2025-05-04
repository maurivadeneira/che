#!/bin/bash

# Corregir importaciones de CheMiniLogo
find src -name "*.jsx" -type f -exec sed -i 's/"..\/components\/CheMiniLogo.js"/"..\/components\/CheMiniLogo.jsx"/' {} \;
find src -name "*.jsx" -type f -exec sed -i 's/".\/CheMiniLogo.js"/".\/CheMiniLogo.jsx"/' {} \;
find src -name "*.jsx" -type f -exec sed -i 's/"..\/..\/components\/CheMiniLogo.js"/"..\/..\/components\/CheMiniLogo.jsx"/' {} \;

# Corregir importaciones de CheMediumLogo
find src -name "*.jsx" -type f -exec sed -i 's/"..\/components\/CheMediumLogo.js"/"..\/components\/CheMediumLogo.jsx"/' {} \;
find src -name "*.jsx" -type f -exec sed -i 's/".\/CheMediumLogo.js"/".\/CheMediumLogo.jsx"/' {} \;
find src -name "*.jsx" -type f -exec sed -i 's/"..\/..\/components\/CheMediumLogo.js"/"..\/..\/components\/CheMediumLogo.jsx"/' {} \;

# Corregir importaciones de DevelopmentBanner
find src -name "*.jsx" -type f -exec sed -i 's/"..\/components\/common\/DevelopmentBanner.js"/"..\/components\/common\/DevelopmentBanner.jsx"/' {} \;

# Verificar que se corrigieron todos
echo "Verificando imports restantes:"
grep -rn "from.*\.js[\"']" src --exclude-dir=node_modules || echo "¡No hay más imports .js!"
