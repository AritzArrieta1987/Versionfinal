# 🚀 ACTUALIZAR SERVIDOR DESDE GITHUB

## ✅ TU SITUACIÓN

- ✅ Todo el código ya está en GitHub
- ✅ El servidor ya tiene una versión anterior desplegada
- ✅ Solo necesitas actualizar el servidor con los cambios de GitHub

**Repositorio:** https://github.com/AritzArrieta1987/Versionfinal.git

---

## ⚡ PROCESO ULTRA SIMPLE (2 PASOS)

### **PASO 1: Conectar al servidor**
```bash
ssh root@94.143.141.241
```

### **PASO 2: Actualizar**
```bash
cd /var/www/bigartist-frontend && ./update.sh
```

**¡LISTO!** ⏱️ Tiempo: 2-3 minutos

---

## 📋 EXPLICACIÓN DETALLADA

### ¿Qué hace `./update.sh`?

El script automáticamente:

1. ⏸️ Para el backend
2. 📥 Descarga los cambios desde GitHub (`git pull`)
3. 📦 Instala dependencias nuevas (si las hay)
4. 🏗️ Compila el frontend (`npm run build`)
5. ▶️ Reinicia el backend
6. 🔄 Recarga Nginx
7. ✅ Verifica que todo funcione

---

## 🔍 COMANDOS ALTERNATIVOS

### Si `update.sh` no existe o falla:

```bash
# 1. Conectar al servidor
ssh root@94.143.141.241

# 2. Ir al directorio
cd /var/www/bigartist-frontend

# 3. Actualizar código desde GitHub
git pull origin main

# 4. Instalar dependencias
npm install

# 5. Compilar frontend
npm run build

# 6. Reiniciar backend
pm2 restart bigartist-backend

# 7. Recargar Nginx
sudo systemctl reload nginx
```

---

## 🎯 VERIFICAR QUE FUNCIONÓ

### 1. Abrir el sitio:
```
https://app.bigartist.es
```

### 2. Verificar cambios:
- ✅ Título pestaña: "BAM Royalties System"
- ✅ Favicon: "BAM" en dorado sobre fondo verde
- ✅ Login funciona
- ✅ Dashboard carga correctamente

### 3. Probar funcionalidades nuevas:
- ✅ Ir a Finanzas → Ver 4 cajas con datos reales
- ✅ Selector de años funciona
- ✅ Portal de Artista → Ver "Contrato Activo"
- ✅ Catálogo → No muestra "-1 artistas"

---

## 🆘 SOLUCIÓN DE PROBLEMAS

### ❌ Error: "update.sh: No such file"

**Opción A: Usar comandos manuales**
```bash
cd /var/www/bigartist-frontend
git pull origin main
npm install
npm run build
pm2 restart bigartist-backend
sudo systemctl reload nginx
```

**Opción B: Crear update.sh**
```bash
cd /var/www/bigartist-frontend
nano update.sh
# Pegar el contenido del script (ver abajo)
chmod +x update.sh
./update.sh
```

---

### ❌ Error: "git pull failed" o "merge conflict"

```bash
cd /var/www/bigartist-frontend

# Ver qué hay modificado
git status

# Si hay cambios locales que no importan, descartarlos
git reset --hard HEAD
git clean -fd

# Actualizar
git pull origin main
```

---

### ❌ Error: "Permission denied"

```bash
# Dar permisos al script
chmod +x update.sh

# Si sigue fallando, ejecutar como root
sudo ./update.sh
```

---

### ❌ Backend no arranca después de actualizar

```bash
# Ver logs para identificar el problema
pm2 logs bigartist-backend --lines 100

# Verificar que el puerto 3001 esté libre
netstat -tulpn | grep 3001

# Reiniciar completamente
pm2 delete bigartist-backend
cd /var/www/bigartist-backend
pm2 start server.js --name bigartist-backend
```

---

### ❌ Error 502 Bad Gateway

```bash
# Verificar que el backend esté corriendo
pm2 status

# Si no está corriendo, iniciarlo
pm2 start bigartist-backend

# Reiniciar Nginx
sudo systemctl restart nginx

# Ver logs de Nginx
sudo tail -f /var/log/nginx/bigartist-error.log
```

---

### ❌ Los cambios no se ven en el navegador

**En el servidor:**
```bash
# Asegurarse de que se compiló
cd /var/www/bigartist-frontend
npm run build
sudo systemctl reload nginx
```

**En tu navegador:**
```
1. Ctrl + Shift + R (Windows/Linux)
2. Cmd + Shift + R (Mac)
3. O abrir ventana de incógnito
```

---

## 📊 VERIFICAR SERVICIOS

### Ver estado de todos los servicios:
```bash
# PM2 (backend)
pm2 status

# Nginx (frontend)
sudo systemctl status nginx

# MySQL (base de datos)
sudo systemctl status mysql
```

