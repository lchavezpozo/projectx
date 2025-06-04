# Etapa de construcción
FROM node:20-alpine AS builder

WORKDIR /app

# Copiar archivos de dependencias
COPY package.json package-lock.json ./

# Instalar dependencias
RUN npm ci

# Copiar el resto del código
COPY . .

# Generar el cliente de Prisma antes del build
RUN npx prisma generate

# Construir la aplicación
RUN npm run build

# Etapa de producción
FROM node:20-alpine AS runner

WORKDIR /app

# Establecer variables de entorno
ENV NODE_ENV=production
ENV PORT=3001

# Instalar Prisma CLI y tsx globalmente
RUN npm install -g prisma tsx

# Copiar package.json y package-lock.json para instalar dependencias
COPY package.json package-lock.json ./

# Instalar todas las dependencias (incluyendo devDependencies para tsx)
RUN npm ci

# Copiar archivos necesarios desde la etapa de construcción
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

# Copiar script de entrypoint
COPY scripts/docker-entrypoint.sh /entrypoint.sh

# Hacer el script ejecutable
RUN chmod +x /entrypoint.sh

# Exponer los puertos
EXPOSE 3001
EXPOSE 5555

# Usar el script de entrypoint
ENTRYPOINT ["/entrypoint.sh"]

# Comando para iniciar la aplicación
CMD ["node", "server.js"] 