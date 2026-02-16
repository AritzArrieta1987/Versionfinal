# ⚡ DESPLIEGUE RÁPIDO - BigArtist Royalties

## Si ya tienes todo configurado, sigue estos pasos:

### 1️⃣ Conectar al servidor
```bash
ssh usuario@app.bigartist.es
cd /var/www/bigartist-royalties
```

### 2️⃣ Actualizar el código
```bash
git pull origin main
```

### 3️⃣ Ejecutar script de actualización
```bash
chmod +x update.sh
./update.sh
```

**¡Listo! Tu aplicación estará actualizada en https://app.bigartist.es** 🚀

---

## 🆕 Primera vez? Sigue la guía completa:

Lee el archivo: **DEPLOY-PRODUCTION.md**

---

## ⚠️ Solución de problemas rápidos

### Backend no funciona
```bash
pm2 restart bigartist-backend
pm2 logs bigartist-backend
```

### Frontend no actualiza
```bash
npm run build
sudo systemctl reload nginx
```

### Ver logs
```bash
# Backend
pm2 logs bigartist-backend --lines 100

# Nginx
sudo tail -f /var/log/nginx/bigartist-error.log
```

### Reiniciar todo
```bash
pm2 restart bigartist-backend
sudo systemctl restart nginx
sudo systemctl restart mysql
```

---

## 📝 Comandos útiles

### Estado de servicios
```bash
pm2 status                          # PM2
sudo systemctl status nginx         # Nginx
sudo systemctl status mysql         # MySQL
```

### Logs en tiempo real
```bash
pm2 logs bigartist-backend --lines 50
sudo tail -f /var/log/nginx/bigartist-access.log
```

### Verificar que el backend responde
```bash
curl http://localhost:3001/api/health
```

Debería responder: `{"status":"ok"}`

---

## 🔄 Workflow de desarrollo

1. **Desarrollar localmente** → Hacer cambios en tu código
2. **Commit y Push** → `git add . && git commit -m "mensaje" && git push`
3. **Desplegar** → Ejecutar `./update.sh` en el servidor

---

## 🎯 URLs importantes

- **Producción:** https://app.bigartist.es
- **API Backend:** https://app.bigartist.es/api
- **GitHub:** https://github.com/AritzArrieta1987/Versionfinal.git

---

## ✅ Checklist antes de desplegar

- [ ] Has hecho commit de todos los cambios
- [ ] Has pusheado al repositorio de GitHub
- [ ] Has probado localmente con `npm run dev`
- [ ] Las variables de entorno están configuradas en el servidor

---

**Cualquier problema, revisa DEPLOY-PRODUCTION.md para más detalles.**
