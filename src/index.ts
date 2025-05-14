import { FastifyInstance } from "fastify";
import buildFastify from "./app";

(async () => {
    try {
        const app: FastifyInstance = await buildFastify();

        await app.listen({ port: 3000, host: "0.0.0.0" });
        console.log("Server started");
    } catch (e) {
        console.log(e);
    }
})()