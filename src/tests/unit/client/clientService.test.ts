import { prismaMock } from "../singleton";
import ClientRepository from "../../../repositories/clientRepository";
import { CreateClientType } from "../../../types/personalData";
import ClientService from "../../../services/clientService";
import { clientDataForService, clientResponse } from "./preparedClientData";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import ajvError from "../utils/ajvError";

const clientRepository = new ClientRepository(prismaMock);
const clientService = new ClientService(clientRepository);

describe("create new client", () => {
    test("should create new client", async () => {
        const checkChecksumOfInn = jest.spyOn(ClientService.prototype as any, "checkChecksumOfInn");
        checkChecksumOfInn.mockReturnValueOnce(true);
        prismaMock.client.create.mockResolvedValueOnce(clientResponse);

        const result = await clientService.createClient(clientDataForService);

        expect(result).toEqual(clientResponse);
        expect(checkChecksumOfInn).toHaveBeenCalled();
    });

    test("should create new client with valid checksum of inn", async () => {
        const checkChecksumOfInn = jest.spyOn(ClientService.prototype as any, "checkChecksumOfInn");
        prismaMock.client.create.mockResolvedValueOnce(clientResponse);

        const result = await clientService.createClient(clientDataForService);

        expect(result).toEqual(clientResponse);
        expect(checkChecksumOfInn).toHaveBeenCalled();
    });

    test("should be error for invalid checksum", async () => {
        const data: CreateClientType = JSON.parse(JSON.stringify(clientDataForService));
        data.client.inn = "122354557444";
        const checkChecksumOfInn = jest.spyOn(ClientService.prototype as any, "checkChecksumOfInn");

        try {
            await clientService.createClient(data);
        } catch (e) {
            const message = (e as Error).message;
            expect(message).toMatch("Invalid checksum of inn!");
            expect(checkChecksumOfInn).toHaveBeenCalled();
        }
    });

    test("should be error for undefined field", async () => {
        const data: CreateClientType = JSON.parse(JSON.stringify(clientDataForService));
        (data.client.firstName as string | undefined) = undefined;

        try {
            await clientService.createClient(data);
        } catch (e) {
            expect(ajvError(e)).toMatch("/client must have required property 'firstName'");
        }
    });

    test("should be error for incorrect field type", async () => {
        const data: CreateClientType = JSON.parse(JSON.stringify(clientDataForService));

        (data.passport.dateOfBirth as unknown as number) = 123;

        try {
            await clientService.createClient(data);
        } catch (e) {
            expect(ajvError(e)).toMatch("/passport/dateOfBirth must be string")
        }
    });

    test("should be error for incorrect data", async () => {
        const data: CreateClientType = JSON.parse(JSON.stringify(clientDataForService));

        data.passport.dateOfBirth = "12111";
        data.client.phoneNumber = "12311111111";
        data.client.email = "aAaaaaaaaaaa.mail.ru"

        try {
            await clientService.createClient(data);
        } catch (e) {
            expect(ajvError(e)).toEqual([
                {
                    instancePath: "/client/phoneNumber",
                    message: 'must match pattern "^\\+\\d+$"'
                },
                {
                    instancePath: "/client/email",
                    message: 'must match format "email"'
                },
                {
                    instancePath: "/passport/dateOfBirth",
                    message: 'must match format "date"'
                }
            ])
        }
    });
});

describe("update client", () => {
    test("should update client by id", async () => {
        const id = { id: "1" };
        const checkChecksumOfInn = jest.spyOn(ClientService.prototype as any, "checkChecksumOfInn");
        checkChecksumOfInn.mockReturnValueOnce(true);
        prismaMock.client.update.mockResolvedValueOnce(clientResponse);

        const result = await clientService.updateClient(clientDataForService, id);

        expect(result).toEqual(clientResponse);
        expect(checkChecksumOfInn).toHaveBeenCalled();
    });

    test("should update client by id with correct checksum of inn", async () => {
        const id = { id: "1" };
        const checkChecksumOfInn = jest.spyOn(ClientService.prototype as any, "checkChecksumOfInn");
        prismaMock.client.update.mockResolvedValueOnce(clientResponse);

        const result = await clientService.updateClient(clientDataForService, id);

        expect(result).toEqual(clientResponse);
        expect(checkChecksumOfInn).toHaveBeenCalled();
    });

    test("should be error for incorrect checksum of inn", async () => {
        const id = { id: "1" };
        const data: CreateClientType = JSON.parse(JSON.stringify(clientDataForService));
        data.client.inn = "782657574442";
        const checkChecksumOfInn = jest.spyOn(ClientService.prototype as any, "checkChecksumOfInn");

        try {
            await clientService.updateClient(data, id)
        } catch (e) {
            const error = (e as Error).message;
            expect(error).toMatch("Invalid checksum of inn!");
            expect(checkChecksumOfInn).toHaveBeenCalled();
        }
    });

    test("should be error for incorrect id type", async () => {
        const id = { id: "1" };
        (id.id as unknown as number) = 1;

        try {
            await clientService.updateClient(clientDataForService, id);
        } catch (e) {
            expect(ajvError(e)).toMatch("/id must be string");
        }
    });

    test("should be error for client is not exist", async () => {
        const id = { id: "2" };
        const checkChecksumOfInn = jest.spyOn(ClientService.prototype as any, "checkChecksumOfInn");
        prismaMock.client.update.mockResolvedValueOnce(null as any);

        try {
            await clientService.updateClient(clientDataForService, id);
        } catch (e) {
            const message = (e as Error).message;
            expect(message).toMatch("Client not found!");
            expect(checkChecksumOfInn).toHaveBeenCalled();
        }
    });

    test("should be error for incorrect data patterns", async () => {
        const id = { id: "1" };
        const data: CreateClientType = JSON.parse(JSON.stringify(clientDataForService));
        data.client.phoneNumber = "029231";
        data.client.email = "2134.gmail.ne.ru";

        try {
            await clientService.updateClient(data, id);
        } catch (e) {
            expect(ajvError(e)).toEqual([
                {
                    instancePath: "/client/phoneNumber",
                    message: 'must NOT have fewer than 10 characters',
                },
                {
                    instancePath: "/client/phoneNumber",
                    message: 'must match pattern \"^\\+\\d+$\"',
                },
                {
                    instancePath: "/client/email",
                    message: 'must match format "email"'
                },
            ])
        }
    })
})

