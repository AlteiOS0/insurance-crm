import { Static, Type } from "@sinclair/typebox";

export const addEmployeePayload = Type.Object({
    firstName: Type.String(),
    lastName: Type.String(),
    surname: Type.Optional(Type.String()),
    email: Type.String({ format: "email" }),
    password: Type.String({ minLength: 8 }),
    login: Type.String({ minLength: 3 })
});

export const employeeId = Type.Object({
    id: Type.Number()
});

export const loginPayload = Type.Object({
    email: Type.String({ format: "email" }),
    password: Type.String()
});

export const employeeResponse = Type.Object({
    id: Type.String(),
    firstName: Type.String(),
    lastName: Type.String(),
    surname: Type.Optional(Type.String()),
    email: Type.String(),
    login: Type.String()
});

export const accessTokenResponse = Type.String();

export type AddEmployeePayload = Static<typeof addEmployeePayload>;
export type EmployeeId = Static<typeof employeeId>;
export type LoginPayload = Static<typeof loginPayload>;
export type AccessTokenResponse = Static<typeof accessTokenResponse>;