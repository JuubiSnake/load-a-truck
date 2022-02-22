import { Parcel } from "../../models/parcel";
import { Weight } from "../../models/weight";

describe('models/parcel', () => {
    it('should be able to be constructed from an id and weight', () => {
        const id = "my-parcel";
        const weight = new Weight(5);
        const parcel = new Parcel(id, weight);
        expect(parcel.getID()).toStrictEqual(id);
        expect(parcel.getWeight()).toStrictEqual(weight);
    });
});