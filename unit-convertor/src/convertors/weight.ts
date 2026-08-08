export type WeightUnit = 
    | "mg"
    | "g"
    | "kg"
    | "oz"
    | "lb";

const toGrams: Record<WeightUnit, number> = {
    mg: 0.001,
    g: 1,
    kg: 1000,
    oz: 28.3495,
    lb: 453.592,
}

export const weightUnits = Object.keys(toGrams) as WeightUnit[];

export function convertWeight(value: number, from: WeightUnit, to: WeightUnit): number {
    const grams = value * toGrams[from];
    return grams / toGrams[to];
}