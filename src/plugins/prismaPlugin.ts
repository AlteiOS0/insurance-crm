import { FastifyInstance } from "fastify";
import fastifyPlugin from "fastify-plugin";
import prisma from "../prisma/prismaClient";

const prismaPlugin = fastifyPlugin(async function fp(fastify: FastifyInstance) {
    await prisma.$connect();
    fastify.decorate("prisma", prisma);
    fastify.addHook("onClose", async () => {
        await prisma.$disconnect();
    });
}, {
    name: "prismaPlugin"
});

export default prismaPlugin;