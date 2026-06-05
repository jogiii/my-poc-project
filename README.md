# my-poc-project

A proof-of-concept project combining a **Spring Boot 3.5 / Java 21** REST API with **AWS CDK (TypeScript)** infrastructure-as-code. Designed to validate **Snyk** vulnerability scanning across both `build.gradle` (Java) and `package.json` (Node.js) dependency trees.

---

## Project Structure

```
my-poc-project/
├── src/                                      # Spring Boot application
│   ├── main/java/com/example/mypoc/
│   │   ├── MyPocApplication.java
│   │   ├── config/
│   │   │   └── SecurityConfig.java
│   │   ├── controller/
│   │   │   └── HelloController.java
│   │   ├── service/
│   │   │   └── HelloService.java
│   │   └── model/
│   │       └── HelloResponse.java
│   └── main/resources/
│       └── application.yml
├── build.gradle                              # Gradle build (scanned by Snyk)
├── settings.gradle
├── gradle/wrapper/
│   └── gradle-wrapper.properties
└── deployment/                               # AWS CDK Infrastructure
    ├── bin/
    │   └── deployment.ts
    ├── lib/
    │   ├── my-poc-stack.ts
    │   └── constructs/
    │       └── spring-boot-service.ts
    ├── test/
    │   └── my-poc-stack.test.ts
    ├── package.json                          # Node.js deps (scanned by Snyk)
    ├── tsconfig.json
    └── cdk.json
```

---

## Prerequisites

| Tool | Version |
|------|---------|
| Java | 21+ |
| Gradle | 8.8+ |
| Node.js | 18+ |
| AWS CDK CLI | `npm install -g aws-cdk` |
| AWS CLI | configured with credentials |
| Snyk CLI | `npm install -g snyk` |

---

## Spring Boot Application

### Run locally
```bash
./gradlew bootRun
```

### Run tests
```bash
./gradlew test
```

### Build JAR
```bash
./gradlew build
```

### API Endpoints

| Method | URL | Description |
|--------|-----|-------------|
| GET | `/api/v1/hello` | Returns hello message |
| GET | `/api/v1/hello/{name}` | Personalized hello |
| GET | `/actuator/health` | Health check |
| GET | `/actuator/metrics` | Metrics |
| GET | `/swagger-ui.html` | Swagger UI |
| GET | `/h2-console` | H2 DB console |

---

## AWS CDK Deployment

```bash
cd deployment
npm install
npm run build

# Bootstrap AWS account (first time only)
cdk bootstrap

# Deploy to dev
npm run deploy:dev

# Deploy to prod
npm run deploy:prod

# Diff changes
npm run diff

# Destroy stack
npm run destroy
```

---

## Snyk Security Scanning

### Scan Java/Gradle dependencies
```bash
snyk test --file=build.gradle --package-manager=gradle
```

### Scan Node.js/CDK dependencies
```bash
snyk test --file=deployment/package.json
```

### Scan all (auto-detect)
```bash
snyk test --all-projects
```

### Monitor (upload to Snyk dashboard)
```bash
snyk monitor --all-projects
```

### Snyk IaC scan (CloudFormation templates)
```bash
cd deployment && cdk synth
snyk iac test deployment/cdk.out/
```

---

## Tech Stack

- **Backend**: Spring Boot 3.5.0, Java 21, Spring Security, Spring Data JPA
- **Build**: Gradle 8.8, Spring Boot Gradle Plugin
- **Infrastructure**: AWS CDK v2 (TypeScript), ECS Fargate, ALB, VPC, S3
- **Security Scanning**: Snyk (SCA + IaC)

