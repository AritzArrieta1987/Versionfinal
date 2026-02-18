#!/bin/bash

echo "🚀 DESPLEGANDO FIX DE CSV A PRODUCCIÓN"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Colores
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Variables
FRONTEND_DIR="/root/bigartist-frontend-source"
DEPLOY_DIR="/var/www/bigartist-frontend"

echo -e "${BLUE}📁 Directorio de código: ${NC}$FRONTEND_DIR"
echo -e "${BLUE}📂 Directorio de despliegue: ${NC}$DEPLOY_DIR"
echo ""

# 1. Verificar que estamos en el directorio correcto
if [ ! -d "$FRONTEND_DIR" ]; then
    echo -e "${RED}❌ Error: No se encontró el directorio $FRONTEND_DIR${NC}"
    echo ""
    echo "Creando estructura de directorios..."
    mkdir -p /root/bigartist-frontend-source
    cd /root/bigartist-frontend-source
    
    # Si no existe, necesitamos los archivos base
    echo -e "${YELLOW}⚠️  Necesitas copiar los archivos del proyecto primero${NC}"
    exit 1
fi

cd $FRONTEND_DIR

# 2. Hacer backup del build anterior
echo -e "${YELLOW}📦 Haciendo backup del build anterior...${NC}"
if [ -d "$DEPLOY_DIR" ]; then
    BACKUP_NAME="backup-$(date +%Y%m%d-%H%M%S)"
    mkdir -p /root/backups
    cp -r $DEPLOY_DIR /root/backups/$BACKUP_NAME
    echo -e "${GREEN}✅ Backup guardado en: /root/backups/$BACKUP_NAME${NC}"
else
    echo -e "${YELLOW}⚠️  No hay build anterior para respaldar${NC}"
    mkdir -p $DEPLOY_DIR
fi
echo ""

# 3. Verificar que package.json existe
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Error: No se encontró package.json${NC}"
    echo "Necesitas copiar todos los archivos del proyecto primero"
    exit 1
fi

# 4. Instalar dependencias (si es necesario)
echo -e "${BLUE}📦 Verificando dependencias...${NC}"
if [ ! -d "node_modules" ]; then
    echo "Instalando dependencias..."
    npm install
else
    echo -e "${GREEN}✅ Dependencias ya instaladas${NC}"
fi
echo ""

# 5. Compilar el proyecto
echo -e "${BLUE}🔨 Compilando proyecto...${NC}"
echo ""
npm run build

if [ $? -ne 0 ]; then
    echo ""
    echo -e "${RED}❌ Error al compilar el proyecto${NC}"
    echo "Revisa los errores arriba"
    exit 1
fi

echo ""
echo -e "${GREEN}✅ Compilación exitosa${NC}"
echo ""

# 6. Verificar que el directorio build existe
if [ ! -d "build" ] && [ ! -d "dist" ]; then
    echo -e "${RED}❌ Error: No se generó el directorio build/dist${NC}"
    exit 1
fi

# Determinar cuál directorio usar (Vite usa 'dist', CRA usa 'build')
if [ -d "dist" ]; then
    BUILD_DIR="dist"
else
    BUILD_DIR="build"
fi

echo -e "${BLUE}📋 Directorio de build: ${NC}$BUILD_DIR"
echo ""

# 7. Limpiar directorio de despliegue
echo -e "${YELLOW}🗑️  Limpiando directorio de despliegue...${NC}"
rm -rf $DEPLOY_DIR/*
echo -e "${GREEN}✅ Limpiado${NC}"
echo ""

# 8. Copiar archivos compilados
echo -e "${BLUE}📂 Copiando archivos al servidor...${NC}"
cp -r $BUILD_DIR/* $DEPLOY_DIR/

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Error al copiar archivos${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Archivos copiados${NC}"
echo ""

# 9. Ajustar permisos
echo -e "${BLUE}🔐 Ajustando permisos...${NC}"
chown -R www-data:www-data $DEPLOY_DIR
chmod -R 755 $DEPLOY_DIR
echo -e "${GREEN}✅ Permisos ajustados${NC}"
echo ""

# 10. Verificar tamaño de archivos JS
echo -e "${BLUE}📊 Archivos JavaScript generados:${NC}"
ls -lh $DEPLOY_DIR/assets/*.js 2>/dev/null | tail -5
echo ""

# 11. Verificar que index.html existe
if [ -f "$DEPLOY_DIR/index.html" ]; then
    echo -e "${GREEN}✅ index.html encontrado${NC}"
else
    echo -e "${RED}❌ Error: No se encontró index.html${NC}"
    exit 1
fi
echo ""

# 12. Reiniciar nginx (opcional pero recomendado)
echo -e "${BLUE}🔄 Reiniciando nginx...${NC}"
systemctl reload nginx

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Nginx reiniciado${NC}"
else
    echo -e "${YELLOW}⚠️  No se pudo reiniciar nginx (puede que no esté instalado o necesites sudo)${NC}"
fi
echo ""

# 13. Limpiar caché del navegador (crear archivo con timestamp)
echo -e "${BLUE}🔄 Generando timestamp para caché...${NC}"
date +%s > $DEPLOY_DIR/version.txt
echo -e "${GREEN}✅ Cache timestamp generado${NC}"
echo ""

# 14. Resumen final
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${GREEN}🎉 DESPLIEGUE COMPLETADO EXITOSAMENTE${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo -e "${BLUE}📍 URL de la aplicación:${NC}"
echo "   https://app.bigartist.es"
echo ""
echo -e "${YELLOW}⚠️  IMPORTANTE:${NC}"
echo "   1️⃣  Abre tu navegador en https://app.bigartist.es"
echo "   2️⃣  Presiona ${YELLOW}Ctrl+Shift+R${NC} para forzar recarga sin caché"
echo "   3️⃣  Si no funciona, abre DevTools (F12) → Network → marca 'Disable cache'"
echo "   4️⃣  Sube tu CSV y verifica que los totales aparezcan en el Dashboard"
echo ""
echo -e "${BLUE}🔍 Para ver logs en tiempo real:${NC}"
echo "   tail -f /var/log/nginx/access.log"
echo ""
echo -e "${BLUE}📦 Backup anterior guardado en:${NC}"
ls -d /root/backups/backup-* 2>/dev/null | tail -1
echo ""
echo -e "${GREEN}✅ Todo listo!${NC}"
echo ""
