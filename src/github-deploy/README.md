# BIGARTIST Royalties - Frontend

Panel de administración para BIGARTIST Royalties Management System.

## Tecnologías

- React 18
- TypeScript
- Vite
- Tailwind CSS 3

## Instalación en servidor

```bash
# Clonar repositorio
cd /var/www
rm -rf bigartist-frontend
git clone TU_REPOSITORIO_AQUI bigartist-frontend

# Instalar dependencias
cd bigartist-frontend
npm install

# Compilar
npm run build

# Desplegar
cp -r dist/* .
rm -rf dist

# Permisos
chown -R www-data:www-data /var/www/bigartist-frontend
chmod -R 755 /var/www/bigartist-frontend

# Reiniciar Nginx
systemctl reload nginx
```

## Credenciales de prueba

- Email: `admin@bigartist.es`
- Password: `admin123`

## Colores corporativos

- Fondo oscuro: `#2a3f3f`
- Acento dorado: `#c9a574`
