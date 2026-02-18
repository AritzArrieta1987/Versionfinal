# 🚀 ACTUALIZAR SERVIDOR - BAM ROYALTIES SYSTEM

## ✅ Cambios Incluidos en Esta Actualización

### 🎯 Correcciones Recientes:
1. ✅ **Contrato Activo** - Nueva sección en Artist Portal Dashboard
2. ✅ **4 Cajas de Reportes** - Datos 100% reales (BAM Share, Artistas Share, Gastos)
3. ✅ **Selector de años dinámico** - Extrae años del CSV (2017, 2018, etc.)
4. ✅ **Catálogo Musical** - Corregido "-1 artistas" → mínimo 0
5. ✅ **Seguridad Login** - Mensaje genérico sin revelar credenciales
6. ✅ **Título** - Cambiado a "BAM Royalties System"
7. ✅ **Favicon** - Actualizado con iniciales "BAM"

---

## 📋 OPCIÓN 1: ACTUALIZACIÓN AUTOMÁTICA (RECOMENDADO)

### Paso 1: Hacer commit de los cambios
```bash
# En tu máquina local (donde estás ahora)
git add .
git commit -m "feat: actualización completa - BAM Royalties System con todas las correcciones"
git push origin main
```

### Paso 2: Conectar al servidor
```bash
ssh root@94.143.141.241
```

### Paso 3: Navegar al directorio del proyecto
```bash
cd /var/www/bigartist-frontend
```

### Paso 4: Ejecutar script de actualización
```bash
./update.sh
```

**¡Listo!** El script automáticamente:
- ✅ Descarga los cambios desde GitHub
- ✅ Actualiza dependencias
- ✅ Compila el frontend
- ✅ Reinicia el backend
- ✅ Recarga Nginx
- ✅ Verifica que todo funcione

---

## 📋 OPCIÓN 2: ACTUALIZACIÓN MANUAL (Si update.sh no existe)

### Paso 1: Commit y Push (desde tu máquina local)
```bash
git add .
git commit -m "feat: actualización completa - BAM Royalties System"
git push origin main
```

### Paso 2: Conectar al servidor
```bash
ssh root@94.143.141.241
```

### Paso 3: Ir al directorio del proyecto
```bash
cd /var/www/bigartist-frontend
```

### Paso 4: Actualizar código
```bash
git pull origin main
```

### Paso 5: Instalar dependencias (si hay nuevas)
```bash
npm install
```

### Paso 6: Compilar frontend
```bash
npm run build
```

### Paso 7: Reiniciar servicios
```bash
# Reiniciar backend
pm2 restart bigartist-backend

# Recargar Nginx
sudo systemctl reload nginx
```

### Paso 8: Verificar que funciona
```bash
# Ver estado de PM2
pm2 status

# Probar backend
curl http://localhost:3001/api/health

# Ver logs si hay problemas
pm2 logs bigartist-backend --lines 50
```

---

## 🔍 VERIFICACIÓN POST-DESPLIEGUE

### 1. Verificar que el sitio carga
Abre en tu navegador:
```
https://app.bigartist.es
```

### 2. Verificar cambios visibles:
- ✅ Título de la pestaña: "BAM Royalties System"
- ✅ Favicon con "BAM" visible
- ✅ Login seguro (mensajes genéricos)

### 3. Verificar funcionalidades (después de login):
- ✅ Dashboard carga correctamente
- ✅ Finanzas muestra 4 cajas con datos reales
- ✅ Selector de años dinámico funciona
- ✅ Catálogo no muestra "-1 artistas"
- ✅ Portal de artista muestra "Contrato Activo"

---

## 🆘 SOLUCIÓN DE PROBLEMAS

### ❌ Error: "Permission denied" al ejecutar update.sh
```bash
chmod +x update.sh
./update.sh
```

### ❌ Error: "git pull failed"
```bash
# Ver qué hay modificado
git status

# Si hay cambios locales, respaldarlos
git stash

# Actualizar
git pull origin main

# Recuperar cambios (si es necesario)
git stash pop
```

### ❌ Backend no responde
```bash
# Ver logs
pm2 logs bigartist-backend --lines 100

# Reiniciar
pm2 restart bigartist-backend

# Ver estado
pm2 status
```

