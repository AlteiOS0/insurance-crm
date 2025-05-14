import createHttpError from "http-errors";
import insuranceProductRepository from "../repositories/insuranceProductRepository";
import { validateAddProductBody, validateProductId, validateUpdateProductBody } from "../schemas/insuranceProductValidator";
import { CreateInsuranceProduct, ProductId, UpdateInsuranceProduct } from "../schemas/insuranceProductSchema";

export default class InsuranceProductService {
    constructor(private readonly repository: insuranceProductRepository) {}

    async addProduct(body: CreateInsuranceProduct) {
        const valid = validateAddProductBody(body);
        if(!valid)
            throw new Error(JSON.stringify(validateAddProductBody.errors))

        return await this.repository.addProduct(body);
    }

    async updateProduct(body: UpdateInsuranceProduct, params: ProductId) {
        const validBody = validateUpdateProductBody(body);
        const validParams = validateProductId(params);
        if(!validParams) 
            throw new createHttpError.BadRequest(JSON.stringify(validateProductId.errors));
        if(!validBody)
            throw new createHttpError.BadRequest(JSON.stringify(validateUpdateProductBody.errors));

        return await this.repository.updateProduct(body, Number(params.id));
    }

    async getAllProducts() {
        return await this.repository.getAllProducts();
    }

    async getProduct(params: ProductId) {
        const valid = validateProductId(params);
        if(!valid) 
            throw new createHttpError.BadRequest(JSON.stringify(validateProductId.errors));

        return await this.repository.getProduct(Number(params.id));
    }

    async deleteProduct(params: ProductId) {
        const valid = validateProductId(params);
        if(!valid)
            throw new createHttpError.BadRequest(JSON.stringify(validateProductId.errors));

        return await this.repository.deleteProduct(Number(params.id));
    }
}