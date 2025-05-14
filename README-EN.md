[Russian](README.md)

# insurance-crm
The project is a customer relationship management system for insurance companies.
Implemented on Node.js using `Fastify`, `Prisma ORM`, `PostgreSQL`.

## Starting the project with docker
To start working with the project, you need docker with images `node:latest`, `nginx:latest`, `postgres:latest`.
Nginx acts as a reverse proxy server.

To clone a repository enter the command:
`git clone https://github.com/AlteiOS0/insurance-crm.git`

To build a container, enter the `docker compose build` command

Next, to start containers `docker compose up`

## Start the project without docker

To work with the project directly without docker, as well as work with the project

It is necessary to enter the command for installing dependencies `npm install`

To deploy to the database and generate PrismaClient `npm run prisma:init`

And finally to start the server `npm run dev`

## Project structure
```
insurance
│   .dockerignore
│   .env
│   .gitignore
│   .prod.env
│   .test.env
│   compose.yaml
│   dockerfile
│   jest.config.js
│   jest.setup.js
│   package-lock.json
│   package.json
│   tsconfig.json
│
├───assets
│   ├───fonts
│   │       OpenSans-Bold.ttf
│   │       OpenSans-Regular.ttf
│   │       OpenSans-SemiBold.ttf
│   │
│   └───policies
├───nginx
│       nginx.conf
│
├───prisma
│   │   schema.prisma
│   │   
│   └───migrations
│       │   migration_lock.toml
│       │
│       └───20250513185830_init
│               migration.sql
│
└───src
    │   app.ts
    │   index.ts
    │
    ├───controllers
    │       clientController.ts
    │       insuranceProductController.ts
    │       loginController.ts
    │       policyController.ts
    │
    ├───plugins
    │       clientPlugin.ts
    │       insuranceProductPlugin.ts
    │       loginPlugin.ts
    │       policyPlugin.ts
    │       prismaPlugin.ts
    │       sessionPlugin.ts
    │
    ├───prisma
    │       prismaClient.ts
    │
    ├───repositories
    │       clientRepository.ts
    │       employeeRepository.ts
    │       insuranceProductRepository.ts
    │       policyNumberReservedRepository.ts
    │       policyRepository.ts
    │       sessionRepository.ts
    │
    ├───routes
    │       clientRoutes.ts
    │       insuranceProductRoutes.ts
    │       loginRoutes.ts
    │       policyRoutes.ts
    │
    ├───schemas
    │   │   ajv.ts
    │   │   clientSchema.ts
    │   │   clientValidator.ts
    │   │   employeeSchema.ts
    │   │   employeeValidator.ts
    │   │   insuranceProductSchema.ts
    │   │   insuranceProductValidator.ts
    │   │   policySchema.ts
    │   │   policyValidator.ts
    │   │   sessionSchema.ts
    │   │   sessionValidator.ts
    │   │
    │   ├───share
    │   │       responseSchemas.ts
    │   │
    │   └───utils
    │           partialDeep.ts
    │           typingEnum.ts
    │
    ├───services
    │       clientService.ts
    │       insuranceProductService.ts
    │       loginService.ts
    │       policyService.ts
    │       sessionService.ts
    │       
    ├───tests
    │   ├───integration
    │   │   ├───client
    │   │   │       clientController.test.ts
    │   │   │       preparedData.ts
    │   │   │
    │   │   ├───insuranceProduct
    │   │   │       insuranceProductController.test.ts
    │   │   │       preparedData.ts
    │   │   │
    │   │   └───policy
    │   │       │   policyController.test.ts
    │   │       │
    │   │       └───assets
    │   └───unit
    │       │   prismaClient.ts
    │       │   singleton.ts
    │       │
    │       ├───client
    │       │       clientService.test.ts
    │       │       preparedClientData.ts
    │       │
    │       ├───policy
    │       │       policyService.test.ts
    │       │       preparedData.ts
    │       │
    │       ├───product
    │       │       insuranceProductService.test.ts
    │       │       preparedData.ts
    │       │
    │       └───utils
    │               ajvError.ts
    │
    └───types
            deepPartial.ts
            index.d.ts
            personalData.ts
```
