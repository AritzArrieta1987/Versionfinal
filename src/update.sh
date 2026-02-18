#!/bin/bash

# Script de actualización rápida para BAM Royalties System
# Uso: ./update.sh

set -e  # Salir si hay algún error

echo "🔄 Actualizando BAM Royalties System..."
echo ""

# Colores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
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

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Verificar que estamos en el directorio correcto
if [ ! -f "package.json" ]; then
    print_error "No se encuentra package.json. Ejecuta este script desde el directorio raíz del proyecto."
    exit 1
fi

print_info "Iniciando actualización completa..."
echo ""

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
print_success "Código actualizado desde GitHub"

# 3. Actualizar dependencias del backend
echo ""
echo "3️⃣  Actualizando backend..."
if [ -d "backend" ]; then
    cd backend
    npm install --production
    print_success "Dependencias del backend actualizadas"
    cd ..
else
    print_warning "No se encontró carpeta backend"
fi

# 4. Actualizar frontend
echo ""
echo "4️⃣  Actualizando frontend..."
npm install
print_success "Dependencias del frontend instaladas"

# 5. Compilar frontend
echo ""
echo "5️⃣  Compilando frontend para producción..."
npm run build
print_success "Frontend compilado (dist/)"

# 6. Reiniciar backend
echo ""
echo "6️⃣  Reiniciando backend..."
if [ -d "backend" ]; then
    pm2 restart bigartist-backend
    print_success "Backend reiniciado"
else
    print_warning "No hay backend para reiniciar"
fi

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
    print_warning "Backend no responde en http://localhost:3001 (puede ser normal si no hay backend)"
fi

# Verificar frontend
echo ""
echo "🧪 Verificando frontend..."
if [ -d "dist" ]; then
    print_success "Frontend compilado existe (dist/)"
else
    print_error "No se encontró carpeta dist/"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
print_success "✨ Actualización completada con éxito!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
print_info "🌐 Visita: https://app.bigartist.es"
echo ""
print_info "📋 Cambios incluidos:"
echo "   • Título actualizado a 'BAM Royalties System'"
echo "   • Favicon con iniciales BAM"
echo "   • Contrato Activo en Artist Portal"
echo "   • 4 Cajas de Reportes con datos reales"
echo "   • Selector de años dinámico"
echo "   • Catálogo corregido (sin -1 artistas)"
echo "   • Login seguro (mensajes genéricos)"
echo ""
print_info "📊 Para ver logs:"
echo "   Backend: pm2 logs bigartist-backend"
echo "   Nginx:   sudo tail -f /var/log/nginx/bigartist-error.log"
echo ""