import { PrismaClient } from "@prisma/client";
import { AddSessionPayload, SessionRefreshToken } from "../schemas/sessionSchema";

export default class SessionRepository {
    constructor(private readonly prisma: PrismaClient) {}

    async addSession(session: AddSessionPayload) {
        return await this.prisma.session.create({
            data: {
                ipv4: session.ipv4,
                email: session.email,
                userAgent: session.userAgent,
                refreshToken: session.refreshToken,
                employeeId: session.employeeId
            }
        });
    }

    async getSession(uuid: SessionRefreshToken) {
        return await this.prisma.session.findFirst({
            where: {
                refreshToken: uuid
            },
            include: {
                employee: true
            }
        });
    }

    async updateRefreshToken(oldRefreshToken: string, newRefreshToken: string) {
        return await this.prisma.session.update({
            where: {
                refreshToken: oldRefreshToken
            },
            data: {
                refreshToken: newRefreshToken
            }
        });
    }

    async getAllSessions(id: number) {
        return await this.prisma.session.findMany({
            where: {
                employeeId: id
            }
        })
    } 
}