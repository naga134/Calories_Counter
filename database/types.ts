// Foods
export interface Food {
    id: number;
    name: string;
    isDeleted: boolean;
}

// Units
export interface Unit {
    id: number;
    symbol: string;
}

// Journal Entries
export interface Entry {
    id: number;
    foodId: number;
    nutrientsId: number;
    date: Date;
    amount: number;
    unitId: number;
    mealId: number;
}

// Daily Meals
export interface Meal {
    id: number;
    name: string;
    isDeleted: boolean;
}

// Nutritional Tables
export interface Nutritable {
    id: number;
    foodId: number;
    unit: {
        id: number;
        symbol: string;
    };
    baseMeasure: number;
    kcals: number;
    carbs: number;
    fats: number;
    protein: number;
    // isDeleted: boolean;
}