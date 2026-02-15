# ⚡ Solución Rápida - "Failed to fetch"

## 🎯 Paso 1: Verifica si el backend está corriendo

Abre una terminal y ejecuta:

```bash
ssh root@94.143.141.241
```

Password: `root2024`

Luego:

```bash
pm2 list
```

**¿Qué deberías ver?**

```
┌─────┬──────────────────────┬─────────┬─────────┐
│ id  │ name                 │ mode    │ status  │
├─────┼──────────────────────┼─────────┼─────────┤
│ 0   │ bigartist-backend    │ fork    │ online  │ ✅
└─────┴──────────────────────┴─────────┴─────────┘
```

### ❌ Si NO ves `bigartist-backend` o está `stopped`:

```bash
cd /root/bigartist-backend
pm2 start server.js --name bigartist-backend
pm2 save
```

---

## 🎯 Paso 2: Ver los logs del backend

```bash
pm2 logs bigartist-backend --lines 20
```

**Deberías ver:**
```
Server running on port 3001
MySQL Connected
```

### ❌ Si ves errores:

```bash
cd /root/bigartist-backend
npm install
pm2 restart bigartist-backend
pm2 logs bigartist-backend
```

---

## 🎯 Paso 3: Probar el endpoint directamente

Desde el servidor, ejecuta:

```bash
curl http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@bigartist.es","password":"admin123"}'
```

**Respuesta esperada:**
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

### ❌ Si NO funciona:

El problema está en el backend. Verifica que:

1. MySQL está corriendo:
```bash
systemctl status mysql
```

2. Las credenciales de MySQL son correctas en `/root/bigartist-backend/.env`:
```bash
cat /root/bigartist-backend/.env
```

Debería contener:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=root2024
DB_NAME=bigartist_royalties
JWT_SECRET=bigartist_secret_key_2024
PORT=3001
```

---

## 🎯 Paso 4: Probar desde fuera del servidor

Desde tu computadora local, abre una nueva terminal y ejecuta:

```bash
curl https://app.bigartist.es/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@bigartist.es","password":"admin123"}'
```

**Respuesta esperada:**
```json
{
  "success": true,
  "token": "eyJhbGci...",
  "user": {...}
}
```

### ❌ Si NO funciona pero el Paso 3 SÍ funcionó:

El problema es **Nginx**. Verifica la configuración:

```bash
ssh root@94.143.141.241
cat /etc/nginx/sites-available/app.bigartist.es
```

Debería tener algo como:

```nginx
server {
    server_name app.bigartist.es;
    
    location /api/ {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
    }
}
```

Si falta o está mal, edita:

```bash
nano /etc/nginx/sites-available/app.bigartist.es
```

Guarda (Ctrl+O, Enter, Ctrl+X) y recarga:

```bash
nginx -t
systemctl reload nginx
```

---

## 🎯 Paso 5: Reiniciar el frontend (tu computadora)

Vuelve a tu proyecto local y:

```bash
# Detener el servidor (Ctrl+C en la terminal donde corre)
# Luego reiniciar:
npm run dev
```

Abre el navegador en `http://localhost:3000` e intenta hacer login de nuevo.

---

## 🎯 Paso 6: Ver la consola del navegador

1. Abre `http://localhost:3000`
2. Presiona **F12** para abrir las herramientas de desarrollador
3. Ve a la pestaña **Console**
4. Intenta hacer login con:
   - Email: `admin@bigartist.es`
   - Password: `admin123`

**¿Qué deberías ver en la consola?**

```
🔍 Intentando login a: /api/auth/login
📧 Email: admin@bigartist.es
📡 Response status: 200
📡 Response ok: true
📦 Response data: {success: true, token: "...", user: {...}}
✅ Login válido desde MySQL: admin
```

### ❌ Si ves "Failed to fetch":

El navegador no puede conectarse. Verifica:

1. **Network tab** (pestaña Red) en las herramientas de desarrollador
2. Busca la petición a `/api/auth/login`
3. Mira el **Status**:
   - Si no aparece = no llega al servidor
   - Si aparece pero con error = hay un problema en el servidor

---

## 🎯 Paso 7: Usar la herramienta de debug

En tu navegador, abre la consola (F12) y escribe:

```javascript
window.debugBigArtist.info()
```

Esto te mostrará toda la configuración actual.

Luego prueba la conexión:

```javascript
window.debugBigArtist.testConnection()
```

---

## 📋 Resumen de Comandos

### En el servidor (94.143.141.241):

```bash
# Verificar estado
pm2 list
pm2 logs bigartist-backend --lines 20

# Reiniciar si es necesario
pm2 restart bigartist-backend

# Verificar MySQL
systemctl status mysql

# Verificar Nginx
nginx -t
systemctl status nginx

# Probar endpoint localmente
curl http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@bigartist.es","password":"admin123"}'
```

### En tu computadora local:

```bash
# Probar endpoint remotamente
curl https://app.bigartist.es/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@bigartist.es","password":"admin123"}'

# Reiniciar servidor de desarrollo
npm run dev
```

---

## 🆘 Si NADA funciona

Ejecuta este **mega-reset** en el servidor:

```bash
ssh root@94.143.141.241

# Detener todo
pm2 delete all

# Ir al directorio
cd /root/bigartist-backend

# Reinstalar dependencias
rm -rf node_modules package-lock.json
npm install

# Verificar que .env existe
cat .env

# Si no existe, crearlo:
cat > .env << 'EOF'
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=root2024
DB_NAME=bigartist_royalties
JWT_SECRET=bigartist_secret_key_2024
PORT=3001
EOF

# Iniciar backend
pm2 start server.js --name bigartist-backend
pm2 save

# Ver logs
pm2 logs bigartist-backend --lines 30

# Probar
curl http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@bigartist.es","password":"admin123"}'
```

---

## ✅ ¿Funcionó?

Si ahora puedes hacer login, estos fueron los archivos que creamos/actualizamos:

- ✅ `/vite.config.ts` - Proxy configurado
- ✅ `/utils/api.ts` - Funciones centralizadas con logs
- ✅ `/components/LoginPanel.tsx` - Usa la función centralizada
- ✅ Backend corriendo en puerto 3001
- ✅ Nginx redirigiendo `/api` al backend

---

**¿Sigue sin funcionar?**

Comparte:
1. Output de `pm2 logs bigartist-backend`
2. Output de la consola del navegador (F12)
3. Output de `window.debugBigArtist.info()`

Y podré ayudarte más específicamente! 🚀
