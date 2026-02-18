# ⚡ COMANDOS RÁPIDOS - Actualizar Servidor

## 🎯 PROCESO COMPLETO EN 3 PASOS

### **PASO 1: Desde tu máquina local (donde estás ahora)**
```bash
# Opción A: Usar script automático
chmod +x push-to-server.sh
./push-to-server.sh "Actualización completa BAM Royalties System"

# Opción B: Manual
git add .
git commit -m "feat: actualización completa BAM Royalties System"
git push origin main
```

### **PASO 2: Conectar al servidor**
```bash
ssh root@94.143.141.241
```

### **PASO 3: Actualizar en el servidor**
```bash
cd /var/www/bigartist-frontend
./update.sh
```

**¡LISTO!** Tu sitio estará actualizado en https://app.bigartist.es 🚀

---

## 🔥 ULTRA RÁPIDO (Copy-Paste)

### En tu máquina local:
```bash
git add . && git commit -m "feat: actualización BAM" && git push origin main
```

### En el servidor:
```bash
ssh root@94.143.141.241 "cd /var/www/bigartist-frontend && git pull && npm run build && pm2 restart bigartist-backend && sudo systemctl reload nginx"
```

---

## 📋 VERIFICAR QUE FUNCIONA

### Abrir en navegador:
```
https://app.bigartist.es
```

### Verificar cambios:
- ✅ Título pestaña: "BAM Royalties System"
- ✅ Favicon con "BAM"
- ✅ Login funciona
- ✅ Dashboard carga
- ✅ Finanzas muestra 4 cajas correctas

---

## 🆘 SI ALGO FALLA

### Ver logs del backend:
```bash
ssh root@94.143.141.241
pm2 logs bigartist-backend --lines 50
```

### Reiniciar todo:
```bash
ssh root@94.143.141.241
cd /var/www/bigartist-frontend
pm2 restart bigartist-backend
sudo systemctl restart nginx
```

### Limpiar caché del navegador:
```
Ctrl + Shift + R (Windows/Linux)
Cmd + Shift + R (Mac)
```

---

## 💡 RECORDATORIOS

### Información del servidor:
- **IP:** 94.143.141.241
- **Usuario:** root
- **Directorio:** /var/www/bigartist-frontend
- **URL:** https://app.bigartist.es
- **GitHub:** https://github.com/AritzArrieta1987/Versionfinal.git

### Script de actualización:
```bash
# Si no existe update.sh, crearlo:
ssh root@94.143.141.241
cd /var/www/bigartist-frontend
nano update.sh
# Pegar el contenido del update.sh de tu repositorio
chmod +x update.sh
```

---

## ✅ CHECKLIST

- [ ] He guardado todos los cambios
- [ ] He hecho commit y push a GitHub
- [ ] Me he conectado al servidor
- [ ] He ejecutado ./update.sh
- [ ] El sitio carga en https://app.bigartist.es
- [ ] Los cambios son visibles

---

**¿Todo OK?** ¡Tu aplicación está actualizada! 🎉

**¿Problemas?** Lee **ACTUALIZAR-SERVIDOR.md** para más detalles.
