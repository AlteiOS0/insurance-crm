import { CreateClientType } from "../../../types/personalData";

export const policies = [{}];

export const clientResponse = {
    id: 1,
    firstName: "Алексей",
    lastName: "Алексеев",
    phoneNumber: "+7911111111111",
    inn: "123412321321",
    surname: "Алексеевич",
    email: "alex@mail.ru",
    passportId: 1,
    passport: {
        id: 1,
        seria: "2221",
        number: "384919",
        issuedByWhom: "ОВД",
        issuedAt: new Date("2024-03-11"),
        departmentCode: "222-222",
        dateOfBirth: new Date("2001-03-03"),
        placeOfBirth: "Москва",
        registrationAddress: {
            id: 1,
            region: "Московская область",
            city: "Москва",
            street: "ул. Ленина",
            house: "д. 20",
            apartment: "кв. 219",
            registeredAt: new Date("2021-08-19"),
            passportId: 1
        },
        residentialAddress: {
            id: 1,
            region: "Московская область",
            city: "Москва",
            street: "ул. Ленина",
            house: "д. 20",
            apartment: "кв. 219",
            passportId: 1
        }
    },
    policies: policies
}

export const clientDataForService: CreateClientType = {
    client: {
        firstName: "Алексей",
        lastName: "Алексеев",
        phoneNumber: "+79111111111",
        inn: "782657574446",
        surname: "Алексеевич",
        email: "alex@mail.ru"
    },
    passport: {
        seria: "2221",
        number: "384919",
        issuedByWhom: "ОВД",
        issuedAt: "2024-03-11",
        departmentCode: "222-222",
        dateOfBirth: "2001-03-03",
        placeOfBirth: "Москва",
    },
    registrationAddress: {
        region: "Московская область",
        city: "Москва",
        street: "ул. Ленина",
        house: "д. 20",
        apartment: "кв. 219",
        registeredAt: "2021-08-19",
    },
    residentialAddress: {
        region: "Московская область",
        city: "Москва",
        street: "ул. Ленина",
        house: "д. 20",
        apartment: "кв. 219",
    }
}