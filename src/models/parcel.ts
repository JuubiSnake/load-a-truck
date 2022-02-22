import { ParcelInterface } from "./interfaces";
import { Weight } from "./weight";


export class Parcel implements ParcelInterface {
    private id: string;
    private weight: Weight;

    constructor(id: string, weight: Weight) {
        this.id = id;
        this.weight = new Weight(weight.kg);
    }

    getID(): string {
        return this.id;
    }
    getWeight(): Weight {
        return this.weight;
    }
}
