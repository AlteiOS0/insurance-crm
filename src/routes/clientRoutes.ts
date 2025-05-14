import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { createClient, deleteClientById, getAllClients, getClientById, getClientByPassport, updateClient } from "../controllers/clientController";
import {  allClientsResponse, ClientId, clientResponseSchema, createClientBodySchema, getClientByIdSchema, getClientByPassportSchema, updateClientBodySchema } from "../schemas/clientSchema";
import { badRequestResponseSchema, conflictResponseSchema, notFoundResponseSchema } from "../schemas/share/responseSchemas";

const createClientSchema = {
    schema: {
        body: createClientBodySchema,
        tags: [ "Client" ],
        response: {
            201: clientResponseSchema,
            400: badRequestResponseSchema,
            404: notFoundResponseSchema,
            409: conflictResponseSchema
        }
    }
}

const updateClientSchema = {
    schema: {
        body: updateClientBodySchema,
        tags: [ "Client" ],
        response: {
            200: clientResponseSchema,
            400: badRequestResponseSchema,
            404: notFoundResponseSchema,
            409: conflictResponseSchema
        }
    }
}

const getClientSchemaId = {
    schema: {
        params: getClientByIdSchema,
        tags: [ "Client" ],
        response: {
            200: clientResponseSchema,
            400: badRequestResponseSchema,
            404: notFoundResponseSchema
        }
    }
}

const getClientSchemaPassport = {
    schema: {
        querystring: getClientByPassportSchema,
        tags: [ "Client" ],
        response: {
            200: clientResponseSchema,
            400: badRequestResponseSchema,
            404: notFoundResponseSchema
        }
    }
}

const deleteClientSchema = {
    schema: {
        params: getClientByIdSchema,
        tags: [ "Client" ],
        response: {
            202: {
                type: "string",
                value: "Accepted"
            }
        }
    },
}

const getAllClientsSchema = {
    schema: {
        tags: [ "Client" ],
        response: {
            200: allClientsResponse
        }
    }
}

const clientRouter = async (fastify: FastifyInstance) => {
    fastify.get("/clients/:id", getClientSchemaId, getClientById);
    fastify.get("/clients/passport", getClientSchemaPassport, getClientByPassport);
    fastify.get("/clients", getAllClientsSchema, getAllClients);
    fastify.post("/clients", createClientSchema, createClient);
    fastify.put("/clients/:id", updateClientSchema, updateClient);
    fastify.delete("/clients/:id", deleteClientSchema, deleteClientById)
}


export default clientRouter;