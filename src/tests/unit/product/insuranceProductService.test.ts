import InsuranceProductRepository from "../../../repositories/insuranceProductRepository"
import InsuranceProductService from "../../../services/insuranceProductService";
import { prismaMock } from "../singleton"
import { ErrorObject } from "ajv";
import { InsuranceProductUnitTest } from "./preparedData";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import ajvError from "../utils/ajvError";
import { CreateInsuranceProduct, UpdateInsuranceProduct } from "../../../schemas/insuranceProductSchema";

const insuranceProductRepository = new InsuranceProductRepository(prismaMock);
const insuranceProductService = new InsuranceProductService(insuranceProductRepository);

describe("create new insurance product", () => {
    test("should create new insurance product", async () => {
        prismaMock.insuranceProduct.create.mockResolvedValueOnce(InsuranceProductUnitTest.receiveInsuranceProductAfterCreate);

        const result = await insuranceProductService.addProduct(InsuranceProductUnitTest.insuranceProductBody);

        expect(result).toEqual(InsuranceProductUnitTest.receiveInsuranceProductAfterCreate);
    });

    test("should be error for empty insurance product type", async () => {
        const data: CreateInsuranceProduct = JSON.parse(JSON.stringify(InsuranceProductUnitTest.insuranceProductBody));
        data.type = "";
        prismaMock.insuranceProduct.create.mockResolvedValueOnce(null as any);

        try {
            await insuranceProductService.addProduct(data);
        } catch (e) {
            expect(ajvError(e)).toMatch("must be equal to one of the allowed values");
        }
    });

    test("should be error for undefined field", async () => {
        const data: CreateInsuranceProduct = JSON.parse(JSON.stringify(InsuranceProductUnitTest.insuranceProductBody));
        (data.minInsurancePremium as number | undefined) = undefined
        prismaMock.insuranceProduct.create.mockResolvedValueOnce(null as any);

        try {
            await insuranceProductService.addProduct(data);
        } catch (e) {
            expect(ajvError(e)).toMatch("must have required property 'minInsurancePremium'");
        }
    });
});

describe("update insurance product", () => {
    test("should update insurance product", async () => {
        const id = { id: 1 };
        prismaMock.insuranceProduct.update.mockResolvedValueOnce(InsuranceProductUnitTest.receiveInsuranceProductAfterUpdate);

        const result = await insuranceProductService.updateProduct(InsuranceProductUnitTest.insuranceProductUpdate, id);

        expect(result).toEqual(InsuranceProductUnitTest.receiveInsuranceProductAfterUpdate);
    });

    test("should be error for empty insurance product type", async () => {
        const id = { id: 1 };
        const data: UpdateInsuranceProduct = JSON.parse(JSON.stringify(InsuranceProductUnitTest.insuranceProductUpdate));
        data.type = "";
        prismaMock.insuranceProduct.update.mockResolvedValueOnce(null as any);

        try {
            await insuranceProductService.updateProduct(data, id);
        } catch (e) {
            expect(ajvError(e)).toMatch("must be equal to one of the allowed values")
        }
    });

    test("should be error for insurance product not found", async () => {
        const id = { id: 2 };
        prismaMock.insuranceProduct.update.mockImplementationOnce(() => {
            throw new PrismaClientKnownRequestError("Record not found", {
                code: "P2025",
                clientVersion: "6.7.0",
                batchRequestIdx: 1
            })
        });

        try {
            await insuranceProductService.updateProduct(InsuranceProductUnitTest.insuranceProductUpdate, id);
        } catch (e) {
            const error = (e as Error).message;
            expect(error).toMatch("Record not found");
        }
    });

    test("should be error for incorrect id type", async () => {
        const id = { id: 1 };
        (id.id as unknown as string) = "1";

        try {
            await insuranceProductService.updateProduct(InsuranceProductUnitTest.insuranceProductUpdate, id);
        } catch (e) {
            expect(ajvError(e)).toMatch("must be number");
        }
    });
});

describe("get insurance product", () => {
    test("should get insurance product", async () => {
        const id = { id: 1 };
        prismaMock.insuranceProduct.findFirstOrThrow.mockResolvedValueOnce(InsuranceProductUnitTest.receiveInsuranceProductAfterUpdate);

        const result = await insuranceProductService.getProduct(id);

        expect(result).toEqual(InsuranceProductUnitTest.receiveInsuranceProductAfterUpdate);
    });

    test("error because insurance product not found", async () => {
        const id = { id: 2 };
        prismaMock.insuranceProduct.findFirstOrThrow.mockImplementationOnce(() => {
            throw new PrismaClientKnownRequestError("Record not found", {
                code: "P2025",
                batchRequestIdx: 1,
                clientVersion: "6.7.0"
            });
        });

        try {
            await insuranceProductService.getProduct(id);
        } catch (e) {
            const message = (e as Error).message;
            expect(message).toMatch("Record not found");
        }
    });

    test("error because incorrect id type", async () => {
        const id = { id: 1 };
        (id.id as unknown as string) = "1";

        try {
            await insuranceProductService.getProduct(id);
        } catch (e) {
            expect((JSON.parse((e as ErrorObject).message!)[0] as ErrorObject).message).toMatch("must be number");
        }
    });
})