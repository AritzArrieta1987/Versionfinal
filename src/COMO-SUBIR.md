# 🚀 CÓMO SUBIR EL DASHBOARD AL SERVIDOR

## ✅ Todo está configurado y listo

```
✓ Servidor: root@94.143.141.241
✓ Ruta: /var/www/bigartist-frontend
✓ Backend: https://app.bigartist.es/api
✓ SSL: Activo
```

---

## 📋 MÉTODO 1: Script Automático (RECOMENDADO)

### En tu Mac, ejecuta:

```bash
chmod +x deploy-simple.sh
./deploy-simple.sh
```

**Eso es todo.** El script:
1. Comprime los archivos
2. Los sube al servidor
3. Instala dependencias
4. Compila el proyecto
5. Reinicia nginx

---

## 🛠️ MÉTODO 2: Manual (si el script falla)

### Paso 1: Comprimir archivos
```bash
tar -czf bigartist-frontend.tar.gz \
  --exclude='node_modules' \
  --exclude='.git' \
  --exclude='*.md' \
  .
```

### Paso 2: Subir al servidor
```bash
scp bigartist-frontend.tar.gz root@94.143.141.241:/tmp/
```

### Paso 3: Conectar al servidor e instalar
```bash
ssh root@94.143.141.241

# Una vez conectado:
cd /tmp
mkdir bigartist-temp
tar -xzf bigartist-frontend.tar.gz -C bigartist-temp/
cd bigartist-temp
npm install
npm run build
cp -r build/* /var/www/bigartist-frontend/
chown -R www-data:www-data /var/www/bigartist-frontend
systemctl reload nginx
cd /tmp
rm -rf bigartist-temp bigartist-frontend.tar.gz
```

---

## 🔐 Credenciales de prueba

**Admin:**
- Email: `admin@bigartist.es`
- Password: `admin123`

**Artista:**
- Email: `artist@bigartist.es`
- Password: `admin123`

---

## 🌐 URL

Después del deployment, accede a:
**https://app.bigartist.es**

---

## ❓ Problemas comunes

### Error de permisos SSH
```bash
chmod 600 ~/.ssh/id_rsa
```

### Error al conectar
```bash
ssh -v root@94.143.141.241
```

### Ver logs de nginx
```bash
ssh root@94.143.141.241 'tail -50 /var/log/nginx/bigartist-error.log'
```

### Ver logs del backend
```bash
ssh root@94.143.141.241 'pm2 logs bigartist-backend --lines 50'
```
