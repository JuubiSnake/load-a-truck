import { Parcel } from "../../models/parcel";
import { Truck } from "../../models/truck";
import { Weight } from "../../models/weight";
import { StorageErrorType } from "../../storage/interfaces";
import { MemoryStorageClient } from "../../storage/memory";

describe('storage/memory', () => {
    it('should be able to store a parcel with no data loss', () => {
        const store = new MemoryStorageClient();
        const parcel = new Parcel("my-parcel", new Weight(10));
        const result = store.addParcel(parcel);
        expect(result.isOk).toBeTruthy();
        expect(result.unwrap()).toStrictEqual(parcel);
    });

    it('should never attempt to store a parcel when one with the same identifier exists', () => {
        const store = new MemoryStorageClient();
        const parcel = new Parcel("my-parcel", new Weight(10));
        store.addParcel(parcel);
        const result = store.addParcel(parcel);
        if (!result.isErr) {
            fail("adding another parcel with the same ID should have failed");
        }
        expect(result.error.getType()).toStrictEqual(StorageErrorType.AlreadyExists);
    });

    it('should be able to list parcels when added', () => {
        const store = new MemoryStorageClient();
        expect(store.listParcels().unwrap()).toStrictEqual([]);

        const coolParcel = new Parcel("cool-parcel", new Weight(10));
        const uncoolParcel = new Parcel("uncool-parcel", new Weight(10));
        store.addParcel(coolParcel);
        store.addParcel(uncoolParcel);
        
        const result = store.listParcels();
        expect(result.isOk).toBeTruthy();
        expect(result.unwrap()).toContain(coolParcel);
        expect(result.unwrap()).toContain(uncoolParcel);
    });

    it('should be able to delete a parcel that exists in the store', () => {
        const store = new MemoryStorageClient();

        const coolParcel = new Parcel("cool-parcel", new Weight(10));
        store.addParcel(coolParcel);

        const deleteResult = store.deleteParcel(coolParcel.getID());
        expect(deleteResult.isOk).toBeTruthy();
        expect(deleteResult.unwrap()).toStrictEqual(coolParcel);

        const listResult = store.listParcels();
        expect(listResult.unwrap()).not.toContain(coolParcel);
    });

    it('should be able to remove all parcels from the store', () => {
        const store = new MemoryStorageClient();

        const coolParcel = new Parcel("cool-parcel", new Weight(10));
        const uncoolParcel = new Parcel("uncool-parcel", new Weight(10));
        store.addParcel(coolParcel);
        store.addParcel(uncoolParcel);

        const deleteAllResult = store.deleteParcels();
        expect(deleteAllResult.isOk).toBeTruthy();
        expect(deleteAllResult.unwrap()).toContain(coolParcel);
        expect(deleteAllResult.unwrap()).toContain(uncoolParcel);

        const listResult = store.listParcels();
        expect(listResult.unwrap()).toStrictEqual([]);
    });

    it('should be able to store a vehicle with no data loss', () => {
        const store = new MemoryStorageClient();
        const vehicle = new Truck("my-truck", new Weight(10));
        const result = store.addVehicle(vehicle);
        expect(result.isOk).toBeTruthy();
        expect(result.unwrap()).toStrictEqual(vehicle);
    });

    it('should never attempt to store a vehicle when one with the same identifier exists', () => {
        const store = new MemoryStorageClient();
        const truck = new Truck("my-truck", new Weight(10));
        store.addVehicle(truck);
        const result = store.addVehicle(truck);
        if (!result.isErr) {
            fail("adding another truck with the same ID should have failed");
        }
        expect(result.error.getType()).toStrictEqual(StorageErrorType.AlreadyExists);
    });

    it('should be able to list vehicles when added', () => {
        const store = new MemoryStorageClient();
        expect(store.listParcels().unwrap()).toStrictEqual([]);

        const coolVehicle = new Truck("cool-vehicle", new Weight(10));
        const uncoolVehicle = new Truck("uncool-vehicle", new Weight(10));
        store.addVehicle(coolVehicle);
        store.addVehicle(uncoolVehicle);
        
        const result = store.listVehicles();
        expect(result.isOk).toBeTruthy();
        expect(result.unwrap()).toContain(coolVehicle);
        expect(result.unwrap()).toContain(uncoolVehicle);
    });

    it('should be able to delete a vehicle that exists in the store', () => {
        const store = new MemoryStorageClient();

        const truck = new Truck("cool-parcel", new Weight(10));
        store.addVehicle(truck);

        const deleteResult = store.deleteVehicle(truck.getID());
        expect(deleteResult.isOk).toBeTruthy();
        expect(deleteResult.unwrap()).toStrictEqual(truck);

        const listResult = store.listVehicles();
        expect(listResult.unwrap()).not.toContain(truck);
    });

    it('should be able to remove all vehicles from the store', () => {
        const store = new MemoryStorageClient();

        const coolVehicle = new Truck("cool-Vehicle", new Weight(10));
        const uncoolVehicle = new Truck("uncool-Vehicle", new Weight(10));
        store.addVehicle(coolVehicle);
        store.addVehicle(uncoolVehicle);

        const deleteAllResult = store.deleteVehicles();
        expect(deleteAllResult.isOk).toBeTruthy();
        expect(deleteAllResult.unwrap()).toContain(coolVehicle);
        expect(deleteAllResult.unwrap()).toContain(uncoolVehicle);

        const listResult = store.listVehicles();
        expect(listResult.unwrap()).toStrictEqual([]);
    });
});