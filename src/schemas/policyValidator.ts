import ajv from "./ajv";
import { addPolicyPayload, clientIdParams, generationOfPdfFilePayload, pdfFileName, policyIdParams } from "./policySchema";

export const validateGenerationOfPdfFilePayload = ajv.compile(generationOfPdfFilePayload);
export const validateAddPolicyPayload = ajv.compile(addPolicyPayload);
export const validateClientIdParams = ajv.compile(clientIdParams);
export const validatePolicyIdParams = ajv.compile(policyIdParams);
export const validatePolicyFileName = ajv.compile(pdfFileName)