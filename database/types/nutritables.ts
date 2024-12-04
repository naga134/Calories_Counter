// Nutrients Table
interface Nutritable {
    id: number;
    foodId: number;
    unitId: number;
    baseMeasure: number;
    kcals: number;
    carbs: number;
    fats: number;
    protein: number;
    isDeleted: boolean;
}