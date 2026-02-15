# ❓ POR QUÉ NO PUEDES ENTRAR EN EL PREVIEW

## 🎯 Respuesta Directa

**El backend NO está instalado en tu servidor.**

Es como si tuvieras una tienda (frontend) pero sin almacén (backend). Los clientes llegan pero no hay nadie para atenderlos.

---

## 📊 Diagrama del Problema

### ❌ SITUACIÓN ACTUAL (NO FUNCIONA)

```
┌────────────────────────────────┐
│   TU NAVEGADOR (Preview)      │
│   ┌──────────────────────┐    │
│   │  Login Form          │    │
│   │  Email: admin@...    │    │
│   │  Password: ****      │    │
│   │  [ENTRAR] ← Click    │    │
│   └──────────┬───────────┘    │
└──────────────┼────────────────┘
               │
               │ 1️⃣ Envía petición:
               │    POST https://app.bigartist.es/api/auth/login
               │    { email: "admin@...", password: "..." }
               │
               ▼
┌────────────────────────────────┐
│   SERVIDOR app.bigartist.es    │
│   IP: 94.143.141.241           │
│                                │
│   ✅ Nginx: Corriendo          │
│   ✅ MySQL: Corriendo          │
│   ❌ Backend (Node.js): NO     │  ← PROBLEMA AQUÍ
│      ESTÁ INSTALADO            │
│                                │
│   El servidor responde:        │
│   ❌ 404 Not Found              │
│   ❌ 502 Bad Gateway            │
│   ❌ No responde                │
└────────────────────────────────┘
               │
               │ 2️⃣ Respuesta de error
               │
               ▼
┌────────────────────────────────┐
│   TU NAVEGADOR                 │
│   ❌ Error: Failed to fetch    │
│   ❌ No puedes entrar           │
└────────────────────────────────┘
```

---

### ✅ CÓMO DEBERÍA SER (CUANDO FUNCIONE)

```
┌────────────────────────────────┐
│   TU NAVEGADOR (Preview)      │
│   ┌──────────────────────┐    │
│   │  Login Form          │    │
│   │  [ENTRAR] ← Click    │    │
│   └──────────┬───────────┘    │
└──────────────┼────────────────┘
               │
               │ 1️⃣ POST /api/auth/login
               ▼
┌────────────────────────────────┐
│   SERVIDOR                     │
│                                │
│   ✅ Nginx (Puerto 80/443)     │
│        │                       │
│        ▼                       │
│   ✅ Backend Node.js (3001)    │  ← ESTO FALTA
│        │                       │
│        ▼                       │
│   ✅ MySQL (Base de datos)     │
│                                │
│   Procesa login:               │
│   ✅ Valida email/password     │
│   ✅ Genera token JWT          │
│   ✅ Responde: {success:true}  │
└────────────┬───────────────────┘
               │
               │ 2️⃣ Respuesta exitosa
               ▼
┌────────────────────────────────┐
│   TU NAVEGADOR                 │
│   ✅ Login exitoso              │
│   ✅ Entra al dashboard         │
└────────────────────────────────┘
```

---

## 🔍 PRUEBA ESTO AHORA (Confirma el problema)

Abre una terminal y ejecuta:

```bash
curl https://app.bigartist.es/api/health
```

### ❌ Si ves ESTO → Backend NO instalado:

```
curl: (7) Failed to connect to app.bigartist.es port 443
```

```html
<html>
<head><title>404 Not Found</title></head>
```

```
curl: (52) Empty reply from server
```

```
502 Bad Gateway
```

### ✅ Si ves ESTO → Backend instalado y funcionando:

```json
{
  "success": true,
  "message": "BigArtist Backend is running",
  "timestamp": "2025-02-15T..."
}
```

---

## 💡 Analogía Simple

Imagina que tu aplicación es un restaurante:

| Componente | Analogía | Estado |
|------------|----------|--------|
| **Frontend (Preview)** | El comedor con mesas y menús | ✅ OK - Funciona |
| **Nginx** | La puerta principal | ✅ OK - Abierta |
| **Backend** | La cocina con chefs | ❌ NO EXISTE |
| **MySQL** | La despensa con ingredientes | ✅ OK - Lista |

**Problema**: Los clientes (usuarios) llegan, se sientan, piden comida (hacen login), pero **no hay cocina para prepararla**. Por eso no pueden entrar.

