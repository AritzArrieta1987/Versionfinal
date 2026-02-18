# 🚀 DESPLEGAR AHORA - BAM Royalties System

## ✨ ACTUALIZACIÓN LISTA PARA DESPLEGAR

### 📦 Cambios Incluidos:
```
✅ Título: "BAM Royalties System"
✅ Favicon: Iniciales "BAM" en dorado
✅ Contrato Activo en Artist Portal Dashboard
✅ 4 Cajas de Reportes con datos 100% reales
✅ Selector de años dinámico (extrae del CSV)
✅ Catálogo corregido (sin "-1 artistas")
✅ Login seguro (mensajes genéricos)
```

---

## 🎯 DESPLIEGUE EN 60 SEGUNDOS

### 🖥️ TERMINAL 1 (Tu máquina local):
```bash
# Copiar y pegar estos comandos uno por uno:

git add .
git commit -m "feat: actualización completa BAM Royalties System"
git push origin main
```

**Espera a que termine el push...**

---

### 🖥️ TERMINAL 2 (Servidor):
```bash
# Conectar al servidor:
ssh root@94.143.141.241

# Una vez dentro, ejecutar:
cd /var/www/bigartist-frontend && ./update.sh
```

**Espera 2-3 minutos mientras actualiza...**

---

### 🌐 VERIFICAR:
Abre tu navegador en:
```
https://app.bigartist.es
```

**Verifica:**
- ✅ Título de la pestaña dice "BAM Royalties System"
- ✅ Favicon muestra "BAM"
- ✅ Login funciona
- ✅ Todo carga correctamente

---

## 🎉 ¡COMPLETADO!

Si ves el nuevo título y favicon, **la actualización fue exitosa**.

---

## 📋 COMANDOS COMPLETOS (Copy-Paste)

### Todo en uno - Local:
```bash
cd /ruta/a/tu/proyecto && git add . && git commit -m "feat: actualización BAM" && git push origin main
```

### Todo en uno - Servidor:
```bash
ssh root@94.143.141.241 "cd /var/www/bigartist-frontend && ./update.sh"
```

---

## 🆘 TROUBLESHOOTING RÁPIDO

### ❌ "Permission denied" al hacer push
```bash
git config --global user.email "tu@email.com"
git config --global user.name "Tu Nombre"
```

### ❌ "update.sh: Permission denied"
```bash
ssh root@94.143.141.241
cd /var/www/bigartist-frontend
chmod +x update.sh
./update.sh
```

### ❌ "git pull failed" en el servidor
```bash
ssh root@94.143.141.241
cd /var/www/bigartist-frontend
git status
git stash
git pull origin main
```

### ❌ "502 Bad Gateway"
```bash
ssh root@94.143.141.241
pm2 restart bigartist-backend
sudo systemctl restart nginx
```

### ❌ Los cambios no se ven (caché)
```
En el navegador:
Ctrl + Shift + R (Windows/Linux)
Cmd + Shift + R (Mac)

O abrir ventana de incógnito
```

---

## 📊 INFO DEL SERVIDOR

```yaml
IP:         94.143.141.241
Usuario:    root
Directorio: /var/www/bigartist-frontend
URL:        https://app.bigartist.es
GitHub:     https://github.com/AritzArrieta1987/Versionfinal.git
Backend:    Puerto 3001 (interno)
Frontend:   Nginx → https://app.bigartist.es
```

---

## 🔍 VERIFICAR SERVICIOS

```bash
# Conectar al servidor
ssh root@94.143.141.241

# Ver estado
pm2 status
sudo systemctl status nginx
sudo systemctl status mysql

# Ver logs
pm2 logs bigartist-backend --lines 30
sudo tail -f /var/log/nginx/bigartist-error.log
```

---

## ✅ CHECKLIST FINAL

### Antes de desplegar:
- [ ] Todos los archivos guardados
- [ ] Cambios commiteados
- [ ] Push a GitHub exitoso

### Durante el despliegue:
- [ ] Conectado al servidor
- [ ] Script update.sh ejecutado
- [ ] Sin errores en la salida

### Después de desplegar:
- [ ] Sitio carga: https://app.bigartist.es
- [ ] Título: "BAM Royalties System" ✅
- [ ] Favicon: "BAM" visible ✅
- [ ] Login funciona ✅
- [ ] Dashboard carga ✅
- [ ] Finanzas muestra datos correctos ✅

---

## 🎯 PRÓXIMOS PASOS

Una vez actualizado, puedes:

1. **Probar todas las funcionalidades:**
   - Login como admin
   - Subir CSV
   - Ver reportes en Finanzas
   - Probar Portal de Artista

2. **Compartir con tu equipo:**
   - URL: https://app.bigartist.es
   - Usuarios de prueba (si los tienes)

3. **Monitorear logs:**
   ```bash
   pm2 logs bigartist-backend
   ```

---

## 💡 CONSEJOS

### Para futuras actualizaciones:
1. Hacer cambios en local
2. Probar con `npm run dev`
3. Commit y push
4. Ejecutar `./update.sh` en servidor

### Backup antes de actualizar:
```bash
ssh root@94.143.141.241
cd /var/www/bigartist-frontend
cp -r dist dist.backup.$(date +%Y%m%d_%H%M%S)
```

### Ver qué cambió:
```bash
git log --oneline -10
git show HEAD
```

---

## 🎉 ¡LISTO PARA DESPLEGAR!

**Tiempo estimado:** 2-3 minutos

**Dificultad:** Fácil ⭐

**Riesgo:** Bajo (puedes hacer rollback si es necesario)

---

**Última actualización:** 17 de Febrero de 2026  
**Versión:** BAM Royalties System v2.0  
**Estado:** ✅ LISTO PARA PRODUCCIÓN
