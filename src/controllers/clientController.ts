import { FastifyReply, FastifyRequest } from "fastify";
import { ClientId, ClientPassport, CreateClientBody, UpdateClientBody } from "../schemas/clientSchema";

export const createClient = async (req: FastifyRequest<{ Body: CreateClientBody }>, reply: FastifyReply) => {
    const result = await req.server.clientService.createClient(req.body);

    return reply.status(201).send(result);
}

export const updateClient = async (req: FastifyRequest<{ Body: UpdateClientBody, Params: ClientId }>, reply: FastifyReply) => {
    const result = await req.server.clientService.updateClient(req.body, req.params);

    return result;
}

export const getClientById = async (req: FastifyRequest<{ Params: ClientId }>, reply: FastifyReply) => {
    const result = await req.server.clientService.getClientById(req.params);

    return result;
}

export const getClientByPassport = async (req: FastifyRequest<{ Querystring: ClientPassport }>, reply: FastifyReply) => {
    const result = await req.server.clientService.getClientByPassport(req.query);

    return result;
}

export const deleteClientById = async (req: FastifyRequest<{ Params: ClientId }>, reply: FastifyReply) => {
    const result = await req.server.clientService.deleteClientById(req.params);

    return reply.status(202).send(result);
}

export const getAllClients = async (req: FastifyRequest, reply: FastifyReply) => {
    const result = await req.server.clientService.getAllClients();

    return result;
}