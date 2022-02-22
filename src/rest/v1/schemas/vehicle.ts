import { VehicleType } from "../../../models/interfaces";
import { enumFromString } from "../../../utils/enums";
import { isWeightSchema, WeightSchema } from "./weight";

export interface VehiclesResponse {
    vehicles: Array<VehicleSchema>
}

export interface VehicleResponse {
    vehicle: VehicleSchema
}

export interface VehicleSchema {
    id: string
    type: VehicleType
    weightCapacity: WeightSchema
    currentWeight?: WeightSchema
    loadedParcels?: Array<string>
}

export const isVehicleListSchema = (unknown: unknown): unknown is VehicleSchema[] => {
    if (unknown === undefined || unknown === null) {
        return false;
    }
    if (!Array.isArray(unknown)) {
        return false;
    }
    return unknown.every(isVehicleSchema);
}

export const isVehicleSchema = (unknown: unknown): unknown is VehicleSchema => {
    if (unknown === undefined || unknown === null) {
        return false;
    }
    if (typeof unknown !== 'object' || Array.isArray(unknown)) {
        return false;
    }
    const entries = Object.entries(unknown);
    const valiatedProps = {
        id: false,
        type: false,
        weightCapacity: false,
    };
    for (const [key, value] of entries) {
      switch(key) {
        case "id":
            valiatedProps.id = typeof key === 'string';
            break;
        case "weightCapacity":
            valiatedProps.weightCapacity = isWeightSchema(value);
            break;
        case "type":
            if (typeof value !== "string") {
                break;
            }
            valiatedProps.type = enumFromString(VehicleType, value) !== undefined;
            break;
        default:
            continue;
      } 
    }
    return Object.values(valiatedProps).every(v => v);
}