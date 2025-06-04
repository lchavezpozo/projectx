#!/bin/bash

set -e

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para logs
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

success() {
    echo -e "${GREEN}✅ $1${NC}"
}

warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

error() {
    echo -e "${RED}❌ $1${NC}"
}

# Verificar si Docker está corriendo
if ! docker info > /dev/null 2>&1; then
    error "Docker no está corriendo. Por favor, inicia Docker."
    exit 1
fi

# Verificar variables de entorno
if [ ! -f .env ]; then
    warning "Archivo .env no encontrado. Creando uno de ejemplo..."
    cat > .env << EOF
# Variables de entorno para producción
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=agendia
GITHUB_REPOSITORY=tu-usuario/agendia
# Para usar imagen del registry en producción, descomenta la siguiente línea:
# PROD_IMAGE=ghcr.io/tu-usuario/agendia:latest
# Para forzar seed en cada deployment:
# FORCE_SEED=true
EOF
    warning "Por favor, edita el archivo .env con tus valores antes de continuar."
    exit 1
fi

# Cargar variables de entorno
source .env

# Validar variables críticas
validate_env() {
    local missing_vars=()
    
    if [ -z "$POSTGRES_USER" ]; then
        missing_vars+=("POSTGRES_USER")
    fi
    
    if [ -z "$POSTGRES_PASSWORD" ]; then
        missing_vars+=("POSTGRES_PASSWORD")
    fi
    
    if [ -z "$POSTGRES_DB" ]; then
        missing_vars+=("POSTGRES_DB")
    fi
    
    if [ ${#missing_vars[@]} -gt 0 ]; then
        error "Variables de entorno faltantes en .env: ${missing_vars[*]}"
        error "Por favor, verifica tu archivo .env"
        exit 1
    fi
    
    log "Variables de entorno cargadas:"
    log "  - POSTGRES_USER: $POSTGRES_USER"
    log "  - POSTGRES_DB: $POSTGRES_DB"
    if [ -n "$GITHUB_REPOSITORY" ]; then
        log "  - GITHUB_REPOSITORY: $GITHUB_REPOSITORY"
    fi
    if [ "$FORCE_SEED" = "true" ]; then
        warning "FORCE_SEED=true - Se ejecutará seed en cada deployment"
    fi
}

# Función de ayuda
show_help() {
    echo "Uso: $0 [OPCIÓN]"
    echo ""
    echo "Opciones:"
    echo "  dev         Levantar la aplicación en desarrollo"
    echo "  prod        Levantar la aplicación en producción (local)"
    echo "  prod-registry  Levantar la aplicación en producción (desde registry)"
    echo "  down        Bajar la aplicación"
    echo "  restart     Reiniciar la aplicación"
    echo "  logs        Ver logs de la aplicación"
    echo "  update      Actualizar a la última versión del registry"
    echo "  seed        Ejecutar seed de la base de datos manualmente"
    echo "  migrate     Ejecutar migraciones de la base de datos manualmente"
    echo "  backup      Hacer backup de la base de datos"
    echo "  restore     Restaurar backup de la base de datos"
    echo "  help        Mostrar esta ayuda"
    echo ""
    echo "Nota: Las migraciones y seed se ejecutan automáticamente al iniciar producción"
}

# Función para hacer backup
backup_db() {
    validate_env
    log "Haciendo backup de la base de datos $POSTGRES_DB..."
    BACKUP_FILE="backup_$(date +%Y%m%d_%H%M%S).sql"
    log "Ejecutando: pg_dump -U $POSTGRES_USER $POSTGRES_DB"
    docker-compose exec -T postgres pg_dump -U "$POSTGRES_USER" "$POSTGRES_DB" > "$BACKUP_FILE"
    success "Backup creado: $BACKUP_FILE"
}

# Función para restaurar backup
restore_db() {
    validate_env
    
    if [ -z "$1" ]; then
        error "Por favor especifica el archivo de backup: $0 restore <archivo.sql>"
        exit 1
    fi
    
    if [ ! -f "$1" ]; then
        error "Archivo de backup no encontrado: $1"
        exit 1
    fi
    
    log "Restaurando backup: $1"
    log "Ejecutando: psql -U $POSTGRES_USER $POSTGRES_DB"
    docker-compose exec -T postgres psql -U "$POSTGRES_USER" "$POSTGRES_DB" < "$1"
    success "Backup restaurado exitosamente"
}

# Función para usar imagen del registry
use_registry_image() {
    if [ -z "$GITHUB_REPOSITORY" ]; then
        error "GITHUB_REPOSITORY no está definido en .env"
        exit 1
    fi
    
    export PROD_IMAGE="ghcr.io/$GITHUB_REPOSITORY:latest"
    log "Usando imagen del registry: $PROD_IMAGE"
}

# Función para actualizar imagen del registry
update_image() {
    use_registry_image
    log "Actualizando imagen desde GitHub Container Registry..."
    docker-compose pull prod
    docker-compose up -d prod
    success "Aplicación actualizada"
}

# Main switch
case "$1" in
    dev)
        validate_env
        log "Levantando aplicación en desarrollo..."
        docker-compose up -d postgres dev
        success "Aplicación de desarrollo iniciada"
        log "Aplicación disponible en: http://localhost:3000"
        ;;
    prod)
        validate_env
        log "Levantando aplicación en producción (build local)..."
        log "🔄 Las migraciones y seed se ejecutarán automáticamente..."
        unset PROD_IMAGE
        docker-compose up -d postgres prod
        success "Aplicación de producción iniciada"
        log "Aplicación disponible en: http://localhost:3001"
        log "Prisma Studio disponible en: http://localhost:5555"
        log "💡 Para ver el progreso de migraciones: ./scripts/deploy.sh logs prod"
        ;;
    prod-registry)
        validate_env
        log "Levantando aplicación en producción (desde registry)..."
        log "🔄 Las migraciones y seed se ejecutarán automáticamente..."
        use_registry_image
        docker-compose up -d postgres prod
        success "Aplicación de producción iniciada"
        log "Aplicación disponible en: http://localhost:3001"
        log "Prisma Studio disponible en: http://localhost:5555"
        log "💡 Para ver el progreso de migraciones: ./scripts/deploy.sh logs prod"
        ;;
    down)
        log "Bajando aplicación..."
        docker-compose down
        success "Aplicación detenida"
        ;;
    restart)
        log "Reiniciando aplicación..."
        docker-compose restart
        success "Aplicación reiniciada"
        ;;
    logs)
        SERVICE=${2:-prod}
        log "Mostrando logs de $SERVICE..."
        docker-compose logs -f $SERVICE
        ;;
    update)
        update_image
        ;;
    seed)
        validate_env
        warning "Ejecutando seed manualmente (las migraciones se ejecutan automáticamente en prod)..."
        docker-compose exec prod npx prisma generate
        docker-compose exec prod npm run db:seed
        success "Seed ejecutado exitosamente"
        ;;
    migrate)
        validate_env
        warning "Ejecutando migraciones manualmente (se ejecutan automáticamente en prod)..."
        docker-compose exec prod npx prisma db push
        success "Migraciones ejecutadas"
        ;;
    backup)
        backup_db
        ;;
    restore)
        restore_db "$2"
        ;;
    help|--help|-h)
        show_help
        ;;
    *)
        error "Opción no válida: $1"
        echo ""
        show_help
        exit 1
        ;;
esac 