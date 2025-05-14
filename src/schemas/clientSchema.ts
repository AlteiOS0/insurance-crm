import { Type, Static } from '@sinclair/typebox'
import { PartialDeep } from './utils/partialDeep';
import { policyResponse } from './policySchema';

export const createClientBodySchema = Type.Object({
    client: Type.Object({
        firstName: Type.String(),
        lastName: Type.String(),
        surname: Type.Optional(Type.String()),
        phoneNumber: Type.String({ minLength: 10, maxLength: 12, pattern: "^\\+\\d+$" }),
        email: Type.Optional(Type.String({ format: "email" })),
        inn: Type.String({ minLength: 10, maxLength: 12, pattern: "^\\d+$" })
    }),
    passport: Type.Object({
        seria: Type.String({ minLength: 4, maxLength: 4, pattern: "^\\d+$" }),
        number: Type.String({ minLength: 6, maxLength: 6, pattern: "^\\d+$" }),
        issuedByWhom: Type.String(),
        issuedAt: Type.String({ format: 'date' }),
        departmentCode: Type.String({ minLength: 7, maxLength: 7, pattern: "^\\d{3}-\\d{3}$"}),
        dateOfBirth: Type.String({ format: "date" }),
        placeOfBirth: Type.String()
    }),
    registrationAddress: Type.Object({
        region: Type.String(),
        city: Type.String(),
        street: Type.String(),
        house: Type.String(),
        apartment: Type.Optional(Type.String()),
        registeredAt: Type.String({ format: "date" })
    }),
    residentialAddress: Type.Object({
        region: Type.String(),
        city: Type.String(),
        street: Type.String(),
        house: Type.String(),
        apartment: Type.Optional(Type.String()),
    })
});

export const updateClientBodySchema = PartialDeep(createClientBodySchema);

export const getClientByIdSchema = Type.Object({
    id: Type.String({ pattern: "^\\d+$"})
});

export const getClientByPassportSchema = Type.Object({
    seria: Type.String({ minLength: 4, maxLength: 4, pattern: "^\\d+$" }),
    number: Type.String({ minLength: 6, maxLength: 6, pattern: "^\\d+$" }),
});

export const clientResponseSchema = Type.Object({
    id: Type.Number(),
    firstName: Type.String(),
    lastName: Type.String(),
    surname: Type.Optional(Type.String()),
    phoneNumber: Type.String({ minLength: 10, maxLength: 12, pattern: "^\\+\\d+$" }),
    email: Type.Optional(Type.String({ format: "email" })),
    inn: Type.String({ minLength: 10, maxLength: 12, pattern: "^\\d+$" }),
    passport: Type.Object({
        id: Type.Number(),
        seria: Type.String({ minLength: 4, maxLength: 4, pattern: "^\\d+$" }),
        number: Type.String({ minLength: 6, maxLength: 6, pattern: "^\\d+$" }),
        issuedByWhom: Type.String(),
        issuedAt: Type.String({ format: "date" }),
        departmentCode: Type.String({ minLength: 7, maxLength: 7, pattern: "^\\d{3}-\\d{3}$"}),
        dateOfBirth: Type.String({ format: "date" }),
        placeOfBirth: Type.String(),
        clientId: Type.Number(),
        registrationAddress: Type.Object({
            id: Type.Number(),
            region: Type.String(),
            city: Type.String(),
            street: Type.String(),
            house: Type.String(),
            apartment: Type.Optional(Type.String()),
            registeredAt: Type.String({ format: "date" }),
            passportId: Type.Number()
        }),
        residentialAddress: Type.Object({
            id: Type.Number(),
            region: Type.String(),
            city: Type.String(),
            street: Type.String(),
            house: Type.String(),
            apartment: Type.Optional(Type.String()),
            passportId: Type.Number()
        }),
        policies: Type.Optional(Type.Array(policyResponse))
    })
});

export const allClientsResponse = Type.Array(Type.Object({
    id: Type.Number(),
    firstName: Type.String(),
    surname: Type.String(),
    lastName: Type.String(),
    phoneNumber: Type.String(),
    email: Type.String()
}));


export const deleteClientById = Type.Number();

export type CreateClientBody = Static<typeof createClientBodySchema>;
export type UpdateClientBody = Static<typeof updateClientBodySchema>;
export type ClientId = Static<typeof getClientByIdSchema>;
export type ClientPassport = Static<typeof getClientByPassportSchema>;
export type ClientResponse = Static<typeof clientResponseSchema>;