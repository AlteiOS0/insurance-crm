import { Decimal } from "@prisma/client/runtime/library";
import { CreateInsuranceProduct, InsuranceProductType, UpdateInsuranceProduct } from "../../../schemas/insuranceProductSchema";

export namespace InsuranceProductUnitTest {
    export const receiveInsuranceProductAfterCreate = {
        id: 1,
        name: "Инвест",
        description: "Страховой продукт позволит вам получить дополнительный фиксированный доход",
        type: InsuranceProductType.InvestmentInsurance,
        minInsurancePremium: new Decimal(50000),
        maxInsurancePremium: new Decimal(5000000),
        minAge: 18,
        maxAge: 75,
        minCoverage: new Decimal(50000),
        maxCoverage: new Decimal(5000000),
        minHowYears: new Decimal(2),
        maxHowYears: new Decimal(5)
    };
    
    export const receiveInsuranceProductAfterUpdate = {
        id: 1,
        name: "Инвест 2.0",
        description: "Страховой продукт позволит вам получить дополнительный фиксированный доход, а также денежные средства защищены от посягательств третьих лиц",
        type: InsuranceProductType.InvestmentInsurance,
        minInsurancePremium: new Decimal(50000),
        maxInsurancePremium: new Decimal(5000000),
        minAge: 18,
        maxAge: 75,
        minCoverage: new Decimal(50000),
        maxCoverage: new Decimal(5000000),
        minHowYears: new Decimal(2),
        maxHowYears: new Decimal(5)
    };
    
    export const insuranceProductBody: CreateInsuranceProduct = {
        name: "Инвест",
        description: "Страховой продукт позволит вам получить дополнительный фиксированный доход",
        type: Object.keys(InsuranceProductType)[0], // InvestmentInsurance
        minInsurancePremium: 50000,
        maxInsurancePremium: 5000000,
        minAge: 18,
        maxAge: 75,
        minCoverage: 50000,
        maxCoverage: 5000000,
        minHowYears: 2,
        maxHowYears: 5
    }
    
    export const insuranceProductUpdate: UpdateInsuranceProduct = {
        name: "Инвест 2.0",
        description: "Страховой продукт позволит вам получить дополнительный фиксированный доход, а также денежные средства защищены от посягательств третьих лиц"
    }
}
