import createHttpError from "http-errors";
import ClientRepository from "../repositories/clientRepository";
import { CreateClientBody, ClientId, UpdateClientBody, ClientPassport } from "../schemas/clientSchema";
import { validateClientId, validateClientPassport, validateCreateClientBody, validateUpdateClientBody } from "../schemas/clientValidator";

export default class ClientService {
    constructor(private readonly repository: ClientRepository) {}

    async createClient(body: CreateClientBody) {
        const valid = validateCreateClientBody(body);
        if(!valid) {
            throw new createHttpError.BadRequest(JSON.stringify(validateCreateClientBody.errors));
        }

        if(await this.repository.getClientByUniqueField(body.client.phoneNumber, body.client.inn, body.client.email))
            throw new createHttpError.Conflict(`Fields email, phoneNumber or inn use already!`);

        if(!this.checkChecksumOfInn(body.client.inn))
            throw new createHttpError.BadRequest("Invalid checksum of inn!");

        return await this.repository.createClient(body);
    }

    async updateClient(body: UpdateClientBody, params: ClientId) {
        const validBody = validateUpdateClientBody(body);
        const validId = validateClientId(params);
        if(!validId) 
            throw new createHttpError.BadRequest(JSON.stringify(validateClientId.errors));
        if(!validBody)
            throw new createHttpError.BadRequest(JSON.stringify(validateUpdateClientBody.errors));

        if(body.client?.inn)
            if(!this.checkChecksumOfInn(body.client.inn))
                throw new createHttpError.BadRequest("Invalid checksum of inn!");

        if(body.client?.phoneNumber || body.client?.inn || body.client?.email) {
            if(await this.repository.getClientByUniqueField(body.client.phoneNumber, body.client.inn, body.client.email))
                throw new createHttpError.Conflict(`Fields email, phoneNumber or inn use already!`);    
        }

        return await this.repository.updateClient(body, Number(params.id));
    }

    async getClientById(params: ClientId) {
        const valid = validateClientId(params);
        if(!valid)
            throw new createHttpError.BadRequest(JSON.stringify(validateClientId.errors));

        return await this.repository.getClientById(Number(params.id));
    }

    async getClientByPassport(passport: ClientPassport) {
        const valid = validateClientPassport(passport);
        if(!valid)
            throw new createHttpError.BadRequest(JSON.stringify(validateClientPassport.errors));

        const client = await this.repository.getClientByPassport(passport);
        if(!client) 
            throw new createHttpError.NotFound("Client not found!");

        return client;
    }

    async deleteClientById(params: ClientId) {
        const valid = validateClientId(params);
        if(!valid)
            throw new createHttpError.BadRequest(JSON.stringify(validateClientId.errors));

        await this.repository.deleteClient(Number(params.id));

        return 'Accepted';
    }

    async getAllClients() {
        return await this.repository.getAllClients()
    }

    private checkChecksumOfInn(inn: string) {
        const coefficientsForFirstChecksum = [7, 2, 4, 10, 3, 5, 9, 4, 6, 8];
        const coefficientsForSecondChecksum = [3, 7, 2, 4, 10, 3, 5, 9, 4, 6, 8];

        let sumFirst = 0;
        let sumSecond = 0;
        for(let i = 0; i < coefficientsForFirstChecksum.length; i++) {
            sumFirst += Number(inn[i]) * coefficientsForFirstChecksum[i];
        }

        for(let i = 0; i < coefficientsForSecondChecksum.length; i++) {
            sumSecond += Number(inn[i]) * coefficientsForSecondChecksum[i];
        }

        if(sumFirst % 11 == Number(inn[inn.length - 2]) && sumSecond % 11 == Number(inn[inn.length - 1])) {
            return true;
        }

        return false;
    }
}