describe("get client", () => {
    const clientRepository = new ClientRepository(prismaMock);
    const clientService = new ClientService(clientRepository);

    test("should get client by id", async () => {
        const id = { id: "1" };
        prismaMock.client.findFirstOrThrow.mockResolvedValueOnce(clientResponse);

        const result = await clientService.getClientById(id);
        expect(result).toEqual(clientResponse);
    });

    test("should get client by passport - seria and number", async () => {
        prismaMock.client.findFirstOrThrow.mockResolvedValueOnce(clientResponse);

        const result = await clientService.getClientByPassport({ seria: clientDataForService.passport.seria, number: clientDataForService.passport.number });
        expect(result).toEqual(clientResponse);
    });

    test("should be not found for client is not exist by id", async () => {
        const id = { id: "2" };
        prismaMock.client.findFirstOrThrow.mockImplementationOnce(() => {
            throw new PrismaClientKnownRequestError("Record not found", {
                code: "P2025",
                clientVersion: "6.7.0",
                batchRequestIdx: 1
            })
        });

        try {
            await clientService.getClientById(id);
        } catch (e) {
            const message = (e as Error).message;
            expect(message).toMatch("Record not found");
        }
    });

    test("should be not found for client is not exist by passport - seria and number", async () => {
        const passport = { seria: "0000", number: "000000" };
        prismaMock.client.findFirstOrThrow.mockImplementationOnce(() => {
            throw new PrismaClientKnownRequestError("Record not found", {
                code: "P2025",
                clientVersion: "6.7.0",
                batchRequestIdx: 1
            })
        });

        try {
            await clientService.getClientByPassport(passport);
        } catch (e) {
            const message = (e as Error).message;
            expect(message).toMatch("Record not found");
        }
    });

    test("should be error for incorrect id type", async () => {
        const id = { id: "1" };
        (id.id as unknown as number) = 1;

        try {
            await clientService.getClientById(id);
        } catch (e) {
            expect(ajvError(e)).toMatch("/id must be string");
        }
    });

    test("should be error for incorrect passport type", async () => {
        const passport = { seria: "1234" };

        try {
            await clientService.getClientByPassport(passport as any);
        } catch (e) {
            expect(ajvError(e)).toMatch("must have required property 'number'");
        }
    });

    test("should be error for incorrect seria of passport", async () => {
        const passport = { seria: "1s2", number: "123456" };

        try {
            await clientService.getClientByPassport(passport);
        } catch (e) {
            expect(ajvError(e)).toEqual([
                {
                    instancePath: "/seria",
                    message: "must NOT have fewer than 4 characters"
                },
                {
                    instancePath: "/seria",
                    message: "must match pattern \"^\\d+$\""
                }
            ]);
        }
    });
});

describe("delete client from db", () => {
    const clientRepository = new ClientRepository(prismaMock);
    const clientService = new ClientService(clientRepository);

    test("should be delete client", async () => {
        const id = { id: "1" };
        const data: CreateClientType = JSON.parse(JSON.stringify(clientDataForService));
        const spyDeleteFunction = jest.spyOn(prismaMock.client as any, "delete");
        spyDeleteFunction.mockImplementationOnce(() => {
            data.client = {} as any;
            data.passport = {} as any;
            data.registrationAddress = {} as any;
            data.residentialAddress = {} as any;
        });

        const result = await clientService.deleteClientById(id);

        expect(result).toBe("Accepted");
        expect(data).toEqual({
            client: {},
            passport: {},
            registrationAddress: {},
            residentialAddress: {}
        });
        expect(spyDeleteFunction).toHaveBeenCalled();
    });

    test("should be error for incorrect id type", async () => {
        const id = { id: "1" };
        (id.id as unknown as number) = 1;

        try {
            await clientService.deleteClientById(id);
        } catch (e) {
            expect(ajvError(e)).toMatch("must be string");
        }
    });

    test("error because record not found by id", async () => {
        const id = { id: "2" };
        prismaMock.client.delete.mockImplementationOnce(() => {
            throw new PrismaClientKnownRequestError("Record not found", {
                code: "P2025",
                clientVersion: "6.7.0",
                batchRequestIdx: 1
            })
        });

        try {
            await clientService.deleteClientById(id);
        } catch (e) {
            const message = (e as Error).message;
            expect(message).toMatch("Record not found");
        }
    });
})