# 🚨 NO PUEDO ENTRAR CON admin@bigartist.es EN EL PREVIEW

## 🎯 Tu Problema EXACTO

**Síntoma**: No puedes hacer login con `admin@bigartist.es` desde el preview de Figma Make.

**Causa más probable**: El backend NO está corriendo en el servidor.

---

## ⚡ SOLUCIÓN EN 2 MINUTOS

### ✅ OPCIÓN 1: Usa la Herramienta de Debug (MÁS RÁPIDO)

1. **Abre esta URL en el preview**:

```
[URL-DEL-PREVIEW]/debug-login.html
```

O si estás en localhost:

```
http://localhost:3000/debug-login.html
```

2. **La herramienta automáticamente**:
   - ✅ Prueba la conexión al backend
   - ✅ Intenta hacer login
   - ✅ Te dice EXACTAMENTE qué está fallando
   - ✅ Te da la solución específica

3. **Sigue las instrucciones** que te muestre la herramienta.

---

### ✅ OPCIÓN 2: Verifica Manualmente (1 minuto)

Abre una terminal y ejecuta:

```bash
curl -X POST https://app.bigartist.es/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@bigartist.es","password":"admin123"}'
```

#### Si ves esto → ✅ EL BACKEND FUNCIONA:

```json
{"success":true,"token":"eyJhbGci...","user":{...}}
```

**Solución**: El problema es en el frontend. Recarga el preview (F5) y prueba de nuevo.

#### Si ves esto → ❌ EL BACKEND NO FUNCIONA:

```
curl: (7) Failed to connect to app.bigartist.es
```

o

```
curl: (52) Empty reply from server
```

**Solución**: El backend no está corriendo. Ve a la **OPCIÓN 3**.

---

### ✅ OPCIÓN 3: Instalar el Backend (3 minutos)

El backend NO está instalado. Ejecuta estos comandos:

```bash
# 1. Subir el backend al servidor
cd backend
chmod +x deploy-to-server.sh
./deploy-to-server.sh
```

**Espera** a que termine (verás logs). Luego:

```bash
# 2. Configurar la base de datos
ssh root@94.143.141.241
cd /root/bigartist-backend/database
mysql -u root -proot2024 bigartist_royalties < setup.sql
exit
```

**Verifica** que funciona:

```bash
# 3. Probar el login
curl -X POST https://app.bigartist.es/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@bigartist.es","password":"admin123"}'
```

Si ves `{"success":true,...}` → **¡LISTO!**

**Recarga el preview** (F5) y ya deberías poder entrar.

---

## 🔍 Diagnóstico Detallado

Si las opciones anteriores no funcionan, diagnóstico paso a paso:

### Paso 1: ¿El servidor backend está corriendo?

```bash
ssh root@94.143.141.241
pm2 list
```

**Debes ver**:
```
┌────┬────────────────────┬─────────┬─────────┐
│ id │ name               │ mode    │ status  │
├────┼────────────────────┼─────────┼─────────┤
│ 0  │ bigartist-backend  │ fork    │ online  │ ← DEBE DECIR "online"
└────┴────────────────────┴─────────┴─────────┘
```

**❌ Si NO aparece o dice "stopped"**:

```bash
cd /root/bigartist-backend

# Si no existe el directorio:
# Significa que nunca subiste el backend. Ve a OPCIÓN 3.

# Si existe:
pm2 start server.js --name bigartist-backend
pm2 save
pm2 logs bigartist-backend
```

### Paso 2: ¿El endpoint local responde?

```bash
# Estando conectado al servidor:
curl http://localhost:3001/api/health
```

**Debes ver**:
```json
{"success":true,"message":"BigArtist Backend is running","timestamp":"..."}
```

**❌ Si NO responde**:

```bash
# Ver logs para identificar el error
pm2 logs bigartist-backend --lines 50

# Posibles errores:
# - "ECONNREFUSED" → MySQL no está corriendo
# - "ER_BAD_DB_ERROR" → Base de datos no existe
# - "EADDRINUSE" → Puerto 3001 ocupado
```

**Soluciones**:

```bash
# Si MySQL no está corriendo:
systemctl start mysql

# Si la base de datos no existe:
cd /root/bigartist-backend/database
mysql -u root -proot2024 < setup.sql

# Si el puerto está ocupado:
lsof -ti:3001 | xargs kill -9
pm2 restart bigartist-backend
```

### Paso 3: ¿El endpoint público responde?

```bash
# Desde tu computadora (NO desde el servidor):
curl https://app.bigartist.es/api/health
```

**Debes ver**:
```json
{"success":true,"message":"BigArtist Backend is running"...}
```

**❌ Si NO responde**: Problema con Nginx o firewall.

```bash
ssh root@94.143.141.241

# Verificar Nginx
nginx -t
systemctl status nginx

# Ver configuración de Nginx
cat /etc/nginx/sites-available/app.bigartist.es | grep -A 10 "location /api"

# Debería mostrar:
# location /api/ {
#     proxy_pass http://localhost:3001;
#     ...
# }

# Si no existe, editar:
nano /etc/nginx/sites-available/app.bigartist.es

# Añadir dentro del bloque server:
# location /api/ {
#     proxy_pass http://localhost:3001;
#     proxy_http_version 1.1;
#     proxy_set_header Host $host;
# }

# Recargar Nginx:
nginx -t
systemctl reload nginx
```

### Paso 4: ¿El usuario admin existe en la BD?

```bash
ssh root@94.143.141.241
mysql -u root -proot2024 bigartist_royalties
```

```sql
SELECT * FROM users WHERE email = 'admin@bigartist.es';
```

