import { WeightSchema } from "../rest/v1/schemas/weight";

export class Weight implements WeightSchema {
    kg: number;

    constructor(kg: number) {
        this.kg = kg;
    }

    static Plus(l: Weight, r: Weight): Weight {
        return new Weight(l.kg + r.kg);
    }

    static Minus(l: Weight, r: Weight): Weight {
        const result = l.kg - r.kg;
        if (result <= 0) {
            return Weight.Empty();
        }
        return new Weight(result);
    }

    static LessThan(l: Weight, r: Weight): boolean {
        return l.kg < r.kg;
    }

    static Empty(): Weight {
        return new Weight(0);
    }
}