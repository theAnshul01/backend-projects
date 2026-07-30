
export function parseAmount(value: string): number {
    const amount = Number(value);
    if(Number.isNaN(amount)){
        throw new Error(`"${value}" is not a valid number`);
    }
    if(amount <= 0) {
        throw new Error("Amount must be greater than zero");
    }

    return Math.round(amount * 100) / 100;
}