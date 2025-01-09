// Foods
export interface Food {
    id: number;
    name: string;
    isDeleted: boolean;
}

// Units
export interface Unit {
    id: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
    symbol: 'g' | 'ml' | 'lb' | 'tsp' | 'tbsp' | 'cup' | 'oz' | 'unit';
}

// Journal Entries
export interface Entry {
    id: number;
    foodId: number;
    nutritableId: number;
    date: Date;
    amount: number;
    unitId: number;
    mealId: number;
}

// Daily Meals
export interface Meal {
    id: 1 | 2 | 3 | 4 | 5;
    name: 'Breakfast' | 'Morning' | 'Lunch' | 'Afternoon' | 'Dinner';
}

// Nutritional Tables
export interface Nutritable {
    id: number;
    foodId: number;
    unit: Unit;
    baseMeasure: number;
    kcals: number;
    carbs: number;
    fats: number;
    protein: number;
    // isDeleted: boolean;
}