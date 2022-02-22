export interface WeightSchema {
    kg: number
}

export const isWeightSchema = (unknown: unknown): unknown is WeightSchema => {
    if (unknown === undefined || unknown === null) {
        return false;
    }
    if (typeof unknown !== 'object' || Array.isArray(unknown)) {
        return false;
    }
    let keys = Object.keys(unknown);
    return keys.includes("kg");
};