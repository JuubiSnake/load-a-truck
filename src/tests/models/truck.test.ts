import { Parcel } from "../../models/parcel";
import { Truck } from "../../models/truck";
import { Weight } from "../../models/weight";

describe('models/truck', () => {
    it('should be able to be constructed given an id and weightCapacity', () => {
        const id = "my-truck";
        const cap = new Weight(100);
        const truck = new Truck(id, cap);
        expect(truck.getID()).toStrictEqual(id);
        expect(truck.getWeightCapacity()).toStrictEqual(cap);
    });

    it('should have no parcel weight when constructed', () => {
        const truck = new Truck("my-truck", new Weight(10));
        expect(truck.getCurrentWeight()).toStrictEqual(Weight.Empty());
    });

    it('should have no parcels loaded when constructed', () => {
        const truck = new Truck("my-truck", new Weight(10));
        expect(truck.getLoadedParcelIDs()).toStrictEqual([]);
    });

    it('should be able to load a parcel given there is enough capacity', () => {
        const truck = new Truck("my-truck", new Weight(10));
        const parcel = new Parcel("my-parcel", new Weight(10));
        expect(truck.loadParcel(parcel).isErr).toBeFalsy();
    });

    it('should retain a parcels ID when loaded', () => {
        const truck = new Truck("my-truck", new Weight(10));
        const parcel = new Parcel("my-parcel", new Weight(10));
        truck.loadParcel(parcel);
        expect(truck.getLoadedParcelIDs()).toContain(parcel.getID());
    });

    it('should have its current weight updated when loading a parcel', () => {
        const truck = new Truck("my-truck", new Weight(10));
        expect(truck.getCurrentWeight()).toStrictEqual(Weight.Empty());
        const parcel = new Parcel("my-parcel", new Weight(10));
        truck.loadParcel(parcel);
        expect(truck.getCurrentWeight()).toStrictEqual(new Weight(10));
    });

    it('should not load parcel when there is not enough capacity', () => {
        const truck = new Truck("my-truck", new Weight(10));
        const parcel = new Parcel("my-parcel", new Weight(10.1));
        expect(truck.loadParcel(parcel).isErr).toBeTruthy();
    });

    it('should not have its weight increased when rejecting to load a parcel', () => {
        const truck = new Truck("my-truck", new Weight(10));
        const parcel = new Parcel("my-parcel", new Weight(10.1));
        truck.loadParcel(parcel);
        expect(truck.getCurrentWeight()).toStrictEqual(Weight.Empty());
    });
});