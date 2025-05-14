import { FastifyReply, FastifyRequest } from "fastify";
import { AddPolicyPayload, ClientIdParams, GenerationOfPdfFilePayload, PdfFileName, PolicyIdParams } from "../schemas/policySchema";

export const addPolicy = async (req: FastifyRequest<{ Body: AddPolicyPayload }>, reply: FastifyReply) => {
    const result = await req.server.policyService.addPolicy(req.body, req.cookies['policyUUID']);

    return reply.clearCookie("policyUUID").status(201).send(result);
}

export const getPolicy = async (req: FastifyRequest<{ Params: PolicyIdParams }>, reply: FastifyReply) => {
    const result = await req.server.policyService.getPolicy(req.params);

    return result;
}

export const getAllPolicies = async (req: FastifyRequest<{ Querystring: ClientIdParams }>, reply: FastifyReply) => {
    const result = await req.server.policyService.getAllPolicies(req.query);

    return result;
}

export const getFile = async (req: FastifyRequest<{ Params: PdfFileName }>, reply: FastifyReply) => {
    const result = await req.server.policyService.getFile(req.params);

    return reply.headers({
        "content-type": "application/pdf",
        "content-disposition": `attachment; filename=${req.params.fileName}`
    }).send(result);
}

export const sendFile = async (req: FastifyRequest<{ Body: GenerationOfPdfFilePayload }>, reply: FastifyReply) => {
    const fioOfEmployeer = req.user.lastName + " " + req.user.firstName + " " + req.user.surname;
    const result = await req.server.policyService.sendPolicyToClient(req.body, fioOfEmployeer);
   
    return await reply.setCookie("policyUUID", result.uuid, {
        secure: false,
        path: "/",
        httpOnly: true,
        expires: new Date(Date.now() + 1000 * 60 * 30)
    }).headers({
        "content-type": "application/pdf",
        "content-disposition": `attachment; filename=${"policy.pdf"}`
    }).send(result.file);
}
