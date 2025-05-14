import { Type } from "@sinclair/typebox";

export const badRequestResponseSchema = Type.Object({
    statusCode: Type.Literal(400),
    error: Type.Literal("Bad Request"),
    message: Type.String()
});

export const unauthorizedResponseSchema = Type.Object({
    statusCode: Type.Literal(401),
    error: Type.Literal("Unauthorized"),
    message: Type.String()
});

export const notFoundResponseSchema = Type.Object({
    statusCode: Type.Literal(404),
    error: Type.Literal("Not found"),
    message: Type.String()
});

export const conflictResponseSchema = Type.Object({
    statusCode: Type.Literal(409),
    error: Type.Literal("Conflict"),
    message: Type.String()
});

export const internalServerErrorSchema = Type.Object({
    statusCode: Type.Literal(500),
    error: Type.Literal("InternalServerError"),
    message: Type.String()
});
