import { Weight } from "../../models/weight";

describe('models/weight', () => {
    it('should require a unit in KG when constructed', () => {
        const kg = 10;
        const weight = new Weight(kg);
        expect(weight.kg).toStrictEqual(kg);
    });

    it('should be able to undergo addition', () => {
        const tenKG = new Weight(10);
        const nineKG = new Weight(9);
        const nineteenKG = new Weight(19);
        expect(Weight.Plus(nineKG, tenKG)).toStrictEqual(nineteenKG);
        expect(Weight.Plus(tenKG, nineKG)).toStrictEqual(nineteenKG);
    });

    it('should be able to undergo subtraction', () => {
        const tenKG = new Weight(10);
        const nineKG = new Weight(9);
        const oneKG = new Weight(1);
        expect(Weight.Minus(nineKG, tenKG)).toStrictEqual(Weight.Empty());
        expect(Weight.Minus(tenKG, nineKG)).toStrictEqual(oneKG);
    });

    it('should be able to undergo < comparison', () => {
        const tenKG = new Weight(10);
        const nineKG = new Weight(9);
        expect(Weight.LessThan(nineKG, tenKG)).toBeTruthy();
        expect(Weight.LessThan(tenKG, nineKG)).toBeFalsy(); 
    });
});