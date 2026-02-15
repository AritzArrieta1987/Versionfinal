# 📤 INSTRUCCIONES DE DEPLOYMENT

## ✅ EL SCRIPT YA ESTÁ CONFIGURADO CON TUS DATOS

```bash
Servidor: root@94.143.141.241
Ruta frontend: /var/www/bigartist-frontend
Backend URL: https://app.bigartist.es/api
```

---

## 🚀 OPCIÓN 1: Script automático (RECOMENDADO)

### Desde tu Mac:
```bash
# Dar permisos de ejecución
chmod +x deploy.sh

# Ejecutar (te pedirá la contraseña SSH)
./deploy.sh
```

---

## 🛠️ OPCIÓN 2: Subir manualmente via SSH (si el script falla)

### Paso a paso:
```bash
# 1. Comprimir archivos localmente
tar -czf bigartist-frontend.tar.gz *

# 2. Subir al servidor
scp bigartist-frontend.tar.gz root@94.143.141.241:/tmp/

# 3. Conectar al servidor
ssh root@94.143.141.241

# 4. En el servidor, descomprimir
cd /tmp
mkdir bigartist-deploy
tar -xzf bigartist-frontend.tar.gz -C bigartist-deploy/

# 5. Copiar archivos
sudo cp -r bigartist-deploy/* /var/www/bigartist-frontend/

# 6. Instalar dependencias y compilar
cd /var/www/bigartist-frontend
npm install
npm run build

# 7. Reiniciar nginx
sudo systemctl reload nginx

# 8. Limpiar
rm -rf /tmp/bigartist-deploy /tmp/bigartist-frontend.tar.gz
```

---

## ⚠️ IMPORTANTE

1. **Asegúrate de tener acceso SSH** al servidor
2. **Verifica la ruta** donde está tu frontend
3. **El backend debe estar corriendo** en la URL configurada
4. **Nginx debe estar configurado** para servir la aplicación

---

## 🆘 Si tienes problemas

1. Verifica conexión SSH: `ssh root@94.143.141.241`
2. Verifica permisos: `sudo chown -R $USER:$USER /var/www/bigartist-frontend`
3. Verifica logs de nginx: `sudo tail -f /var/log/nginx/error.log`
4. Verifica que el build funciona: `npm run build` localmente primero

---

## 📋 Checklist antes de subir

- [ ] He modificado las variables en `deploy.sh`
- [ ] Tengo acceso SSH al servidor
- [ ] Sé la ruta exacta del frontend en el servidor
- [ ] El backend está funcionando
- [ ] He hecho backup del código actual del servidor