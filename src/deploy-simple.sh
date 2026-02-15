#!/bin/bash

# ============================================
# SCRIPT SIMPLE DE DEPLOYMENT - BIGARTIST
# ============================================

echo "╔════════════════════════════════════════╗"
echo "║   🚀 BIGARTIST DEPLOYMENT             ║"
echo "╚════════════════════════════════════════╝"
echo ""

# Comprimir archivos (excluyendo node_modules y archivos innecesarios)
echo "📦 [1/3] Comprimiendo archivos..."
tar -czf bigartist-frontend.tar.gz \
  --exclude='node_modules' \
  --exclude='.git' \
  --exclude='*.md' \
  --exclude='backend' \
  --exclude='github-deploy' \
  --exclude='utils/api-test.html' \
  --exclude='public/debug-login.html' \
  --exclude='public/test-backend.html' \
  .
echo "✅ Archivos comprimidos"
echo ""

# Subir al servidor
echo "📤 [2/3] Subiendo al servidor..."
scp bigartist-frontend.tar.gz root@94.143.141.241:/tmp/
echo "✅ Archivos subidos"
echo ""

# Ejecutar comandos en el servidor
echo "🔧 [3/3] Instalando en el servidor..."
ssh root@94.143.141.241 << 'ENDSSH'
cd /tmp
rm -rf bigartist-temp
mkdir bigartist-temp
tar -xzf bigartist-frontend.tar.gz -C bigartist-temp/

cd bigartist-temp
npm install
npm run build

# Copiar build a la carpeta final
cp -r build/* /var/www/bigartist-frontend/

# Permisos
chown -R www-data:www-data /var/www/bigartist-frontend
chmod -R 755 /var/www/bigartist-frontend

# Reiniciar nginx
systemctl reload nginx

# Limpiar
cd /tmp
rm -rf bigartist-temp bigartist-frontend.tar.gz

echo "✅ Instalación completada"
ENDSSH

# Limpiar archivo local
rm bigartist-frontend.tar.gz

echo ""
echo "════════════════════════════════════════"
echo "   ✅ DEPLOYMENT COMPLETADO"
echo "════════════════════════════════════════"
echo ""
echo "🌐 URL: https://app.bigartist.es"
echo ""
echo "🔐 Credenciales:"
echo "   👨‍💼 Admin: admin@bigartist.es / admin123"
echo "   🎨 Artista: artist@bigartist.es / admin123"
echo ""
