import { Result } from "@badrap/result";
import { ParcelInterface, VehicleInterface } from "../models/interfaces";

export enum StorageErrorType {
    NotFound,
    InternalError,
    AlreadyExists
}

export class StorageError extends Error {
    private type: StorageErrorType;
    
    constructor(type: StorageErrorType, msg: string) {
        super(msg);
        this.type = type;

        Object.setPrototypeOf(this, StorageError.prototype);
    }

    public getType(): StorageErrorType {
        return this.type;
    }
}

export interface StorageClient {
    listParcels(): Result<Array<ParcelInterface>, StorageError>;
    deleteParcels(): Result<Array<ParcelInterface>, StorageError>;
    getParcel(id: string): Result<ParcelInterface, StorageError>;
    deleteParcel(id: string): Result<ParcelInterface, StorageError>;
    addParcel(parcel: ParcelInterface): Result<ParcelInterface, StorageError>;
    addParcels(parcels: Array<ParcelInterface>): Result<Array<ParcelInterface>, StorageError>;

    listVehicles(): Result<Array<VehicleInterface>, StorageError>;
    getVehicle(id: string): Result<VehicleInterface, StorageError>;
    addVehicle(vehicle: VehicleInterface): Result<VehicleInterface, StorageError>;
    addVehicles(vehicles: Array<VehicleInterface>): Result<Array<VehicleInterface>, StorageError>;
    deleteVehicle(id: string): Result<VehicleInterface, StorageError>;
    deleteVehicles(): Result<Array<VehicleInterface>, StorageError>,
}