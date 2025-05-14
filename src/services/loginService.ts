import createHttpError from "http-errors";
import EmployeeRepository from "../repositories/employeeRepository";
import { AddEmployeePayload, LoginPayload } from "../schemas/employeeSchema";
import { validateAddEmployeePayload, validateLoginPayload } from "../schemas/employeeValidator";
import { compare, hash } from "bcrypt";

export default class LoginService {
    constructor(private readonly employeeRepository: EmployeeRepository) {}

    private readonly SALT_ROUNDS = 10;

    async addEmployee(payload: AddEmployeePayload) {
        const valid = validateAddEmployeePayload(payload);
        if(!valid)
            throw new createHttpError.BadRequest(JSON.stringify(validateAddEmployeePayload));

        const user = await this.employeeRepository.getEmployeeByUniqueField(payload.email, payload.login);
        if(user)
            throw new createHttpError.Conflict("User exists already");

        try {
            const passwordHash = await hash(payload.password, this.SALT_ROUNDS);
            payload.password = passwordHash;

            return await this.employeeRepository.addEmployee(payload);
        } catch (e) {
            throw new createHttpError.InternalServerError("Hash error");
        }
    }

    async login(payload: LoginPayload) {
        const valid = validateLoginPayload(payload);
        if(!valid)
            throw new createHttpError.Unauthorized(JSON.stringify(valid));

        const user = await this.employeeRepository.getEmployeeByUniqueField(payload.email);
        if(!user)
            throw new createHttpError.Unauthorized("Email or password invalid");

        const comparePassword = await compare(payload.password, user?.password);
        if(!comparePassword)
            throw new createHttpError.Unauthorized("Email or password invalid");

        return { id: user.id, email: user.email, firstName: user.firstName, surname: user.surname, lastName: user.lastName };
    }
}