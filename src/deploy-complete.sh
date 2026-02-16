#!/bin/bash

# ============================================
# SCRIPT DE DESPLIEGUE COMPLETO
# BigArtist Royalties - app.bigartist.es
# ============================================

set -e  # Salir si hay algún error

# Colores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

# Variables configurables
APP_DIR="/var/www/bigartist-royalties"
BACKEND_PORT=3001
DOMAIN="app.bigartist.es"
PM2_APP_NAME="bigartist-backend"

echo -e "${BLUE}╔════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  BigArtist Royalties - Deploy Script  ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════╝${NC}"
echo ""

# ============================================
# VERIFICAR REQUISITOS
# ============================================
echo -e "${YELLOW}📋 Verificando requisitos...${NC}"

# Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js no está instalado${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Node.js $(node -v)${NC}"

# NPM
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ NPM no está instalado${NC}"
    exit 1
fi
echo -e "${GREEN}✅ NPM $(npm -v)${NC}"

# PM2
if ! command -v pm2 &> /dev/null; then
    echo -e "${YELLOW}⚠️  PM2 no está instalado. Instalando...${NC}"
    sudo npm install -g pm2
fi
echo -e "${GREEN}✅ PM2 instalado${NC}"

# MySQL
if ! command -v mysql &> /dev/null; then
    echo -e "${RED}❌ MySQL no está instalado${NC}"
    exit 1
fi
echo -e "${GREEN}✅ MySQL instalado${NC}"

# Nginx
if ! command -v nginx &> /dev/null; then
    echo -e "${RED}❌ Nginx no está instalado${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Nginx instalado${NC}"

echo ""

# ============================================
# VERIFICAR DIRECTORIO
# ============================================
if [ ! -d "$APP_DIR" ]; then
    echo -e "${RED}❌ Directorio $APP_DIR no existe${NC}"
    echo -e "${YELLOW}Creando directorio...${NC}"
    sudo mkdir -p $APP_DIR
    sudo chown $USER:$USER $APP_DIR
fi

cd $APP_DIR

# ============================================
# CONFIGURAR BACKEND .env
# ============================================
echo -e "${YELLOW}🔧 Configurando variables de entorno del backend...${NC}"

if [ ! -f "backend/.env" ]; then
    echo -e "${YELLOW}⚠️  No existe backend/.env${NC}"
    echo -e "${YELLOW}Creando archivo de configuración...${NC}"
    
    mkdir -p backend
    
    # Solicitar datos al usuario
    read -p "Usuario MySQL (default: bigartist_user): " DB_USER
    DB_USER=${DB_USER:-bigartist_user}
    
    read -sp "Password MySQL: " DB_PASSWORD
    echo ""
    
    read -p "Nombre de la base de datos (default: bigartist_royalties): " DB_NAME
    DB_NAME=${DB_NAME:-bigartist_royalties}
    
    # Generar JWT secret aleatorio
    JWT_SECRET=$(openssl rand -hex 32)
    
    cat > backend/.env << EOF
# BASE DE DATOS MYSQL
DB_HOST=localhost
DB_USER=$DB_USER
DB_PASSWORD=$DB_PASSWORD
DB_NAME=$DB_NAME
DB_PORT=3306

# JWT SECRET
JWT_SECRET=$JWT_SECRET

# PUERTO DEL BACKEND
PORT=$BACKEND_PORT

# ENTORNO
NODE_ENV=production

# CORS
CORS_ORIGIN=https://$DOMAIN
EOF
    
    echo -e "${GREEN}✅ Archivo backend/.env creado${NC}"
else
    echo -e "${GREEN}✅ backend/.env ya existe${NC}"
fi

echo ""

# ============================================
# INSTALAR DEPENDENCIAS BACKEND
# ============================================
echo -e "${YELLOW}📦 Instalando dependencias del backend...${NC}"

if [ -f "backend/package.json" ]; then
    cd backend
    npm install --production
    echo -e "${GREEN}✅ Dependencias del backend instaladas${NC}"
    cd ..
else
    echo -e "${RED}❌ No se encuentra backend/package.json${NC}"
    exit 1
fi

echo ""

# ============================================
# INSTALAR DEPENDENCIAS FRONTEND
# ============================================
echo -e "${YELLOW}📦 Instalando dependencias del frontend...${NC}"

if [ -f "package.json" ]; then
    npm install
    echo -e "${GREEN}✅ Dependencias del frontend instaladas${NC}"
else
    echo -e "${RED}❌ No se encuentra package.json${NC}"
    exit 1
fi

echo ""

# ============================================
# COMPILAR FRONTEND
# ============================================
echo -e "${YELLOW}🏗️  Compilando frontend para producción...${NC}"

npm run build

if [ -d "dist" ]; then
    echo -e "${GREEN}✅ Frontend compilado en dist/${NC}"
else
    echo -e "${RED}❌ Error al compilar frontend${NC}"
    exit 1
fi

echo ""

# ============================================
# CONFIGURAR PM2
# ============================================
echo -e "${YELLOW}🚀 Configurando PM2 para el backend...${NC}"

cd backend

