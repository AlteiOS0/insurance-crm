import { FastifyInstance } from "fastify";
import fastifyPlugin from "fastify-plugin";
import ClientRepository from "../repositories/clientRepository";
import ClientService from "../services/clientService";

const clientPlugin = fastifyPlugin(async function(fastify: FastifyInstance) {
    const clientRepository = new ClientRepository(fastify.prisma);
    const clientService = new ClientService(clientRepository);

    fastify.decorate("clientService", clientService);
}, {
    name: "clientServicePlugin",
    dependencies: [ "prismaPlugin" ]
});

export default clientPlugin;