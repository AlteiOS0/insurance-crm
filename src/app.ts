import fastifyAutoload from "@fastify/autoload";
import fastify, { FastifyReply, FastifyRequest } from "fastify";
import clientRouter from "./routes/clientRoutes";
import { join } from "path";
import { Static, TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import insuranceProductRoutes from "./routes/insuranceProductRoutes";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { notFoundResponseSchema } from "./schemas/share/responseSchemas";
import policyRouter from "./routes/policyRoutes";
import fastifyJwt from "@fastify/jwt";
import fastifyCookie from "@fastify/cookie";
import fastifyEnv from "@fastify/env";
import loginRoutes from "./routes/loginRoutes";
import { existsSync } from "fs";
import { mkdir } from "fs/promises";
import fastifyCors from "@fastify/cors";

async function buildFastify() {
    const path = join(__dirname, "./logs/server.log");
    if(!existsSync("./assets/policies")) {
        await mkdir("./assets/policies");
    }    
    
    if(!existsSync(join(__dirname, "./logs"))) {
        await mkdir(join(__dirname, "./logs"));
    }
    
    const app = fastify({ logger: {
        file: path,
        level: "info",
        customLevels: {
            info: 30,
            trace: 35,
            debug: 40,
            warn: 45,
            error: 60,
            fatal: 100
        },
        useOnlyCustomLevels: false
    } }).withTypeProvider<TypeBoxTypeProvider>();

    app.register(fastifyEnv, {
        confKey: "config",
        data: process.env,
        dotenv: true,
        schema: {
            type: "object",
            required: [ "SECRET_KEY", "COOKIE_SECRET_KEY", "DATABASE_URL" ],
            properties: {
                SECRET_KEY: {
                    type: "string",
                },
                COOKIE_SECRET_KEY: {
                    type: "string",
                },
                DATABASE_URL: {
                    type: "string"
                }
            }
        }
    });
    await app.after();

    app.register(fastifyJwt, {
        secret: process.env.SECRET_KEY!,
        cookie: {
            cookieName: "accessToken",
            signed: false
        },
        sign: {
            expiresIn: "15m"
        }
    });
    
    app.register(fastifyCookie);

    app.register(fastifyCors, {
        origin: "*",
        methods: [ "GET", "POST", "PUT", "DELETE" ]
    });

    app.addHook("preHandler", (req: FastifyRequest, reply: FastifyReply, next) => {
        req.jwt = app.jwt;
        next();
    });

    app.addHook("onRequest", async (req: FastifyRequest, reply: FastifyReply) => {
        if(process.env.NODE_ENV == 'test') {
            req.user = {
                id: 1,
                firstName: "Андрей",
                surname: "Андреевич",
                lastName: "Андреев",
                email: "andrew@mail.ru"
            };
            return;
        }

        if (req.url.split('/')[1] != "auth" && req.url.split('/')[1] != 'documentation') {
            try {
                await req.jwtVerify({ onlyCookie: true });
            } catch (e) {
                throw e
            }
        }
    });
    const port = process.env.PORT || 3000;

    app.register(import('@fastify/swagger'), {
        openapi: {
            openapi: '3.0.0',
            info: {
                title: 'Test swagger',
                description: 'Testing the Fastify swagger API',
                version: '0.1.0'
            },
            servers: [
                {
                    url: `http://localhost:${port}`,
                    description: 'Development server'
                }
            ],
            tags: [
                { name: 'Client', description: 'Client related end-points' },
                { name: 'InsuranceProduct', description: 'Insurance product related end-points' },
                { name: 'Policy', description: "Policy related end-point" },
                { name: 'Auth', description: "Auth related end-point" }
            ],
            components: {
                securitySchemes: {
                    apiKey: {
                        type: 'apiKey',
                        name: 'apiKey',
                        in: 'header'
                    }
                }
            },
            externalDocs: {
                url: 'https://swagger.io',
                description: 'Find more info here'
            }
        }
    })

    app.register(import('@fastify/swagger-ui'), {
        routePrefix: '/documentation',
        uiConfig: {
            docExpansion: 'full',
            deepLinking: false
        },
        uiHooks: {
            onRequest: function (request, reply, next) { next() },
            preHandler: function (request, reply, next) { next() }
        },
        staticCSP: true,
        transformStaticCSP: (header) => header,
        transformSpecification: (swaggerObject, request, reply) => { return swaggerObject },
        transformSpecificationClone: true
    });

    app.register(fastifyAutoload, {
        dir: join(__dirname, "plugins")
    });

    app.register(clientRouter);
    app.register(insuranceProductRoutes);
    app.register(policyRouter);
    app.register(loginRoutes);

    app.setErrorHandler((error, req: FastifyRequest, reply: FastifyReply) => {
        if (error instanceof PrismaClientKnownRequestError) {
            if (error.code == "P2025") {
                reply.status(404).send({ error: 'Not found', statusCode: 404, message: "Record not found" } as Static<typeof notFoundResponseSchema>);
            }
        } else {
            if(error.statusCode! >= 500) {
                req.log.error(error);
            }
            reply.send(error);
        }
    });

    await app.ready();

    return app;
}

export default buildFastify;