**Solución**: Construir la cocina (instalar el backend).

---

## 🔧 Qué Está Instalado vs Qué Falta

### ✅ YA TIENES (En tu computadora):

```
/tu-proyecto/
  ├── frontend/          ✅ React + Vite - Funciona
  ├── backend/           ✅ Código existe pero...
  │   ├── server.js      ✅   ...solo en tu compu
  │   ├── package.json   ✅   ...no en el servidor
  │   └── database/      ✅
  └── public/            ✅
```

### ❌ FALTA (En el servidor):

```
SERVIDOR: 94.143.141.241

/root/bigartist-backend/    ❌ ESTE DIRECTORIO NO EXISTE
  ├── server.js             ❌ (o existe pero no corre)
  ├── package.json          ❌
  ├── node_modules/         ❌
  └── database/             ❌
```

---

## 📝 Los Archivos Existen Pero...

Sí, creamos estos archivos:
- ✅ `/backend/server.js`
- ✅ `/backend/package.json`
- ✅ `/backend/database/setup.sql`

**PERO** están **solo en tu computadora local**.

El preview de Figma Make intenta conectarse a:
```
https://app.bigartist.es
```

Que es un servidor remoto (94.143.141.241), donde **NO están estos archivos**.

---

## 🚀 La Solución: 3 Pasos

### Paso 1: Subir los archivos al servidor

```bash
cd backend
./deploy-to-server.sh
```

Esto copia:
```
Tu compu                  →     Servidor
/backend/server.js        →     /root/bigartist-backend/server.js
/backend/package.json     →     /root/bigartist-backend/package.json
/backend/database/        →     /root/bigartist-backend/database/
```

### Paso 2: Instalar y correr el backend

El script automáticamente:
1. Instala dependencias (`npm install`)
2. Inicia el servidor con PM2
3. Configura para que corra siempre

### Paso 3: Configurar la base de datos

```bash
ssh root@94.143.141.241
cd /root/bigartist-backend/database
mysql -u root -proot2024 bigartist_royalties < setup.sql
```

Esto crea:
- ✅ Base de datos `bigartist_royalties`
- ✅ Todas las tablas
- ✅ Usuario `admin@bigartist.es` con password `admin123`

---

## 🧪 Verificación

Después de instalar, prueba:

```bash
curl -X POST https://app.bigartist.es/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@bigartist.es","password":"admin123"}'
```

**Antes** (Backend no instalado):
```
curl: (7) Failed to connect
```

**Después** (Backend instalado):
```json
{"success":true,"token":"eyJhbG...","user":{...}}
```

---

## ⏱️ Cuánto Tarda

| Paso | Tiempo |
|------|--------|
| Subir archivos | 1 min |
| Instalar dependencias | 2 min |
| Configurar BD | 30 seg |
| **TOTAL** | **~4 min** |

---

## 🎯 EJECUTA AHORA

Copia estos 3 comandos:

```bash
# 1. Deploy
cd backend && ./deploy-to-server.sh

# 2. Setup BD
ssh root@94.143.141.241 "cd /root/bigartist-backend/database && mysql -u root -proot2024 bigartist_royalties < setup.sql"

# 3. Verificar
curl -X POST https://app.bigartist.es/api/auth/login -H "Content-Type: application/json" -d '{"email":"admin@bigartist.es","password":"admin123"}'
```

Si el comando #3 muestra `{"success":true,...}`:

**🎉 ¡FUNCIONA!**

Recarga el preview (F5) y ya podrás entrar.

---

## 🆘 Si Tienes Problemas

Ejecuta y comparte el resultado:

```bash
# ¿El backend está corriendo?
ssh root@94.143.141.241 "pm2 list"

# ¿Los archivos existen?
ssh root@94.143.141.241 "ls -la /root/bigartist-backend/"

# ¿El endpoint responde?
curl -v https://app.bigartist.es/api/health
```

---

## 📚 Otros Archivos de Ayuda

- [`/SOLUCION-INMEDIATA.md`](SOLUCION-INMEDIATA.md) - Solución paso a paso
- [`/debug-login.html`](http://localhost:3000/debug-login.html) - Herramienta visual
- [`/START-HERE.md`](START-HERE.md) - Guía general
- [`/INDICE-AYUDA.md`](INDICE-AYUDA.md) - Índice completo

---

**En resumen: El backend NO está instalado. Ejecuta los 3 comandos y listo.** ✅
