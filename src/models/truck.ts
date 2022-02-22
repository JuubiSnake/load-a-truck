import { Result } from "@badrap/result";
import { ParcelInterface, VehicleError, VehicleInterface, VehicleType } from "./interfaces";
import { Weight } from "./weight";

export class Truck implements VehicleInterface {
    private id: string;
    private type: VehicleType;
    private weightCapacity: Weight;
    private parcelIDs: Array<string>;
    private currentWeight: Weight;

    constructor(id: string, weightCapacity: Weight) {
        this.id = id;
        this.type = VehicleType.Truck;
        this.weightCapacity = weightCapacity;
        this.parcelIDs = [];
        this.currentWeight = Weight.Empty();
    }

    getType(): VehicleType {
        return this.type;
    }

    getID(): string {
        return this.id;
    }
    
    getWeightCapacity(): Weight {
        return this.weightCapacity;
    }
    
    loadParcel(parcel: ParcelInterface): Result<boolean, VehicleError> {
        const isParcelOnTruck = this.parcelIDs.includes(parcel.getID());
        if (isParcelOnTruck) {
            return Result.err(new VehicleError(`could not load parcel, parcel ${parcel.getID()} is already on truck ${this.id}}`));
        }
        const combinedLoad = Weight.Plus(parcel.getWeight(), this.getCurrentWeight());
        if (Weight.LessThan(this.weightCapacity, combinedLoad)) {
            return Result.err(new VehicleError(`cannot load parcel ${parcel.getID()} onto truck, it weighs too much`));
        }
        this.parcelIDs.push(parcel.getID());
        this.currentWeight = combinedLoad;
        return Result.ok(true);
    }

    unloadParcel(parcel: ParcelInterface): Result<boolean, VehicleError> {
        const isParcelOnTruck = this.parcelIDs.includes(parcel.getID());
        if (!isParcelOnTruck) {
            return Result.err(new VehicleError(`could not unload parcel, parcel ${parcel.getID()} is not on truck ${this.id}}`));
        }
        let remainingParcels = this.parcelIDs.filter(p => p !== parcel.getID());
        this.parcelIDs = remainingParcels;
        this.currentWeight = Weight.Minus(this.currentWeight, parcel.getWeight());
        return Result.ok(true);
    }

    getCurrentWeight(): Weight {
        return this.currentWeight;
    }

    getLoadedParcelIDs(): Array<string> {
        return this.parcelIDs;
    }
} 