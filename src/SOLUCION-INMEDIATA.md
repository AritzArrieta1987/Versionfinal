# 🚨 SOLUCIÓN INMEDIATA - Preview No Funciona

## ❓ POR QUÉ NO PUEDES ENTRAR

**Respuesta corta**: El backend NO está instalado en el servidor.

**Respuesta técnica**: 
- El preview intenta conectarse a `https://app.bigartist.es/api/auth/login`
- El servidor responde: "No existe" (404 o error de conexión)
- Por eso no puedes hacer login

---

## ✅ SOLUCIÓN EN 3 COMANDOS

Copia y pega estos comandos **UNO POR UNO**:

### Comando 1: Subir el Backend

```bash
cd backend && chmod +x deploy-to-server.sh && ./deploy-to-server.sh
```

**Espera** hasta que termine. Verás algo como:

```
✅ Archivos copiados al servidor
✅ Dependencias instaladas
✅ Backend iniciado con PM2
```

---

### Comando 2: Configurar la Base de Datos

```bash
ssh root@94.143.141.241 "cd /root/bigartist-backend/database && mysql -u root -proot2024 bigartist_royalties < setup.sql"
```

Verás output de MySQL (tablas creadas, usuarios insertados, etc.)

---

### Comando 3: Verificar que Funciona

```bash
curl -X POST https://app.bigartist.es/api/auth/login -H "Content-Type: application/json" -d '{"email":"admin@bigartist.es","password":"admin123"}'
```

**Debes ver**:
```json
{"success":true,"token":"eyJhbG...","user":{...}}
```

---

## 🎉 SI VES ESO → ¡LISTO!

Ahora:

1. **Ve al preview de Figma Make**
2. **Recarga la página** (F5)
3. **Intenta entrar**:
   - Email: `admin@bigartist.es`
   - Password: `admin123`

**Debería funcionar!** ✅

---

## ❌ SI NO FUNCIONA

### Posible Error 1: "Permission denied" al ejecutar deploy

```bash
# Solución:
chmod +x backend/deploy-to-server.sh
cd backend
./deploy-to-server.sh
```

### Posible Error 2: "mysql: command not found" en el servidor

```bash
# Conecta al servidor:
ssh root@94.143.141.241

# Instala MySQL:
apt update
apt install mysql-server -y

# Configura contraseña:
mysql
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'root2024';
FLUSH PRIVILEGES;
exit;

# Ahora vuelve al Comando 2
```

### Posible Error 3: Comando 3 sigue sin funcionar

```bash
# Verifica que el backend esté corriendo:
ssh root@94.143.141.241 "pm2 list"

# Debes ver:
# ┌────┬────────────────────┬─────────┬─────────┐
# │ id │ name               │ status  │ ...     │
# ├────┼────────────────────┼─────────┼─────────┤
# │ 0  │ bigartist-backend  │ online  │ ...     │
# └────┴────────────────────┴─────────┴─────────┘
```

Si NO está "online":

```bash
ssh root@94.143.141.241
cd /root/bigartist-backend
pm2 start server.js --name bigartist-backend
pm2 save
exit
```

---

## 🔧 SI NADA DE ESO FUNCIONA

Ejecuta este **mega-comando** que lo hace TODO automáticamente:

```bash
# EN TU COMPUTADORA:
cd backend && ./deploy-to-server.sh && \
ssh root@94.143.141.241 'cd /root/bigartist-backend && \
  npm install && \
  cd database && mysql -u root -proot2024 bigartist_royalties < setup.sql && \
  cd .. && pm2 restart bigartist-backend && pm2 save && \
  sleep 2 && curl http://localhost:3001/api/health' && \
curl https://app.bigartist.es/api/auth/login -H "Content-Type: application/json" -d '{"email":"admin@bigartist.es","password":"admin123"}'
```

---

## 📸 COMPARTE ESTO SI SIGUE SIN FUNCIONAR

```bash
# 1. Ver si el backend está corriendo
ssh root@94.143.141.241 "pm2 list"

# 2. Ver logs del backend
ssh root@94.143.141.241 "pm2 logs bigartist-backend --lines 20 --nostream"

# 3. Probar endpoint público
curl -v https://app.bigartist.es/api/health

# 4. Listar archivos del backend
ssh root@94.143.141.241 "ls -la /root/bigartist-backend/"
```

Copia y pega TODO el output y compártelo.

---

## ⏱️ TIEMPO ESTIMADO

- ✅ Comando 1: **2 minutos**
- ✅ Comando 2: **30 segundos**
- ✅ Comando 3: **10 segundos**

**Total**: ~3 minutos

---

## 🎯 RESUMEN ULTRA-CORTO

**3 comandos en orden**:

```bash
# 1
cd backend && ./deploy-to-server.sh

# 2
ssh root@94.143.141.241 "cd /root/bigartist-backend/database && mysql -u root -proot2024 bigartist_royalties < setup.sql"

# 3
curl -X POST https://app.bigartist.es/api/auth/login -H "Content-Type: application/json" -d '{"email":"admin@bigartist.es","password":"admin123"}'
```

Si el #3 muestra `{"success":true,...}` → **Recarga el preview** → **Funciona** ✅
