FROM maven:3.9.9-eclipse-temurin-21 AS build
WORKDIR /workspace
COPY .mvn .mvn
COPY mvnw pom.xml ./
COPY src src
RUN chmod +x mvnw && ./mvnw -B -DskipTests package

FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=build /workspace/target/backend-0.0.1-SNAPSHOT.jar /app/app.jar
ENV DATA_DIR=/data
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app/app.jar"]