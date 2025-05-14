import buildFastify from "../../../app";
import { ClientResponse } from "../../../schemas/clientSchema";
import { CreateClientType } from "../../../types/personalData";
import { GenerationOfPdfFilePayload, SendFileResponse, AddPolicyPayload } from "../../../schemas/policySchema";
import { FastifyInstance } from "fastify";
import { CreateInsuranceProduct, InsuranceProductResponse, InsuranceProductType } from "../../../schemas/insuranceProductSchema";

let fastify: FastifyInstance;
jest.setTimeout(30000);

beforeAll(async () => {
    fastify = await buildFastify();
})

afterAll(async () => {
    await fastify.prisma.$executeRaw`TRUNCATE clients, passports, registration_addresses, residential_addresses, policies, insurance_products, policies_number_reserved RESTART IDENTITY CASCADE`;
    await fastify.close();
});

// create client
// create insurance product
// generate pdf file
// load pdf file to server and add policy to db
test("add policy", async () => {
    const clientData: CreateClientType = {
        client: {
            firstName: "Алексей",
            lastName: "Алексеев",
            phoneNumber: "+79111111111",
            inn: "782657574446",
            surname: "Алексеевич",
            email: "alex@mail.ru"
        },
        passport: {
            seria: "2221",
            number: "384919",
            issuedByWhom: "ОВД",
            issuedAt: "2024-03-11",
            departmentCode: "222-222",
            dateOfBirth: "2001-03-03",
            placeOfBirth: "Москва",
        },
        registrationAddress: {
            region: "Московская область",
            city: "Москва",
            street: "ул. Ленина",
            house: "д. 20",
            apartment: "кв. 219",
            registeredAt: "2021-08-19",
        },
        residentialAddress: {
            region: "Московская область",
            city: "Москва",
            street: "ул. Ленина",
            house: "д. 20",
            apartment: "кв. 219",
        }
    };

    const insuranceProductData: CreateInsuranceProduct = {
        name: "Инвест",
        description: "Страховой продукт позволит вам получить дополнительный фиксированный доход",
        type: Object.keys(InsuranceProductType)[0], // InvestmentInsurance
        minInsurancePremium: 50000,
        maxInsurancePremium: 5000000,
        minAge: 18,
        maxAge: 75,
        minCoverage: 50000,
        maxCoverage: 5000000,
        minHowYears: 2,
        maxHowYears: 5
    };

    await fastify.inject({
        method: "POST",
        url: "/clients",
        body: clientData
    });

    await fastify.inject({
        method: "POST",
        url: "/products",
        body: insuranceProductData
    });

    const clientResponse = await fastify.inject({
        method: "GET",
        url: "/clients/1",
    });

    const insuranceProductResponse = await fastify.inject({
        method: "GET",
        url: "/products/1"
    })

    const client: ClientResponse = JSON.parse(clientResponse.payload);
    const passport = client.passport;
    const registrationAddress = passport.registrationAddress;
    const insuranceProduct: InsuranceProductResponse = JSON.parse(insuranceProductResponse.payload);

    const pdfFilePayload: GenerationOfPdfFilePayload = {
        client: {
            fio: `${client.lastName} ${client.firstName} ${client.surname}`,
            passport: {
                seria: passport.seria,
                number: passport.number,
                issuedAt: passport.issuedAt,
                issuedWho: passport.issuedByWhom,
                dateOfBirth: passport.dateOfBirth,
                registrationAddress: `${registrationAddress.city}, ул. ${registrationAddress.street}, д. ${registrationAddress.house}, кв. ${registrationAddress.apartment}`
            }
        },
        insuranceProduct: {
            name: insuranceProduct.name,
            insurancePeriod: insuranceProduct.maxHowYears,
            insurancePremium: 200000,
            coverage: 500000
        }
    }

    const fileResponse = await fastify.inject({
        method: "POST",
        url: "/policies/file",
        body: pdfFilePayload
    });

    const buf = fileResponse.rawPayload.toString("base64");
    const policyUUID = fileResponse.cookies.find(c => c.name == "policyUUID")!;

    const addPolicyPayload: AddPolicyPayload = {
        insurancePeriod: insuranceProduct.maxHowYears,
        insurancePremium: 200000,
        coverage: 500000,
        insuranceProductId: 1,
        insuredPersonId: 1,
        file: buf
    };

    const policyResponse = await fastify.inject({
        method: "POST",
        url: "/policies",
        body: addPolicyPayload,
        cookies: {
            "policyUUID": policyUUID.value
        }
    });

    const getPolicy = await fastify.inject({
        method: "GET",
        url: "/policies/1"
    });
    
    await fastify.inject({
        method: "GET",
        url: "/policies",
        query: { clientId: "1" }
    });

    const getFile = await fastify.inject({
        method: "GET",
        url: `/policies/file/${getPolicy.json().policyPath}`,
    });
    
    expect(getFile.headers["content-type"]).toBe("application/pdf");
    expect(policyResponse.statusCode).toBe(201);
});