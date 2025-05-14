import { PDFDocument } from "pdf-lib";
import PolicyRepository from "../repositories/policyRepository";
import { readFile, writeFile, readdir, stat } from "fs/promises";
import fontkit from "@pdf-lib/fontkit";
import createHttpError from "http-errors";
import { randomInt, randomUUID } from "crypto";
import { join } from "path";
import { AddPolicyPayload, ClientIdParams, GenerationOfPdfFilePayload, PdfFileName, PolicyIdParams, SendFileResponse } from "../schemas/policySchema";
import { validateAddPolicyPayload, validateClientIdParams, validateGenerationOfPdfFilePayload, validatePolicyFileName, validatePolicyIdParams } from "../schemas/policyValidator";
import PolicyNumberReservedRepository from "../repositories/policyNumberReservedRepository";

export default class PolicyService {
    constructor(private readonly repository: PolicyRepository, private readonly reserveRepository: PolicyNumberReservedRepository) {}

    private readonly wordOfMonth: Record<number, string> = {
        0: "января",
        1: "февраля",
        2: "марта",
        3: "апреля",
        4: "мая",
        5: "июня",
        6: "июля",
        7: "августа",
        8: "сентября",
        9: "октября",
        10: "ноября",
        11: "декабря",
    };

    private readonly directory: string = "./assets/policies";

    async addPolicy(payload: AddPolicyPayload, uuid?: string) {
        const valid = validateAddPolicyPayload(payload);
        if(!valid)
            throw createHttpError.BadRequest(JSON.stringify(validateAddPolicyPayload.errors));

        const expiresAt = this.calculateDate(payload.insurancePeriod).toISOString();
        const directory = await this.addFileToDirectory(payload.file);
        const policyNumber = (await this.reserveRepository.getPolicyNumber(uuid!)).number;
        const policy = await this.repository.addPolicy({...payload, expiresAt: expiresAt, policyPath: directory, policyStatus: "not_paid", number: policyNumber });

        return policy;
    }

    async getAllPolicies(params: ClientIdParams) {
        const valid = validateClientIdParams(params);
        if(!valid)
            throw createHttpError.BadRequest(JSON.stringify(validateClientIdParams.errors));
        
        return await this.repository.getAllPolicies(params);
    }

    async getPolicy(params: PolicyIdParams) {
        const valid = validatePolicyIdParams(params);
        if(!valid)
            throw new createHttpError.BadRequest(JSON.stringify(validatePolicyIdParams.errors));

        return await this.repository.getPolicy(Number(params.id));
    }

    async getFile(params: PdfFileName) {
        const valid = validatePolicyFileName(params);
        if(!valid)
            throw new createHttpError.BadRequest(JSON.stringify(validatePolicyFileName.errors));

        const filePath = join(this.directory, params.fileName);

        try {
            const fileRaw = await readFile(filePath);

            return fileRaw;
        } catch (e) {
            throw new createHttpError.NotFound("File not found");
        }
    }

    async addFileToDirectory(pdf: string): Promise<string | undefined> {
        if(!pdf) 
            throw new createHttpError.BadRequest("File not loaded");
        
        try {
            let count = (await readdir(this.directory)).length;
            const random = randomInt(2**32);
            count += random;
            const filePath = join(this.directory, `${count}.pdf`);

            await writeFile(filePath, Buffer.from(pdf, "base64"));

            return `${count}.pdf`;
        } catch (e) {
            throw new createHttpError.InternalServerError("File system error");
        }
    }

    async sendPolicyToClient(payload: GenerationOfPdfFilePayload, employee: string = "Alexey") {
        const valid = validateGenerationOfPdfFilePayload(payload);
        if(!valid)
            throw new createHttpError.BadRequest(JSON.stringify(validateGenerationOfPdfFilePayload.errors));

        if(employee == "" || employee == undefined) {
            throw new createHttpError.InternalServerError("Auth error");
        }

        const policyNumber = String(100000000000 + randomInt(9999999999));
        const uuid = randomUUID();
        await this.reserveRepository.reservePolicyNumber({ number: policyNumber, uuid: uuid });
        const file = await this.generatePolicyPdf(payload, employee, policyNumber);

        return { file: file, uuid: uuid };
    }