**Debes ver**:
```
+----+---------------------+----------+-------+-------+
| id | email               | password | name  | type  |
+----+---------------------+----------+-------+-------+
|  1 | admin@bigartist.es  | $2b$10.. | Admin | admin |
+----+---------------------+----------+-------+-------+
```

**❌ Si NO existe**:

```sql
-- Crear usuario admin (password: admin123)
INSERT INTO users (email, password, name, type) VALUES
('admin@bigartist.es', '$2b$10$rK8F5jXcZOXQxjhDQVQOXu', 'Admin', 'admin');

-- Salir
exit;
```

O ejecutar el script de setup:

```bash
cd /root/bigartist-backend/database
mysql -u root -proot2024 bigartist_royalties < setup.sql
```

### Paso 5: ¿CORS permite el preview?

En el servidor:

```bash
cd /root/bigartist-backend
grep -A 5 "cors" server.js
```

**Debe mostrar**:
```javascript
app.use(cors({
  origin: '*',
  credentials: true
}));
```

**❌ Si NO está o es diferente**:

```bash
nano server.js
```

Busca `const app = express();` y JUSTO DESPUÉS añade:

```javascript
const cors = require('cors');

app.use(cors({
  origin: '*',
  credentials: true
}));
```

Guarda (Ctrl+O, Enter, Ctrl+X) y reinicia:

```bash
pm2 restart bigartist-backend
```

---

## 🧪 Test desde el Preview (Consola del Navegador)

1. **Abre el preview**
2. **Presiona F12** (Consola de desarrollador)
3. **Ve a la pestaña "Console"**
4. **Ejecuta estos comandos**:

```javascript
// Test 1: Verificar configuración
console.log('Hostname:', window.location.hostname);
console.log('API debe usar:', 'https://app.bigartist.es');

// Test 2: Probar health check
fetch('https://app.bigartist.es/api/health')
  .then(r => r.json())
  .then(d => console.log('✅ Backend OK:', d))
  .catch(e => console.error('❌ Backend NO accesible:', e));

// Test 3: Probar login
fetch('https://app.bigartist.es/api/auth/login', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({email:'admin@bigartist.es',password:'admin123'})
})
  .then(r => r.json())
  .then(d => {
    if (d.success) {
      console.log('✅ LOGIN OK:', d);
      localStorage.setItem('authToken', d.token);
      localStorage.setItem('user', JSON.stringify(d.user));
      console.log('Token guardado. Recarga la página (F5)');
    } else {
      console.error('❌ LOGIN FALLÓ:', d);
    }
  })
  .catch(e => console.error('❌ Error:', e));
```

**Si ves errores**, copia TODO lo que aparezca y compártelo.

---

## 📋 Checklist Completo

Marca cada item:

- [ ] Backend corriendo: `pm2 list` muestra "online"
- [ ] Endpoint local funciona: `curl localhost:3001/api/health`
- [ ] MySQL corriendo: `systemctl status mysql`
- [ ] Base de datos existe: `USE bigartist_royalties;` funciona
- [ ] Usuario admin existe en la BD
- [ ] Nginx corriendo y configurado
- [ ] Endpoint público funciona: `curl https://app.bigartist.es/api/health`
- [ ] Login funciona vía curl
- [ ] CORS configurado con `origin: '*'`

---

## 🚀 Script de Auto-Fix (ÚLTIMO RECURSO)

Si NADA funciona, ejecuta este mega-script:

```bash
# EN TU COMPUTADORA: Deploy del backend
cd backend
./deploy-to-server.sh

# EN EL SERVIDOR: Configurar todo
ssh root@94.143.141.241 << 'EOF'
cd /root/bigartist-backend

# Setup BD
mysql -u root -proot2024 bigartist_royalties < database/setup.sql

# Verificar CORS
if ! grep -q "origin: '\*'" server.js; then
    echo "⚠️  Configura CORS manualmente"
fi

# Reiniciar
pm2 restart bigartist-backend
pm2 save

# Verificar Nginx
nginx -t
systemctl reload nginx

# Test
sleep 2
echo ""
echo "🧪 Probando health:"
curl -s http://localhost:3001/api/health
echo ""
echo ""
echo "🧪 Probando login:"
curl -s -X POST https://app.bigartist.es/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@bigartist.es","password":"admin123"}' | head -c 200
echo ""
echo ""
pm2 list
EOF

# VERIFICAR DESDE TU COMPUTADORA
curl https://app.bigartist.es/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@bigartist.es","password":"admin123"}'
```

Si ves `{"success":true,...}` → **¡FUNCIONA!**

**Recarga el preview (F5)** y ya deberías poder entrar.

---

## 🆘 Ayuda Final

Si TODAVÍA no funciona, comparte el resultado de:

```bash
# 1. Estado del backend
ssh root@94.143.141.241 'pm2 list && pm2 logs bigartist-backend --lines 30 --nostream'

# 2. Test curl
curl -v https://app.bigartist.es/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@bigartist.es","password":"admin123"}'

# 3. Test en el preview
# Abre debug-login.html y comparte el resultado
```

---

## 🎯 RESUMEN ULTRA-RÁPIDO

**3 Pasos**:

1. **Abre**: `[preview-url]/debug-login.html`
2. **Lee** lo que dice
3. **Ejecuta** la solución que te indique

O directamente:

```bash
cd backend && ./deploy-to-server.sh
ssh root@94.143.141.241 'cd /root/bigartist-backend/database && mysql -u root -proot2024 bigartist_royalties < setup.sql'
curl https://app.bigartist.es/api/auth/login -H "Content-Type: application/json" -d '{"email":"admin@bigartist.es","password":"admin123"}'
```

**Si ves `{"success":true,...}` recarga el preview y listo!** ✅
