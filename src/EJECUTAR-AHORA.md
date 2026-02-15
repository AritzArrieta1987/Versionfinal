# 🚨 EJECUTA ESTO AHORA - Backend no conecta

## Tu error actual:
```
No se puede conectar al servidor. Verifica que el backend esté corriendo en https://app.bigartist.es
```

Esto significa: **El backend NO está corriendo o NO es accesible**.

---

## ⚡ SOLUCIÓN EN 3 PASOS

### PASO 1: Conecta al servidor

```bash
ssh root@94.143.141.241
```

**Password**: `root2024`

---

### PASO 2: Ejecuta el script de auto-reparación

Copia y pega estos comandos **UNO POR UNO**:

```bash
# Descargar el script (o créalo manualmente)
cd ~

# Crear el script de reparación
cat > fix-backend.sh << 'SCRIPT_END'
#!/bin/bash
echo "🔧 Reparando Backend BigArtist..."
echo ""

# Ir al directorio del backend
cd /root/bigartist-backend || { echo "❌ Directorio no existe"; exit 1; }

# Detener proceso anterior
echo "1. Deteniendo procesos anteriores..."
pm2 delete bigartist-backend 2>/dev/null || true

# Verificar MySQL
echo "2. Verificando MySQL..."
systemctl start mysql
systemctl status mysql --no-pager | head -3

# Instalar dependencias
echo "3. Instalando dependencias..."
npm install

# Crear/verificar .env
echo "4. Verificando .env..."
if [ ! -f ".env" ]; then
    cat > .env << 'EOF'
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=root2024
DB_NAME=bigartist_royalties
JWT_SECRET=bigartist_secret_key_2024
PORT=3001
NODE_ENV=production
EOF
    echo "✅ Archivo .env creado"
fi

# Iniciar backend
echo "5. Iniciando backend..."
pm2 start server.js --name bigartist-backend
pm2 save

# Esperar 3 segundos
sleep 3

# Mostrar estado
echo ""
echo "📊 Estado actual:"
pm2 list

echo ""
echo "🧪 Probando endpoint..."
sleep 2
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@bigartist.es","password":"admin123"}'

echo ""
echo ""
echo "✅ Script completado. Ver logs con:"
echo "   pm2 logs bigartist-backend"
SCRIPT_END

# Dar permisos de ejecución
chmod +x fix-backend.sh

# EJECUTAR EL SCRIPT
./fix-backend.sh
```

---

### PASO 3: Verificar el resultado

Después de ejecutar el script, deberías ver algo como:

```
✅ Archivo .env creado
✅ Iniciando backend...
[PM2] Starting /root/bigartist-backend/server.js in fork_mode
[PM2] Done.

📊 Estado actual:
┌─────┬──────────────────────┬─────────┬─────────┐
│ id  │ name                 │ mode    │ status  │
├─────┼──────────────────────┼─────────┼─────────┤
│ 0   │ bigartist-backend    │ fork    │ online  │ ← ESTO ES BUENO
└─────┴──────────────────────┴─────────┴─────────┘

🧪 Probando endpoint...
{"success":true,"token":"eyJhbGci...","user":{...}} ← ESTO ES BUENO
```

---

## ✅ Si todo está OK (ves "online" y success:true):

Vuelve a tu computadora local y:

```bash
# Reinicia el servidor de desarrollo
npm run dev
```

Luego en el navegador:
- Abre `http://localhost:3000`
- Intenta hacer login con:
  - Email: `admin@bigartist.es`
  - Password: `admin123`

**¡Debería funcionar ahora!** ✅

---

## ❌ Si NO funciona:

### Opción A: El script falló

**Copia y pega todo el output del script** y compártelo.

### Opción B: Los archivos del backend no existen

Si el script dice "Directorio no existe", significa que los archivos del backend **no están en el servidor**.

**Solución**: Necesitas subir los archivos del backend al servidor.

```bash
# En tu computadora local, desde la raíz del proyecto:
cd backend

# Comprimir archivos
tar -czf backend.tar.gz *.js routes/ .env.example package.json

# Subir al servidor
scp backend.tar.gz root@94.143.141.241:/root/

# En el servidor:
ssh root@94.143.141.241
cd /root
mkdir -p bigartist-backend
cd bigartist-backend
tar -xzf ../backend.tar.gz

# Crear .env
cp .env.example .env
nano .env  # Editar con las credenciales correctas

# Instalar dependencias
npm install

# Iniciar con PM2
pm2 start server.js --name bigartist-backend
pm2 save
```

---

## 🔍 Comandos de Diagnóstico Adicionales

Si el script se ejecutó pero sigue sin funcionar:

### Ver logs del backend:
```bash
pm2 logs bigartist-backend --lines 50
```

### Probar endpoint directamente:
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@bigartist.es","password":"admin123"}'
```

### Verificar Nginx:
```bash
nginx -t
systemctl status nginx
cat /etc/nginx/sites-available/app.bigartist.es
```

### Verificar puerto:
```bash
netstat -tulpn | grep 3001
```

---

## 📞 Necesitas más ayuda?

Ejecuta estos comandos y comparte los resultados:

```bash
pm2 list
pm2 logs bigartist-backend --lines 20 --nostream
ls -la /root/bigartist-backend/
cat /root/bigartist-backend/.env | sed 's/PASSWORD=.*/PASSWORD=***/'
```

---

## 🎯 Checklist Rápido

Ejecuta esto en el servidor y dime qué sale:

```bash
# 1. ¿PM2 tiene el backend?
pm2 list | grep bigartist-backend

# 2. ¿El proceso está online?
pm2 list | grep online

# 3. ¿El puerto está escuchando?
netstat -tulpn | grep 3001

# 4. ¿El endpoint responde?
curl -s http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@bigartist.es","password":"admin123"}' | grep success

# 5. ¿MySQL está corriendo?
systemctl is-active mysql

# 6. ¿Nginx está corriendo?
systemctl is-active nginx
```

Si todos responden correctamente, el problema es otro (probablemente firewall o configuración de Nginx).

---

**EJECUTA EL PASO 1 Y 2 AHORA Y COMPARTE QUÉ SALE** 🚀
