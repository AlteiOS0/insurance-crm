export type Client = {
    firstName: string,
    lastName: string,
    phoneNumber: string,
    inn: string,
    surname?: string,
    email?: string
}

export type Passport = {
    seria: string,
    number: string,
    issuedByWhom: string,
    issuedAt: string,
    departmentCode: string,
    dateOfBirth: string,
    placeOfBirth: string
}

export type RegistrationAddress = {
    region: string,
    city: string,
    street: string,
    house: string,
    apartment?: string,
    registeredAt: string
}

export type ResidentialAddress = {
    region: string,
    city: string,
    street: string,
    house: string,
    apartment?: string,
};

export type CreateClientType = {
    client: Client,
    passport: Passport,
    registrationAddress: RegistrationAddress,
    residentialAddress: ResidentialAddress
}