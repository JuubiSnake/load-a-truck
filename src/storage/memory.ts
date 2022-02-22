import { Result } from "@badrap/result";
import { ParcelInterface, VehicleInterface } from "../models/interfaces";
import { StorageError, StorageErrorType, StorageClient } from "./interfaces";

export class MemoryStorageClient implements StorageClient {
    private vehicles: Map<string, VehicleInterface>;
    private parcels: Map<string, ParcelInterface>;

    constructor() {
        this.vehicles = new Map();
        this.parcels = new Map();
    }

    addParcel(parcel: ParcelInterface): Result<ParcelInterface, StorageError> {
        if (this.parcels.has(parcel.getID())) {
            return Result.err(new StorageError(StorageErrorType.AlreadyExists, `unable to add parcel with id ${parcel.getID()} since it already exists`))
        }
        this.parcels.set(parcel.getID(), parcel);
        return Result.ok(parcel);
    }

    addParcels(parcels: ParcelInterface[]): Result<ParcelInterface[], StorageError> {
        const existingIDs = Array.from(this.parcels.values()).map(p => p.getID());
        const newIDs = parcels.map(p => p.getID());
        for (const id of existingIDs) {
            if (newIDs.includes(id)) {
                return Result.err(new StorageError(StorageErrorType.AlreadyExists, `unable to add parcel with id ${id} since it already exists`))
            }
        }
        parcels.map((p) => this.parcels.set(p.getID(), p));
        return Result.ok(parcels);
    }

    getParcel(id: string): Result<ParcelInterface, StorageError> {
        let parcel = this.parcels.get(id);
        if (parcel === undefined) {
            return Result.err(new StorageError(StorageErrorType.NotFound, `unable to find parcel with id ${id}`));
        }
        return Result.ok(parcel);
    }

    listParcels(): Result<ParcelInterface[], StorageError> {
        return Result.ok(Array.from(this.parcels.values()));
    }

    deleteParcel(id: string): Result<ParcelInterface, StorageError> {
        let parcel = this.getParcel(id);
        if (parcel.isErr) {
            return Result.err(parcel.error);
        }
        if (!this.parcels.delete(id)) {
            return Result.err(new StorageError(StorageErrorType.InternalError, `unable to delete parcel with id ${id} from in-memory map`));
        }
        return Result.ok(parcel.value);
    }

    deleteParcels(): Result<Array<ParcelInterface>, StorageError> {
        let list = this.listParcels();
        if (list.isErr) {
            return Result.err(list.error);
        }
        this.parcels = new Map();
        return Result.ok(list.value);
    }

    addVehicle(vehicle: VehicleInterface): Result<VehicleInterface, StorageError> {
        if (this.vehicles.has(vehicle.getID())) {
            return Result.err(new StorageError(StorageErrorType.AlreadyExists, `unable to add vehicle with id ${vehicle.getID()} since it already exists`));
        }
        this.vehicles.set(vehicle.getID(), vehicle);
        return Result.ok(vehicle);
    }

    addVehicles(vehicles: VehicleInterface[]): Result<VehicleInterface[], StorageError> {
        const existingIDs = Array.from(this.vehicles.values()).map(p => p.getID());
        const newIDs = vehicles.map(p => p.getID());
        for (const id of existingIDs) {
            if (newIDs.includes(id)) {
                return Result.err(new StorageError(StorageErrorType.AlreadyExists, `unable to add vehicle with id ${id} since it already exists`))
            }
        }
        vehicles.map((p) => this.vehicles.set(p.getID(), p));
        return Result.ok(vehicles);
    }

    getVehicle(id: string): Result<VehicleInterface, StorageError> {
        let vehicle = this.vehicles.get(id);
        if (vehicle === undefined) {
            return Result.err(new StorageError(StorageErrorType.NotFound, `unable to find vehicle with id ${id}`));
        }
        return Result.ok(vehicle);
    }

    listVehicles(): Result<VehicleInterface[], StorageError> {
        return Result.ok(Array.from(this.vehicles.values()));
    }

    deleteVehicle(id: string): Result<VehicleInterface, StorageError> {
        let vehicle = this.getVehicle(id);
        if (vehicle.isErr) {
            return Result.err(vehicle.error);
        }
        if (!this.vehicles.delete(id)) {
            return Result.err(new StorageError(StorageErrorType.InternalError, `unable to delete vehicle with id ${id} from in-memory map`));
        }
        return Result.ok(vehicle.value);
    }

    deleteVehicles(): Result<Array<VehicleInterface>, StorageError> {
        let list = this.listVehicles();
        if (list.isErr) {
            return Result.err(list.error);
        }
        this.vehicles = new Map();
        return Result.ok(list.value);
    }
}