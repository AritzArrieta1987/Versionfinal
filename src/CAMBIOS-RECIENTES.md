# 🔧 Cambios Recientes - Solución de Errores

## ❌ Errores Solucionados

### 1. "Failed to fetch" en Login
**Problema**: El login no podía conectarse al backend.

**Solución**:
- ✅ Configurado proxy en `vite.config.ts` para redirigir `/api` a `https://app.bigartist.es`
- ✅ Creado sistema centralizado de API en `/utils/api.ts`
- ✅ Actualizado `LoginPanel.tsx` para usar la función centralizada

### 2. "Cannot read properties of undefined (reading 'PROD')"
**Problema**: Error con `import.meta.env` en TypeScript.

**Solución**:
- ✅ Modificado `/utils/api.ts` para usar `window.location.hostname` en lugar de `import.meta.env`
- ✅ Creado archivo de tipos `/types/vite-env.d.ts`
- ✅ Añadido `.env.example` con documentación

---

## 📁 Archivos Creados/Modificados

### Nuevos Archivos
- ✅ `/utils/api.ts` - Funciones centralizadas del API
- ✅ `/utils/toast.ts` - Utilidad de notificaciones
- ✅ `/utils/debug.ts` - Herramientas de debug
- ✅ `/types/vite-env.d.ts` - Tipos de Vite
- ✅ `/components/admin/IncomeSection.tsx` - Componente de ingresos
- ✅ `/components/admin/ExpensesSection.tsx` - Componente de gastos
- ✅ `/backend/routes/finances.js` - API de finanzas
- ✅ `/backend/database/finances_schema.sql` - Schema SQL
- ✅ `/backend/README.md` - Documentación del backend
- ✅ `/backend/DEPLOY.md` - Instrucciones de deploy
- ✅ `/README-SETUP.md` - Documentación completa
- ✅ `/CAMBIOS-RECIENTES.md` - Este archivo
- ✅ `/.env.example` - Ejemplo de variables de entorno

### Archivos Modificados
- ✅ `/vite.config.ts` - Agregado proxy para `/api`
- ✅ `/components/LoginPanel.tsx` - Usa función centralizada de login
- ✅ `/App.tsx` - Importa debug tools

---

## 🧪 Cómo Probar

### 1. Reiniciar el servidor de desarrollo

```bash
# Detener el servidor (Ctrl+C)
npm run dev
```

### 2. Abrir el navegador en localhost:3000

```
http://localhost:3000
```

### 3. Probar el login

**Credenciales Admin:**
- Email: `admin@bigartist.es`
- Password: `admin123`

**Credenciales Artista:**
- Email: `artist@bigartist.es`
- Password: `artist123`

### 4. Usar herramientas de debug (Opcional)

Abre la consola del navegador (F12) y escribe:

```javascript
// Ver configuración actual
window.debugBigArtist.info()

// Probar conexión al API
window.debugBigArtist.testConnection()
```

---

## 🔍 Diagnóstico de Problemas

### Si el login sigue sin funcionar:

#### 1. Verificar que el backend está corriendo

```bash
ssh root@94.143.141.241
pm2 list
```

Debería mostrar:
```
┌─────┬──────────────────────┬─────────┬─────────┐
│ id  │ name                 │ mode    │ status  │
├─────┼──────────────────────┼─────────┼─────────┤
│ 0   │ bigartist-backend    │ fork    │ online  │
└─────┴──────────────────────┴─────────┴─────────┘
```

#### 2. Ver logs del backend

```bash
pm2 logs bigartist-backend --lines 50
```

#### 3. Probar endpoint directamente

```bash
curl -X POST https://app.bigartist.es/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@bigartist.es","password":"admin123"}'
```

Debería responder:
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

#### 4. Verificar proxy de Vite

Abre la consola del navegador (F12) → pestaña Network → intenta hacer login

Deberías ver:
- Request a: `http://localhost:3000/api/auth/login`
- Proxy redirige a: `https://app.bigartist.es/api/auth/login`

#### 5. Verificar CORS

Si ves error de CORS, el backend necesita tener configurado:

```javascript
// En server.js del backend
const cors = require('cors');
app.use(cors({
  origin: ['http://localhost:3000', 'https://app.bigartist.es'],
  credentials: true
}));
```

---

## 🎯 Próximos Pasos

1. **Verificar que el login funciona** ✅
2. **Desplegar backend de finanzas** ⏳
3. **Integrar FinancesPanel en admin** ⏳
4. **Conectar componentes con API real** ⏳

---

## 📊 Estado del Sistema

### Backend (Producción)
- 🌐 URL: `https://app.bigartist.es`
- 🗄️ Base de datos: MySQL en servidor
- 🔐 Autenticación: JWT
- ✅ Endpoint de login: Funcionando

### Frontend (Desarrollo)
- 🌐 URL: `http://localhost:3000`
- 🔄 Proxy: Vite → `https://app.bigartist.es/api`
- ✅ Componentes: Creados
- ⏳ API de finanzas: Por conectar

### Tablas MySQL
- ✅ `usuarios` - Creada y con datos
- ⏳ `contratos` - Por crear
- ⏳ `solicitudes_pago` - Por crear
- ⏳ `gastos` - Por crear
- ⏳ `ingresos` - Por crear
- ⏳ `reportes` - Por crear

---

## 💡 Tips

### Desarrollo Local
- Siempre usa `npm run dev` para iniciar el servidor
- El proxy de Vite maneja automáticamente las llamadas a `/api`
- No necesitas configurar variables de entorno

### Producción
- El build de producción usa directamente `https://app.bigartist.es`
- No requiere proxy
- Las variables de entorno se configuran en el servidor

### Debug
- Usa `window.debugBigArtist.info()` para ver la configuración
- Revisa la consola del navegador para mensajes de error
- Verifica la pestaña Network para ver las peticiones HTTP

---

## 📞 Si Necesitas Ayuda

1. Verifica los logs del backend: `pm2 logs bigartist-backend`
2. Revisa la consola del navegador (F12)
3. Prueba los endpoints con curl
4. Verifica que las credenciales sean correctas
5. Asegúrate de que el servidor de desarrollo esté corriendo

---

**Última actualización**: 15 de febrero de 2026
