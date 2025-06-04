# 🚀 Guía de Deployment - Agendia

Este proyecto está configurado para deployment automático usando GitHub Actions y GitHub Container Registry (GHCR).

## 📋 Configuración Inicial

### 1. Variables de Entorno

Crea o edita el archivo `.env` con las siguientes variables:

```bash
# Variables de base de datos
POSTGRES_USER=postgres
POSTGRES_PASSWORD=tu_password_seguro
POSTGRES_DB=agendia

# Variables de GitHub (reemplaza con tu usuario/repositorio)
GITHUB_REPOSITORY=tu-usuario/agendia

# Para usar imagen del registry en producción, descomenta:
# PROD_IMAGE=ghcr.io/tu-usuario/agendia:latest
```

### 2. Permisos de GitHub

Asegúrate de que tu repositorio tenga habilitado el GitHub Container Registry:
1. Ve a Settings → Actions → General
2. En "Workflow permissions", selecciona "Read and write permissions"
3. Marca "Allow GitHub Actions to create and approve pull requests"

## 🛠️ Comandos de Deployment

### Desarrollo Local

```bash
# Levantar entorno de desarrollo
./scripts/deploy.sh dev

# Ver logs de desarrollo
./scripts/deploy.sh logs dev
```

### Producción Local (Build Local)

```bash
# Levantar producción con build local
./scripts/deploy.sh prod

# Ver logs de producción
./scripts/deploy.sh logs prod
```

### Producción con Registry

```bash
# Levantar producción usando imagen del registry
./scripts/deploy.sh prod-registry

# Actualizar a la última versión del registry
./scripts/deploy.sh update
```

### Gestión de Base de Datos

```bash
# Ejecutar migraciones
./scripts/deploy.sh migrate

# Ejecutar seed (poblar base de datos)
./scripts/deploy.sh seed

# Hacer backup
./scripts/deploy.sh backup

# Restaurar backup
./scripts/deploy.sh restore backup_20241225_120000.sql
```

### Operaciones Generales

```bash
# Bajar todos los servicios
./scripts/deploy.sh down

# Reiniciar servicios
./scripts/deploy.sh restart

# Ver ayuda
./scripts/deploy.sh help
```

## 🔄 Workflow de CI/CD

### Versionado Automático

El proyecto usa **Conventional Commits** para versionado automático:

#### Tipos de Commit:

- `feat:` → Incrementa versión **minor** (0.1.0 → 0.2.0)
- `fix:` → Incrementa versión **patch** (0.1.0 → 0.1.1)
- `BREAKING CHANGE:` → Incrementa versión **major** (0.1.0 → 1.0.0)

#### Ejemplos:

```bash
# Nuevo feature (minor)
git commit -m "feat: agregar sistema de notificaciones"

# Bug fix (patch)
git commit -m "fix: corregir error en cálculo de precios"

# Breaking change (major)
git commit -m "feat!: cambiar estructura de base de datos

BREAKING CHANGE: La tabla usuarios ahora requiere campo email único"
```

### Flujo de Deployment

1. **Push a main/master** → Activa los workflows
2. **Release workflow** → Crea tag y release automáticamente
3. **Docker workflow** → Construye y sube imagen al registry
4. **Tu servidor** → Puede usar `./scripts/deploy.sh update` para actualizar

## 🐳 Docker Images

### Tags Generados Automáticamente:

- `latest` → Última versión de main/master
- `v1.2.3` → Version específica del release
- `main-abc123` → SHA específico de main
- `1.2` → Major.minor version
- `1` → Major version

### Usar Imagen Específica:

```bash
# En .env
PROD_IMAGE=ghcr.io/tu-usuario/agendia:v1.2.3

# Levantar con versión específica
./scripts/deploy.sh prod-registry
```

## 🌐 URLs de Acceso

### Desarrollo:
- **Aplicación:** http://localhost:3000
- **Base de datos:** localhost:5432

### Producción:
- **Aplicación:** http://localhost:3001
- **Prisma Studio:** http://localhost:5555
- **Base de datos:** localhost:5432

## 📝 Logs y Monitoreo

```bash
# Ver logs en tiempo real
./scripts/deploy.sh logs prod

# Ver logs de un servicio específico
./scripts/deploy.sh logs postgres

# Ver estado de contenedores
docker-compose ps
```

## 🔧 Troubleshooting

### Problema: Imagen no se encuentra

```bash
# Verificar que la imagen existe en el registry
docker pull ghcr.io/tu-usuario/agendia:latest

# Usar build local como fallback
./scripts/deploy.sh prod
```

### Problema: Error de permisos en registry

1. Verifica que `GITHUB_TOKEN` tiene permisos de packages
2. Revisa que el repositorio es público o tienes acceso
3. Haz login manual: `docker login ghcr.io -u tu-usuario`

### Problema: Base de datos no conecta

```bash
# Verificar que postgres está corriendo
docker-compose ps postgres

# Reiniciar servicios
./scripts/deploy.sh restart

# Verificar logs
./scripts/deploy.sh logs postgres
```

## 🎯 Best Practices

1. **Siempre hacer backup antes de deployment en producción**
2. **Usar conventional commits para versionado automático**
3. **Verificar que los tests pasan antes de merge**
4. **Monitorear logs después de deployment**
5. **Mantener las variables de entorno seguras**

## 📦 Estructura de Archivos

```
├── .github/
│   └── workflows/
│       ├── docker-build-deploy.yml  # Build y push de imágenes
│       └── release.yml              # Versionado automático
├── scripts/
│   └── deploy.sh                    # Script de deployment
├── docker-compose.yml               # Configuración unificada
├── Dockerfile                       # Imagen de la aplicación
├── .env                            # Variables de entorno
└── DEPLOYMENT.md                   # Esta guía
```

---

## 🚀 ¡Tu aplicación está lista para producción!

Con esta configuración, cada push a `main` automáticamente:
1. ✅ Crea un nuevo release versionado
2. ✅ Construye una imagen Docker optimizada
3. ✅ La sube al GitHub Container Registry
4. ✅ Está lista para deployment con un solo comando 