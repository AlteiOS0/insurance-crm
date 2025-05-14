import createHttpError from "http-errors";
import SessionRepository from "../repositories/sessionRepository";
import { validateAddSessionPayload, validateBothRefreshTokens, validateSessionRefreshToken,  } from "../schemas/sessionValidator";
import { AddSessionPayload, OldAndNewRefreshTokens, SessionRefreshToken } from "../schemas/sessionSchema";

export default class SessionService {
    constructor(private readonly repository: SessionRepository) {}

    async addSession(payload: AddSessionPayload) {
        const valid = validateAddSessionPayload(payload);
        if(!valid)
            throw new createHttpError.InternalServerError(JSON.stringify(validateAddSessionPayload));

        return await this.repository.addSession(payload);
    }

    async updateRefreshToken(tokens: OldAndNewRefreshTokens) {
        const valid = validateBothRefreshTokens(tokens);
        if(!valid)
            throw new createHttpError.BadRequest(JSON.stringify(validateBothRefreshTokens));

        return await this.repository.updateRefreshToken(tokens.oldRefreshToken, tokens.newRefreshToken);
    }

    async getSession(token: SessionRefreshToken) {
        const valid = validateSessionRefreshToken(token);
        if(!valid)
            throw new createHttpError.BadRequest(JSON.stringify(validateSessionRefreshToken));

        const session = await this.repository.getSession(token);
        if(!session)
            throw new createHttpError.Unauthorized("Refresh token invalid");

        return session;
    }
}