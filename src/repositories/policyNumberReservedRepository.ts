import { PrismaClient } from "@prisma/client";
import { UUID } from "crypto";

export default class PolicyNumberReservedRepository {
    constructor(private readonly prisma: PrismaClient) {};

    async reservePolicyNumber(reserve: { number: string, uuid: UUID }) {
        return await this.prisma.policyNumberReserved.create({
            data: {
                number: reserve.number,
                uuid: reserve.uuid
            }
        });
    }

    async getPolicyNumber(uuid: string) {
        return await this.prisma.policyNumberReserved.findFirstOrThrow({
            where: {
                uuid: uuid
            },
            select: {
                number: true
            }
        });
    }

    async deletePolicyNumber(uuid: string) {
        return await this.prisma.policyNumberReserved.delete({
            where: {
                id: undefined,
                uuid: uuid
            }
        })
    }
}