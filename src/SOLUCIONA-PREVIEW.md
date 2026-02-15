# 🎯 Solución: Preview No Conecta al Backend

## Tu Problema Actual

**No puedes entrar desde el preview de Figma Make al backend.**

---

## ⚡ SOLUCIÓN EN 2 PASOS

### PASO 1: Usa la Herramienta de Diagnóstico

Abre esta URL en tu navegador:

```
http://localhost:3000/test-backend.html
```

O desde el preview de Figma Make, añade `/test-backend.html` a la URL.

**Esta herramienta te dirá EXACTAMENTE cuál es el problema.**

---

### PASO 2: Sigue la Solución que te Indique

La herramienta tiene 4 tests automáticos:

#### ✅ Test 1: Conectividad
- Si falla → El backend NO está corriendo
- **Solución**: Sube el backend al servidor

#### ✅ Test 2: Login  
- Si falla → La base de datos no está configurada
- **Solución**: Ejecuta el script de setup de BD

#### ✅ Test 3: CORS
- Si falla → CORS está bloqueando las peticiones
- **Solución**: Configura CORS en el servidor

#### ✅ Test 4: Info del Sistema
- Muestra información de configuración

---

## 🚀 Solución Completa (Si Todo Falla)

Ejecuta estos comandos en orden:

### 1. Subir el Backend al Servidor

```bash
cd backend
chmod +x deploy-to-server.sh
./deploy-to-server.sh
```

### 2. Configurar la Base de Datos

```bash
ssh root@94.143.141.241
cd /root/bigartist-backend/database
mysql -u root -proot2024 < setup.sql
exit
```

### 3. Verificar que Funciona

```bash
curl -X POST https://app.bigartist.es/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@bigartist.es","password":"admin123"}'
```

**Respuesta esperada**:
```json
{"success":true,"token":"...","user":{...}}
```

---

## 🔍 Diagnóstico Manual

Si prefieres hacerlo manualmente, verifica:

### 1. Backend Corriendo

```bash
ssh root@94.143.141.241
pm2 list
```

Debe mostrar `bigartist-backend` con status `online`.

**Si NO está online**:
```bash
cd /root/bigartist-backend
pm2 start server.js --name bigartist-backend
pm2 save
```

### 2. Endpoint Responde

```bash
curl https://app.bigartist.es/api/health
```

Debe responder:
```json
{"success":true,"message":"BigArtist Backend is running","timestamp":"..."}
```

**Si NO responde**:
- Verifica Nginx: `nginx -t`
- Verifica firewall: `ufw status`

### 3. CORS Configurado

```bash
ssh root@94.143.141.241
cat /root/bigartist-backend/server.js | grep -A 5 "cors"
```

Debe tener:
```javascript
app.use(cors({
  origin: '*',
  credentials: true
}));
```

**Si NO está**:
```bash
cd /root/bigartist-backend
npm install cors
nano server.js
# Añadir la configuración de CORS
pm2 restart bigartist-backend
```

---

## 📊 Test desde el Navegador (Consola)

Abre el preview, presiona **F12**, ve a **Console** y ejecuta:

```javascript
// Test 1: Verificar configuración
console.log('API URL:', window.location.hostname);

// Test 2: Probar endpoint
fetch('https://app.bigartist.es/api/health')
  .then(r => r.json())
  .then(d => console.log('✅ Backend OK:', d))
  .catch(e => console.error('❌ Error:', e));

// Test 3: Probar login
fetch('https://app.bigartist.es/api/auth/login', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({
    email: 'admin@bigartist.es',
    password: 'admin123'
  })
})
  .then(r => r.json())
  .then(d => console.log('✅ Login:', d))
  .catch(e => console.error('❌ Login Error:', e));
```

---

## ✅ Checklist

Marca cada item:

- [ ] Backend está corriendo: `pm2 list` muestra "online"
- [ ] Puerto 3001 escuchando: `netstat -tulpn | grep 3001`
- [ ] MySQL corriendo: `systemctl status mysql`
- [ ] Base de datos creada: `mysql -u root -p -e "USE bigartist_royalties;"`
- [ ] Usuario admin existe: Ver en la BD
- [ ] Nginx configurado: Tiene proxy para `/api`
- [ ] Nginx corriendo: `systemctl status nginx`
- [ ] Endpoint local funciona: `curl localhost:3001/api/health`
- [ ] Endpoint público funciona: `curl https://app.bigartist.es/api/health`
- [ ] Login funciona: Ver comando arriba
- [ ] CORS configurado: Ver `server.js`
- [ ] Firewall permite HTTP/HTTPS: `ufw status`

---

## 🆘 Script de Auto-Reparación

Si nada funciona, ejecuta esto:

```bash
ssh root@94.143.141.241 << 'EOF'
# Auto-reparación completa
cd /root/bigartist-backend || exit 1

# Instalar CORS
npm install cors

# Verificar server.js tiene CORS
if ! grep -q "cors" server.js; then
    echo "⚠️  Falta configuración de CORS en server.js"
fi

# Reiniciar todo
pm2 restart bigartist-backend || pm2 start server.js --name bigartist-backend
pm2 save

# Verificar MySQL
systemctl start mysql

# Verificar Nginx
nginx -t
systemctl reload nginx

# Esperar y probar
sleep 3
echo ""
echo "🧪 Probando endpoint público:"
curl -s https://app.bigartist.es/api/health
echo ""
echo ""
echo "🧪 Probando login:"
curl -s -X POST https://app.bigartist.es/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@bigartist.es","password":"admin123"}' | head -c 200
echo ""
echo ""

# Estado final
pm2 list
EOF
```

---

## 📞 Ayuda Adicional

Si después de todo esto sigue sin funcionar, comparte:

```bash
# 1. Estado del servidor
ssh root@94.143.141.241 '
  pm2 list &&
  pm2 logs bigartist-backend --lines 20 --nostream &&
  curl -s http://localhost:3001/api/health
'

# 2. Test público
curl -v https://app.bigartist.es/api/health

# 3. Logs de Nginx
ssh root@94.143.141.241 'tail -n 50 /var/log/nginx/error.log'
```

---

## 🎯 Resumen Ultra-Rápido

**3 comandos mágicos para arreglar todo**:

```bash
# 1. Deploy completo
cd backend && ./deploy-to-server.sh

# 2. Setup BD
ssh root@94.143.141.241 'cd /root/bigartist-backend/database && mysql -u root -proot2024 < setup.sql'

# 3. Test
curl https://app.bigartist.es/api/auth/login -H "Content-Type: application/json" -d '{"email":"admin@bigartist.es","password":"admin123"}'
```

**Si ves `{"success":true,...}` → ¡FUNCIONA!** ✅

---

## 🌐 URL de la Herramienta de Diagnóstico

**Localhost**: http://localhost:3000/test-backend.html

**Preview**: [URL del preview]/test-backend.html

Esta herramienta te dice EXACTAMENTE qué está fallando y cómo solucionarlo.

---

**Usa la herramienta de diagnóstico primero** (`/test-backend.html`) **y comparte qué dice!** 🚀
