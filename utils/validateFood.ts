import calculateCalories from "./calculateCalories";

export interface ValidationError {
    errorType: 'error' | 'warning';
    errorMessage: string;
}

export const validateFoodInputs = (
    name: string,
    measure: string,
    kcals: string,
    protein: string,
    carbs: string,
    fat: string,
    existingNames: string[]
): ValidationError[] => {
    const errors: ValidationError[] = [];

    // Validates name
    if (name.trim() === '') {
        errors.push({
            errorType: 'error',
            errorMessage: 'Name cannot be empty.',
        });
    } else if (existingNames.includes(name.trim())) {
        errors.push({
            errorType: 'error',
            errorMessage: 'Food name must be unique.',
        });
    }

    // Validates measure
    if (measure.trim() === '') {
        errors.push({
            errorType: 'error',
            errorMessage: 'Measure cannot be empty.',
        });
    } else if (isNaN(Number(measure)) || Number(measure) <= 0) {
        errors.push({
            errorType: 'error',
            errorMessage: 'Measure must be a positive number.',
        });
    }

    // Validates kcals
    const expectedKcals = calculateCalories(Number(protein), Number(carbs), Number(fat));
    const margin = expectedKcals * 0.05;

    if (Math.abs(expectedKcals - Number(kcals)) > margin) {
        errors.push({
            errorType: 'warning',
            errorMessage: `The total kcals differ from the expected value based on the provided macros.`,
        });
    }

    return errors;
};