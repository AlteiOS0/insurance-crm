import { FastifyInstance } from "fastify";
import fastifyPlugin from "fastify-plugin";
import EmployeeRepository from "../repositories/employeeRepository";
import LoginService from "../services/loginService";

const loginPlugin = fastifyPlugin(async function(fastify: FastifyInstance) {
    const employeeRepository = new EmployeeRepository(fastify.prisma);
    const loginService = new LoginService(employeeRepository);

    fastify.decorate("loginService", loginService);
}, {
    name: "loginServicePlugin",
    dependencies: [ "prismaPlugin" ]
});

export default loginPlugin;