    private calculateDate(period: number) {
        return new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 30 * 12 * period)
    }

    private async generatePolicyPdf(payload: GenerationOfPdfFilePayload, employee: string, policyNumber: string) {
        const pdfDoc = await PDFDocument.create();
        const openSansRegularRaw = await readFile("./assets/fonts/OpenSans-Regular.ttf");
        const openSansSemiBoldRaw = await readFile("./assets/fonts/OpenSans-SemiBold.ttf");
        pdfDoc.registerFontkit(fontkit);
    
        const openSansRegular = await pdfDoc.embedFont(openSansRegularRaw);
        const openSansSemiBold = await pdfDoc.embedFont(openSansSemiBoldRaw);
    
        const fontSize = 14;
        const fontSizeNote = 10;
        const page = pdfDoc.addPage([(21 / 2.54) * 96, (29.7 / 2.54) * 96]);
        const { width, height } = page.getSize();
    
        const date = new Date();
        let day = String(date.getDate());
        const month = this.wordOfMonth[date.getMonth()]; 
        const year = date.getFullYear();
        
        if(day.length == 1) {
            day = String(`0${day}`)
        }
        
        const dateText = `«${day}» ${month} ${year} г.`;
    
        const leftIndent = width / 96 + 40;
        const rightIndent = width - dateText.length * fontSize / 2 - 40;

        const insurancePeriodDate = this.calculateDate(payload.insuranceProduct.insurancePeriod);

        const insurancePeriod = {
            day: String(insurancePeriodDate.getDate()),
            month: this.wordOfMonth[insurancePeriodDate.getMonth()] ,
            year: insurancePeriodDate.getFullYear()
        }

        if(insurancePeriod.day.length == 1) {
            insurancePeriod.day = String(`0${insurancePeriod.day}`);
        }
    
        page.drawText(`Договор страхования № ${policyNumber}`, {
            x: width / 2.54 - 50,
            y: height - 75,
            font: openSansRegular,
            size: fontSize
        });
    
        page.drawText(`г. Москва`, {
            x: leftIndent,
            y: height - 125,
            font: openSansRegular,
            size: fontSize
        });
    
        page.drawText(dateText, {
            x: rightIndent,
            y: height - 125,
            font: openSansRegular,
            size: fontSize
        });
    
        page.drawText("1. Страховая компания:", {
            x: leftIndent,
            y: height - 175 - fontSize,
            font: openSansSemiBold,
            size: fontSize
        });
    
        const organizationName = 'СК "КБ Страхование"';
    
        page.drawText(`${organizationName} \nАдрес: г. Москва, ул Страховая, д. 491 \nПредставитель ${employee}`, {
            x: leftIndent,
            y: height - 205 - fontSize,
            font: openSansRegular,
            size: fontSize
        });
    
        page.drawText("2. Страхователь:", {
            x: leftIndent,
            y: height - 305 - fontSize,
            font: openSansSemiBold,
            size: fontSize
        });
    
        page.drawText(`ФИО: ${payload.client.fio}\n` +
            `Дата рождение: ${payload.client.passport.dateOfBirth}\n` +
            `Паспорт: серия: ${payload.client.passport.seria}, номер: ${payload.client.passport.number}\n` +
            `Дата выдачи: ${payload.client.passport.issuedAt}, кто выдал: ${payload.client.passport.issuedWho}\n` +
            `Адрес проживания: ${payload.client.passport.registrationAddress}`, {
                x: leftIndent,
                y: height - 335 - fontSize,
                font: openSansRegular,
                size: fontSize
        });
    
        page.drawText("3. Предмет договора:", {
            x: leftIndent,
            y: height - 485 - fontSize,
            font: openSansSemiBold,
            size: fontSize
        });
    
        page.drawText("Страховая компания обязуется за страховую премию обеспечить страховую защиту по следующему\n" +
            "продукту:", {
            x: leftIndent,
            y: height - 515 - fontSize,
            font: openSansRegular,
            size: fontSize
        });
    
        page.drawText(`Страховой продукт: ${payload.insuranceProduct.name}\n` +
            `Срок страхования: до ${insurancePeriod.day} ${insurancePeriod.month} ${insurancePeriod.year}\n` +
            `Страховая сумма: ${payload.insuranceProduct.coverage}\n` +
            `Страховая премия: ${payload.insuranceProduct.insurancePremium}`, {
                x: leftIndent + 20,
                y: height - 575 - fontSize,
                font: openSansRegular,
                size: fontSize
        });
    
        page.drawText("4. Условия страхования:", {
            x: leftIndent,
            y: height - 695 - fontSize,
            font: openSansSemiBold,
            size: fontSize
        });
    
        page.drawText("Общие условия и исключения определяются в соответствии с правилами страхования, утверждёнными\n" +
            "Страховщиком. Договор считается заключённым с момента уплаты страховой премии.", {
            x: leftIndent,
            y: height - 725 - fontSize,
            font: openSansRegular,
            size: fontSize
        });
    
        page.drawText("5. Подписи сторон:", {
            x: leftIndent,
            y: height - 795 - fontSize,
            font: openSansSemiBold,
            size: fontSize
        });
    
        page.drawText(`Страхователь: ______________ ________________________ `, { // 22 и 40
            x: leftIndent,
            y: height - 845 - fontSize,
            font: openSansRegular,
            size: fontSize
        });
    
        page.drawText("(подпись)", {
            x: 169,
            y: height - 855 - fontSize,
            font: openSansRegular,
            size: fontSizeNote
        });
    
        page.drawText("(инициалы)", {
            x: 285,
            y: height - 855 - fontSize,
            font: openSansRegular,
            size: fontSizeNote
        });
    
        page.drawText(`Страховщик: ______________ ${employee}`, {
            x: leftIndent,
            y: height - 905 - fontSize,
            font: openSansRegular,
            size: fontSize
        })
    
        page.drawText("(подпись)", {
            x: 154,
            y: height - 915 - fontSize,
            font: openSansRegular,
            size: fontSizeNote
        });
    
        return await pdfDoc.save();
    }
}