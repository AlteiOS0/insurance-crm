import { PrismaClient } from "@prisma/client";
import ClientService from "../services/clientService";
import InsuranceProductService from "../services/insuranceProductService";
import PolicyService from "../services/policyService";
import { JWT } from "@fastify/jwt";
import LoginService from "../services/loginService";
import SessionService from "../services/sessionService";

declare module "fastify" {
    interface FastifyInstance {
        prisma: PrismaClient,
        clientService: ClientService,
        insuranceProductService: InsuranceProductService,
        policyService: PolicyService,
        loginService: LoginService,
        sessionService: SessionService,
    };

    interface FastifyRequest {
        jwt: JWT
    };
}

declare module "@fastify/jwt" {
    interface FastifyJWT {
        user: { id: number, firstName: string, surname: string | null, lastName: string, email: string }
    }
}