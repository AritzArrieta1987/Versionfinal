# 🔴 Preview No Conecta al Backend

## Tu Problema

No puedes entrar desde el **preview de Figma Make** al backend.

## ✅ Solución en 4 Pasos

### PASO 1: Verifica que el Backend está Corriendo

Abre una terminal y ejecuta:

```bash
ssh root@94.143.141.241
pm2 list
```

**¿Qué deberías ver?**

```
┌─────┬──────────────────────┬─────────┬─────────┐
│ id  │ name                 │ mode    │ status  │
├─────┼──────────────────────┼─────────┼─────────┤
│ 0   │ bigartist-backend    │ fork    │ online  │ ← DEBE DECIR "online"
└─────┴──────────────────────┴─────────┴─────────┘
```

#### ❌ Si NO está "online" o NO aparece:

```bash
cd /root/bigartist-backend
pm2 start server.js --name bigartist-backend
pm2 save
pm2 logs bigartist-backend
```

---

### PASO 2: Verifica que el Endpoint Responde

Desde tu computadora (NO desde el servidor), ejecuta:

```bash
curl -X POST https://app.bigartist.es/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@bigartist.es","password":"admin123"}'
```

**Respuesta esperada**:
```json
{"success":true,"token":"eyJhbGci...","user":{...}}
```

#### ❌ Si NO responde o da error:

**Problema de Nginx**. En el servidor, ejecuta:

```bash
# Verificar configuración de Nginx
cat /etc/nginx/sites-available/app.bigartist.es | grep -A 10 "location /api"

# Debería mostrar algo como:
# location /api/ {
#     proxy_pass http://localhost:3001;
#     ...
# }
```

Si no existe o está mal, edita:

```bash
nano /etc/nginx/sites-available/app.bigartist.es
```

Añade dentro del bloque `server`:

```nginx
location /api/ {
    proxy_pass http://localhost:3001;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
    
    # CORS para permitir desde cualquier origen
    add_header 'Access-Control-Allow-Origin' '*' always;
    add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, DELETE, OPTIONS' always;
    add_header 'Access-Control-Allow-Headers' 'Content-Type, Authorization' always;
    
    if ($request_method = OPTIONS) {
        return 204;
    }
}
```

Guarda (Ctrl+O, Enter, Ctrl+X) y recarga:

```bash
nginx -t
systemctl reload nginx
```

---

### PASO 3: Verifica CORS en el Backend

En el servidor:

```bash
cat /root/bigartist-backend/server.js | grep -A 5 "cors"
```

**Debería mostrar**:
```javascript
app.use(cors({
  origin: ['http://localhost:3000', 'https://app.bigartist.es', 'http://localhost:5173'],
  credentials: true
}));
```

#### ❌ Si NO tiene configuración de CORS:

```bash
cd /root/bigartist-backend
npm install cors
```

Edita el `server.js`:

```bash
nano server.js
```

Busca la línea donde está `const app = express();` y añade DEBAJO:

```javascript
const cors = require('cors');

app.use(cors({
  origin: '*', // Permitir todos los orígenes
  credentials: true
}));
```

Guarda y reinicia:

```bash
pm2 restart bigartist-backend
pm2 logs bigartist-backend
```

---

### PASO 4: Verifica desde el Preview

Abre el preview de Figma Make y abre la **consola del navegador** (F12).

Intenta hacer login y mira los logs.

**Deberías ver**:
```
🔍 Intentando login a: https://app.bigartist.es/api/auth/login
📡 Response status: 200
✅ Login válido desde MySQL: admin
```

#### ❌ Si ves "CORS policy" error:

El problema es CORS. Vuelve al PASO 2 y PASO 3.

#### ❌ Si ves "Failed to fetch":

El backend no está accesible. Verifica:

1. **Firewall del servidor**:
```bash
ssh root@94.143.141.241
ufw status
```

Si el puerto 80 o 443 están bloqueados:
```bash
ufw allow 80
ufw allow 443
ufw reload
```

2. **Certificado SSL**:
```bash
curl -I https://app.bigartist.es
```

Debería responder con `HTTP/2 200` o similar.

---

## 🧪 Test Rápido desde el Navegador

Abre el preview de Figma Make, abre la **consola del navegador** (F12) y ejecuta:

```javascript
fetch('https://app.bigartist.es/api/health')
  .then(r => r.json())
  .then(d => console.log('✅ Backend OK:', d))
  .catch(e => console.error('❌ Error:', e))
```

Si ves `✅ Backend OK: {success: true, ...}` → El backend está accesible.

Si ves `❌ Error: Failed to fetch` → El backend NO es accesible.

---

## 📋 Checklist Completo

Verifica cada punto en el servidor:

```bash
ssh root@94.143.141.241

# 1. Backend corriendo
pm2 list | grep bigartist-backend | grep online
echo "✅ Backend online"

# 2. Puerto escuchando
netstat -tulpn | grep 3001
echo "✅ Puerto 3001 escuchando"

# 3. Endpoint local funciona
curl -s http://localhost:3001/api/health | grep success
echo "✅ Endpoint local OK"

# 4. MySQL corriendo
systemctl is-active mysql
echo "✅ MySQL OK"

# 5. Nginx corriendo
systemctl is-active nginx
echo "✅ Nginx OK"

# 6. Firewall permite HTTP/HTTPS
ufw status | grep -E "80|443"
echo "✅ Firewall OK"
```

---

## 🔧 Script de Auto-Fix

Ejecuta esto en el servidor para arreglar todo automáticamente:

```bash
ssh root@94.143.141.241 << 'EOF'
echo "🔧 Reparando configuración..."

# Verificar backend
cd /root/bigartist-backend
if [ ! -f "server.js" ]; then
    echo "❌ Backend no está instalado"
    exit 1
fi

# Instalar CORS si no está
npm list cors || npm install cors

# Reiniciar backend
pm2 restart bigartist-backend || pm2 start server.js --name bigartist-backend
pm2 save

# Esperar
sleep 3

# Verificar
pm2 list
curl -s http://localhost:3001/api/health

# Verificar Nginx
nginx -t
systemctl reload nginx

# Test público
echo ""
echo "🧪 Test público:"
curl -s https://app.bigartist.es/api/health
echo ""

echo "✅ Configuración actualizada"
EOF
```

---

## 🎯 Solución Más Común

**El problema más común es que el backend NO ESTÁ INSTALADO en el servidor**.

Si después de verificar todo sigue sin funcionar, ejecuta:

```bash
# En tu computadora
cd backend
./deploy-to-server.sh
```

Esto subirá e instalará todo el backend automáticamente.

---

## 🆘 Si Nada Funciona

Comparte el output de estos comandos:

```bash
# 1. Estado del backend
ssh root@94.143.141.241 'pm2 list && pm2 logs bigartist-backend --lines 10 --nostream'

# 2. Configuración de Nginx
ssh root@94.143.141.241 'cat /etc/nginx/sites-available/app.bigartist.es | grep -A 10 "location /api"'

# 3. Test del endpoint
curl -v https://app.bigartist.es/api/health

# 4. Archivos del backend
ssh root@94.143.141.241 'ls -la /root/bigartist-backend/'
```

---

## ✅ Una Vez que Funcione

Cuando veas esto:

```bash
curl https://app.bigartist.es/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@bigartist.es","password":"admin123"}'

# {"success":true,"token":"...","user":{...}}
```

El preview debería funcionar correctamente! 🎉
