import { isWeightSchema, WeightSchema } from "./weight";

export interface ParcelsResponse {
    parcels: Array<ParcelSchema>
}

export interface ParcelResponse {
    parcel: ParcelSchema
}

export interface ParcelSchema {
    id: string;
    weight: WeightSchema;
}

export const isParcelListSchema = (unknown: unknown): unknown is ParcelSchema[] => {
    if (unknown === undefined || unknown === null) {
        return false;
    }
    if (!Array.isArray(unknown)) {
        return false;
    }
    return unknown.every(isParcelSchema);
}

export const isParcelSchema = (unknown: unknown): unknown is ParcelSchema =>  {
    if (unknown === undefined || unknown === null) {
        return false;
    }
    if (typeof unknown !== 'object' || Array.isArray(unknown)) {
        return false;
    }
    const entries = Object.entries(unknown);
    const valiatedProps = {
        id: false,
        weight: false,
    };
    for (const [key, value] of entries) {
      switch(key) {
        case "id":
            valiatedProps.id = typeof key === 'string';
            break;
        case "weight":
            valiatedProps.weight = isWeightSchema(value);
            break;
        default:
            continue;
      } 
    }
    return Object.values(valiatedProps).every(v => v);
}