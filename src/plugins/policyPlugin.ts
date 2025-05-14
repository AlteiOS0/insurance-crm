import { FastifyInstance } from "fastify";
import fastifyPlugin from "fastify-plugin";
import PolicyRepository from "../repositories/policyRepository";
import PolicyNumberReservedRepository from "../repositories/policyNumberReservedRepository";
import PolicyService from "../services/policyService";

const policyPlugin = fastifyPlugin(async function(fastify: FastifyInstance) {
    const policyRepository = new PolicyRepository(fastify.prisma);
    const policyNumberReservedRepository = new PolicyNumberReservedRepository(fastify.prisma);
    const policyService = new PolicyService(policyRepository, policyNumberReservedRepository);

    fastify.decorate("policyService", policyService);
}, {
    name: "policyServicePlugin",
    dependencies: [ "prismaPlugin" ]
});

export default policyPlugin;