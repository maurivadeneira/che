#!/bin/bash
# Script para facilitar el despliegue en Vercel

echo "Preparando despliegue en Vercel..."

# Commit de los cambios
git add .
git commit -m "Configuración actualizada para Vercel"

# Push a la rama principal
git push origin main

echo "✅ Cambios enviados al repositorio"
echo "Ahora debes ir a la consola de Vercel y redeployar el proyecto"
echo "O ejecutar 'vercel' desde la línea de comandos si tienes instalada la CLI de Vercel"
