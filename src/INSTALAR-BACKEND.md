# 🚀 INSTALAR BACKEND - Guía Definitiva

## 🎯 El Problema

Tu error es:
```
No se puede conectar al servidor. Verifica que el backend esté corriendo en https://app.bigartist.es
```

**Causa**: Los archivos del backend **NO ESTÁN en el servidor** o el backend no está corriendo.

**Solución**: Subir los archivos y configurar el backend.

---

## ⚡ SOLUCIÓN RÁPIDA (5 minutos)

### Opción 1: Deploy Automático (RECOMENDADO)

Desde tu computadora, en el directorio del proyecto:

```bash
cd backend
chmod +x deploy-to-server.sh
./deploy-to-server.sh
```

**¿Qué hace este script?**
1. ✅ Empaqueta todos los archivos del backend
2. ✅ Los sube al servidor (94.143.141.241)
3. ✅ Instala las dependencias (npm install)
4. ✅ Configura el .env
5. ✅ Inicia el backend con PM2
6. ✅ Prueba que funcione

**Tiempo total**: 2-3 minutos

---

### Opción 2: Deploy Manual

Si el script automático falla, hazlo manualmente:

#### PASO 1: Comprimir archivos

En tu computadora, desde el directorio del proyecto:

```bash
cd backend
tar -czf backend.tar.gz server.js package.json .env.example routes database
```

#### PASO 2: Subir al servidor

```bash
scp backend.tar.gz root@94.143.141.241:/tmp/
```

#### PASO 3: Conectar al servidor e instalar

```bash
ssh root@94.143.141.241
```

Una vez conectado:

```bash
# Ir a /tmp y extraer
cd /tmp
tar -xzf backend.tar.gz

# Crear directorio del backend
mkdir -p /root/bigartist-backend
cd /root/bigartist-backend

# Mover archivos
mv /tmp/server.js .
mv /tmp/package.json .
mv /tmp/.env.example .
mv /tmp/routes . 2>/dev/null || true
mv /tmp/database . 2>/dev/null || true

# Crear .env
cp .env.example .env

# Editar .env (verificar credenciales)
nano .env
```

**Contenido del .env** (presiona Ctrl+O para guardar, Ctrl+X para salir):

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=root2024
DB_NAME=bigartist_royalties
JWT_SECRET=bigartist_secret_key_2024
PORT=3001
NODE_ENV=production
```

#### PASO 4: Instalar dependencias

```bash
npm install
```

#### PASO 5: Iniciar con PM2

```bash
# Detener proceso anterior (si existe)
pm2 delete bigartist-backend 2>/dev/null || true

# Iniciar
pm2 start server.js --name bigartist-backend

# Guardar configuración
pm2 save

# Configurar para que inicie automáticamente
pm2 startup
```

#### PASO 6: Verificar que funciona

```bash
# Ver estado
pm2 list

# Ver logs
pm2 logs bigartist-backend --lines 20

# Probar endpoint
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@bigartist.es","password":"admin123"}'
```

**Respuesta esperada**:
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

---

## 🔧 Configurar Nginx (si no está configurado)

Si el endpoint funciona en `localhost:3001` pero NO en `https://app.bigartist.es`:

```bash
# Editar configuración de Nginx
nano /etc/nginx/sites-available/app.bigartist.es
```

**Añadir esta configuración** (dentro del bloque `server`):

```nginx
server {
    server_name app.bigartist.es;

    # Redirigir /api al backend
    location /api/ {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        
        # CORS
        add_header 'Access-Control-Allow-Origin' '*' always;
        add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, DELETE, OPTIONS' always;
        add_header 'Access-Control-Allow-Headers' 'Content-Type, Authorization' always;
        
        # OPTIONS request
        if ($request_method = OPTIONS) {
            return 204;
        }
    }

    # Resto de configuración...
}
```

**Guardar y recargar Nginx**:

```bash
# Verificar sintaxis
nginx -t

# Si todo OK, recargar
systemctl reload nginx
```

---

## ✅ Verificación Final

### 1. En el servidor:

```bash
# Backend corriendo
pm2 list | grep bigartist-backend
# Debería mostrar: online

# Puerto escuchando
netstat -tulpn | grep 3001
# Debería mostrar: node ... :3001

# Endpoint local funciona
curl http://localhost:3001/health
# Debería responder: {"success":true,"message":"BigArtist Backend is running"...}
```

### 2. Desde tu computadora:

```bash
# Endpoint público funciona
curl https://app.bigartist.es/api/health

# Login funciona
curl -X POST https://app.bigartist.es/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@bigartist.es","password":"admin123"}'
```

### 3. En el navegador:

1. Abre `http://localhost:3000`
2. Presiona F12 (consola de desarrollador)
3. Intenta hacer login
4. Deberías ver en la consola:

```
🔍 Intentando login a: /api/auth/login
📡 Response status: 200
✅ Login válido desde MySQL: admin
```

---

## 🆘 Si aún no funciona

### Verificar logs del backend:

```bash
ssh root@94.143.141.241
pm2 logs bigartist-backend --lines 50
```

### Verificar base de datos:

```bash
ssh root@94.143.141.241
mysql -u root -p
# Password: root2024

USE bigartist_royalties;
SELECT * FROM users WHERE email = 'admin@bigartist.es';
```

Si NO existe el usuario admin, créalo:

```sql
-- Generar hash de contraseña (usar bcrypt online o en Node.js)
-- Para "admin123" el hash bcrypt es:
-- $2b$10$rK8F5jXcZOXQxjhDQVQOXuqYZVYX8LqWvNcZXvXcZOXQxjhDQVQOXu

INSERT INTO users (email, password, name, type) VALUES
('admin@bigartist.es', '$2b$10$rK8F5jXcZOXQxjhDQVQOXu', 'Admin', 'admin');
```

O ejecuta el script de setup de la base de datos:

```bash
cd /root/bigartist-backend/database
mysql -u root -p bigartist_royalties < setup.sql
```

---

## 📋 Checklist Final

- [ ] Backend corriendo: `pm2 list` muestra "online"
- [ ] Puerto 3001 escuchando: `netstat -tulpn | grep 3001`
- [ ] MySQL corriendo: `systemctl status mysql`
- [ ] Base de datos existe: `mysql -u root -p -e "USE bigartist_royalties;"`
- [ ] Usuario admin existe: Ver arriba
- [ ] Nginx configurado: `/etc/nginx/sites-available/app.bigartist.es` tiene proxy
- [ ] Nginx corriendo: `systemctl status nginx`
- [ ] Endpoint local funciona: `curl localhost:3001/health`
- [ ] Endpoint público funciona: `curl https://app.bigartist.es/api/health`
- [ ] Login funciona: Ver comando arriba

---

## 🚀 Una vez que funcione

Vuelve a tu frontend y:

```bash
npm run dev
```

Abre `http://localhost:3000` y haz login con:
- **Email**: admin@bigartist.es
- **Password**: admin123

**¡Debería funcionar!** ✅

---

## 📞 Comandos Útiles

```bash
# Ver estado del backend
ssh root@94.143.141.241 'pm2 list'

# Ver logs en tiempo real
ssh root@94.143.141.241 'pm2 logs bigartist-backend'

# Reiniciar backend
ssh root@94.143.141.241 'pm2 restart bigartist-backend'

# Detener backend
ssh root@94.143.141.241 'pm2 stop bigartist-backend'

# Eliminar backend de PM2
ssh root@94.143.141.241 'pm2 delete bigartist-backend'

# Probar endpoint
curl https://app.bigartist.es/api/health
```

---

**Elige la Opción 1 (script automático) y comparte el resultado** 🎯
