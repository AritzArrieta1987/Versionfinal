# 🎯 SOLUCIÓN COMPLETA - Error "Failed to fetch"

## 📋 Resumen del Problema

**Error actual**: 
```
No se puede conectar al servidor. Verifica que el backend esté corriendo en https://app.bigartist.es
```

**Causa**: El backend NO ESTÁ instalado o corriendo en el servidor.

**Solución**: Seguir esta guía paso a paso.

---

## ✅ SOLUCIÓN EN 3 PASOS SIMPLES

### 🚀 PASO 1: Subir el Backend al Servidor

En tu computadora, desde la raíz del proyecto:

```bash
cd backend
chmod +x deploy-to-server.sh
./deploy-to-server.sh
```

**Esto tomará 2-3 minutos y:**
- ✅ Comprime los archivos del backend
- ✅ Los sube al servidor
- ✅ Instala las dependencias
- ✅ Configura el .env
- ✅ Inicia el backend con PM2
- ✅ Verifica que funcione

**Output esperado**:
```
📦 DEPLOY BACKEND A SERVIDOR
==============================
✅ Archivos del backend encontrados
✅ Archivos copiados al paquete
✅ Paquete creado: bigartist-backend.tar.gz
✅ Archivos subidos correctamente
📦 Instalando dependencias...
🚀 Iniciando backend...
✅ Deployment completado
🎉 DEPLOYMENT COMPLETADO
```

---

### 🗄️ PASO 2: Configurar la Base de Datos

Conecta al servidor:

```bash
ssh root@94.143.141.241
```

Ejecuta el script de setup de la base de datos:

```bash
cd /root/bigartist-backend/database
mysql -u root -p < setup.sql
```

**Password de MySQL**: `root2024`

**Esto creará**:
- ✅ Base de datos `bigartist_royalties`
- ✅ Todas las tablas necesarias
- ✅ Usuario admin: `admin@bigartist.es` / `admin123`
- ✅ Usuario artista demo: `artista@demo.com` / `artist123`

---

### 🔧 PASO 3: Verificar que Todo Funciona

Aún conectado al servidor, ejecuta:

```bash
# Ver estado del backend
pm2 list

# Ver logs
pm2 logs bigartist-backend --lines 20

# Probar endpoint
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@bigartist.es","password":"admin123"}'
```

**Deberías ver**:
```json
{
  "success": true,
  "token": "eyJhbGci...",
  "user": {
    "id": 1,
    "email": "admin@bigartist.es",
    "name": "Admin",
    "type": "admin"
  }
}
```

✅ **Si ves esto, el backend funciona correctamente!**

---

## 🌐 Verificar desde Internet

Desde tu computadora (NO desde el servidor), ejecuta:

```bash
curl -X POST https://app.bigartist.es/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@bigartist.es","password":"admin123"}'
```

✅ **Si ves la misma respuesta, está accesible desde internet!**

---

## 💻 Probar el Frontend

Vuelve a tu proyecto React:

```bash
# Asegúrate de estar en la raíz del proyecto
npm run dev
```

Abre el navegador en: `http://localhost:3000`

Intenta hacer login con:
- **Email**: `admin@bigartist.es`
- **Password**: `admin123`

✅ **Deberías poder entrar sin problemas!**

---

## ❌ Si el PASO 1 Falla

### Opción A: El script no existe o falla

Crea el script manualmente:

```bash
cd backend
nano deploy-to-server.sh
```

Copia el contenido del archivo `/backend/deploy-to-server.sh` que ya está en el proyecto.

Guarda (Ctrl+O, Enter, Ctrl+X) y ejecuta:

```bash
chmod +x deploy-to-server.sh
./deploy-to-server.sh
```

### Opción B: Deploy Manual

Si el script automático no funciona, hazlo manual:

```bash
# Comprimir archivos
cd backend
tar -czf backend.tar.gz server.js package.json .env.example routes database

# Subir al servidor
scp backend.tar.gz root@94.143.141.241:/tmp/

# Conectar al servidor
ssh root@94.143.141.241

# Extraer e instalar
cd /tmp
tar -xzf backend.tar.gz
mkdir -p /root/bigartist-backend
cp -r server.js package.json .env.example routes database /root/bigartist-backend/

cd /root/bigartist-backend
cp .env.example .env

# Editar .env si es necesario
nano .env

# Instalar dependencias
npm install

# Iniciar con PM2
pm2 delete bigartist-backend 2>/dev/null || true
pm2 start server.js --name bigartist-backend
pm2 save

# Verificar
pm2 list
pm2 logs bigartist-backend --lines 20
```

---

## ❌ Si el PASO 2 Falla

### La base de datos no existe

```bash
ssh root@94.143.141.241
mysql -u root -p
```

Password: `root2024`

