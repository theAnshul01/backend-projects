import jwt from "jsonwebtoken";
import type { User } from  "../types/user.types.js";

const JWT_SECRET = process.env.JWT_SECRET;

if(!JWT_SECRET){
    throw new Error("JWT_SECRET is not defined.");
}

export function generateToken(user: User): string {
    const token = jwt.sign(
        {
            userId: user.id,
            username: user.username,
        },
        JWT_SECRET as string,
        {
            expiresIn: "1h"
        }
    );

    return token;
}

export function verifyToken(token: string){
    return jwt.verify(token, JWT_SECRET as string);
}