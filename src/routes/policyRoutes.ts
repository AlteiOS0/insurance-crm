import { FastifyInstance } from "fastify";
import { addPolicy, getAllPolicies, getFile, getPolicy, sendFile } from "../controllers/policyController";
import { addPolicyPayload, allPolicies, clientIdParams, fileRaw, generationOfPdfFilePayload, pdfFileName, policyIdParams, policyResponse, sendFileResponse } from "../schemas/policySchema";
import { badRequestResponseSchema, internalServerErrorSchema, notFoundResponseSchema } from "../schemas/share/responseSchemas";

const getPolicySchema = {
    schema: {
        params: policyIdParams,
        tags: [ "Policy" ],
        response: {
            200: policyResponse,
            400: badRequestResponseSchema,
            404: notFoundResponseSchema,
        }
    }
};

const getAllPoliciesSchema = {
    schema: {
        querystring: clientIdParams,
        tags: [ "Policy" ],
        response: {
            200: allPolicies,
            400: badRequestResponseSchema,
            404: notFoundResponseSchema
        }
    }
};

const getFileSchema = {
    schema: {
        params: pdfFileName,
        tags: [ "Policy" ],
        response: {
            200: fileRaw,
            400: badRequestResponseSchema,
            404: notFoundResponseSchema,
            500: internalServerErrorSchema
        }
    }
};

const sendFileSchema = {
    schema: {
        body: generationOfPdfFilePayload,
        tags: [ "Policy" ],
        response: {
            200: sendFileResponse,
            400: badRequestResponseSchema,
            404: notFoundResponseSchema,
            500: internalServerErrorSchema
        }
    }
}

const addPolicySchema = {
    schema: {
        consumes: ["multipart/form-data"],
        body: addPolicyPayload,
        tags: [ "Policy" ],
        response: {
            200: policyResponse,
            400: badRequestResponseSchema,
            404: notFoundResponseSchema,
            500: internalServerErrorSchema
        }
    }
}

const policyRouter = async (fastify: FastifyInstance) => {
    fastify.get("/policies/:id", getPolicySchema, getPolicy);
    fastify.get("/policies", getAllPoliciesSchema, getAllPolicies);
    fastify.get("/policies/file/:fileName", getFileSchema, getFile);
    fastify.post("/policies/file", sendFileSchema, sendFile);
    fastify.post("/policies", addPolicySchema, addPolicy);
};

export default policyRouter;