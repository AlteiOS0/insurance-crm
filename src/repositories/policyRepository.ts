import { PrismaClient } from "@prisma/client";
import { AddPolicyPayload, ClientIdParams, PolicyIdParams, ChangeStatusPayload } from "../schemas/policySchema";

type PolicyPayload = AddPolicyPayload & {
    number: string,
    insurancePremium: number,
    expiresAt: string
    coverage: number,
    policyPath?: string,
    policyStatus: string,
    insuredPersonId: number,
    insuranceProductId: number
}

export default class PolicyRepository {
    constructor(private readonly prisma: PrismaClient) {}
    
    async addPolicy(policy: PolicyPayload) {
        return await this.prisma.policy.create({
            data: {
                number: policy.number,
                issuedAt: new Date(),
                expiresAt: new Date(policy.expiresAt),
                insurancePremium: policy.insurancePremium,
                coverage: policy.coverage,
                policyPath: policy.policyPath,
                insuredPersonId: policy.insuredPersonId,
                insuranceProductId: policy.insuranceProductId
            }
        });
    }

    async getAllPolicies(id: ClientIdParams) {
        return await this.prisma.policy.findMany({
            where: {
                insuredPersonId: id.clientId
            }
        });
    }

    async getPolicy(id: number) {
        return await this.prisma.policy.findFirstOrThrow({
            where: {
                id: id
            }
        });
    }
}