# Stage 1: Build
FROM gradle:7.2-jdk17 AS build

WORKDIR /home/gradle/src

# Copy Gradle wrapper & build files
COPY build.gradle.kts .
COPY gradle gradle
COPY settings.gradle.kts .

# Copy source code
COPY src ./src

# Build the JAR
RUN gradle bootJar --no-daemon

# Stage 2: Run
FROM eclipse-temurin:17-jre-ubi9-minimal

WORKDIR /app

EXPOSE 8080

COPY --from=build /home/gradle/src/build/libs/*.jar authservice.jar

CMD ["java", "-jar", "authservice.jar"]