FROM maven:3.9.9-eclipse-temurin-21 AS build
WORKDIR /workspace

COPY .mvn/ .mvn/
COPY mvnw pom.xml ./
RUN chmod +x mvnw
RUN ./mvnw -q dependency:go-offline

COPY src ./src
RUN ./mvnw -q -DskipTests package

FROM eclipse-temurin:21-jre-jammy
WORKDIR /app

COPY --from=build /workspace/target/*.jar /app/app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "/app/app.jar"]
