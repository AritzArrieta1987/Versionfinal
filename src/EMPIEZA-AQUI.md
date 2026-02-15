# 🎯 EMPIEZA AQUÍ - No Puedo Entrar en el Preview

## Tu Pregunta

**"¿Por qué no puedo entrar en el preview?"**

## La Respuesta

**Porque el backend NO está instalado en el servidor.**

---

## ✅ SOLUCIÓN (Copia y pega estos 3 comandos)

Abre tu terminal y ejecuta **UNO POR UNO**:

### 1️⃣ Instalar el Backend en el Servidor

```bash
cd backend && chmod +x deploy-to-server.sh && ./deploy-to-server.sh
```

Espera unos 2 minutos. Verás muchos logs. Cuando termine, continúa.

---

### 2️⃣ Configurar la Base de Datos

```bash
ssh root@94.143.141.241 "cd /root/bigartist-backend/database && mysql -u root -proot2024 bigartist_royalties < setup.sql"
```

Verás output de MySQL. Es normal. Espera a que termine.

---

### 3️⃣ Verificar que Funciona

```bash
curl -X POST https://app.bigartist.es/api/auth/login -H "Content-Type: application/json" -d '{"email":"admin@bigartist.es","password":"admin123"}'
```

**¿Qué deberías ver?**

```json
{"success":true,"token":"eyJhbG...","user":{...}}
```

---

## 🎉 SI VISTE ESO → ¡LISTO!

1. Ve al **preview de Figma Make**
2. **Recarga la página** (F5)
3. **Entra con**:
   - Email: `admin@bigartist.es`
   - Password: `admin123`

**Ya debería funcionar!** ✅

---

## ❌ SI NO FUNCIONÓ

### Error: "Permission denied"

```bash
# Solución:
chmod +x backend/deploy-to-server.sh
cd backend
./deploy-to-server.sh
```

---

### Error: "No such file or directory"

Estás en el directorio equivocado.

```bash
# Ver dónde estás:
pwd

# Deberías estar en el directorio raíz del proyecto
# Si no, navega hasta ahí:
cd /ruta/a/tu/proyecto

# Luego ejecuta de nuevo el comando 1
```

---

### Error: El comando 3 no muestra success:true

El backend no se instaló correctamente.

**Verifica**:

```bash
ssh root@94.143.141.241 "pm2 list"
```

**Deberías ver**:

```
┌────┬────────────────────┬─────────┬─────────┐
│ id │ name               │ status  │ ...     │
├────┼────────────────────┼─────────┼─────────┤
│ 0  │ bigartist-backend  │ online  │ ...     │  ← DEBE DECIR "online"
└────┴────────────────────┴─────────┴─────────┘
```

**Si NO dice "online" o NO aparece**:

```bash
ssh root@94.143.141.241
cd /root/bigartist-backend
pm2 start server.js --name bigartist-backend
pm2 save
exit
```

Luego ejecuta de nuevo el comando 3.

---

### Sigo sin poder entrar

**Comparte el resultado de estos comandos**:

```bash
# 1
ssh root@94.143.141.241 "pm2 list"

# 2
ssh root@94.143.141.241 "pm2 logs bigartist-backend --lines 20 --nostream"

# 3
curl -v https://app.bigartist.es/api/health

# 4
ssh root@94.143.141.241 "ls -la /root/bigartist-backend/"
```

Copia TODO el output y compártelo para poder ayudarte.

---

## 📊 Explicación Visual (Si Quieres Entender Mejor)

Lee: [`/POR-QUE-NO-FUNCIONA.md`](POR-QUE-NO-FUNCIONA.md)

---

## 🧪 Herramienta de Debug

Si prefieres una herramienta visual:

```bash
npm run dev
```

Luego abre: `http://localhost:3000/debug-login.html`

Esta herramienta te dirá exactamente qué está fallando.

---

## 📚 Más Ayuda

| Archivo | Para Qué |
|---------|----------|
| [`POR-QUE-NO-FUNCIONA.md`](POR-QUE-NO-FUNCIONA.md) | Explicación detallada |
| [`SOLUCION-INMEDIATA.md`](SOLUCION-INMEDIATA.md) | Solución paso a paso |
| [`INDICE-AYUDA.md`](INDICE-AYUDA.md) | Índice de todas las guías |
| `debug-login.html` | Herramienta visual de debug |

---

## ⏱️ Tiempo Total

**~4 minutos** para instalar todo.

---

## 🎯 RESUMEN ULTRA-CORTO

**Tres comandos**:

```bash
cd backend && ./deploy-to-server.sh
ssh root@94.143.141.241 "cd /root/bigartist-backend/database && mysql -u root -proot2024 bigartist_royalties < setup.sql"
curl -X POST https://app.bigartist.es/api/auth/login -H "Content-Type: application/json" -d '{"email":"admin@bigartist.es","password":"admin123"}'
```

Si el último muestra `{"success":true,...}` → Recarga el preview → Funciona ✅

---

**¡Ejecuta los comandos AHORA y comparte qué resultado te sale!** 🚀
