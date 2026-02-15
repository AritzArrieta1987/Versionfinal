#!/bin/bash

# ============================================
# SCRIPT DE DEPLOYMENT - BIGARTIST ROYALTIES
# ============================================

# CONFIGURACIÓN - YA CONFIGURADO CON TUS DATOS REALES
SERVER_USER="root"
SERVER_IP="94.143.141.241"
SERVER_PATH="/var/www/bigartist-frontend"
BACKEND_URL="https://app.bigartist.es/api"

# ============================================
# NO MODIFICAR A PARTIR DE AQUÍ
# ============================================

echo "🚀 Iniciando deployment de BIGARTIST ROYALTIES..."

# 1. Crear carpeta temporal
echo "📦 Preparando archivos..."
mkdir -p deploy_temp
cp -r * deploy_temp/ 2>/dev/null || true

# 2. Crear archivo .env con la URL del backend
echo "⚙️ Configurando backend URL..."
echo "VITE_API_URL=$BACKEND_URL" > deploy_temp/.env

# 3. Comprimir archivos
echo "📦 Comprimiendo archivos..."
cd deploy_temp
tar -czf ../bigartist-frontend.tar.gz .
cd ..

# 4. Subir al servidor
echo "📤 Subiendo al servidor..."
scp bigartist-frontend.tar.gz $SERVER_USER@$SERVER_IP:/tmp/

# 5. Descomprimir y mover en el servidor
echo "📂 Desplegando en el servidor..."
ssh $SERVER_USER@$SERVER_IP << 'ENDSSH'
cd /tmp
tar -xzf bigartist-frontend.tar.gz -C bigartist-deploy
sudo rm -rf SERVER_PATH_PLACEHOLDER/src SERVER_PATH_PLACEHOLDER/components SERVER_PATH_PLACEHOLDER/pages
sudo cp -r bigartist-deploy/* SERVER_PATH_PLACEHOLDER/
rm -rf bigartist-deploy bigartist-frontend.tar.gz
cd SERVER_PATH_PLACEHOLDER
npm install
npm run build
sudo systemctl reload nginx
ENDSSH

# Reemplazar placeholder con ruta real
ssh $SERVER_USER@$SERVER_IP "sed -i 's|SERVER_PATH_PLACEHOLDER|$SERVER_PATH|g' /tmp/deploy_commands.sh"

# 6. Limpiar archivos temporales locales
echo "🧹 Limpiando archivos temporales..."
rm -rf deploy_temp bigartist-frontend.tar.gz

echo "✅ ¡Deployment completado!"
echo "🌐 Tu aplicación debería estar actualizada en: https://app.bigartist.es"