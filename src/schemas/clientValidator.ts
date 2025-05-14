import ajv from "./ajv";
import { createClientBodySchema, getClientByIdSchema, getClientByPassportSchema, updateClientBodySchema } from "./clientSchema";

export const validateCreateClientBody = ajv.compile(createClientBodySchema);
export const validateUpdateClientBody = ajv.compile(updateClientBodySchema);
export const validateClientId = ajv.compile(getClientByIdSchema);
export const validateClientPassport = ajv.compile(getClientByPassportSchema);