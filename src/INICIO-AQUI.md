# 👋 EMPIEZA AQUÍ - Actualizar BAM Royalties System

## 🎯 TU SITUACIÓN

✅ **Todo el código ya está en GitHub**  
✅ **El servidor ya tiene una versión anterior**  
✅ **Solo necesitas actualizar el servidor**

---

## ⚡ ACTUALIZAR EN 2 COMANDOS

### **1️⃣ Conectar al servidor:**
```bash
ssh root@94.143.141.241
```
*(Te pedirá la contraseña del servidor)*

---

### **2️⃣ Actualizar:**
```bash
cd /var/www/bigartist-frontend && ./update.sh
```
*(Espera 2-3 minutos mientras actualiza)*

---

## ✅ **¡LISTO!**

Abre tu navegador en:
```
https://app.bigartist.es
```

**Verifica estos cambios:**
- ✅ Título pestaña: "BAM Royalties System"
- ✅ Favicon: "BAM" en dorado
- ✅ Login funciona
- ✅ Dashboard carga

---

## 🎨 **CAMBIOS INCLUIDOS**

| Cambio | Ubicación | Qué verás |
|--------|-----------|-----------|
| 🏷️ Título | Pestaña navegador | "BAM Royalties System" |
| 🎨 Favicon | Pestaña navegador | "BAM" dorado sobre verde |
| 📄 Contrato Activo | Portal de Artista | Nueva sección con detalles |
| 💰 Cajas Finanzas | Panel Finanzas | Datos 100% reales |
| 📅 Selector años | Panel Finanzas | Años dinámicos del CSV |
| 📊 Catálogo | Panel Catálogo | Sin "-1 artistas" |
| 🔒 Login | Pantalla login | Mensajes seguros |

---

## 📁 **ARCHIVOS DE AYUDA**

Si necesitas más información:

| Archivo | Para qué |
|---------|----------|
| **COMANDOS-EXACTOS.txt** | Solo los comandos, sin explicaciones |
| **ACTUALIZAR-DESDE-GITHUB.md** | Guía completa con troubleshooting |
| **README-DESPLIEGUE.md** | Documentación técnica detallada |

---

## 🆘 **SI ALGO FALLA**

### ❌ Error: "update.sh: No such file"
```bash
cd /var/www/bigartist-frontend
git pull origin main
npm install
npm run build
pm2 restart bigartist-backend
sudo systemctl reload nginx
```

### ❌ Backend no responde
```bash
pm2 logs bigartist-backend --lines 50
pm2 restart bigartist-backend
```

### ❌ Los cambios no se ven
```
En el navegador: Ctrl + Shift + R
```

---

## 💡 **RECORDATORIO**

**NO necesitas:**
- ❌ Clonar el repositorio en tu ordenador
- ❌ Hacer commit
- ❌ Hacer push
- ❌ Compilar localmente

**Solo necesitas:**
- ✅ Conectar al servidor
- ✅ Ejecutar el script de actualización

---

## 📊 **INFORMACIÓN**

```yaml
Servidor:   94.143.141.241
Usuario:    root
Directorio: /var/www/bigartist-frontend
URL:        https://app.bigartist.es
GitHub:     https://github.com/AritzArrieta1987/Versionfinal.git
```

---

## 🚀 **¿LISTO?**

### Abre tu terminal y ejecuta:

**COMANDO 1:**
```bash
ssh root@94.143.141.241
```

**COMANDO 2 (después de conectar):**
```bash
cd /var/www/bigartist-frontend && ./update.sh
```

---

## 🎉 **ESO ES TODO**

**Tiempo:** 2-3 minutos  
**Dificultad:** ⭐ Muy fácil  
**Resultado:** Aplicación actualizada con todos los cambios

---

**¿Tienes problemas?** Lee **ACTUALIZAR-DESDE-GITHUB.md** para más ayuda.

**¿Quieres solo los comandos?** Lee **COMANDOS-EXACTOS.txt**
