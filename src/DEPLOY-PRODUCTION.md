# 🚀 GUÍA DE DESPLIEGUE COMPLETO - BigArtist Royalties

## 📋 Pre-requisitos

- Servidor con Node.js >= 18.0.0
- MySQL instalado y configurado
- Dominio: app.bigartist.es apuntando al servidor
- Nginx instalado
- PM2 instalado globalmente: `npm install -g pm2`

---

## 🔧 PASO 1: Preparar el Backend

### 1.1 Conectar por SSH a tu servidor
```bash
ssh usuario@app.bigartist.es
```

### 1.2 Navegar a tu directorio de aplicación
```bash
cd /var/www/bigartist-royalties
# O el path que uses
```

### 1.3 Clonar/Actualizar desde GitHub
```bash
# Si es primera vez:
git clone https://github.com/AritzArrieta1987/Versionfinal.git .

# Si ya existe:
git pull origin main
```

### 1.4 Configurar variables de entorno del backend
```bash
cd backend
nano .env
```

Contenido del archivo `.env`:
```env
# Base de datos
DB_HOST=localhost
DB_USER=bigartist_user
DB_PASSWORD=TU_PASSWORD_MYSQL
DB_NAME=bigartist_royalties
DB_PORT=3306

# JWT
JWT_SECRET=tu-secreto-jwt-super-seguro-cambiar-en-produccion

# Puerto del backend
PORT=3001

# Entorno
NODE_ENV=production

# CORS
CORS_ORIGIN=https://app.bigartist.es
```

### 1.5 Instalar dependencias del backend
```bash
npm install --production
```

### 1.6 Configurar la base de datos (si es primera vez)
```bash
mysql -u root -p
```

Dentro de MySQL:
```sql
CREATE DATABASE IF NOT EXISTS bigartist_royalties;
CREATE USER IF NOT EXISTS 'bigartist_user'@'localhost' IDENTIFIED BY 'TU_PASSWORD_AQUI';
GRANT ALL PRIVILEGES ON bigartist_royalties.* TO 'bigartist_user'@'localhost';
FLUSH PRIVILEGES;
exit;
```

Importar el schema:
```bash
mysql -u bigartist_user -p bigartist_royalties < database/setup.sql
mysql -u bigartist_user -p bigartist_royalties < database/finances_schema.sql
```

### 1.7 Iniciar el backend con PM2
```bash
pm2 start server.js --name bigartist-backend
pm2 save
pm2 startup
```

Verificar que está corriendo:
```bash
pm2 status
pm2 logs bigartist-backend
```

---

## 🎨 PASO 2: Preparar el Frontend

### 2.1 Volver al directorio raíz
```bash
cd /var/www/bigartist-royalties
```

### 2.2 Instalar dependencias del frontend
```bash
npm install
```

### 2.3 Compilar para producción
```bash
npm run build
```

Esto creará una carpeta `dist/` con todos los archivos estáticos optimizados.

---

## 🌐 PASO 3: Configurar Nginx

### 3.1 Crear configuración de Nginx
```bash
sudo nano /etc/nginx/sites-available/bigartist
```

Contenido del archivo:
```nginx
server {
    listen 80;
    listen [::]:80;
    server_name app.bigartist.es;

    # Redirigir HTTP a HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name app.bigartist.es;

    # Certificados SSL (ajusta las rutas según tu configuración)
    ssl_certificate /etc/letsencrypt/live/app.bigartist.es/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/app.bigartist.es/privkey.pem;
    
    # Configuración SSL recomendada
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # Root del frontend compilado
    root /var/www/bigartist-royalties/dist;
    index index.html;

    # Logs
    access_log /var/log/nginx/bigartist-access.log;
    error_log /var/log/nginx/bigartist-error.log;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    # API Backend (proxy al puerto 3001)
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
        proxy_read_timeout 300s;
        proxy_connect_timeout 300s;
    }

    # Frontend - React Router (SPA)
    location / {
        try_files $uri $uri/ /index.html;
        add_header Cache-Control "no-cache, must-revalidate";
    }

    # Cache para assets estáticos
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Seguridad adicional
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
}
```

