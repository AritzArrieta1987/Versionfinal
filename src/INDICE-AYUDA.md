# 📚 Índice de Ayuda - BigArtist Royalties

## 🎯 Tu Problema: "No puedo entrar desde el preview al backend"

### 🚀 EMPIEZA AQUÍ

**1. Lee primero**: [`/START-HERE.md`](START-HERE.md)
   - Los 3 comandos para instalar el backend
   - Solución en 5 minutos

**2. Usa la herramienta de diagnóstico**: 
   - Abre: `http://localhost:3000/test-backend.html`
   - Te dirá EXACTAMENTE qué está fallando

**3. Si el preview no funciona**: [`/SOLUCIONA-PREVIEW.md`](SOLUCIONA-PREVIEW.md)

---

## 📁 Guías Disponibles (Por Problema)

### 🔴 Problema: "Failed to fetch" o "No puedo conectar al backend"

| Archivo | Descripción | Cuándo Usar |
|---------|-------------|-------------|
| [`START-HERE.md`](START-HERE.md) | ⭐ **Empieza aquí** - 3 comandos básicos | Siempre primero |
| [`SOLUCIONA-PREVIEW.md`](SOLUCIONA-PREVIEW.md) | Específico para el preview de Figma Make | Cuando el preview no conecta |
| [`SOLUCION-COMPLETA.md`](SOLUCION-COMPLETA.md) | Guía completa paso a paso | Cuando quieres entender todo |
| [`EJECUTAR-AHORA.md`](EJECUTAR-AHORA.md) | Solución rápida con comandos específicos | Cuando tienes prisa |

### 🔧 Problema: "Backend no está instalado"

| Archivo | Descripción | Cuándo Usar |
|---------|-------------|-------------|
| [`INSTALAR-BACKEND.md`](INSTALAR-BACKEND.md) | Instalación completa del backend | Primera vez instalando |
| [`/backend/deploy-to-server.sh`](backend/deploy-to-server.sh) | Script automático de deploy | El método más rápido |
| [`/backend/DEPLOY.md`](backend/DEPLOY.md) | Documentación de deployment | Referencia técnica |

### 🗄️ Problema: "Base de datos no funciona"

| Archivo | Descripción | Cuándo Usar |
|---------|-------------|-------------|
| [`/backend/database/setup.sql`](backend/database/setup.sql) | Script de creación de BD | Configurar la base de datos |
| SQL directo en servidor | Ver sección de BD | Cuando setup.sql falla |

### 🔍 Problema: "No sé qué está fallando"

| Archivo | Descripción | Cuándo Usar |
|---------|-------------|-------------|
| [`DIAGNOSTICO-BACKEND.md`](DIAGNOSTICO-BACKEND.md) | Diagnóstico completo por escenarios | Cuando no sabes qué falla |
| [`/backend/check-backend.sh`](backend/check-backend.sh) | Script de verificación automático | Para verificar todo |
| `/test-backend.html` | Herramienta visual de testing | Desde el navegador |

---

## 🛠️ Archivos del Backend

### Código Principal

| Archivo | Descripción |
|---------|-------------|
| [`/backend/server.js`](backend/server.js) | ✅ Servidor Express completo |
| [`/backend/package.json`](backend/package.json) | ✅ Dependencias |
| [`/backend/.env.example`](backend/.env.example) | ✅ Configuración de ejemplo |

### Scripts de Automatización

| Archivo | Descripción | Comando |
|---------|-------------|---------|
| [`deploy-to-server.sh`](backend/deploy-to-server.sh) | Deploy automático | `./deploy-to-server.sh` |
| [`fix-backend.sh`](backend/fix-backend.sh) | Auto-reparación | Ejecutar en servidor |
| [`check-backend.sh`](backend/check-backend.sh) | Verificación | Ejecutar en servidor |

### Base de Datos

| Archivo | Descripción | Comando |
|---------|-------------|---------|
| [`database/setup.sql`](backend/database/setup.sql) | Setup completo | `mysql -u root -p < setup.sql` |
| [`database/finances_schema.sql`](backend/database/finances_schema.sql) | Schema de finanzas | Ya incluido en setup.sql |

---

## 🧪 Herramientas de Testing

| Herramienta | URL/Comando | Descripción |
|-------------|-------------|-------------|
| Test Backend HTML | `http://localhost:3000/test-backend.html` | Testing visual desde navegador |
| API Test HTML | `/utils/api-test.html` | Tests del API |
| Debug Console | F12 en navegador | `window.debugBigArtist.info()` |

---

## 📋 Comandos Rápidos

### Deploy Completo (3 comandos)

