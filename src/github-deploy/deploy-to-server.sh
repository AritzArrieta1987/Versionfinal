#!/bin/bash

echo "🚀 BIGARTIST Royalties - Deploy Script"
echo "======================================"
echo ""

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Verificar que estamos en el servidor
if [ "$HOSTNAME" != "vmi2147663" ]; then
    echo -e "${RED}⚠️  Este script debe ejecutarse EN EL SERVIDOR${NC}"
    echo "Conéctate primero: ssh root@94.143.141.241"
    exit 1
fi

echo -e "${YELLOW}📦 Paso 1: Clonando repositorio...${NC}"
cd /var/www
rm -rf bigartist-frontend
git clone https://github.com/AritzArrieta1987/Versionfinal.git bigartist-frontend

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Error al clonar repositorio${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Repositorio clonado${NC}"
echo ""

echo -e "${YELLOW}📦 Paso 2: Instalando dependencias...${NC}"
cd bigartist-frontend
npm install

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Error al instalar dependencias${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Dependencias instaladas${NC}"
echo ""

echo -e "${YELLOW}🔨 Paso 3: Compilando proyecto...${NC}"
npm run build

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Error al compilar${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Proyecto compilado${NC}"
echo ""

echo -e "${YELLOW}📁 Paso 4: Moviendo archivos...${NC}"
cp -r dist/* .
rm -rf dist

echo -e "${GREEN}✅ Archivos movidos${NC}"
echo ""

echo -e "${YELLOW}🔐 Paso 5: Estableciendo permisos...${NC}"
chown -R www-data:www-data /var/www/bigartist-frontend
chmod -R 755 /var/www/bigartist-frontend

echo -e "${GREEN}✅ Permisos establecidos${NC}"
echo ""

echo -e "${YELLOW}🔄 Paso 6: Reiniciando Nginx...${NC}"
systemctl reload nginx

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Error al reiniciar Nginx${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Nginx reiniciado${NC}"
echo ""

echo -e "${GREEN}════════════════════════════════════${NC}"
echo -e "${GREEN}✅ ¡DEPLOY COMPLETADO CON ÉXITO!${NC}"
echo -e "${GREEN}════════════════════════════════════${NC}"
echo ""
echo -e "🌐 Accede a: ${YELLOW}https://app.bigartist.es${NC}"
echo ""
echo "📋 Credenciales de prueba:"
echo "   Email: admin@bigartist.es"
echo "   Password: admin123"
echo ""
