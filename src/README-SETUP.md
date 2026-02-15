# 🚀 BigArtist Royalties - Setup

## 📋 Estado Actual del Proyecto

### ✅ Completado
- ✅ Sistema de login conectado a MySQL
- ✅ Panel de artistas con portal completo
- ✅ API de finanzas (backend)
- ✅ Componentes de ingresos y gastos
- ✅ Configuración de proxy para desarrollo

### 🔄 Próximo: Deploy del Backend de Finanzas

---

## 🛠️ Instalación Local

### 1. Clonar el proyecto

```bash
git clone https://github.com/TU_USUARIO/bigartist-royalties.git
cd bigartist-royalties
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Iniciar servidor de desarrollo

```bash
npm run dev
```

El servidor iniciará en: `http://localhost:3000`

---

## 🔐 Credenciales de Prueba

### Admin
- Email: `admin@bigartist.es`
- Password: `admin123`

### Artista
- Email: `artist@bigartist.es`
- Password: `artist123`

---

## 🌐 Configuración del Proxy

El proyecto usa **Vite Proxy** para desarrollo local:

```javascript
// vite.config.ts
server: {
  proxy: {
    '/api': {
      target: 'https://app.bigartist.es',
      changeOrigin: true,
      secure: false
    }
  }
}
```

**¿Cómo funciona?**
- En **desarrollo local**: `/api/auth/login` → proxy → `https://app.bigartist.es/api/auth/login`
- En **producción**: usa directamente `https://app.bigartist.es/api/auth/login`

---

## 📁 Estructura del Proyecto

```
/
├── components/
│   ├── LoginPanel.tsx          # Panel de login
│   ├── ArtistPortal.tsx        # Portal completo de artistas
│   ├── admin/
│   │   ├── IncomeSection.tsx   # Sección de ingresos
│   │   └── ExpensesSection.tsx # Sección de gastos
│   └── ui/                     # Componentes de UI
├── backend/
│   ├── routes/
│   │   └── finances.js         # Rutas del API de finanzas
│   ├── database/
│   │   └── finances_schema.sql # Schema de base de datos
│   ├── README.md              # Documentación del backend
│   └── DEPLOY.md              # Instrucciones de deploy
├── utils/
│   ├── api.ts                 # Funciones centralizadas del API
│   └── toast.ts               # Utilidad de notificaciones
├── types/
│   ├── vite-env.d.ts          # Tipos de Vite
│   └── figma-asset.d.ts       # Tipos de assets de Figma
└── vite.config.ts             # Configuración de Vite
```

---

## 🚀 Deploy del Backend

### 1. Subir código a GitHub

```bash
git add .
git commit -m "feat: Backend completo de finanzas"
git push origin main
```

### 2. Conectar al servidor

```bash
ssh root@94.143.141.241
```

### 3. Actualizar backend

```bash
cd /root/bigartist-backend
git pull origin main
```

### 4. Crear tablas en MySQL

```bash
mysql -u root -proot2024 bigartist_royalties < /root/bigartist-backend/database/finances_schema.sql
```

### 5. Actualizar server.js

Agregar al archivo `/root/bigartist-backend/server.js`:

```javascript
const financesRoutes = require('./routes/finances');
app.use('/api/finances', financesRoutes);
```

### 6. Reiniciar backend

```bash
pm2 restart bigartist-backend
pm2 logs bigartist-backend --lines 20
```

---

## 🧪 Testing

### Probar Login

```bash
curl -X POST https://app.bigartist.es/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@bigartist.es","password":"admin123"}'
```

### Probar Estadísticas de Finanzas

```bash
curl https://app.bigartist.es/api/finances/stats
```

---

## 🔧 Troubleshooting

### Error: "Failed to fetch"

**Causa**: El proxy de Vite no está configurado o el backend no está corriendo.

**Solución**:
1. Verifica que el backend esté corriendo: `ssh root@94.143.141.241` → `pm2 list`
2. Reinicia el servidor de desarrollo local: `Ctrl+C` → `npm run dev`

### Error: "Cannot read properties of undefined (reading 'PROD')"

**Causa**: Problema con `import.meta.env` en TypeScript.

**Solución**: Ya está resuelto en `/utils/api.ts` usando `window.location.hostname`

### Error: "Table doesn't exist"

**Causa**: Las tablas de finanzas no están creadas en MySQL.

**Solución**:
```bash
ssh root@94.143.141.241
mysql -u root -proot2024 bigartist_royalties < /root/bigartist-backend/database/finances_schema.sql
```

---

## 📊 Endpoints del API

### Auth
- `POST /api/auth/login` - Login de usuarios
- `POST /api/auth/logout` - Cerrar sesión

### Finanzas
- `GET /api/finances/stats` - Estadísticas financieras
- `GET /api/finances/payment-requests` - Solicitudes de pago
- `POST /api/finances/payment-requests` - Crear solicitud
- `PUT /api/finances/payment-requests/:id/approve` - Aprobar solicitud
- `PUT /api/finances/payment-requests/:id/reject` - Rechazar solicitud
- `GET /api/finances/expenses` - Obtener gastos
- `POST /api/finances/expenses` - Crear gasto
- `DELETE /api/finances/expenses/:id` - Eliminar gasto
- `GET /api/finances/income` - Obtener ingresos
- `GET /api/finances/contracts` - Obtener contratos
- `POST /api/finances/contracts` - Crear/actualizar contrato

---

## 🎨 Diseño

- **Fondo oscuro**: `#2a3f3f`
- **Acento dorado**: `#c9a574`
- **Estilo**: Premium tipo Sony Music/Universal
- **Responsive**: Sí (bottom navigation móvil < 768px)

---

## 📝 TODO

- [ ] Desplegar backend de finanzas
- [ ] Integrar FinancesPanel en el admin
- [ ] Conectar componentes con el API real
- [ ] Agregar generación de PDFs para reportes
- [ ] Implementar sistema de notificaciones en tiempo real

---

## 💡 Notas

- El sistema usa **JWT** para autenticación
- Las contraseñas se almacenan con **bcrypt**
- Los pagos son exclusivamente por **transferencia bancaria**
- Validación de **IBAN** incluida
- **Bottom navigation** aparece automáticamente en móvil

---

## 📞 Soporte

Para cualquier duda o problema:
- Email: contacto@bigartist.es
- Servidor: 94.143.141.241
