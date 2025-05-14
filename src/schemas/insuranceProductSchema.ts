import { Static, Type } from "@sinclair/typebox";
import { PartialDeep } from "./utils/partialDeep";
import StringEnum from "./utils/typingEnum";
import Subset from "../types/deepPartial";

export enum InsuranceProductType {
    InvestmentInsurance = "investment_insurance",
    InsuranceSavingsPlan = "insurance_savings_plan"
}

const ProviderOfInsuranceProductType = StringEnum(Object.keys(InsuranceProductType));

export const insuranceProductResponse = Type.Object({
    id: Type.Number(),
    name: Type.String(),
    description: Type.Union([
        Type.String(),
        Type.Null()
    ]),
    type: ProviderOfInsuranceProductType,
    minAge: Type.Number(),
    maxAge: Type.Number(),
    minInsurancePremium: Type.Number(),
    maxInsurancePremium: Type.Number(),
    minCoverage: Type.Number(),
    maxCoverage: Type.Number(),
    minHowYears: Type.Number(),
    maxHowYears: Type.Number()
});

export const insuranceProductArrayResponse = Type.Array(insuranceProductResponse);

export const addInsuranceProductBody = Type.Object({
    name: Type.String(),
    description: Type.Optional(Type.String()),
    type: ProviderOfInsuranceProductType,
    minAge: Type.Number({ exclusiveMinimum: 17 }),
    maxAge: Type.Number({ exclusiveMaximum: 98 }),
    minInsurancePremium: Type.Number(),
    maxInsurancePremium: Type.Number(),
    minCoverage: Type.Number(),
    maxCoverage: Type.Number(),
    minHowYears: Type.Number({ exclusiveMinimum: 0 }),
    maxHowYears: Type.Number({ exclusiveMaximum: 9 }),
});

export const updateInsuranceProductBody = PartialDeep(addInsuranceProductBody);
export const productId = Type.Object({
    id: Type.Number()
});

export type CreateInsuranceProduct = Static<typeof addInsuranceProductBody>;
export type UpdateInsuranceProduct = Subset<CreateInsuranceProduct>;
export type ProductId = Static<typeof productId>;
export type InsuranceProductResponse = Static<typeof insuranceProductResponse>;