#!/bin/bash

# Script para hacer commit y push rápido
# Uso: ./push-to-server.sh "mensaje del commit"

# Colores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

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

echo ""
echo "🚀 BAM Royalties System - Push a Servidor"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Verificar si hay cambios
if [ -z "$(git status --porcelain)" ]; then
    print_warning "No hay cambios para hacer commit"
    exit 0
fi

# Mensaje del commit
if [ -z "$1" ]; then
    COMMIT_MESSAGE="feat: actualización BAM Royalties System - $(date '+%Y-%m-%d %H:%M')"
    print_info "Usando mensaje automático: $COMMIT_MESSAGE"
else
    COMMIT_MESSAGE="$1"
    print_info "Mensaje del commit: $COMMIT_MESSAGE"
fi

echo ""

# Git add
print_info "Añadiendo archivos..."
git add .
print_success "Archivos añadidos"

# Git commit
print_info "Haciendo commit..."
git commit -m "$COMMIT_MESSAGE"
print_success "Commit realizado"

# Git push
print_info "Subiendo a GitHub..."
git push origin main
print_success "Push completado"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
print_success "✨ Código subido a GitHub exitosamente!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
print_info "📋 Próximos pasos:"
echo ""
echo "1. Conectar al servidor:"
echo "   ${BLUE}ssh root@94.143.141.241${NC}"
echo ""
echo "2. Ir al directorio del proyecto:"
echo "   ${BLUE}cd /var/www/bigartist-frontend${NC}"
echo ""
echo "3. Ejecutar actualización:"
echo "   ${BLUE}./update.sh${NC}"
echo ""
print_info "🌐 Repositorio: https://github.com/AritzArrieta1987/Versionfinal.git"
echo ""