### 3.2 Activar el sitio
```bash
sudo ln -s /etc/nginx/sites-available/bigartist /etc/nginx/sites-enabled/
```

### 3.3 Verificar configuración de Nginx
```bash
sudo nginx -t
```

### 3.4 Recargar Nginx
```bash
sudo systemctl reload nginx
```

---

## 🔒 PASO 4: SSL con Let's Encrypt (si no lo tienes)

### 4.1 Instalar Certbot
```bash
sudo apt update
sudo apt install certbot python3-certbot-nginx
```

### 4.2 Obtener certificado SSL
```bash
sudo certbot --nginx -d app.bigartist.es
```

Sigue las instrucciones y acepta redirigir HTTP a HTTPS.

### 4.3 Renovación automática
```bash
sudo certbot renew --dry-run
```

---

## ✅ PASO 5: Verificación Final

### 5.1 Verificar el backend
```bash
curl http://localhost:3001/api/health
```

Debería responder: `{"status":"ok"}`

### 5.2 Verificar PM2
```bash
pm2 status
pm2 logs bigartist-backend --lines 50
```

### 5.3 Verificar Nginx
```bash
sudo systemctl status nginx
sudo tail -f /var/log/nginx/bigartist-error.log
```

### 5.4 Probar en el navegador
Abre: `https://app.bigartist.es`

---

## 🔄 ACTUALIZACIONES FUTURAS

Crea este script para futuras actualizaciones:

```bash
nano /var/www/bigartist-royalties/update.sh
```

Contenido:
```bash
#!/bin/bash

echo "🔄 Actualizando BigArtist Royalties..."

# Detener el backend
pm2 stop bigartist-backend

# Actualizar código
git pull origin main

# Backend
cd backend
npm install --production
cd ..

# Frontend
npm install
npm run build

# Reiniciar servicios
pm2 restart bigartist-backend
sudo systemctl reload nginx

echo "✅ Actualización completada!"
pm2 status
```

Darle permisos:
```bash
chmod +x /var/www/bigartist-royalties/update.sh
```

Para actualizar en el futuro:
```bash
./update.sh
```

---

## 🐛 Troubleshooting

### Backend no arranca
```bash
pm2 logs bigartist-backend --lines 100
# Verificar variables de entorno
cat backend/.env
```

### Frontend muestra página en blanco
```bash
# Verificar que existe dist/
ls -la dist/
# Revisar logs de Nginx
sudo tail -f /var/log/nginx/bigartist-error.log
```

### Error de conexión a MySQL
```bash
# Verificar que MySQL está corriendo
sudo systemctl status mysql
# Probar conexión
mysql -u bigartist_user -p bigartist_royalties
```

### Error 502 Bad Gateway
```bash
# El backend no está corriendo o el proxy de Nginx está mal configurado
pm2 restart bigartist-backend
sudo nginx -t
sudo systemctl restart nginx
```

---

## 📊 Monitoreo

### Ver logs en tiempo real
```bash
# Backend
pm2 logs bigartist-backend

# Nginx
sudo tail -f /var/log/nginx/bigartist-access.log
sudo tail -f /var/log/nginx/bigartist-error.log
```

### Estado de servicios
```bash
pm2 status
sudo systemctl status nginx
sudo systemctl status mysql
```

---

## 🎯 CHECKLIST FINAL

- [ ] Backend corriendo en puerto 3001
- [ ] MySQL configurado y tablas creadas
- [ ] Frontend compilado en carpeta dist/
- [ ] Nginx configurado y corriendo
- [ ] SSL/HTTPS funcionando
- [ ] Prueba de login funcionando
- [ ] API respondiendo correctamente

---

**¡Tu aplicación debería estar funcionando en https://app.bigartist.es! 🚀**
