import { FastifyReply, FastifyRequest } from "fastify"
import { CreateInsuranceProduct, ProductId, UpdateInsuranceProduct } from "../schemas/insuranceProductSchema";

export const addProduct = async (req: FastifyRequest<{ Body: CreateInsuranceProduct }>, reply: FastifyReply) => {
    const result = await req.server.insuranceProductService.addProduct(req.body);

    return reply.status(201).send(result);
}

export const updateProduct = async (req: FastifyRequest<{ Body: UpdateInsuranceProduct, Params: ProductId }>, reply: FastifyReply) => {
    const result = await req.server.insuranceProductService.updateProduct(req.body, req.params);

    return result;
}

export const getAllProducts = async (req: FastifyRequest, reply: FastifyReply) => {
    const result = await req.server.insuranceProductService.getAllProducts();

    return result;
}

export const getProduct = async (req: FastifyRequest<{ Params: ProductId }>, reply: FastifyReply) => {
    const result = await req.server.insuranceProductService.getProduct(req.params);

    return result;
}

export const deleteProduct = async (req: FastifyRequest<{ Params: ProductId }>, reply: FastifyReply) => {
    const result = await req.server.insuranceProductService.deleteProduct(req.params);

    return reply.status(202).send("Accepted");
}