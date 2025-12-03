# 📦 Entrenamiento Docker - Creación de Imágenes

## Índice
1. [Introducción a Docker](#introduccion-a-docker)
2. [Conceptos Fundamentales](#conceptos-fundamentales)
3. [Dockerfile - Estructura Básica](#dockerfile---estructura-basica)
4. [Creando Imagen para Aplicación InovaTech](#creando-imagen-para-aplicacion-inovatech)
5. [Buenas Prácticas](#buenas-practicas)
6. [Multi-Stage Builds](#multi-stage-builds)
7. [Optimización de Imágenes](#optimizacion-de-imagenes)
8. [Comandos Esenciales](#comandos-esenciales)
9. [Ejercicios Prácticos](#ejercicios-practicos)

---

## Introducción a Docker

Docker es una plataforma que permite empaquetar aplicaciones y sus dependencias en **containers**, garantizando que funcionen de forma consistente en cualquier entorno.

### ¿Por qué usar Docker?

- ✅ **Portabilidad**: Funciona igual en desarrollo, homologación y producción
- ✅ **Aislamiento**: Cada container es independiente
- ✅ **Eficiencia**: Los containers son más ligeros que las VMs
- ✅ **Versionado**: Las imágenes pueden ser versionadas y compartidas
- ✅ **Escalabilidad**: Fácil replicación de containers

---

## Conceptos Fundamentales

### Imagen vs Container

| **Imagen** | **Container** |
|------------|---------------|
| Plantilla de solo lectura | Instancia ejecutable de una imagen |
| Almacenada en el registry | En ejecución en el host |
| Puede generar múltiples containers | Tiene estado y puede ser iniciado/detenido |

### Componentes de una Imagen Docker

- **Layers (Capas)**: Cada instrucción en el Dockerfile crea una capa
- **Base Image**: Imagen base sobre la que construimos
- **Metadata**: Información sobre la imagen (autor, versión, etc.)

---

## Dockerfile - Estructura Básica

El **Dockerfile** es un archivo de texto con instrucciones para construir una imagen Docker.

### Instrucciones Principales

```dockerfile
# Imagen base
FROM <imagen>:<tag>

# Define directorio de trabajo
WORKDIR /app

# Copia archivos del host al container
COPY <origen> <destino>

# Añade archivos (soporta URLs y tar)
ADD <origen> <destino>

# Ejecuta comandos durante el build
RUN <comando>

# Define variables de entorno
ENV <clave>=<valor>

# Expone puertos
EXPOSE <puerto>

# Define volúmenes
VOLUME ["/data"]

# Comando ejecutado al iniciar el container
CMD ["ejecutable", "param1", "param2"]

# Punto de entrada (no sobrescrito por argumentos)
ENTRYPOINT ["ejecutable"]
```

---

## Creando Imagen para Aplicación InovaTech

Vamos a crear una imagen Docker para la aplicación Spring Boot en la carpeta `APP`.

### Ejemplo 1: Dockerfile Básico

Crea el archivo `Dockerfile` en la carpeta `APP`:

```dockerfile
# Usa imagen oficial de OpenJDK 21
FROM eclipse-temurin:21-jdk-alpine

# Define el directorio de trabajo
WORKDIR /app

# Copia el archivo pom.xml y el wrapper de Maven
COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .

# Descarga las dependencias (cache layer)
RUN ./mvnw dependency:go-offline

# Copia el código fuente
COPY src src

# Compila la aplicación
RUN ./mvnw package -DskipTests

# Expone el puerto de la aplicación
EXPOSE 5000

# Comando para ejecutar la aplicación
CMD ["java", "-jar", "target/InovaTech-0.0.1-SNAPSHOT.jar"]
```

### Cómo Construir la Imagen

```bash
# Navegar hasta la carpeta APP
cd APP

# Construir la imagen
docker build -t inovatech-backend:1.0 .

# Listar imágenes
docker images

# Ejecutar container
docker run -p 5000:5000 inovatech-backend:1.0
```

### Probando la Aplicación

```bash
# Acceder en el navegador o curl
curl http://localhost:5000/swagger-ui.html
```

---

## Ejemplo 2: Dockerfile con Multi-Stage Build (RECOMENDADO)

Multi-stage builds permiten crear imágenes más pequeñas y seguras.

```dockerfile
# ============================================
# ETAPA 1: BUILD
# ============================================
FROM eclipse-temurin:21-jdk-alpine AS builder

WORKDIR /app

# Copia archivos necesarios para build
COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .

# Descarga dependencias (cached)
RUN ./mvnw dependency:go-offline

# Copia código fuente
COPY src src

# Compila la aplicación
RUN ./mvnw clean package -DskipTests

# ============================================
# ETAPA 2: RUNTIME
# ============================================
FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

# Copia solo el JAR de la etapa anterior
COPY --from=builder /app/target/InovaTech-0.0.1-SNAPSHOT.jar app.jar

# Crea usuario no-root para seguridad
RUN addgroup -S spring && adduser -S spring -G spring
USER spring:spring

# Define variables de entorno
ENV JAVA_OPTS="-Xmx512m -Xms256m"
ENV SERVER_PORT=5000

# Expone el puerto
EXPOSE ${SERVER_PORT}

# Healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=30s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:5000/actuator/health || exit 1

# Comando de ejecución
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
```

### Ventajas del Multi-Stage:

- ✅ Imagen final **mucho más pequeña** (sin Maven, código fuente, etc.)
- ✅ Solo el JRE necesario (no el JDK completo)
- ✅ Más segura (menos herramientas de desarrollo)
- ✅ Más rápida para descargar/desplegar

### Construir y Ejecutar

```bash
# Build
docker build -t inovatech-backend:2.0 -f Dockerfile.multistage .

# Run con variables de entorno
docker run -d \
  --name inovatech \
  -p 5000:5000 \
  -e JAVA_OPTS="-Xmx1g" \
  inovatech-backend:2.0

# Ver logs
docker logs -f inovatech

# Parar y eliminar
docker stop inovatech
docker rm inovatech
```

---

## Ejemplo 3: Dockerfile con Build Arguments

Usa `ARG` para parametrizar builds:

```dockerfile
# Argumentos de build
ARG JAVA_VERSION=21
ARG APP_VERSION=0.0.1-SNAPSHOT

# ============================================
# BUILD STAGE
# ============================================
FROM eclipse-temurin:${JAVA_VERSION}-jdk-alpine AS builder

ARG APP_VERSION
WORKDIR /app

COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .

RUN ./mvnw dependency:go-offline

COPY src src

# Usa el argumento en la compilación
RUN ./mvnw clean package -DskipTests

# ============================================
# RUNTIME STAGE
# ============================================
FROM eclipse-temurin:${JAVA_VERSION}-jre-alpine

ARG APP_VERSION
LABEL version="${APP_VERSION}"
LABEL description="InovaTech Backend Application"
LABEL maintainer="tu-email@ejemplo.com"

WORKDIR /app

COPY --from=builder /app/target/InovaTech-${APP_VERSION}.jar app.jar

RUN addgroup -S spring && adduser -S spring -G spring
USER spring:spring

EXPOSE 5000

ENTRYPOINT ["java", "-jar", "app.jar"]
```

### Build con Argumentos

```bash
# Build por defecto
docker build -t inovatech-backend:latest .

# Build con Java 17
docker build --build-arg JAVA_VERSION=17 -t inovatech-backend:java17 .

# Build con versión específica
docker build --build-arg APP_VERSION=1.0.0 -t inovatech-backend:1.0.0 .
```

---

## Ejemplo 4: Dockerfile con .dockerignore

Crea un archivo `.dockerignore` en la carpeta `APP` para excluir archivos innecesarios:

```
# .dockerignore
target/
!target/InovaTech-*.jar
.git
.gitignore
*.md
.mvn/wrapper/maven-wrapper.jar
*.log
.idea
.vscode
*.iml
```

---

## Buenas Prácticas

### 1. Usa Imágenes Oficiales y Específicas

```dockerfile
# ❌ Evita tags genéricas
FROM openjdk:latest

# ✅ Usa tags específicas
FROM eclipse-temurin:21-jre-alpine
```

### 2. Minimiza el Número de Capas

```dockerfile
# ❌ Múltiples RUN
RUN apk update
RUN apk add curl
RUN apk add wget

# ✅ Combina comandos
RUN apk update && \
    apk add --no-cache curl wget && \
    rm -rf /var/cache/apk/*
```

### 3. Usa Cache de Capas Eficientemente

```dockerfile
# ✅ Copia dependencias primero (cambian menos)
COPY pom.xml .
RUN ./mvnw dependency:go-offline

# ✅ Copia código después (cambia más)
COPY src src
```

### 4. No Ejecutes como Root

```dockerfile
# ✅ Crea y usa usuario no privilegiado
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser
```

### 5. Usa Variables de Entorno

```dockerfile
# ✅ Facilita configuración
ENV SPRING_PROFILES_ACTIVE=production
ENV DATABASE_URL=jdbc:postgresql://db:5432/inovatech
```

### 6. Añade Healthcheck

```dockerfile
HEALTHCHECK --interval=30s --timeout=3s \
  CMD curl -f http://localhost:5000/actuator/health || exit 1
```

### 7. Usa Multi-Stage Builds

Siempre que sea posible, separa build de runtime para imágenes más pequeñas.

---

## Optimización de Imágenes

### Comparación de Tamaños

```bash
# Imagen con JDK completo
FROM eclipse-temurin:21-jdk
# Tamaño: ~400MB

# Imagen con JRE
FROM eclipse-temurin:21-jre
# Tamaño: ~200MB

# Imagen Alpine con JRE
FROM eclipse-temurin:21-jre-alpine
# Tamaño: ~180MB
```

### Técnicas de Optimización

1. **Usa Alpine Linux** cuando sea posible
2. **Multi-stage builds** para eliminar herramientas de build
3. **Limpia cache** de gestores de paquetes
4. **Elimina archivos temporales**
5. **Usa .dockerignore**

---

## Comandos Esenciales

### Build

```bash
# Build básico
docker build -t nombre:tag .

# Build sin usar cache
docker build --no-cache -t nombre:tag .

# Build con archivo diferente
docker build -f Dockerfile.dev -t nombre:dev .

# Build con contexto remoto
docker build -t nombre:tag https://github.com/user/repo.git#branch
```

### Gestión de Imágenes

```bash
# Listar imágenes
docker images
docker image ls

# Inspeccionar imagen
docker inspect nombre:tag

# Ver historial de capas
docker history nombre:tag

# Eliminar imagen
docker rmi nombre:tag

# Eliminar imágenes no utilizadas
docker image prune

# Eliminar todas las imágenes no usadas
docker image prune -a
```

### Tagging y Push

```bash
# Tag para registry
docker tag inovatech-backend:1.0 registry.com/inovatech-backend:1.0

# Push para registry
docker push registry.com/inovatech-backend:1.0

# Pull de registry
docker pull registry.com/inovatech-backend:1.0
```

### Ejecutar Containers

```bash
# Run básico
docker run nombre:tag

# Run en background (-d)
docker run -d --name mi-container nombre:tag

# Run con port mapping
docker run -p 8080:5000 nombre:tag

# Run con variables de entorno
docker run -e ENV_VAR=value nombre:tag

# Run con volumen
docker run -v /host/path:/container/path nombre:tag

# Run con reinicio automático
docker run --restart unless-stopped nombre:tag
```

---

## Ejercicios Prácticos

### Ejercicio 1: Crear Primera Imagen

1. Crea un `Dockerfile` básico en la carpeta `APP`
2. Construye la imagen: `docker build -t inovatech:v1 .`
3. Ejecuta el container: `docker run -p 5000:5000 inovatech:v1`
4. Prueba accediendo: `http://localhost:5000/swagger-ui.html`

### Ejercicio 2: Multi-Stage Build

1. Crea un `Dockerfile.multistage` con dos etapas
2. Construye: `docker build -f Dockerfile.multistage -t inovatech:v2 .`
3. Compara los tamaños:
   ```bash
   docker images | grep inovatech
   ```

### Ejercicio 3: Optimización

1. Añade `.dockerignore` para excluir archivos innecesarios
2. Usa imagen Alpine
3. Añade healthcheck
4. Crea usuario no-root
5. Compara el tamaño final

### Ejercicio 4: Build con Argumentos

1. Parametriza la versión de Java en el Dockerfile
2. Construye imágenes con Java 17 y 21
3. Compara rendimiento y tamaño

### Ejercicio 5: Docker Compose

1. Crea un `docker-compose.yml` que levante:
   - Backend (InovaTech)
   - Base de datos PostgreSQL
   - Frontend (si disponible)

---

## Troubleshooting

### Problema: Build muy lento

**Solución**: Usa cache de capas eficientemente
```dockerfile
# Copia solo pom.xml primero
COPY pom.xml .
RUN ./mvnw dependency:go-offline

# Luego copia el código
COPY src src
```

### Problema: Imagen muy grande

**Solución**: Usa multi-stage build y Alpine
```dockerfile
FROM eclipse-temurin:21-jre-alpine AS runtime
# Solo la JRE, no el JDK completo
```

### Problema: Permisos denegados

**Solución**: Ajusta permisos del Maven wrapper
```dockerfile
RUN chmod +x ./mvnw
```

### Problema: El container no inicia

**Solución**: Verifica logs
```bash
docker logs container-name
```

---

## Recursos Adicionales

- 📚 [Documentación Oficial Docker](https://docs.docker.com/)
- 📚 [Dockerfile Best Practices](https://docs.docker.com/develop/develop-images/dockerfile_best-practices/)
- 📚 [Docker Hub](https://hub.docker.com/)
- 📚 [Play with Docker](https://labs.play-with-docker.com/)

---

## Próximos Pasos

1. ✅ Aprender sobre **Docker Compose** para orquestar múltiples containers
2. ✅ Estudiar **Docker Networks** para comunicación entre containers
3. ✅ Entender **Docker Volumes** para persistencia de datos
4. ✅ Explorar **Docker Swarm** o **Kubernetes** para orquestación en producción
5. ✅ Implementar **CI/CD** con Docker

---

**Creado por**: Equipo InovaTech  
**Fecha**: Noviembre 2025  
**Versión**: 1.0