# Detener si ya existe
if pm2 describe $PM2_APP_NAME &> /dev/null; then
    echo -e "${YELLOW}⚠️  Deteniendo instancia existente...${NC}"
    pm2 delete $PM2_APP_NAME
fi

# Iniciar con PM2
pm2 start server.js --name $PM2_APP_NAME

# Guardar configuración
pm2 save

# Configurar inicio automático (solo si no está configurado)
if ! systemctl is-enabled pm2-$USER &> /dev/null; then
    pm2 startup | tail -n 1 | bash
fi

echo -e "${GREEN}✅ Backend iniciado con PM2${NC}"

cd ..

echo ""

# ============================================
# CONFIGURAR NGINX
# ============================================
echo -e "${YELLOW}🌐 Configurando Nginx...${NC}"

NGINX_CONFIG="/etc/nginx/sites-available/bigartist"

sudo tee $NGINX_CONFIG > /dev/null << 'NGINXCONF'
server {
    listen 80;
    server_name app.bigartist.es;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name app.bigartist.es;

    ssl_certificate /etc/letsencrypt/live/app.bigartist.es/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/app.bigartist.es/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    root /var/www/bigartist-royalties/dist;
    index index.html;

    access_log /var/log/nginx/bigartist-access.log;
    error_log /var/log/nginx/bigartist-error.log;

    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml;

    # API Backend
    location /api/ {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Frontend SPA
    location / {
        try_files $uri $uri/ /index.html;
        add_header Cache-Control "no-cache, must-revalidate";
    }

    # Cache assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
}
NGINXCONF

echo -e "${GREEN}✅ Configuración de Nginx creada${NC}"

# Activar sitio
sudo ln -sf /etc/nginx/sites-available/bigartist /etc/nginx/sites-enabled/

# Verificar configuración
if sudo nginx -t; then
    echo -e "${GREEN}✅ Configuración de Nginx válida${NC}"
    sudo systemctl reload nginx
    echo -e "${GREEN}✅ Nginx recargado${NC}"
else
    echo -e "${RED}❌ Error en la configuración de Nginx${NC}"
    exit 1
fi

echo ""

# ============================================
# VERIFICAR SERVICIOS
# ============================================
echo -e "${YELLOW}🔍 Verificando servicios...${NC}"
echo ""

# PM2
echo -e "${BLUE}PM2 Status:${NC}"
pm2 status

echo ""

# Backend health check
echo -e "${YELLOW}Probando backend...${NC}"
sleep 2

if curl -s http://localhost:$BACKEND_PORT/api/health > /dev/null; then
    echo -e "${GREEN}✅ Backend responde correctamente${NC}"
else
    echo -e "${RED}❌ Backend no responde${NC}"
    echo -e "${YELLOW}Ver logs: pm2 logs $PM2_APP_NAME${NC}"
fi

echo ""

# Nginx
if sudo systemctl is-active --quiet nginx; then
    echo -e "${GREEN}✅ Nginx está corriendo${NC}"
else
    echo -e "${RED}❌ Nginx no está corriendo${NC}"
fi

echo ""

# ============================================
# CREAR SCRIPT DE ACTUALIZACIÓN
# ============================================
echo -e "${YELLOW}📝 Creando script de actualización...${NC}"

cat > $APP_DIR/update.sh << 'UPDATESCRIPT'
#!/bin/bash
set -e

echo "🔄 Actualizando BigArtist Royalties..."

GREEN='\033[0;32m'
NC='\033[0m'

# Detener backend
pm2 stop bigartist-backend || true

# Actualizar código
git pull origin main

# Backend
cd backend
npm install --production
cd ..

# Frontend
npm install
npm run build

# Reiniciar
pm2 restart bigartist-backend
sudo systemctl reload nginx

echo -e "${GREEN}✅ Actualización completada${NC}"
pm2 status
UPDATESCRIPT

chmod +x $APP_DIR/update.sh
echo -e "${GREEN}✅ Script de actualización creado: $APP_DIR/update.sh${NC}"

echo ""

# ============================================
# RESUMEN FINAL
# ============================================
echo -e "${BLUE}╔════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║         DESPLIEGUE COMPLETADO          ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════╝${NC}"
echo ""
echo -e "${GREEN}✅ Frontend compilado en: $APP_DIR/dist${NC}"
echo -e "${GREEN}✅ Backend corriendo en puerto: $BACKEND_PORT${NC}"
echo -e "${GREEN}✅ PM2 configurado: $PM2_APP_NAME${NC}"
echo -e "${GREEN}✅ Nginx configurado y corriendo${NC}"
echo ""
echo -e "${BLUE}🌐 URL: https://$DOMAIN${NC}"
echo ""
echo -e "${YELLOW}📊 Comandos útiles:${NC}"
echo "   Ver logs backend:   pm2 logs $PM2_APP_NAME"
echo "   Ver logs nginx:     sudo tail -f /var/log/nginx/bigartist-error.log"
echo "   Estado PM2:         pm2 status"
echo "   Actualizar app:     $APP_DIR/update.sh"
echo ""
echo -e "${GREEN}🚀 ¡Listo para producción!${NC}"
