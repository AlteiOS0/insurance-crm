import { ErrorObject } from "ajv";
import PolicyRepository from "../../../repositories/policyRepository";
import PolicyService from "../../../services/policyService";
import { prismaMock } from "../singleton";
import { PolicyUnitTest } from "./preparedData";
import { randomInt, randomUUID } from "crypto";
import { readdir, writeFile } from "fs/promises";
import PolicyNumberReservedRepository from "../../../repositories/policyNumberReservedRepository";
import { Prisma } from "@prisma/client";
import { GenerationOfPdfFilePayload, AddPolicyPayload, PolicyIdParams } from "../../../schemas/policySchema";

const policyRepository = new PolicyRepository(prismaMock);
const policyNumberReservedRepository = new PolicyNumberReservedRepository(prismaMock);
const policyService = new PolicyService(policyRepository, policyNumberReservedRepository);
const randomUUIDMock = (randomUUID as Function) = jest.fn();
randomUUIDMock.mockReturnValue("13324567-7131-4062-9222-a11a113a0361");

describe("pdf", () => {
    describe("create a file", () => {
        test("should create a file policy", async () => {
            const spyFunction = jest.spyOn(policyService as any, "generatePolicyPdf")
            spyFunction.mockImplementationOnce(() => {return Buffer.from("asdfg", "base64")});
            
            const result = await policyService.sendPolicyToClient(PolicyUnitTest.generatePolicyPdfPayload, "Alexey");
    
            expect(result).toEqual({ file: result.file, uuid: "13324567-7131-4062-9222-a11a113a0361" });
        });
    
        test("error because fio field is undefined", async () => {
            const payload: GenerationOfPdfFilePayload = JSON.parse(JSON.stringify(PolicyUnitTest.generatePolicyPdfPayload));
            (payload.client.fio as string | undefined) = undefined;
    
            try {
                await policyService.sendPolicyToClient(payload, "Alexey");
            } catch (e) {
                const error = (JSON.parse((e as Error).message) as ErrorObject[])[0].message;
                expect(error).toMatch("must have required property 'fio");
            }
        });
    
        test("error because employee is undefined", async () => {
            const employee: string | undefined = undefined;
    
            try {
                await policyService.sendPolicyToClient(PolicyUnitTest.generatePolicyPdfPayload, employee!);
            } catch (e) {
               const error = (e as Error).message;
               expect(error).toMatch("Auth error");
            }
        });
    });

    describe("add to directory", () => {
        test("should add to directory", async () => {
            const payload: Buffer = Buffer.from("abcdfg", "base64");;
            (writeFile as Function) = jest.fn();
            (readdir as Function) = jest.fn(() => { return "0000000000"});
            const randomMock = (randomInt as Function) = jest.fn();
            randomMock.mockReturnValueOnce(1);

            const result = await policyService.addFileToDirectory(payload.toString("base64"));

            expect(result).toBe("11.pdf");
        });

        test("error because argument pdfRaw is empty", async () => {
            const payload: Buffer = Buffer.alloc(0);

            try {
                await policyService.addFileToDirectory(payload.toString("base64"));
            } catch (e) {
                const message = (e as Error).message;
                expect(message).toMatch("File not loaded")
            }
        });
    });
});

describe("add policy", () => {
    test("should add policy", async () => {
        prismaMock.policyNumberReserved.findFirstOrThrow.mockResolvedValueOnce({ number: "101234325", uuid: randomUUIDMock(), id: 1 });
        prismaMock.policy.create.mockResolvedValueOnce(PolicyUnitTest.policyResponse);

        const result = await policyService.addPolicy(PolicyUnitTest.addPolicyPayload);
        
        expect(result).toEqual(PolicyUnitTest.policyResponse);
    });

    test("error because file field is empty", async () => {
        const payload: AddPolicyPayload = JSON.parse(JSON.stringify(PolicyUnitTest.addPolicyPayload));
        payload.file = "";

        try {
            await policyService.addPolicy(payload);
        } catch (e) {
            const message = (e as Error).message;
            expect(message).toMatch("File not loaded");
        }
    });
});

describe("get all policy", () => {
    test("should return all policies", async () => {
        const policies: typeof PolicyUnitTest.policyResponse[] = [PolicyUnitTest.policyResponse];
        prismaMock.policy.findMany.mockResolvedValueOnce([PolicyUnitTest.policyResponse]);

        const result = await policyService.getAllPolicies(PolicyUnitTest.clientId);

        expect(result).toEqual(policies);
    });
});

describe("get policy", () => {
    test("should return policy", async () => {
        const policyId: PolicyIdParams = {
            id: 1
        };
        prismaMock.policy.findFirstOrThrow.mockResolvedValueOnce(PolicyUnitTest.policyResponse);

        const result = await policyService.getPolicy(policyId);

        expect(result).toEqual(PolicyUnitTest.policyResponse);
    });

    test("error because policy not found", async () => {
        const policyId: PolicyIdParams = {
            id: 2
        };
        prismaMock.policy.findFirstOrThrow.mockImplementationOnce(() => { 
            throw new Prisma.PrismaClientKnownRequestError("Record not found", { 
                code: "P2025", 
                batchRequestIdx: 1, 
                clientVersion: "6.7.0" 
            });
        });

        try {
            await policyService.getPolicy(policyId);
        } catch (e) {
            const message = (e as Error).message;
            expect(message).toMatch("Record not found");
        }
    });

    test("error because policyId field is incorrect type", async () => {
        const policyId: PolicyIdParams = {
            id: 1,
        };
        (policyId.id as unknown as string) = "1s";

        try {
            await policyService.getPolicy(policyId);
        } catch (e) {
            const message = (e as Error).message;
            expect(message).toMatch("must be number");
        }
    });
});