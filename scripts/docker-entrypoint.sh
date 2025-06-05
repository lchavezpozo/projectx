#!/bin/sh

set -e

# Colores para logs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

log() {
    echo -e "${BLUE}[ENTRYPOINT]${NC} $1"
}

success() {
    echo -e "${GREEN}[ENTRYPOINT] ✅ $1${NC}"
}

error() {
    echo -e "${RED}[ENTRYPOINT] ❌ $1${NC}"
}

warning() {
    echo -e "${YELLOW}[ENTRYPOINT] ⚠️  $1${NC}"
}

log "🚀 Iniciando proceso de deployment..."

# Verificar que las variables de entorno estén definidas
if [ -z "$DATABASE_URL" ]; then
    error "DATABASE_URL no está definida"
    exit 1
fi

log "📋 Variables de entorno verificadas"

# Esperar a que la base de datos esté disponible (DESHABILITADO TEMPORALMENTE)
# log "⏳ Esperando que la base de datos esté disponible..."
# until echo "SELECT 1;" | npx prisma db execute --stdin > /dev/null 2>&1; do
#     log "Base de datos no disponible aún, esperando 2 segundos..."
#     sleep 2
# done
# success "Base de datos está disponible"

log "⚠️  Verificación de BD deshabilitada - iniciando directamente..."

# Generar cliente de Prisma
log "🔧 Generando cliente de Prisma..."
npx prisma generate
success "Cliente de Prisma generado"

# Ejecutar migraciones
log "📊 Ejecutando migraciones de base de datos..."
npx prisma db push
success "Migraciones ejecutadas"

# Verificar si hay datos en la base de datos
log "🔍 Verificando si la base de datos tiene datos..."
USER_COUNT=$(echo "SELECT COUNT(*) FROM \"User\";" | npx prisma db execute --stdin 2>/dev/null | tail -n 1 | tr -d ' ')

if [ "$USER_COUNT" = "0" ] || [ -z "$USER_COUNT" ]; then
    log "📝 Base de datos vacía, ejecutando seed..."
    npm run db:seed
    success "Seed ejecutado exitosamente"
else
    log "📊 Base de datos ya contiene $USER_COUNT usuarios, omitiendo seed"
fi

# Variable para forzar seed (útil para testing)
if [ "$FORCE_SEED" = "true" ]; then
    warning "FORCE_SEED=true detectado, ejecutando seed..."
    npm run db:seed
    success "Seed forzado ejecutado"
fi

success "🎉 Proceso de deployment completado"
log "🌐 Iniciando aplicación Next.js..."

# Ejecutar el comando original (iniciar Next.js)
exec "$@" 