### Ver logs en tiempo real:
```bash
# Backend
pm2 logs bigartist-backend

# Nginx access
sudo tail -f /var/log/nginx/bigartist-access.log

# Nginx errors
sudo tail -f /var/log/nginx/bigartist-error.log
```

---

## 🔄 SCRIPT update.sh COMPLETO

Si necesitas crear el archivo `update.sh`, este es el contenido:

```bash
#!/bin/bash

# Script de actualización rápida para BAM Royalties System
set -e

echo "🔄 Actualizando BAM Royalties System..."
echo ""

# Colores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Verificar directorio
if [ ! -f "package.json" ]; then
    print_error "No se encuentra package.json"
    exit 1
fi

print_info "Iniciando actualización completa..."
echo ""

# 1. Detener backend
echo "1️⃣  Deteniendo backend..."
if pm2 describe bigartist-backend > /dev/null 2>&1; then
    pm2 stop bigartist-backend
    print_success "Backend detenido"
else
    print_warning "Backend no estaba corriendo"
fi

# 2. Actualizar código
echo ""
echo "2️⃣  Actualizando código desde GitHub..."
git pull origin main
print_success "Código actualizado"

# 3. Actualizar backend
echo ""
echo "3️⃣  Actualizando backend..."
if [ -d "backend" ]; then
    cd backend
    npm install --production
    print_success "Backend actualizado"
    cd ..
else
    print_warning "No se encontró carpeta backend"
fi

# 4. Actualizar frontend
echo ""
echo "4️⃣  Actualizando frontend..."
npm install
print_success "Dependencias instaladas"

# 5. Compilar frontend
echo ""
echo "5️⃣  Compilando frontend..."
npm run build
print_success "Frontend compilado"

# 6. Reiniciar backend
echo ""
echo "6️⃣  Reiniciando backend..."
if [ -d "backend" ]; then
    pm2 restart bigartist-backend
    print_success "Backend reiniciado"
else
    print_warning "No hay backend"
fi

# 7. Recargar Nginx
echo ""
echo "7️⃣  Recargando Nginx..."
sudo systemctl reload nginx
print_success "Nginx recargado"

# 8. Verificar
echo ""
echo "8️⃣  Verificando servicios..."
echo ""
pm2 status

echo ""
echo "🧪 Probando backend..."
sleep 2
if curl -s http://localhost:3001/api/health > /dev/null; then
    print_success "Backend responde correctamente"
else
    print_warning "Backend no responde"
fi

# Verificar frontend
echo ""
if [ -d "dist" ]; then
    print_success "Frontend compilado existe"
else
    print_error "No se encontró carpeta dist/"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
print_success "✨ Actualización completada!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
print_info "🌐 Visita: https://app.bigartist.es"
echo ""
print_info "📋 Cambios incluidos:"
echo "   • Título: BAM Royalties System"
echo "   • Favicon: BAM"
echo "   • Contrato Activo en Artist Portal"
echo "   • 4 Cajas con datos reales"
echo "   • Selector de años dinámico"
echo "   • Catálogo corregido"
echo "   • Login seguro"
echo ""
print_info "📊 Para ver logs:"
echo "   Backend: pm2 logs bigartist-backend"
echo "   Nginx:   sudo tail -f /var/log/nginx/bigartist-error.log"
echo ""
```

**Para crear el archivo:**
```bash
cd /var/www/bigartist-frontend
nano update.sh
# Pegar el contenido de arriba
# Guardar: Ctrl + O, Enter
# Salir: Ctrl + X
chmod +x update.sh
```

---

## 💡 OPCIONAL: CLONAR EN TU ORDENADOR LOCAL

Si más adelante quieres trabajar localmente:

```bash
# 1. Clonar el repositorio
git clone https://github.com/AritzArrieta1987/Versionfinal.git
cd Versionfinal

# 2. Instalar dependencias
npm install

# 3. Ejecutar en modo desarrollo
npm run dev

# 4. Abrir en navegador
# http://localhost:5173
```

---

## ✅ CHECKLIST RÁPIDO

- [ ] Conectado al servidor con SSH
- [ ] Navegado a `/var/www/bigartist-frontend`
- [ ] Ejecutado `./update.sh` o comandos manuales
- [ ] Visto mensaje "Actualización completada"
- [ ] Verificado en https://app.bigartist.es
- [ ] Título es "BAM Royalties System"
- [ ] Favicon muestra "BAM"
- [ ] Todo funciona correctamente

---

## 🎯 RESUMEN

**TU CASO ES EL MÁS SIMPLE:**

1. Todo ya está en GitHub ✅
2. Solo necesitas actualizar el servidor ✅
3. Un comando hace todo: `./update.sh` ✅

**Tiempo total: 2-3 minutos** ⏱️

---

## 📞 INFORMACIÓN

```yaml
Servidor: 94.143.141.241
Usuario: root
Directorio: /var/www/bigartist-frontend
URL: https://app.bigartist.es
GitHub: https://github.com/AritzArrieta1987/Versionfinal.git
```

---

**¡Listo para actualizar!** 🚀