```sql
CREATE DATABASE bigartist_royalties;
USE bigartist_royalties;
source /root/bigartist-backend/database/setup.sql;
exit;
```

### El archivo setup.sql no existe

Créalo manualmente:

```bash
cd /root/bigartist-backend
mkdir -p database
nano database/setup.sql
```

Copia el contenido del archivo `/backend/database/setup.sql` del proyecto.

Guarda y ejecuta:

```bash
mysql -u root -p bigartist_royalties < database/setup.sql
```

---

## ❌ Si el PASO 3 Falla

### El backend no responde

```bash
# Ver logs detallados
pm2 logs bigartist-backend --lines 50

# Reiniciar
pm2 restart bigartist-backend

# Verificar MySQL
systemctl status mysql

# Verificar que el puerto está libre
netstat -tulpn | grep 3001
```

### Error de conexión a MySQL

Edita el archivo `.env`:

```bash
cd /root/bigartist-backend
nano .env
```

Verifica que tiene:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=root2024
DB_NAME=bigartist_royalties
JWT_SECRET=bigartist_secret_key_2024
PORT=3001
NODE_ENV=production
```

Guarda y reinicia:

```bash
pm2 restart bigartist-backend
pm2 logs bigartist-backend
```

---

## 🌐 Si funciona localmente pero NO desde internet

Esto es un problema de **Nginx**. Verifica la configuración:

```bash
ssh root@94.143.141.241
nano /etc/nginx/sites-available/app.bigartist.es
```

Debe contener esto (dentro del bloque `server`):

```nginx
server {
    server_name app.bigartist.es;

    location /api/ {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # SSL y resto de configuración...
    listen 443 ssl;
    ssl_certificate /etc/letsencrypt/live/app.bigartist.es/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/app.bigartist.es/privkey.pem;
}
```

Guarda y recarga:

```bash
nginx -t
systemctl reload nginx
```

---

## 📋 Checklist Completo

Marca cada item:

- [ ] **PASO 1**: Archivos del backend subidos al servidor
- [ ] **PASO 2**: Base de datos creada y configurada
- [ ] **PASO 3**: Backend iniciado con PM2 (status: online)
- [ ] Backend responde en localhost:3001
- [ ] MySQL está corriendo
- [ ] Usuario admin existe en la base de datos
- [ ] Nginx está configurado y corriendo
- [ ] Backend responde desde internet (https://app.bigartist.es/api/health)
- [ ] Login funciona desde curl
- [ ] Login funciona desde el navegador

---

## 🆘 Si Nada Funciona

Ejecuta este **mega-reset** en el servidor:

```bash
ssh root@94.143.141.241

# Detener todo
pm2 delete all

# Verificar servicios
systemctl start mysql
systemctl start nginx

# Reinstalar backend desde cero
cd /root
rm -rf bigartist-backend
mkdir bigartist-backend
cd bigartist-backend

# Aquí necesitas subir los archivos de nuevo
# Usa el script deploy-to-server.sh o el método manual

# Una vez subidos, instalar
npm install
cp .env.example .env
nano .env  # Verificar credenciales

# Configurar base de datos
mysql -u root -p < database/setup.sql

# Iniciar
pm2 start server.js --name bigartist-backend
pm2 save
pm2 logs bigartist-backend
```

---

## 📞 Información de Ayuda

Si después de todo esto sigue sin funcionar, comparte:

### 1. Output de estos comandos en el servidor:

```bash
pm2 list
pm2 logs bigartist-backend --lines 30 --nostream
ls -la /root/bigartist-backend/
cat /root/bigartist-backend/.env | sed 's/PASSWORD=.*/PASSWORD=***/'
systemctl status mysql | head -10
systemctl status nginx | head -10
netstat -tulpn | grep 3001
```

### 2. Output de estos comandos en tu computadora:

```bash
curl https://app.bigartist.es/api/health
curl -X POST https://app.bigartist.es/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@bigartist.es","password":"admin123"}'
```

### 3. Consola del navegador (F12):

- Abre http://localhost:3000
- Presiona F12
- Intenta hacer login
- Copia todo lo que aparezca en la consola (Console tab)
- Copia las peticiones fallidas (Network tab)

---

## 🎯 Resumen Ultra-Rápido

**3 comandos mágicos**:

```bash
# 1. Deploy backend
cd backend && ./deploy-to-server.sh

# 2. Setup base de datos
ssh root@94.143.141.241 'cd /root/bigartist-backend/database && mysql -u root -proot2024 < setup.sql'

# 3. Verificar
curl -X POST https://app.bigartist.es/api/auth/login -H "Content-Type: application/json" -d '{"email":"admin@bigartist.es","password":"admin123"}'
```

Si los 3 funcionan, todo está listo! ✅

---

**Ejecuta el PASO 1 ahora y dime qué sale** 🚀
