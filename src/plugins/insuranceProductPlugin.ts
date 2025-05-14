import { FastifyInstance } from "fastify";
import fastifyPlugin from "fastify-plugin";
import InsuranceProductRepository from "../repositories/insuranceProductRepository";
import InsuranceProductService from "../services/insuranceProductService";

const insuranceProductPlugin = fastifyPlugin(async function(fastify: FastifyInstance) {
    const insuranceProductRepository = new InsuranceProductRepository(fastify.prisma);
    const insuranceProductService = new InsuranceProductService(insuranceProductRepository);

    fastify.decorate("insuranceProductService", insuranceProductService);
}, {
    name: "insuranceProductServicePlugin",
    dependencies: [ "prismaPlugin" ]
});

export default insuranceProductPlugin;