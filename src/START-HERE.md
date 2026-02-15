# 🎯 EMPIEZA AQUÍ - Solución al Error de Login

## 🔴 Tu Problema

```
No se puede conectar al servidor. Verifica que el backend esté corriendo en https://app.bigartist.es
```

## ✅ La Solución (3 Comandos)

### 1️⃣ Subir el Backend al Servidor

```bash
cd backend
chmod +x deploy-to-server.sh
./deploy-to-server.sh
```

⏱️ **Tiempo**: 2-3 minutos

---

### 2️⃣ Configurar la Base de Datos

```bash
ssh root@94.143.141.241
cd /root/bigartist-backend/database
mysql -u root -proot2024 < setup.sql
exit
```

⏱️ **Tiempo**: 30 segundos

---

### 3️⃣ Verificar que Funciona

```bash
curl -X POST https://app.bigartist.es/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@bigartist.es","password":"admin123"}'
```

✅ **Resultado esperado**:
```json
{"success":true,"token":"eyJhbGci...","user":{...}}
```

---

## 🎉 Ahora Prueba el Login

```bash
npm run dev
```

Abre: `http://localhost:3000`

**Login**:
- Email: `admin@bigartist.es`
- Password: `admin123`

---

## ❌ Si Algo Falla

Lee el archivo correspondiente:

1. **Fallo en el paso 1** → Lee `/INSTALAR-BACKEND.md`
2. **Fallo en el paso 2** → Lee `/backend/database/README.md`
3. **Fallo en el paso 3** → Lee `/DIAGNOSTICO-BACKEND.md`
4. **Quieres entender todo** → Lee `/SOLUCION-COMPLETA.md`

---

## 📁 Archivos Importantes Creados

| Archivo | Descripción |
|---------|-------------|
| `/START-HERE.md` | 👈 **ESTE ARCHIVO** - Empieza aquí |
| `/SOLUCION-COMPLETA.md` | Guía completa paso a paso |
| `/INSTALAR-BACKEND.md` | Cómo instalar el backend |
| `/DIAGNOSTICO-BACKEND.md` | Diagnóstico avanzado |
| `/EJECUTAR-AHORA.md` | Solución rápida |
| `/backend/server.js` | Código del servidor backend |
| `/backend/package.json` | Dependencias del backend |
| `/backend/.env.example` | Configuración de ejemplo |
| `/backend/deploy-to-server.sh` | Script de deploy automático |
| `/backend/database/setup.sql` | Script de base de datos |
| `/utils/api-test.html` | Herramienta de testing visual |

---

## 🚀 Comandos Útiles

```bash
# Ver estado del backend en el servidor
ssh root@94.143.141.241 'pm2 list'

# Ver logs del backend
ssh root@94.143.141.241 'pm2 logs bigartist-backend --lines 20'

# Reiniciar el backend
ssh root@94.143.141.241 'pm2 restart bigartist-backend'

# Probar el endpoint
curl https://app.bigartist.es/api/health
```

---

## 📞 ¿Necesitas Ayuda?

Ejecuta estos comandos y comparte los resultados:

```bash
# En el servidor
ssh root@94.143.141.241 '
  pm2 list &&
  pm2 logs bigartist-backend --lines 10 --nostream &&
  ls -la /root/bigartist-backend/
'

# En tu computadora
curl https://app.bigartist.es/api/health
```

---

## 🎯 ¿Por Qué Estaba Fallando?

El backend **NO ESTABA instalado** en el servidor. Los archivos necesarios (`server.js`, `package.json`, etc.) no existían en `/root/bigartist-backend/`.

Ahora los vamos a subir y configurar todo correctamente.

---

**EJECUTA LOS 3 COMANDOS DE ARRIBA Y COMPARTE EL RESULTADO** ✅
