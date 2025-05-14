import { Static, Type } from "@sinclair/typebox";
import StringEnum from "./utils/typingEnum";

export enum PolicyStatus {
    NotPaid = "not_paid",
    Active = "active",
    Pending = "pending",
    PaymentMade = "payment_made",
    InArchive = "in_archive"
}

const ProviderOfPolicyStatus = StringEnum(Object.keys(PolicyStatus));

export const generationOfPdfFilePayload = Type.Object({
    client: Type.Object({
        fio: Type.String(),
        passport: Type.Object({
            seria: Type.String(),
            number: Type.String(),
            dateOfBirth: Type.String({ format: "date" }),
            issuedAt: Type.String({ format: "date" }),
            issuedWho: Type.String(),
            registrationAddress: Type.String()
        })
    }),
    insuranceProduct: Type.Object({
        name: Type.String(),
        insurancePeriod: Type.Number(),
        insurancePremium: Type.Number(),
        coverage: Type.Number()
    }),
});

export const addPolicyPayload = Type.Object({
    insurancePremium: Type.Number(),
    coverage: Type.Number(),
    insuredPersonId: Type.Number(),
    insuranceProductId: Type.Number(),
    insurancePeriod: Type.Number(),
    file: Type.String(),
});

export const clientIdParams = Type.Object({
    clientId: Type.Number()
});

export const policyIdParams = Type.Object({
    id: Type.Number()
});

export const changeStatusPayload = Type.Object({
    status: ProviderOfPolicyStatus
});

export const pdfFileName = Type.Object({
    fileName: Type.String()
});

export const policyResponse = Type.Object({
    id: Type.Number(),
    number: Type.String(),
    issuedAt: Type.String({ format: "date" }),
    expiresAt: Type.String({ format: "date" }),
    insurancePremium: Type.Number(),
    coverage: Type.Number(),
    policyPath: Type.String(),
    insuredPersonId: Type.Number(),
    insuranceProductId: Type.Number()
});

export const allPolicies = Type.Optional(Type.Array(policyResponse));

export const fileRaw = Type.Object({});

export const sendFileResponse = Type.Object({})

export type GenerationOfPdfFilePayload = Static<typeof generationOfPdfFilePayload>
export type AddPolicyPayload = Static<typeof addPolicyPayload>
export type ClientIdParams = Static<typeof clientIdParams>;
export type PolicyIdParams = Static<typeof policyIdParams>;
export type ChangeStatusPayload = Static<typeof changeStatusPayload>
export type PdfFileName = Static<typeof pdfFileName>;
export type PolicyResponse = Static<typeof policyResponse>
export type SendFileResponse = Static<typeof sendFileResponse>
export type FileRaw = Static<typeof fileRaw>
