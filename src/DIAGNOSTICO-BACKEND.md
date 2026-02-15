# 🔍 Diagnóstico del Backend

## ❌ Error Actual: "Failed to fetch"

Este error significa que el navegador **no puede conectarse** al servidor backend en `https://app.bigartist.es`. Esto puede ser por:

1. ❌ El backend no está corriendo
2. ❌ El backend está corriendo pero no en el puerto correcto
3. ❌ Hay un problema de CORS
4. ❌ El proxy de Vite no está funcionando
5. ❌ Problema de firewall/red

---

## 🧪 Tests Rápidos

### Test 1: Abrir el archivo de test

Abre este archivo en tu navegador:

```
/utils/api-test.html
```

O accede directamente:
```
http://localhost:3000/utils/api-test.html
```

Ejecuta los 4 tests y verás exactamente dónde está el problema.

---

### Test 2: Verificar desde la terminal (local)

Ejecuta estos comandos desde tu terminal local:

```bash
# Test 1: Verificar si el servidor responde
curl https://app.bigartist.es/api/finances/stats

# Test 2: Probar login
curl -X POST https://app.bigartist.es/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@bigartist.es","password":"admin123"}'

# Test 3: Ver headers (CORS)
curl -I https://app.bigartist.es/api/auth/login
```

**Respuesta esperada del login:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "admin@bigartist.es",
    "name": "Admin",
    "type": "admin"
  }
}
```

---

### Test 3: Verificar el backend en el servidor

```bash
# Conectarse al servidor
ssh root@94.143.141.241

# Ver procesos de PM2
pm2 list

# Ver logs del backend
pm2 logs bigartist-backend --lines 50

# Ver si el puerto está escuchando
netstat -tulpn | grep 3001

# Probar el endpoint localmente en el servidor
curl http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@bigartist.es","password":"admin123"}'
```

---

## ✅ Soluciones por Escenario

### Escenario 1: Backend no está corriendo

**Síntoma**: `pm2 list` no muestra `bigartist-backend` o está en status `stopped`

**Solución**:
```bash
ssh root@94.143.141.241
cd /root/bigartist-backend
pm2 start server.js --name bigartist-backend
pm2 save
```

---

### Escenario 2: Backend corriendo en puerto incorrecto

**Síntoma**: Backend corre pero en puerto diferente a 3001

**Verificar**:
```bash
pm2 logs bigartist-backend --lines 20
# Debería mostrar: "Server running on port 3001"
```

**Solución**: Verificar que el `server.js` tenga:
```javascript
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

---

### Escenario 3: Nginx no está redirigiendo correctamente

**Síntoma**: El backend corre en el servidor pero no responde desde fuera

**Verificar configuración Nginx**:
```bash
cat /etc/nginx/sites-available/app.bigartist.es
```

**Debería contener**:
```nginx
server {
    listen 80;
    server_name app.bigartist.es;
    
    location /api/ {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        
        # CORS headers
        add_header 'Access-Control-Allow-Origin' '*' always;
        add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, DELETE, OPTIONS' always;
        add_header 'Access-Control-Allow-Headers' 'Content-Type, Authorization' always;
    }
}
```

**Recargar Nginx**:
```bash
nginx -t
systemctl reload nginx
```

---

### Escenario 4: Problema de CORS

**Síntoma**: Error en consola del navegador: "CORS policy blocked"

**Solución**: Verificar que el `server.js` tenga:
```javascript
const cors = require('cors');

app.use(cors({
  origin: ['http://localhost:3000', 'https://app.bigartist.es'],
  credentials: true
}));
```

Si no está instalado:
```bash
cd /root/bigartist-backend
npm install cors
pm2 restart bigartist-backend
```

---

### Escenario 5: El proxy de Vite no funciona

**Síntoma**: Funciona con curl pero no desde el navegador

**Solución**: Verificar `/vite.config.ts`:
```typescript
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'https://app.bigartist.es',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path
      }
    }
  }
});
```

**Reiniciar el servidor de desarrollo**:
```bash
# Detener con Ctrl+C
npm run dev
```

---

## 🔧 Script de Diagnóstico Automático

Ejecuta este script para un diagnóstico completo:

```bash
cd backend
chmod +x check-backend.sh
./check-backend.sh
```

---

## 📋 Checklist de Verificación

Verifica cada punto:

- [ ] El backend está corriendo: `pm2 list` muestra `bigartist-backend` online
- [ ] El puerto es correcto: logs muestran "Server running on port 3001"
- [ ] Nginx está configurado: `nginx -t` no muestra errores
- [ ] Nginx está corriendo: `systemctl status nginx` muestra active
- [ ] El endpoint responde localmente: `curl localhost:3001/api/auth/login` funciona
- [ ] El endpoint responde remotamente: `curl https://app.bigartist.es/api/auth/login` funciona
- [ ] CORS está configurado: hay paquete `cors` instalado en `package.json`
- [ ] El proxy de Vite está configurado: `/vite.config.ts` tiene la sección proxy
- [ ] El servidor dev está corriendo: `npm run dev` sin errores

---

## 🚨 Solución Rápida de Emergencia

Si nada funciona, ejecuta esto en el servidor:

```bash
ssh root@94.143.141.241

# Detener todo
pm2 stop all

# Verificar que MySQL está corriendo
systemctl status mysql

# Verificar configuración del backend
cd /root/bigartist-backend
cat server.js | grep "port\|cors"

# Instalar dependencias faltantes
npm install cors express mysql2 jsonwebtoken bcrypt dotenv multer csv-parser

# Reiniciar backend
pm2 restart bigartist-backend
pm2 logs bigartist-backend --lines 30

# Verificar Nginx
nginx -t
systemctl reload nginx

# Probar endpoint
curl http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@bigartist.es","password":"admin123"}'
```

---

## 💡 Información de Debug en Consola del Navegador

Cuando intentes hacer login, abre la consola del navegador (F12) y verás:

```
🔍 Intentando login a: /api/auth/login
📧 Email: admin@bigartist.es
📡 Response status: XXX
📡 Response ok: true/false
📦 Response data: {...}
```

Si no ves estos logs, es porque la función de login no se está ejecutando.

Si ves "Failed to fetch", es porque el navegador no puede alcanzar el servidor.

---

## 📞 Último Recurso

Si después de todo esto sigue sin funcionar:

1. Copia EXACTAMENTE los logs de:
   - Consola del navegador (F12)
   - Terminal donde corre `npm run dev`
   - `pm2 logs bigartist-backend`

2. Ejecuta los tests del archivo `/utils/api-test.html`

3. Ejecuta el script `./backend/check-backend.sh`

4. Comparte todos los resultados para diagnóstico más específico

---

**Última actualización**: 15 de febrero de 2026
