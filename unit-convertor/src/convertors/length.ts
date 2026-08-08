export type LengthUnit = 
    | "mm"
    | "cm"
    | "m"
    | "km"
    | "inch"
    | "foot"
    | "yard"
    | "mile";

//  conversion factor 
const toMeters: Record<LengthUnit, number> = {
    mm: 0.001,
    cm: 0.01,
    m : 1,
    km: 1000,
    inch: 0.0254,
    foot: 0.3048,
    yard: 0.9144,
    mile: 1609.34,
}

export const lengthUnits = Object.keys(toMeters) as LengthUnit[];

export function convertLength(value: number, from: LengthUnit, to: LengthUnit): number {
    const meters = value * toMeters[from];
    return meters / toMeters[to];
}

