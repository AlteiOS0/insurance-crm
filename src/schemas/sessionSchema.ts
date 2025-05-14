import { Static, Type } from "@sinclair/typebox";

export const addSessionPayload = Type.Object({
    ipv4: Type.String({ format: "ipv4" }),
    email: Type.String({ format: "email" }),
    userAgent: Type.String(),
    refreshToken: Type.String({ format: "uuid" }),
    employeeId: Type.Number()
});

export const oldAndNewRefreshTokens = Type.Object({
    oldRefreshToken: Type.String({ format: "uuid" }),
    newRefreshToken: Type.String({ format: "uuid" })
})

export const sessionRefreshToken = Type.String({ format: "uuid" });

export type AddSessionPayload = Static<typeof addSessionPayload>;
export type SessionRefreshToken = Static<typeof sessionRefreshToken>;
export type OldAndNewRefreshTokens = Static<typeof oldAndNewRefreshTokens>