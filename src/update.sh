#!/bin/bash

# Script de actualización rápida para BigArtist Royalties
# Uso: ./update.sh

set -e  # Salir si hay algún error

echo "🔄 Actualizando BigArtist Royalties..."
echo ""

# Colores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Función para imprimir con color
print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Verificar que estamos en el directorio correcto
if [ ! -f "package.json" ]; then
    print_error "No se encuentra package.json. Ejecuta este script desde el directorio raíz del proyecto."
    exit 1
fi

# 1. Detener el backend
echo "1️⃣  Deteniendo backend..."
if pm2 describe bigartist-backend > /dev/null 2>&1; then
    pm2 stop bigartist-backend
    print_success "Backend detenido"
else
    print_warning "Backend no estaba corriendo"
fi

# 2. Actualizar código desde GitHub
echo ""
echo "2️⃣  Actualizando código desde GitHub..."
git pull origin main
print_success "Código actualizado"

# 3. Actualizar dependencias del backend
echo ""
echo "3️⃣  Actualizando backend..."
cd backend
npm install --production
print_success "Dependencias del backend actualizadas"
cd ..

# 4. Actualizar frontend
echo ""
echo "4️⃣  Actualizando frontend..."
npm install
print_success "Dependencias del frontend instaladas"

# 5. Compilar frontend
echo ""
echo "5️⃣  Compilando frontend para producción..."
npm run build
print_success "Frontend compilado"

# 6. Reiniciar backend
echo ""
echo "6️⃣  Reiniciando backend..."
pm2 restart bigartist-backend
print_success "Backend reiniciado"

# 7. Recargar Nginx
echo ""
echo "7️⃣  Recargando Nginx..."
sudo systemctl reload nginx
print_success "Nginx recargado"

# 8. Verificar estado
echo ""
echo "8️⃣  Verificando servicios..."
echo ""
pm2 status

# Test del backend
echo ""
echo "🧪 Probando backend..."
sleep 2
if curl -s http://localhost:3001/api/health > /dev/null; then
    print_success "Backend responde correctamente"
else
    print_error "Backend no responde en http://localhost:3001"
fi

echo ""
print_success "✨ Actualización completada!"
echo ""
echo "🌐 Visita: https://app.bigartist.es"
echo ""
echo "📊 Para ver logs:"
echo "   Backend: pm2 logs bigartist-backend"
echo "   Nginx:   sudo tail -f /var/log/nginx/bigartist-error.log"
echo ""
