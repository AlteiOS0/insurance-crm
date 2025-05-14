import { FastifyInstance } from "fastify";
import buildFastify from "../../../app";
import { InsuranceProductIntegrationTest } from "./preparedData";
import { CreateInsuranceProduct, ProductId, UpdateInsuranceProduct } from "../../../schemas/insuranceProductSchema";

let fastify: FastifyInstance;
jest.setTimeout(30000);

beforeAll(async () => {
    fastify = await buildFastify();
});

afterAll(async () => {
    await fastify.prisma.$executeRaw`TRUNCATE TABLE insurance_products RESTART IDENTITY CASCADE`;
    await fastify.close();
});

describe("insurance product controller", () => {
    describe("add new a insurance product", () => {
        test("should add new a insurance product", async () => {
            const response = await fastify.inject({
                method: "POST",
                url: "/products",
                body: InsuranceProductIntegrationTest.insuranceProductBody
            });

            expect(response.statusCode).toBe(201);
            expect(JSON.parse(response.payload)).toEqual(InsuranceProductIntegrationTest.ResponseInsuranceProductAfterCreate);
        });
        
        test("error because empty InsuranceProduct field", async () => {
            const body: CreateInsuranceProduct = JSON.parse(JSON.stringify(InsuranceProductIntegrationTest.insuranceProductBody));
            body.type = "";
            const response = await fastify.inject({
                method: "POST",
                url: "/products",
                body: body
            });

            expect(response.statusCode).toBe(400);
            expect(JSON.parse(response.body).message).toMatch("body/type must be equal to one of the allowed values");
        });

        test("error because incorrect InsuranceProduct", async () => {
            const body: CreateInsuranceProduct = JSON.parse(JSON.stringify(InsuranceProductIntegrationTest.insuranceProductBody));
            body.type = "InsuranceProduct123";
            const response = await fastify.inject({
                method: "POST",
                url: "/products",
                body: body
            });

            expect(response.statusCode).toBe(400);
            expect(JSON.parse(response.body).message).toMatch("body/type must be equal to one of the allowed values");
        });

        test("error because incorrect field type", async () => {
            const body: CreateInsuranceProduct = JSON.parse(JSON.stringify(InsuranceProductIntegrationTest.insuranceProductBody));
            (body.minInsurancePremium as unknown as string) = "as3123123";
            const response = await fastify.inject({
                method: "POST",
                url: "/products",
                body: body
            });

            expect(response.statusCode).toBe(400);
            expect(JSON.parse(response.body).message).toMatch("body/minInsurancePremium must be number");
        });

        test("error because undefined of field", async () => {
            const body: CreateInsuranceProduct = JSON.parse(JSON.stringify(InsuranceProductIntegrationTest.insuranceProductBody));
            (body.minHowYears as number | undefined) = undefined;
            const response = await fastify.inject({
                method: "POST",
                url: "/products",
                body: body
            });

            expect(response.statusCode).toBe(400);
            expect(JSON.parse(response.body).message).toMatch("body must have required property 'minHowYears'");
        });
    });

    describe("update insurance product", () => {
        const id: ProductId = { id: 1 };
        test("should update insurance product", async () => {
            const response = await fastify.inject({
                method: "PUT",
                url: `/products/${id.id}`,
                body: InsuranceProductIntegrationTest.insuranceProductUpdate
            });

            expect(response.statusCode).toBe(200);
            expect(JSON.parse(response.payload)).toEqual(InsuranceProductIntegrationTest.responseInsuranceProductAfterUpdate);
        });
        
        test("error because incorrect InsuranceProduct", async () => {
            const body: UpdateInsuranceProduct = JSON.parse(JSON.stringify(InsuranceProductIntegrationTest.insuranceProductUpdate));
            body.type = ""
            const response = await fastify.inject({
                method: "PUT",
                url: `/products/${id.id}`,
                body: body
            });

            expect(response.statusCode).toBe(400);
            expect(JSON.parse(response.body).message).toMatch("body/type must be equal to one of the allowed values");
        });

        test("error because incorrect field type", async () => {
            const body: UpdateInsuranceProduct = JSON.parse(JSON.stringify(InsuranceProductIntegrationTest.insuranceProductUpdate));
            (body.maxInsurancePremium as unknown as string) = "300000-";
            const response = await fastify.inject({
                method: "PUT",
                url: `/products/${id.id}`,
                body: body
            });

            expect(response.statusCode).toBe(400);
            expect(JSON.parse(response.body).message).toMatch("body/maxInsurancePremium must be number");
        });

        test("error because incorrect id type", async () => {
            const param: ProductId = Object.assign(id);
            (param.id as unknown as string) = "1q";
            const response = await fastify.inject({
                method: "PUT",
                url: `/products/${param.id}`,
                body: InsuranceProductIntegrationTest.insuranceProductUpdate
            });

            expect(response.statusCode).toBe(400);
            expect(JSON.parse(response.body).message).toMatch("params/id must be number");
        });

        test("error because record by id does not exist", async () => {
            const param: ProductId = Object.assign(id);
            param.id = 10;

            const response = await fastify.inject({
                method: "PUT",
                url: `/products/${param.id}`,
                body: InsuranceProductIntegrationTest.insuranceProductUpdate
            });
 
            expect(response.statusCode).toBe(404);
            expect(JSON.parse(response.body).message).toMatch("Record not found");
        });
    });

    describe("get insurance product", () => {
        const id: ProductId = { id: 1 };
        test("should get insurance product", async () => {
            const response = await fastify.inject({
                method: "GET",
                url: `/products/${id.id}`
            });

            expect(response.statusCode).toBe(200);
            expect(JSON.parse(response.body)).toEqual(InsuranceProductIntegrationTest.responseInsuranceProductAfterUpdate);
        });

        test("error because record by id does not exist", async () => {
            const param: ProductId = Object.assign(id);
            param.id = 10;
            const response = await fastify.inject({
                method: "GET",
                url: `/products/${param.id}`
            });
            
            expect(response.statusCode).toBe(404);
            expect(JSON.parse(response.body).message).toMatch("Record not found");
        });

        test("error for incorrect id type", async () => {
            const param: ProductId = Object.assign(id);
            (param.id as unknown as string) = "q2";
            const response = await fastify.inject({
                method: "GET",
                url: `/products/${param.id}`
            });
            
            expect(response.statusCode).toBe(400);
            expect(JSON.parse(response.body).message).toMatch("params/id must be number");
        });
    })

    describe("delete insurance product", () => {
        const id: ProductId = { id: 1 };
        test("should delete insurance product", async () => {
            const response = await fastify.inject({
                method: "DELETE",
                url: `/products/${id.id}`
            });

            expect(response.statusCode).toBe(202);
            expect(response.body).toBe("Accepted");
        });

        test("error because record by id does not exist", async () => {
            const response = await fastify.inject({
                method: "DELETE",
                url: `/products/10`
            });

            expect(response.statusCode).toBe(404);
            expect(JSON.parse(response.body).message).toMatch("Record not found");
        });

        test("error because incorrect id type", async () => {
            const param: ProductId = Object.assign(id);
            (param.id as unknown as string) = "1a";
            const response = await fastify.inject({
                method: "DELETE",
                url: `/products/${param.id}`
            });

            expect(response.statusCode).toBe(400);
            expect(JSON.parse(response.body).message).toMatch("params/id must be number");
        });
    })
})