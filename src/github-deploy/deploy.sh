#!/bin/bash

##############################################
# BIGARTIST ROYALTIES - DEPLOY AUTOMÁTICO
# Ejecutar en el servidor: bash deploy.sh
##############################################

set -e  # Detener si hay error

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
BOLD='\033[1m'
NC='\033[0m'

echo ""
echo -e "${BLUE}${BOLD}╔════════════════════════════════════════╗${NC}"
echo -e "${BLUE}${BOLD}║   🚀 BIGARTIST ROYALTIES DEPLOY       ║${NC}"
echo -e "${BLUE}${BOLD}╚════════════════════════════════════════╝${NC}"
echo ""

# Variables
REPO_URL="https://github.com/AritzArrieta1987/Versionfinal.git"
INSTALL_DIR="/var/www/bigartist-frontend"
NGINX_CONF="/etc/nginx/sites-available/bigartist"

# Paso 1: Limpiar instalación anterior
echo -e "${YELLOW}📦 [1/7] Limpiando instalación anterior...${NC}"
cd /var/www
if [ -d "$INSTALL_DIR" ]; then
    rm -rf "$INSTALL_DIR"
    echo -e "${GREEN}✅ Directorio anterior eliminado${NC}"
else
    echo -e "${GREEN}✅ No hay instalación anterior${NC}"
fi
echo ""

# Paso 2: Clonar repositorio
echo -e "${YELLOW}📥 [2/7] Clonando repositorio desde GitHub...${NC}"
git clone "$REPO_URL" "$INSTALL_DIR"
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Repositorio clonado exitosamente${NC}"
else
    echo -e "${RED}❌ Error al clonar repositorio${NC}"
    exit 1
fi
echo ""

# Paso 3: Instalar dependencias
echo -e "${YELLOW}📚 [3/7] Instalando dependencias de Node.js...${NC}"
cd "$INSTALL_DIR"
npm install --production=false
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Dependencias instaladas${NC}"
else
    echo -e "${RED}❌ Error al instalar dependencias${NC}"
    exit 1
fi
echo ""

# Paso 4: Compilar proyecto
echo -e "${YELLOW}🔨 [4/7] Compilando proyecto con Vite...${NC}"
npm run build
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Proyecto compilado exitosamente${NC}"
else
    echo -e "${RED}❌ Error al compilar proyecto${NC}"
    exit 1
fi
echo ""

# Paso 5: Mover archivos compilados
echo -e "${YELLOW}📁 [5/7] Organizando archivos para producción...${NC}"
cp -r dist/* .
rm -rf dist node_modules src *.ts *.json *.js *.md .git .gitignore 2>/dev/null || true
echo -e "${GREEN}✅ Archivos organizados${NC}"
echo ""

# Paso 6: Configurar permisos
echo -e "${YELLOW}🔐 [6/7] Configurando permisos...${NC}"
chown -R www-data:www-data "$INSTALL_DIR"
chmod -R 755 "$INSTALL_DIR"
echo -e "${GREEN}✅ Permisos configurados${NC}"
echo ""

# Paso 7: Reiniciar Nginx
echo -e "${YELLOW}🔄 [7/7] Reiniciando Nginx...${NC}"
systemctl reload nginx
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Nginx reiniciado${NC}"
else
    echo -e "${RED}❌ Error al reiniciar Nginx${NC}"
    exit 1
fi
echo ""

# Resumen final
echo -e "${GREEN}${BOLD}╔════════════════════════════════════════╗${NC}"
echo -e "${GREEN}${BOLD}║   ✅ DEPLOY COMPLETADO CON ÉXITO      ║${NC}"
echo -e "${GREEN}${BOLD}╚════════════════════════════════════════╝${NC}"
echo ""
echo -e "${BOLD}📊 Resumen:${NC}"
echo -e "   🌐 URL: ${BLUE}https://app.bigartist.es${NC}"
echo -e "   📂 Directorio: ${YELLOW}$INSTALL_DIR${NC}"
echo -e "   📦 Repositorio: ${YELLOW}$REPO_URL${NC}"
echo ""
echo -e "${BOLD}🔑 Credenciales de prueba:${NC}"
echo -e "   Email: ${GREEN}admin@bigartist.es${NC}"
echo -e "   Password: ${GREEN}admin123${NC}"
echo ""
echo -e "${BOLD}📋 Archivos desplegados:${NC}"
ls -lh "$INSTALL_DIR" | grep -E "index.html|assets"
echo ""
echo -e "${GREEN}🎉 ¡Listo! Abre tu navegador en https://app.bigartist.es${NC}"
echo ""
