import { FastifyInstance } from "fastify";
import buildFastify from "../../../app";
import { ClientPassport, UpdateClientBody } from "../../../schemas/clientSchema";
import { CreateClientType } from "../../../types/personalData";
import { allClients, AntonRequest, AntonResponse, createAlexeyRequest, createAlexeyResponse, id, SergeyRequest, updateAlexeyRequest, updateAlexeyResponse } from "./preparedData";

let fastify: FastifyInstance;
jest.setTimeout(30000);

beforeAll(async () => {
    fastify = await buildFastify();
});

afterAll(async () => {
    await fastify.prisma.$executeRaw`TRUNCATE TABLE clients, passports, registration_addresses, residential_addresses RESTART IDENTITY CASCADE`;
    await fastify.close();
});

describe("client controller", () => {
    describe("create client", () => {
        test("should create new a client", async () => {
            const response = await fastify.inject({
                method: "POST",
                url: "/clients",
                body: createAlexeyRequest
            });

            expect(response.statusCode).toBe(201);
            expect(JSON.parse(response.payload)).toEqual(createAlexeyResponse);
        });

        test("should create new a client 2", async () => {
            const response = await fastify.inject({
                method: "POST",
                url: "/clients",
                body: AntonRequest
            });

            expect(response.statusCode).toBe(201);
            expect(JSON.parse(response.payload)).toEqual(AntonResponse);
        });

        test("error of attempt create a client with same email and phone number", async () => {
            const body: CreateClientType = JSON.parse(JSON.stringify(SergeyRequest));
            body.client.phoneNumber = "+79111111111";
            body.client.email = "alex123@mail.ru"
            const response = await fastify.inject({
                method: "POST",
                url: "/clients",
                body: body
            });

            expect(response.statusCode).toBe(409);
            expect(JSON.parse(response.body).message).toMatch("Fields email, phoneNumber or inn use already!");
        });

        test("error of attempt create client with incorrect pattern of phone number", async () => {
            const body: CreateClientType = JSON.parse(JSON.stringify(AntonRequest));
            body.client.phoneNumber = "12352679+24";
            const response = await fastify.inject({
                method: "POST",
                url: "/clients",
                body: body
            });

            expect(response.statusCode).toBe(400);
            expect(JSON.parse(response.body).message).toMatch("body/client/phoneNumber must match pattern \"^\\+\\d+$\"");
        });

        test("error of attempt create client with incorrect pattern of email", async () => {
            const body: CreateClientType = JSON.parse(JSON.stringify(AntonRequest));
            body.client.email = "alexmail.ru111";

            const response = await fastify.inject({
                method: "POST",
                url: "/clients",
                body: body
            });

            expect(response.statusCode).toBe(400);
            expect(JSON.parse(response.body).message).toMatch("body/client/email must match format \"email\"");
        });

        test("error of attempt create client with invalid checksum of inn", async () => {
            const body: CreateClientType = JSON.parse(JSON.stringify(SergeyRequest));
            body.client.inn = "212739812742"

            const response = await fastify.inject({
                method: "POST",
                url: "/clients",
                body: body
            });

            expect(response.statusCode).toBe(400);
            expect(JSON.parse(response.body).message).toMatch("Invalid checksum of inn!");
        });
    })

    describe("update client", () => {
        test("should update client", async () => {
            const response = await fastify.inject({
                method: "PUT",
                url: `/clients/${id.id}`,
                body: updateAlexeyRequest,
            });

            expect(response.statusCode).toBe(200);
            expect(JSON.parse(response.payload)).toEqual(updateAlexeyResponse);
        });

        test("error of attempt update a client with same email and phone number", async () => {
            const body: UpdateClientBody = JSON.parse(JSON.stringify(updateAlexeyRequest));
            body.client!.email = AntonRequest.client.email;
            body.client!.phoneNumber = AntonRequest.client.phoneNumber;
            const response = await fastify.inject({
                method: "PUT",
                url: `/clients/${id.id}`,
                body: body
            });

            expect(response.statusCode).toBe(409);
            expect(JSON.parse(response.body).message).toMatch("Fields email, phoneNumber or inn use already!");
        });

        test("error of attempt update a client with incorrect pattern of phone number", async () => {
            const body: CreateClientType = JSON.parse(JSON.stringify(updateAlexeyRequest));
            body.client.phoneNumber = "12352679+24";
            const response = await fastify.inject({
                method: "PUT",
                url: "/clients/1",
                body: body
            });

            expect(response.statusCode).toBe(400);
            expect(JSON.parse(response.body).message).toMatch("body/client/phoneNumber must match pattern \"^\\+\\d+$\"");
        });

        test("error of attempt update a client with incorrect pattern of email", async () => {
            const body: CreateClientType = JSON.parse(JSON.stringify(updateAlexeyRequest));
            body.client.email = "alex@@mail.ru";
            const response = await fastify.inject({
                method: "PUT",
                url: `/clients/${id.id}`,
                body: body
            });

            expect(response.statusCode).toBe(400);
            expect(JSON.parse(response.body).message).toMatch("body/client/email must match format \"email\"");
        });

        test("error of attempt update a client with invalid checksum of inn", async () => {
            const body: CreateClientType = JSON.parse(JSON.stringify(updateAlexeyRequest));
            body.client.inn = "110982434802"
            const response = await fastify.inject({
                method: "PUT",
                url: `/clients/${id.id}`,
                body: body
            });

            expect(response.statusCode).toBe(400);
            expect(JSON.parse(response.body).message).toMatch("Invalid checksum of inn!");
        });
    });

    describe("get client", () => {
        test("get client by passport", async () => {
            const passport: ClientPassport = { seria: "1200", number: "901022" };
            const response = await fastify.inject({
                method: "GET",
                url: "/clients/passport",
                query: passport
            });

            expect(response.statusCode).toBe(200);
            expect(JSON.parse(response.payload)).toEqual(updateAlexeyResponse);
        });
    })

    describe("delete client", () => {
        test("error of attempt delete for record not found", async () => {
            const id = { id: 4 };
            const response = await fastify.inject({
                method: "DELETE",
                url: `/clients/${id.id}`,
            });

            expect(response.statusCode).toBe(404);
            expect(JSON.parse(response.body).message).toMatch("Record not found");
        });
    });
    
    describe("all clients", () => {
        test("should return all clients", async () => {
            const response = await fastify.inject({
                method: "GET",
                url: "/clients"
            });

            expect(response.statusCode).toBe(200);
            expect(JSON.parse(response.body)).toEqual(allClients);
        });
    })
})