```bash
# 1. Deploy backend
cd backend && ./deploy-to-server.sh

# 2. Setup base de datos
ssh root@94.143.141.241 'cd /root/bigartist-backend/database && mysql -u root -proot2024 < setup.sql'

# 3. Verificar
curl https://app.bigartist.es/api/auth/login -H "Content-Type: application/json" -d '{"email":"admin@bigartist.es","password":"admin123"}'
```

### Verificación en el Servidor

```bash
# Conectar al servidor
ssh root@94.143.141.241

# Ver estado
pm2 list

# Ver logs
pm2 logs bigartist-backend --lines 20

# Probar endpoint
curl http://localhost:3001/api/health
```

### Comandos de Emergencia

```bash
# Reiniciar todo
ssh root@94.143.141.241 'pm2 restart bigartist-backend'

# Ver logs de error
ssh root@94.143.141.241 'pm2 logs bigartist-backend --err --lines 50'

# Reinstalar
cd backend && ./deploy-to-server.sh
```

---

## 🎯 Flujo de Solución Recomendado

```
1. START-HERE.md
   ↓
2. Ejecutar deploy-to-server.sh
   ↓
3. Ejecutar setup.sql en el servidor
   ↓
4. Verificar con test-backend.html
   ↓
5. ¿Funciona?
   ├─ SÍ → ¡Listo! 🎉
   └─ NO → DIAGNOSTICO-BACKEND.md
          ↓
      Identificar el problema específico
          ↓
      Seguir la guía correspondiente
```

---

## 🆘 Si NADA Funciona

1. **Comparte** el output de estos comandos:

```bash
# Estado del servidor
ssh root@94.143.141.241 'pm2 list && pm2 logs bigartist-backend --lines 30 --nostream'

# Test del endpoint
curl -v https://app.bigartist.es/api/health

# Archivos del backend
ssh root@94.143.141.241 'ls -la /root/bigartist-backend/'
```

2. **Abre** `http://localhost:3000/test-backend.html` y comparte los resultados

3. **Copia** los errores de la consola del navegador (F12)

---

## 📊 Resumen del Proyecto

| Componente | Estado | Ubicación |
|------------|--------|-----------|
| Frontend | ✅ OK | Local - React + Vite |
| Backend | ⏳ A instalar | Servidor 94.143.141.241 |
| Base de datos | ⏳ A configurar | MySQL en servidor |
| Nginx | ✅ Configurado | Puerto 80/443 |
| PM2 | ✅ Instalado | Para el backend |

---

## 🔗 Información del Servidor

| Dato | Valor |
|------|-------|
| IP | 94.143.141.241 |
| Dominio | app.bigartist.es |
| Usuario SSH | root |
| Password | root2024 |
| Backend Port | 3001 |
| MySQL User | root |
| MySQL Pass | root2024 |
| MySQL DB | bigartist_royalties |

---

## 📞 Datos de Login

| Usuario | Email | Password | Tipo |
|---------|-------|----------|------|
| Admin | admin@bigartist.es | admin123 | admin |
| Artista Demo | artista@demo.com | artist123 | artist |

---

## ✅ Checklist de Verificación

Usa esta lista para verificar que todo está configurado:

### En el Servidor

- [ ] Backend corriendo: `pm2 list` muestra "online"
- [ ] Puerto escuchando: `netstat -tulpn | grep 3001`
- [ ] MySQL corriendo: `systemctl status mysql`
- [ ] Base de datos existe: `mysql -u root -p -e "USE bigartist_royalties;"`
- [ ] Usuario admin existe en la BD
- [ ] Nginx corriendo: `systemctl status nginx`
- [ ] Nginx tiene proxy para `/api`
- [ ] Firewall permite 80/443: `ufw status`

### Tests Externos

- [ ] Endpoint público responde: `curl https://app.bigartist.es/api/health`
- [ ] Login funciona: Ver comando en START-HERE.md
- [ ] CORS configurado correctamente
- [ ] SSL/HTTPS funciona

### En el Frontend

- [ ] Configuración de API correcta: `/utils/api.ts`
- [ ] Proxy de Vite configurado: `/vite.config.ts`
- [ ] Login funciona desde localhost
- [ ] Login funciona desde preview

---

## 🎓 Aprende Más

| Documento | Tema |
|-----------|------|
| [`README-SETUP.md`](README-SETUP.md) | Configuración general del proyecto |
| [`CAMBIOS-RECIENTES.md`](CAMBIOS-RECIENTES.md) | Historial de cambios |
| [`/backend/README.md`](backend/README.md) | Documentación del backend |

---

**Comienza con [`START-HERE.md`](START-HERE.md) y luego usa la herramienta de diagnóstico en `/test-backend.html`** 🚀

**¿Tienes dudas?** Comparte el output de los comandos de verificación y te ayudo específicamente! 💪
