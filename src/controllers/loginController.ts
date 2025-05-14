import { FastifyReply, FastifyRequest } from "fastify";
import { AddEmployeePayload, LoginPayload } from "../schemas/employeeSchema";
import { randomUUID } from "crypto";
import createHttpError from "http-errors";

export const signUp = async (req: FastifyRequest<{ Body: AddEmployeePayload }>, reply: FastifyReply) => {
    const result = await req.server.loginService.addEmployee(req.body);

    return reply.status(201).send(result);
}

export const login = async (req: FastifyRequest<{ Body: LoginPayload }>, reply: FastifyReply) => {
    const result = await req.server.loginService.login(req.body);
    const refreshToken = randomUUID();

    const token = await reply.jwtSign(result, {
        expiresIn: "15m",
        iss: "Insurance crm"
    });

    await req.server.sessionService.addSession({
        ipv4: req.ip,
        email: result.email,
        userAgent: req.headers['user-agent']!,
        employeeId: result.id,
        refreshToken: refreshToken
    });

    return reply.setCookie("accessToken", token, {
        secure: false,
        path: "/",
        httpOnly: true,
    }).setCookie('refreshToken', refreshToken, {
        secure: false,
        path: "/",
        httpOnly: true,
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30)
    }).send(token);
}

export const updateTokens = async (req: FastifyRequest, reply: FastifyReply) => {
    const oldRefreshToken = req.cookies['refreshToken'];
    if(!oldRefreshToken)
        throw new createHttpError.Unauthorized("Refresh token invalid");

    const session = await req.server.sessionService.getSession(oldRefreshToken);

    const payload: typeof req.user = { 
        id: session.employeeId,
        firstName: session.employee.firstName,
        surname: session.employee.surname,
        lastName: session.employee.lastName,
        email: session.employee.email
    };

    const newRefreshToken = randomUUID();
    const token = await reply.jwtSign(payload, {
        expiresIn: "15m",
        iss: "Insurance crm"
    });

    await req.server.sessionService.updateRefreshToken({oldRefreshToken: oldRefreshToken!, newRefreshToken: newRefreshToken});
    
    return reply.setCookie("accessToken", token, {
        secure: false,
        path: "/",
        httpOnly: true,
    }).setCookie('refreshToken', newRefreshToken, {
        secure: false,
        path: "/",
        httpOnly: true,
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30)
    }).send(token);
}

export const logout = async (req: FastifyRequest, reply: FastifyReply) => {
    if(!req.cookies['refreshToken'])
        throw new createHttpError.Unauthorized("You are not authorized");

    return reply.clearCookie("accessToken").clearCookie("refreshToken").send("Ok");
}