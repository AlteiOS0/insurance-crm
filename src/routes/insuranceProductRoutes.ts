import { FastifyInstance } from "fastify";
import { addProduct, deleteProduct, getAllProducts, getProduct, updateProduct } from "../controllers/insuranceProductController";
import { addInsuranceProductBody, insuranceProductArrayResponse, insuranceProductResponse, productId, updateInsuranceProductBody } from "../schemas/insuranceProductSchema";
import { badRequestResponseSchema, notFoundResponseSchema } from "../schemas/share/responseSchemas";

const addInsuranceProductSchema = {
    schema: {
        body: addInsuranceProductBody,
        tags: [ "InsuranceProduct" ],
        response: {
            201: insuranceProductResponse,
            400: badRequestResponseSchema,
        }
    }
}

const updateInsuranceProductSchema = {
    schema: {
        body: updateInsuranceProductBody,
        params: productId,
        tags: [ "InsuranceProduct" ],
        response: {
            200: insuranceProductResponse,
            400: badRequestResponseSchema,
            404: notFoundResponseSchema
        }
    }
}

const getInsuranceProductSchema = {
    schema: {
        params: productId,
        tags: [ "InsuranceProduct" ],
        response: {
            200: insuranceProductResponse,
            400: badRequestResponseSchema,
            404: notFoundResponseSchema
        }
    }
}

const getAllInsuranceProductSchema = {
    schema: {
        tags: [ "InsuranceProduct" ],
        response: {
            200: insuranceProductArrayResponse
        }
    }
}

const deleteInsuranceProductSchema = {
    schema: {
        params: productId,
        tags: [ "InsuranceProduct" ],
        response: {
            202: {
                type: "string",
                value: "Accepted"
            },
        }
    }
}

const insuranceProductRoutes = async (fastify: FastifyInstance) => {
    fastify.get("/products", getAllInsuranceProductSchema, getAllProducts);
    fastify.get("/products/:id", getInsuranceProductSchema, getProduct);
    fastify.post("/products", addInsuranceProductSchema, addProduct);
    fastify.put("/products/:id", updateInsuranceProductSchema, updateProduct);
    fastify.delete("/products/:id", deleteInsuranceProductSchema, deleteProduct)
}

export default insuranceProductRoutes;