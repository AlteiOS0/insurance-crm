import { ClientId, UpdateClientBody } from "../../../schemas/clientSchema";
import { CreateClientType } from "../../../types/personalData";

export const policies = [{}];

export const id: ClientId = {
    id: "1"
};

export const createAlexeyRequest: CreateClientType = {
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

export const createAlexeyResponse = {
    id: 1,
    firstName: "Алексей",
    lastName: "Алексеев",
    phoneNumber: "+79111111111",
    inn: "782657574446",
    surname: "Алексеевич",
    email: "alex@mail.ru",
    passport: {
        id: 1,
        seria: "2221",
        number: "384919",
        issuedByWhom: "ОВД",
        issuedAt: "2024-03-11",
        departmentCode: "222-222",
        dateOfBirth: "2001-03-03",
        placeOfBirth: "Москва",
        clientId: 1,
        registrationAddress: {
            id: 1,
            region: "Московская область",
            city: "Москва",
            street: "ул. Ленина",
            house: "д. 20",
            apartment: "кв. 219",
            registeredAt: "2021-08-19",
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
}

const updateAlexeyRequest: UpdateClientBody = {
    client: {
        email: "alex123@mail.ru",
        phoneNumber: "+79124456132"
    },
    passport: {
        seria: "1200",
        number: "901022"
    }
};
const updateAlexeyResponse = JSON.parse(JSON.stringify(createAlexeyResponse));

updateAlexeyResponse.email = "alex123@mail.ru";
updateAlexeyResponse.passport.seria = "1200";
updateAlexeyResponse.passport.number = "901022";
updateAlexeyResponse.phoneNumber = "+79124456132";
export { updateAlexeyRequest, updateAlexeyResponse };

export const AntonRequest: CreateClientType = {
    client: {
        firstName: "Антон",
        lastName: "Антонов",
        phoneNumber: "+79111111112",
        inn: "805440481754",
        surname: "Антонович",
        email: "anton@mail.ru"
    },
    passport: {
        seria: "1234",
        number: "383929",
        issuedByWhom: "ГУ МВД по Санкт-Петербургу",
        issuedAt: "2024-03-11",
        departmentCode: "202-203",
        dateOfBirth: "2001-03-03",
        placeOfBirth: "Санкт-Петербург",
    },
    registrationAddress: {
        region: "Ленинградская область",
        city: "Санкт-Петербург",
        street: "ул. Ленина",
        house: "д. 30",
        apartment: "кв. 101",
        registeredAt: "2021-08-19",
    },
    residentialAddress: {
        region: "Ленинградская область",
        city: "Санкт-Петербург",
        street: "ул. Ленина",
        house: "д. 30",
        apartment: "кв. 101",
    }
}

export const AntonResponse = {
    id: 2,
    firstName: "Антон",
    lastName: "Антонов",
    phoneNumber: "+79111111112",
    inn: "805440481754",
    surname: "Антонович",
    email: "anton@mail.ru",
    passport: {
        id: 2,
        seria: "1234",
        number: "383929",
        issuedByWhom: "ГУ МВД по Санкт-Петербургу",
        issuedAt: "2024-03-11",
        departmentCode: "202-203",
        dateOfBirth: "2001-03-03",
        placeOfBirth: "Санкт-Петербург",
        clientId: 2,
        registrationAddress: {
            id: 2,
            region: "Ленинградская область",
            city: "Санкт-Петербург",
            street: "ул. Ленина",
            house: "д. 30",
            apartment: "кв. 101",
            registeredAt: "2021-08-19",
            passportId: 2
        },
        residentialAddress: {
            id: 2,
            region: "Ленинградская область",
            city: "Санкт-Петербург",
            street: "ул. Ленина",
            house: "д. 30",
            apartment: "кв. 101",
            passportId: 2
        }
    },
}

export const SergeyRequest: CreateClientType = {
    client: {
        firstName: "Сергей",
        lastName: "Сергеев",
        phoneNumber: "+79111111113",
        inn: "920568921910",
        surname: "Сергеевич",
        email: "sergey@mail.ru"
    },
    passport: {
        seria: "5678",
        number: "123456",
        issuedByWhom: "ГУ МВД по Москве",
        issuedAt: "2024-03-12",
        departmentCode: "204-205",
        dateOfBirth: "1995-07-15",
        placeOfBirth: "Москва",
    },
    registrationAddress: {
        region: "Московская область",
        city: "Москва",
        street: "ул. Пушкина",
        house: "д. 10",
        apartment: "кв. 202",
        registeredAt: "2020-05-10",
    },
    residentialAddress: {
        region: "Московская область",
        city: "Москва",
        street: "ул. Пушкина",
        house: "д. 10",
        apartment: "кв. 202",
    }
}

export const SergeyResponse = {
    id: 3,
    firstName: "Сергей",
    lastName: "Сергеев",
    phoneNumber: "+79111111113",
    inn: "920568921910",
    surname: "Сергеевич",
    email: "sergey@mail.ru",
    passport: {
        id: 3,
        seria: "5678",
        number: "123456",
        issuedByWhom: "ГУ МВД по Москве",
        issuedAt: "2024-03-12",
        departmentCode: "204-205",
        dateOfBirth: "1995-07-15",
        placeOfBirth: "Москва",
        clientId: 3,
        registrationAddress: {
            id: 3,
            region: "Московская область",
            city: "Москва",
            street: "ул. Пушкина",
            house: "д. 10",
            apartment: "кв. 202",
            registeredAt: new Date("2020-05-10").toISOString(),
            passportId: 3
        },
        residentialAddress: {
            id: 3,
            region: "Московская область",
            city: "Москва",
            street: "ул. Пушкина",
            house: "д. 10",
            apartment: "кв. 202",
            passportId: 3
        }
    },
}

export const allClients = [
    {
        id: createAlexeyResponse.id,
        firstName: createAlexeyResponse.firstName,
        surname: createAlexeyResponse.surname,
        lastName: createAlexeyResponse.lastName,
        phoneNumber: updateAlexeyResponse.phoneNumber,
        email: updateAlexeyResponse.email
    },
    {
        id: AntonResponse.id,
        firstName: AntonResponse.firstName,
        surname: AntonResponse.surname,
        lastName: AntonResponse.lastName,
        phoneNumber: AntonResponse.phoneNumber,
        email: AntonResponse.email
    }
].reverse()