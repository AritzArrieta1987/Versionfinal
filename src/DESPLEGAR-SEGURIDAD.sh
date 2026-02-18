#!/bin/bash

# Script de Despliegue - Cambios de Seguridad
# ============================================
# Este script despliega los cambios de seguridad al servidor de producción

echo "🔒 DESPLIEGUE DE MEJORAS DE SEGURIDAD"
echo "======================================"
echo ""

# Verificar que estamos en el directorio correcto
if [ ! -f "package.json" ]; then
  echo "❌ Error: Este script debe ejecutarse desde la raíz del proyecto"
  exit 1
fi

# 1. Instalar dependencias
echo "📦 Instalando dependencias..."
npm install

# 2. Construir el proyecto
echo ""
echo "🏗️  Construyendo proyecto..."
npm run build

# Verificar que el build se creó correctamente
if [ ! -d "dist" ]; then
  echo "❌ Error: El directorio 'dist' no se creó"
  exit 1
fi

echo ""
echo "✅ Build completado"
echo ""

# 3. Mostrar información del despliegue
echo "📋 INFORMACIÓN DEL DESPLIEGUE:"
echo "  - Archivos a desplegar: $(find dist -type f | wc -l) archivos"
echo "  - Tamaño total: $(du -sh dist | cut -f1)"
echo ""

# 4. Confirmar antes de desplegar
read -p "¿Desplegar estos cambios al servidor? (s/n): " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[SsYy]$ ]]; then
  echo "❌ Despliegue cancelado"
  exit 0
fi

echo ""
echo "🚀 Desplegando al servidor..."
echo ""

# 5. Copiar archivos al servidor
scp -r dist/* root@94.143.141.241:/var/www/bigartist-frontend/

if [ $? -ne 0 ]; then
  echo "❌ Error al copiar archivos al servidor"
  exit 1
fi

echo ""
echo "✅ Archivos copiados"
echo ""

# 6. Reiniciar nginx en el servidor
echo "🔄 Reiniciando nginx..."
ssh root@94.143.141.241 "systemctl reload nginx"

if [ $? -ne 0 ]; then
  echo "⚠️  Advertencia: No se pudo reiniciar nginx"
else
  echo "✅ Nginx reiniciado"
fi

echo ""
echo "🎉 =================================="
echo "🎉 DESPLIEGUE COMPLETADO"
echo "🎉 =================================="
echo ""
echo "🔒 CAMBIOS APLICADOS:"
echo "  ✅ Información sensible removida de logs"
echo "  ✅ Debug tools solo en desarrollo local"
echo "  ✅ Sin exposición de emails en consola"
echo ""
echo "🌐 Accede a: https://app.bigartist.es"
echo "   Presiona Cmd+Shift+R para limpiar cache"
echo ""
echo "🔍 VERIFICACIÓN:"
echo "   1. Abre DevTools (F12)"
echo "   2. Ve a la pestaña Console"
echo "   3. Verifica que NO aparecen:"
echo "      - Emails de usuarios"
echo "      - Configuración del API"
echo "      - Debug tools disponibles"
echo ""
