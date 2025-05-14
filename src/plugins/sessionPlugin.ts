import { FastifyInstance } from "fastify";
import fastifyPlugin from "fastify-plugin";
import SessionRepository from "../repositories/sessionRepository";
import SessionService from "../services/sessionService";

const sessionPlugin = fastifyPlugin(async function(fastify: FastifyInstance) {
    const sessionRepository = new SessionRepository(fastify.prisma);
    const sessionService = new SessionService(sessionRepository);

    fastify.decorate("sessionService", sessionService);
}, {
    name: "sessionServicePlugin",
    dependencies: [ "prismaPlugin", "loginServicePlugin" ]
});

export default sessionPlugin;