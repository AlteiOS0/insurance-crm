import { PrismaClient } from "@prisma/client";
import { CreateClientType } from "../types/personalData";
import { ClientPassport } from "../schemas/clientSchema";
import Subset from "../types/deepPartial";

export default class ClientRepository {
    constructor(private readonly prisma: PrismaClient) {}

    async getClient(id: number) {
        return await this.prisma.client.findFirst({
            where: {
                id: id
            }
        });
    }

    async createClient(data: CreateClientType) {
        return await this.prisma.client.create({
            data: {
                firstName: data.client.firstName,
                lastName: data.client.lastName,
                surname: data.client.surname,
                email: data.client.email,
                phoneNumber: data.client.phoneNumber,
                inn: data.client.inn,
                passport: {
                    create: {
                        seria: data.passport.seria,
                        number: data.passport.number,
                        issuedByWhom: data.passport.issuedByWhom,
                        issuedAt: new Date(data.passport.issuedAt),
                        departmentCode: data.passport.departmentCode,
                        dateOfBirth: new Date(data.passport.dateOfBirth),
                        placeOfBirth: data.passport.placeOfBirth,
                        registrationAddress: {
                            create: {
                                region: data.registrationAddress.region,
                                city: data.registrationAddress.city,
                                street: data.registrationAddress.street,
                                house: data.registrationAddress.house,
                                apartment: data.registrationAddress.apartment,
                                registeredAt: new Date(data.registrationAddress.registeredAt)
                            }
                        },
                        residentialAddress: {
                            create: {
                                region: data.residentialAddress.region,
                                city: data.residentialAddress.city,
                                street: data.residentialAddress.street,
                                house: data.residentialAddress.house,
                                apartment: data.residentialAddress.apartment,
                            }
                        }
                    }
                }
            },
            include: {
                passport: {
                    include: {
                        registrationAddress: true,
                        residentialAddress: true,
                    }
                },
                policies: true
            }
        })
    }

    async updateClient(data: Subset<CreateClientType>, id: number) {
        return await this.prisma.client.update({
            where: {
                id: id
            },
            data: {
                firstName: data.client?.firstName,
                lastName: data.client?.lastName,
                surname: data.client?.surname,
                email: data.client?.email,
                phoneNumber: data.client?.phoneNumber,
                inn: data.client?.inn,
                passport: {
                    update: {
                            seria: data.passport?.seria,
                            number: data.passport?.number,
                            issuedByWhom: data.passport?.issuedByWhom,
                            issuedAt: data.passport?.issuedAt ? new Date(data.passport.issuedAt) : undefined,
                            departmentCode: data.passport?.departmentCode,
                            dateOfBirth: data.passport?.dateOfBirth ? new Date(data.passport.dateOfBirth) : undefined,
                            placeOfBirth: data.passport?.placeOfBirth,
                            registrationAddress: {
                                update: {
                                    region: data.registrationAddress?.region,
                                    city: data.registrationAddress?.city,
                                    street: data.registrationAddress?.street,
                                    house: data.registrationAddress?.house,
                                    apartment: data.registrationAddress?.apartment,
                                    registeredAt: data.registrationAddress?.registeredAt ? new Date(data.registrationAddress.registeredAt) : undefined
                                }
                            },
                            residentialAddress: {
                                update: {
                                    region: data.residentialAddress?.region,
                                    city: data.residentialAddress?.city,
                                    street: data.residentialAddress?.street,
                                    house: data.residentialAddress?.house,
                                    apartment: data.residentialAddress?.apartment,
                                }
                            }
                        }
                    }
                
            },
            include: {
                passport: {
                    include: {
                        registrationAddress: true,
                        residentialAddress: true
                    }
                },
                policies: true
            }
        });
    }

    async getClientById(id: number) {
        return await this.prisma.client.findFirstOrThrow({
            where: {
                id: id
            },
            include: {
                passport: {
                    include: {
                        registrationAddress: true,
                        residentialAddress: true
                    }
                },
                policies: true
            }
        });
    }

    async getAllClients() {
        return await this.prisma.client.findMany({
            select: {
                id: true,
                firstName: true,
                surname: true,
                lastName: true,
                phoneNumber: true,
                email: true
            }
        });
    }

    async getClientByPassport(passport: ClientPassport) {
        return await this.prisma.client.findFirstOrThrow({
            where: {
                passport: {
                    seria: passport.seria,
                    number: passport.number
                }
            },
            include: {
                passport: {
                    include: {
                        registrationAddress: true,
                        residentialAddress: true
                    }
                },
                policies: true
            }
        })
    }

    async deleteClient(id: number) {
        await this.prisma.client.delete({
            where: {
                id: id
            }
        })
    }

    async getClientByUniqueField(phoneNumber?: string, inn?: string, email?: string) {
        return await this.prisma.client.findFirst({
            where: {
                OR: [
                    { email: email },
                    { phoneNumber: phoneNumber },
                    { inn: inn }
                ]
            },
        })
    }
}