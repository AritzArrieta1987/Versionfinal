# 🚨 TEST RÁPIDO - Login No Funciona en Preview

## Paso 1: Verifica el Backend (30 segundos)

Abre una nueva terminal y ejecuta:

```bash
curl -X POST https://app.bigartist.es/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@bigartist.es","password":"admin123"}'
```

### ✅ Si ves esto (BIEN):
```json
{"success":true,"token":"eyJhbGci...","user":{...}}
```
→ El backend funciona. Salta al **Paso 3**.

### ❌ Si ves esto (MAL):
```
curl: (7) Failed to connect to app.bigartist.es
```
o
```json
{"success":false,"message":"..."}
```
→ El backend NO funciona. Continúa al **Paso 2**.

---

## Paso 2: Instalar el Backend (3 minutos)

```bash
# A. Subir el backend
cd backend
chmod +x deploy-to-server.sh
./deploy-to-server.sh

# B. Espera a que termine (verás logs)

# C. Configurar la base de datos
ssh root@94.143.141.241
cd /root/bigartist-backend/database
mysql -u root -proot2024 bigartist_royalties < setup.sql
exit

# D. Verificar que funciona
curl -X POST https://app.bigartist.es/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@bigartist.es","password":"admin123"}'
```

Si ves `{"success":true,...}` → **¡Funciona!** Continúa al Paso 3.

---

## Paso 3: Verificar en el Preview

1. **Recarga el preview** (F5)
2. **Abre la consola del navegador** (F12)
3. **Intenta hacer login**:
   - Email: `admin@bigartist.es`
   - Password: `admin123`

### Mira los logs en la consola:

**✅ Si ves:**
```
🔧 API Configuration: {...}
🔍 Intentando login a: https://app.bigartist.es/api/auth/login
📡 Response status: 200
✅ Login exitoso
```
→ **¡FUNCIONA!** Ya puedes entrar.

**❌ Si ves:**
```
❌ Error en login: Failed to fetch
```
→ Problema de CORS o conectividad. Ve al **Paso 4**.

---

## Paso 4: Arreglar CORS (1 minuto)

```bash
ssh root@94.143.141.241

cd /root/bigartist-backend

# Editar server.js
nano server.js
```

Busca la línea `app.use(cors({` y asegúrate que diga:

```javascript
app.use(cors({
  origin: '*',  // ← IMPORTANTE: Permitir todos los orígenes
  credentials: true
}));
```

Guarda (Ctrl+O, Enter, Ctrl+X) y reinicia:

```bash
pm2 restart bigartist-backend
pm2 logs bigartist-backend --lines 10
exit
```

Recarga el preview y prueba de nuevo.

---

## 🆘 Si NADA Funciona

Comparte el resultado de estos comandos:

```bash
# 1. Test del endpoint
curl -v https://app.bigartist.es/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@bigartist.es","password":"admin123"}'

# 2. Estado del backend
ssh root@94.143.141.241 'pm2 list'

# 3. Logs del backend
ssh root@94.143.141.241 'pm2 logs bigartist-backend --lines 20 --nostream'
```

Y en el preview, presiona F12 y copia TODO lo que aparece en la consola.
