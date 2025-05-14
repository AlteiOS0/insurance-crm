import { FastifyInstance } from "fastify";
import { login, logout, signUp, updateTokens } from "../controllers/loginController";
import { accessTokenResponse, addEmployeePayload, employeeResponse, loginPayload } from "../schemas/employeeSchema";
import { badRequestResponseSchema, conflictResponseSchema, internalServerErrorSchema, unauthorizedResponseSchema } from "../schemas/share/responseSchemas";

const signupSchema = {
    schema: {
        body: addEmployeePayload,
        tags: [ "Auth" ],
        response: {
            200: employeeResponse,
            409: conflictResponseSchema,
            500: internalServerErrorSchema
        }
    }
};

const loginSchema = {
    schema: {
        body: loginPayload,
        tags: [ "Auth" ],
        response: {
            200: accessTokenResponse,
            400: badRequestResponseSchema,
            401: unauthorizedResponseSchema,
            409: conflictResponseSchema,
            500: internalServerErrorSchema
        }
    }
};

const refreshSchema = {
    schema: {
        tags: [ "Auth" ],
        response: {
            200: accessTokenResponse,
            400: badRequestResponseSchema,
            401: unauthorizedResponseSchema,
            409: conflictResponseSchema,
            500: internalServerErrorSchema
        }
    }
};

const logoutSchema = {
    schema: {
        tags: [ "Auth" ],
        response: {
            200: {
                type: "string",
                value: "Ok"
            },
            401: unauthorizedResponseSchema
        }
    }
}

const loginRoutes = async (fastify: FastifyInstance) => {
    fastify.post("/auth/login", loginSchema, login);
    fastify.post("/auth/signup", signupSchema, signUp);
    fastify.get("/auth/refresh", refreshSchema, updateTokens);
    fastify.post("/auth/logout", logoutSchema, logout);
};

export default loginRoutes;