### ❌ Frontend no actualiza (caché del navegador)
```bash
# En el servidor
sudo systemctl reload nginx

# En el navegador
1. Ctrl + Shift + R (Windows/Linux)
2. Cmd + Shift + R (Mac)
3. O abrir ventana de incógnito
```

### ❌ Error 502 Bad Gateway
```bash
# Verificar backend
pm2 status
pm2 logs bigartist-backend

# Verificar Nginx
sudo nginx -t
sudo systemctl status nginx

# Reiniciar todo
pm2 restart bigartist-backend
sudo systemctl restart nginx
```

### ❌ Error al compilar (npm run build)
```bash
# Limpiar caché
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
npm run build
```

---

## 📊 COMANDOS ÚTILES

### Ver logs en tiempo real
```bash
# Backend
pm2 logs bigartist-backend

# Nginx access
sudo tail -f /var/log/nginx/bigartist-access.log

# Nginx errors
sudo tail -f /var/log/nginx/bigartist-error.log
```

### Estado de servicios
```bash
pm2 status                          # PM2
sudo systemctl status nginx         # Nginx
sudo systemctl status mysql         # MySQL
```

### Reiniciar servicios
```bash
pm2 restart bigartist-backend       # Backend
sudo systemctl reload nginx         # Nginx (sin cortar conexiones)
sudo systemctl restart nginx        # Nginx (reinicio completo)
sudo systemctl restart mysql        # MySQL
```

### Verificar conectividad
```bash
# Backend
curl http://localhost:3001/api/health

# Frontend (desde el servidor)
curl -I https://app.bigartist.es

# MySQL
mysql -u root -p -e "SELECT 1;"
```

---

## 🎯 CHECKLIST COMPLETO

### Antes de actualizar:
- [ ] Has guardado todos los cambios localmente
- [ ] Has hecho `git add .`
- [ ] Has hecho `git commit -m "mensaje"`
- [ ] Has hecho `git push origin main`

### Durante la actualización:
- [ ] Conectado al servidor SSH
- [ ] Navegado a `/var/www/bigartist-frontend`
- [ ] Ejecutado `git pull` o `./update.sh`
- [ ] Compilado con `npm run build`
- [ ] Reiniciado backend con `pm2 restart`
- [ ] Recargado Nginx con `sudo systemctl reload nginx`

### Después de actualizar:
- [ ] Sitio carga en https://app.bigartist.es
- [ ] Título es "BAM Royalties System"
- [ ] Favicon muestra "BAM"
- [ ] Login funciona correctamente
- [ ] Dashboard carga datos
- [ ] Finanzas muestra 4 cajas correctas
- [ ] Selector de años funciona
- [ ] Catálogo no muestra "-1"
- [ ] Portal de artista muestra contrato

---

## 🔗 ENLACES IMPORTANTES

- **Producción:** https://app.bigartist.es
- **API Backend:** https://app.bigartist.es/api
- **GitHub:** https://github.com/AritzArrieta1987/Versionfinal.git
- **Servidor:** 94.143.141.241

---

## 📝 NOTAS FINALES

### Frecuencia de actualización
- **Desarrollo activo:** Actualizar cada cambio importante
- **Mantenimiento:** Actualizar semanalmente o cuando sea necesario
- **Urgente:** Actualizar inmediatamente (bugs críticos, seguridad)

### Backup automático
El script `update.sh` NO hace backup. Si quieres backup antes de actualizar:
```bash
# Backup de la carpeta dist (frontend compilado)
cp -r dist dist.backup.$(date +%Y%m%d_%H%M%S)

# Backup de base de datos
mysqldump -u root -p bigartist_royalties > backup_$(date +%Y%m%d_%H%M%S).sql
```

### Rollback (si algo sale mal)
```bash
# Ver commits recientes
git log --oneline -10

# Volver a commit anterior
git reset --hard COMMIT_HASH

# Recompilar
npm run build
pm2 restart bigartist-backend
sudo systemctl reload nginx
```

---

## ✅ ¡LISTO PARA ACTUALIZAR!

Sigue **OPCIÓN 1** para actualización rápida y automática.

**Tiempo estimado:** 2-5 minutos

**¿Problemas?** Revisa la sección "Solución de Problemas" arriba.

---

**Última actualización:** 17 de Febrero de 2026
**Versión:** BAM Royalties System v2.0 - Actualización Completa
