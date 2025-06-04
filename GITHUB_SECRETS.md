# 🔐 Configuración de GitHub Secrets

Para que tu aplicación funcione correctamente en GitHub Actions, necesitas configurar los siguientes secrets en tu repositorio.

## 📋 Cómo configurar GitHub Secrets

1. Ve a tu repositorio en GitHub
2. Haz clic en **Settings** (Configuración)
3. En el menú lateral, haz clic en **Secrets and variables** → **Actions**
4. Haz clic en **New repository secret**

## 🔑 Secrets Requeridos

### **OBLIGATORIOS:**

| Secret Name | Descripción | Ejemplo |
|-------------|-------------|---------|
| `JWT_SECRET` | Secret para tokens JWT | `tu_jwt_secret_super_seguro_2024` |
| `NEXTAUTH_SECRET` | Secret para NextAuth.js | `tu_nextauth_secret_super_seguro_2024` |

### **OPCIONALES (con valores por defecto):**

| Secret Name | Descripción | Valor por defecto | Recomendado |
|-------------|-------------|-------------------|-------------|
| `POSTGRES_USER` | Usuario de PostgreSQL | `postgres` | `postgres` |
| `POSTGRES_PASSWORD` | Contraseña de PostgreSQL | `postgres` | `tu_password_seguro_2024` |
| `POSTGRES_DB` | Nombre de la base de datos | `agendia` | `agendia` |
| `FORCE_SEED` | Forzar seed en cada deployment | `false` | `false` |

## 🔧 Cómo generar secrets seguros

### **Para JWT_SECRET y NEXTAUTH_SECRET:**

```bash
# Generar un secret aleatorio de 32 caracteres
openssl rand -base64 32

# O usar Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# O usar una herramienta online segura como:
# https://generate-secret.vercel.app/32
```

## 📝 Configuración paso a paso

### 1. **JWT_SECRET**
```
Name: JWT_SECRET
Value: [resultado de openssl rand -base64 32]
```

### 2. **NEXTAUTH_SECRET**
```
Name: NEXTAUTH_SECRET
Value: [resultado de openssl rand -base64 32]
```

### 3. **POSTGRES_PASSWORD** (opcional pero recomendado)
```
Name: POSTGRES_PASSWORD
Value: tu_password_super_seguro_2024
```

### 4. **FORCE_SEED** (solo si necesitas seed forzado)
```
Name: FORCE_SEED
Value: true
```

## 🌍 Variables de entorno en diferentes ambientes

### **GitHub Actions (automático):**
✅ Se crean automáticamente desde los secrets

### **Desarrollo local:**
Crea tu archivo `.env` local:

```bash
# .env (NO commitear al repositorio)
POSTGRES_USER=postgres
POSTGRES_PASSWORD=tu_password_local
POSTGRES_DB=agendia
DATABASE_URL="postgresql://postgres:tu_password_local@localhost:5432/agendia"
JWT_SECRET=tu_jwt_secret_local
NEXTAUTH_SECRET=tu_nextauth_secret_local
GITHUB_REPOSITORY=tu-usuario/agendia
```

### **Servidor de producción:**
Tienes varias opciones:

#### **Opción 1: Variables de entorno del sistema**
```bash
export POSTGRES_USER=postgres
export POSTGRES_PASSWORD=tu_password_produccion
export POSTGRES_DB=agendia
export DATABASE_URL="postgresql://postgres:tu_password_produccion@localhost:5432/agendia"
export JWT_SECRET=tu_jwt_secret_produccion
export NEXTAUTH_SECRET=tu_nextauth_secret_produccion
```

#### **Opción 2: Archivo .env en el servidor**
```bash
# En tu servidor, crear /path/to/app/.env
POSTGRES_USER=postgres
POSTGRES_PASSWORD=tu_password_produccion
POSTGRES_DB=agendia
DATABASE_URL="postgresql://postgres:tu_password_produccion@localhost:5432/agendia"
JWT_SECRET=tu_jwt_secret_produccion
NEXTAUTH_SECRET=tu_nextauth_secret_produccion
```

#### **Opción 3: Docker Compose con env_file**
```yaml
# docker-compose.prod.yml
services:
  app:
    image: ghcr.io/tu-usuario/agendia:latest
    env_file: .env.prod  # Archivo separado en el servidor
```

## 🔒 Seguridad

### **✅ DO (Hacer):**
- Usar secrets largos y aleatorios
- Diferentes secrets para desarrollo/producción
- Rotar secrets periódicamente
- Usar HTTPS en producción

### **❌ DON'T (No hacer):**
- Commitear archivos `.env` al repositorio
- Usar passwords simples como "password123"
- Reutilizar secrets entre proyectos
- Compartir secrets por email/chat

## 🔍 Verificar configuración

### **En GitHub Actions:**
Los logs mostrarán si faltan secrets:
```
Error: JWT_SECRET is required but not found in secrets
```

### **En desarrollo local:**
```bash
./scripts/deploy.sh dev
# Verificará que tengas las variables necesarias
```

### **En producción:**
```bash
./scripts/deploy.sh prod-registry
# Los logs del entrypoint mostrarán el estado
```

## 🚨 Troubleshooting

### **Error: "JWT_SECRET no está definido"**
1. Verifica que el secret esté configurado en GitHub
2. El nombre debe ser exactamente `JWT_SECRET`
3. Revisa que el workflow esté usando `secrets.JWT_SECRET`

### **Error: "DATABASE_URL no está definida"**
1. Verifica los secrets de PostgreSQL
2. Asegúrate de que `POSTGRES_USER`, `POSTGRES_PASSWORD`, y `POSTGRES_DB` estén configurados

### **La imagen se construye pero falla en runtime:**
1. Revisa los logs: `./scripts/deploy.sh logs prod`
2. Verifica que todos los secrets necesarios estén configurados
3. Asegúrate de que la base de datos esté disponible

---

## 📚 Referencias útiles

- [GitHub Docs: Creating encrypted secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
- [NextAuth.js Configuration](https://next-auth.js.org/configuration/options#secret)
- [Prisma Environment Variables](https://www.prisma.io/docs/guides/development-environment/environment-variables) 