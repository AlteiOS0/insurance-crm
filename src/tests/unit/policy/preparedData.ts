import { Decimal } from "@prisma/client/runtime/library";
import { GenerationOfPdfFilePayload, AddPolicyPayload } from "../../../schemas/policySchema";

export namespace PolicyUnitTest {
    export const generatePolicyPdfPayload: GenerationOfPdfFilePayload = {
        client: {
            fio: "Алексеев Алексей Алексеевич",
            passport: {
                seria: "1111",
                number: "123456",
                issuedAt: "2020-01-01",
                issuedWho: "ОВД",
                dateOfBirth: "2000-01-01",
                registrationAddress: "г. Москва"       
            }
        },
        insuranceProduct: {
            name: "Инвест",
            insurancePeriod: 2,
            insurancePremium: 123000,
            coverage: 200000
        }
    };

    export const addPolicyPayload: AddPolicyPayload = {
        insurancePremium: 200000,
        coverage: 400000,
        file: Buffer.from("SGVsbG8sIGl0J3MgdGVzdCBkYXRh", 'base64').toString(),
        insuredPersonId: 1,
        insuranceProductId: 1,
        insurancePeriod: 5
    };

    export const policyResponse = {
        id: 1,
        number: "101234325",
        issuedAt: new Date("2024-11-20"),
        expiresAt: new Date("2026-11-21"),
        insurancePremium: new Decimal(200000),
        coverage: new Decimal(400000),
        insuranceProductId: 1,
        insuredPersonId: 1,
        policyPath: "./assets/pdf",
    };

    export const clientId = {
        clientId: 1
    };
}