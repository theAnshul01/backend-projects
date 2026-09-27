import jwt from "jsonwebtoken";
import type { User } from  "../types/user.types.js";

const JWT_SECRET = process.env.JWT_SECRET;

if(!JWT_SECRET){
    throw new Error("JWT_SECRET is not defined.");
}

const ACCESS_TOKEN_EXPIRES_IN = "15m";
const REFRESH_TOKEN_EXPIRES_IN = "1d";

export function generateAccessToken(user: User): string {
    const token = jwt.sign(
        {
            userId: user.id,
            username: user.username,
            type: "access",
        },
        JWT_SECRET as string,
        {
            expiresIn: ACCESS_TOKEN_EXPIRES_IN,
        }
    );

    return token;
}

export function generateRefreshToken(user: User): string {
    const token = jwt.sign(
        {
            userId: user.id,
            username: user.username,
            type: "refresh",
        },
        JWT_SECRET as string,
        {
            expiresIn: REFRESH_TOKEN_EXPIRES_IN
        }
    );

    return token;
}

export function verifyAccessToken(token: string){
    const payload = jwt.verify(token, JWT_SECRET as string);

    if(typeof payload !== 'object' || payload == null || payload.type !== 'access'){
        throw new Error("invalid access token!");
    }

    return payload;
}

export function verifyRefreshToken(token: string){
    const payload = jwt.verify(token, JWT_SECRET as string);

    if(
        typeof payload !== 'object' || payload == null || payload.type !== 'refresh'
    ) {
        throw new Error("Invalid refresh token!");
    }

    return payload;

}