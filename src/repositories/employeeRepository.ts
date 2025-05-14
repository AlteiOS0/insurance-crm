import { PrismaClient } from "@prisma/client";
import { AddEmployeePayload } from "../schemas/employeeSchema";

export default class EmployeeRepository {
    constructor(private readonly prisma: PrismaClient) {}

    async addEmployee(employee: AddEmployeePayload) {
        return await this.prisma.employee.create({
            data: {
                firstName: employee.firstName,
                lastName: employee.lastName,
                surname: employee.surname,
                password: employee.password,
                email: employee.email,
                login: employee.login,  
            },
            select: {
                id: true,
                firstName: true,
                surname: true,
                lastName: true,
                email: true,
                login: true
            }
        });
    }

    async getEmployeeByUniqueField(email: string, login?: string) {
        return await this.prisma.employee.findFirst({
            where: {
                OR: [
                    { email: email },
                    { login: login }
                ]
            },
        });
    }

    async getEmployeeById(id: number) {
        return await this.prisma.employee.findFirstOrThrow({
            where: {
                id: id
            },
            select: {
                id: true,
                firstName: true,
                surname: true,
                lastName: true,
                email: true,
                login: true
            }
        })
    }

    async getPassword(email: string) {
        return await this.prisma.employee.findFirstOrThrow({
            where: {
                email: email
            },
            select: {
                password: true
            }
        });
    }
}