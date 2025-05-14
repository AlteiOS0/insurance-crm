import { PrismaClient } from "@prisma/client";
import { createWriteStream } from "fs";
import { join } from "path";

const prisma = new PrismaClient({
    log: [
        { level: "query", emit: "event"},
        { level: "info", emit: "event" },
        { level: "warn", emit: "event" },
        { level: "error", emit: "event" }
    ]
});

const path = join(__dirname, "../logs/prisma.log");

const stream = createWriteStream(path, {flags: "a"});

prisma.$on("warn", async (event: any) => {
    const { message, target, timestamp } = event;
    const log = `[WARNING]: ${timestamp} ${target} ${message} \n\n`;

    stream.write(log);
});

prisma.$on("error", async (event: any) => {
    const { message, target, timestamp } = event;
    const log = `[ERROR]: ${timestamp} ${target} ${message} \n\n`;

    stream.write(log);
});

export default prisma;