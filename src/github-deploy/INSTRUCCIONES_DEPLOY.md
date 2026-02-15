# 🚀 Instrucciones de Deploy - BIGARTIST Frontend

## Paso 1: Subir archivos a GitHub (desde tu Mac)

```bash
# Crear carpeta local
mkdir ~/bigartist-frontend
cd ~/bigartist-frontend

# Inicializar Git
git init
git remote add origin https://github.com/AritzArrieta1987/Versionfinal.git

# Crear todos los archivos del proyecto (copia y pega cada archivo desde /github-deploy/)
```

Necesitas crear estos archivos en tu Mac con el contenido de `/github-deploy/`:

- ✅ package.json
- ✅ vite.config.ts
- ✅ tsconfig.json
- ✅ tailwind.config.js
- ✅ postcss.config.js
- ✅ index.html
- ✅ .gitignore
- ✅ README.md
- ✅ src/main.tsx
- ✅ src/index.css
- ✅ src/App.tsx
- ✅ src/vite-env.d.ts

```bash
# Después de crear todos los archivos:
git add .
git commit -m "Initial commit - BIGARTIST Royalties Frontend"
git branch -M main
git push -u origin main
```

---

## Paso 2: Desplegar en el servidor Ubuntu (94.143.141.241)

Conéctate por SSH y ejecuta:

```bash
# Conectar al servidor
ssh root@94.143.141.241

# Eliminar versión anterior
cd /var/www
rm -rf bigartist-frontend

# Clonar repositorio
git clone https://github.com/AritzArrieta1987/Versionfinal.git bigartist-frontend

# Entrar al directorio
cd bigartist-frontend

# Instalar dependencias
npm install

# Compilar proyecto
npm run build

# Mover archivos compilados al directorio raíz (necesario para Nginx)
cp -r dist/* .

# Limpiar
rm -rf dist node_modules src

# Establecer permisos correctos
chown -R www-data:www-data /var/www/bigartist-frontend
chmod -R 755 /var/www/bigartist-frontend

# Reiniciar Nginx
systemctl reload nginx

# Verificar
echo "✅ Deploy completado!"
echo "🌐 Accede a: https://app.bigartist.es"
```

---

## Paso 3: Verificar funcionamiento

Abre tu navegador y ve a: **https://app.bigartist.es**

Deberías ver:
- ✨ Logo BIGARTIST grande en el lado izquierdo (en desktop)
- 🎨 Formulario de login con colores corporativos (#2a3f3f y #c9a574)
- 📱 Diseño responsive en móviles

**Credenciales de prueba:**
- Email: `admin@bigartist.es`
- Contraseña: `admin123`

---

## 🔄 Para actualizar en el futuro

```bash
# En el servidor
cd /var/www/bigartist-frontend
git pull origin main
npm install
npm run build
cp -r dist/* .
rm -rf dist
systemctl reload nginx
```

---

## ⚠️ Solución de problemas

Si no se ve bien:
1. Verifica que Nginx esté correcto: `cat /etc/nginx/sites-available/bigartist`
2. Revisa los logs: `tail -f /var/log/nginx/error.log`
3. Verifica que los archivos estén en su sitio: `ls -la /var/www/bigartist-frontend/`
4. Comprueba la respuesta del servidor: `curl -I https://app.bigartist.es`
