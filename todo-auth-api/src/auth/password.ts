import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

const KEY_LEN = 64;

export function hashPassword(password: string): string {
    const salt = randomBytes(16);

    const derivedKey = scryptSync(
        password,
        salt,
        KEY_LEN
    )

    return `${salt.toString("hex")}:${derivedKey.toString("hex")}`;
}

export function verifyPassword(
    password: string,
    storedHash: string
): boolean {
    const [saltHex, hashHex] = storedHash.split(":");

    if(!saltHex || !hashHex){
        return false;
    }

    const salt = Buffer.from(saltHex, "hex");
    const storedKey = Buffer.from(hashHex, "hex");

    const derivedKey = scryptSync(
        password,
        salt,
        KEY_LEN
    )

    if(storedKey.length != derivedKey.length){
        return false;
    }

    return timingSafeEqual(storedKey, derivedKey);
}