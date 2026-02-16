# 🚀 DESPLIEGUE ULTRA SIMPLE

## 1️⃣ Sube el script a tu servidor

Desde tu máquina local (donde tienes el código):

```bash
# Ir al directorio del proyecto
cd /ruta/a/tu/proyecto

# Copiar el script al servidor
scp deploy-complete.sh usuario@app.bigartist.es:/tmp/deploy-complete.sh
```

---

## 2️⃣ Ejecuta el script en el servidor

Conecta por SSH:

```bash
ssh usuario@app.bigartist.es
```

Ejecuta el script:

```bash
# Dar permisos de ejecución
chmod +x /tmp/deploy-complete.sh

# Ejecutar (pedirá datos de MySQL)
sudo /tmp/deploy-complete.sh
```

El script te preguntará:
- Usuario MySQL (deja vacío para usar `bigartist_user`)
- Password MySQL
- Nombre de base de datos (deja vacío para usar `bigartist_royalties`)

---

## 3️⃣ ¡Listo!

El script hace **TODO automáticamente**:
- ✅ Verifica requisitos (Node, NPM, PM2, MySQL, Nginx)
- ✅ Crea el archivo `.env` del backend
- ✅ Instala dependencias del backend
- ✅ Instala dependencias del frontend
- ✅ Compila el frontend para producción
- ✅ Inicia el backend con PM2
- ✅ Configura Nginx
- ✅ Crea script de actualización

**Abre tu navegador:** https://app.bigartist.es

---

## 🔄 Para actualizar en el futuro

```bash
ssh usuario@app.bigartist.es
cd /var/www/bigartist-royalties
./update.sh
```

---

## ⚠️ Si no tienes Git en el servidor

El script asume que el código ya está en `/var/www/bigartist-royalties`.

**Primera opción: Clonar desde GitHub**
```bash
ssh usuario@app.bigartist.es
sudo mkdir -p /var/www/bigartist-royalties
sudo chown $USER:$USER /var/www/bigartist-royalties
cd /var/www/bigartist-royalties
git clone https://github.com/AritzArrieta1987/Versionfinal.git .
```

**Segunda opción: Subir todo por SCP**
```bash
# Desde tu máquina local
scp -r * usuario@app.bigartist.es:/var/www/bigartist-royalties/
```

Luego ejecuta el script de deploy.

---

## 📊 Ver logs

```bash
# Backend
pm2 logs bigartist-backend

# Nginx
sudo tail -f /var/log/nginx/bigartist-error.log
```

---

## 🆘 Solución de problemas

### El script falla
```bash
# Ver el error completo
sudo bash -x /tmp/deploy-complete.sh
```

### Backend no arranca
```bash
pm2 logs bigartist-backend --lines 100
```

### Nginx da error
```bash
sudo nginx -t
sudo tail -f /var/log/nginx/error.log
```

---

**¡Eso es todo! Un solo script lo hace TODO.** 🎉
