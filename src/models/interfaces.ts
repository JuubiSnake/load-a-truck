import { Result } from "@badrap/result";
import { Weight } from "./weight";

export enum VehicleType {
    Truck = "truck"
}

export class VehicleError extends Error {
    constructor(msg: string) {
        super(msg);

        Object.setPrototypeOf(this, VehicleError.prototype);
    }
}

export interface VehicleInterface {
    getLoadedParcelIDs(): Array<string>;
    loadParcel(parcel: ParcelInterface): Result<boolean, VehicleError>;
    unloadParcel(parcel: ParcelInterface): Result<boolean, VehicleError>;
    getCurrentWeight(): Weight;
    getWeightCapacity(): Weight;
    getID(): string;
    getType(): VehicleType;
}

export interface ParcelInterface {
    getID(): string;
    getWeight(): Weight;
}