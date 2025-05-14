import { PrismaClient } from "@prisma/client";
import { CreateInsuranceProduct, InsuranceProductType, UpdateInsuranceProduct } from "../schemas/insuranceProductSchema";

export default class InsuranceProductRepository {
    constructor(private readonly prisma: PrismaClient) {}

    async addProduct(product: CreateInsuranceProduct) {
        return await this.prisma.insuranceProduct.create({
            data: {
                name: product.name,
                description: product.description!,
                type: InsuranceProductType[product.type as keyof typeof InsuranceProductType],
                minInsurancePremium: product.minInsurancePremium,
                maxInsurancePremium: product.maxInsurancePremium,
                minCoverage: product.minCoverage,
                maxCoverage: product.maxCoverage,
                minAge: product.minAge,
                maxAge: product.maxAge,
                minHowYears: product.minHowYears,
                maxHowYears: product.maxHowYears
            }
        });
    }

    async updateProduct(product: UpdateInsuranceProduct, id: number) {
        return await this.prisma.insuranceProduct.update({
            where: {
                id: id
            },
            data: {
                name: product.name,
                description: product.description,
                type: InsuranceProductType[product.type as keyof typeof InsuranceProductType],
                minInsurancePremium: product.minInsurancePremium,
                maxInsurancePremium: product.maxInsurancePremium,
                minCoverage: product.minCoverage,
                maxCoverage: product.maxCoverage,
                minAge: product.minAge,
                maxAge: product.maxAge,
                minHowYears: product.minHowYears,
                maxHowYears: product.maxHowYears
            }
        });
    }

    async getAllProducts() {
        return await this.prisma.insuranceProduct.findMany();
    }

    async getProduct(id: number) {
        return await this.prisma.insuranceProduct.findFirstOrThrow({
            where: {
                id: id
            }
        });
    }

    async deleteProduct(id: number) {
        return await this.prisma.insuranceProduct.delete({
            where: {
                id: id
            }
        })
    }
}