import ajv from "./ajv";
import { addSessionPayload, oldAndNewRefreshTokens, sessionRefreshToken } from "./sessionSchema";

export const validateAddSessionPayload = ajv.compile(addSessionPayload);
export const validateSessionRefreshToken = ajv.compile(sessionRefreshToken);
export const validateBothRefreshTokens = ajv.compile(oldAndNewRefreshTokens);