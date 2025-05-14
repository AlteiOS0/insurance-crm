import ajv from "./ajv";
import { addInsuranceProductBody, productId, updateInsuranceProductBody } from "./insuranceProductSchema";

export const validateAddProductBody = ajv.compile(addInsuranceProductBody);
export const validateUpdateProductBody = ajv.compile(updateInsuranceProductBody);
export const validateProductId = ajv.compile(productId);