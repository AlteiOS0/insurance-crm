import ajv from "./ajv";
import { addEmployeePayload, loginPayload } from "./employeeSchema";

export const validateAddEmployeePayload = ajv.compile(addEmployeePayload);
export const validateLoginPayload = ajv.compile(loginPayload);