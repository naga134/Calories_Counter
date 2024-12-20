import { ErrorType, validateFoodInputsParams, ValidationError, Validation, ValidationStatus } from "./types";

export const validateFoodInputs = ({
    name,
    existingNames,
    kcals,
    expectedKcals,
    measure
}: validateFoodInputsParams): Validation => {
    // Declares array to hold errors
    const errors: ValidationError[] = [];

    // Parses inputs
    const kcalsValue = Number(kcals);
    const expectedKcalsValue = Number(expectedKcals);
    const measureValue = Number(measure);

    // Validates name
    if (name.trim() === '') {
        errors.push({
            type: ErrorType.Error,
            message: 'Name cannot be empty.',
        });
    } else if (existingNames.includes(name.trim())) {
        errors.push({
            type: ErrorType.Error,
            message: `There already exists a food named "${name}", foods must be uniquely named.`,
        });
    }

    // Validates measure
    if (measure.trim() === '' || measureValue <= 0) {
        errors.push({
            type: ErrorType.Error,
            message: 'The measure field can neither be empty nor zero.',
        });
    }

    // Validates kcals
    const margin = expectedKcalsValue * 0.05; // Allows for a margin of error of 5% 
    if (Math.abs(expectedKcalsValue - kcalsValue) > margin) {
        errors.push({
            type: ErrorType.Warning,
            message: `Total calories and macros mismatch.\nExpected calories: ${expectedKcals} kcal\nInformed calories: ${kcalsValue} kcal`,
        });
    }

    // Returns object
    return {
        status: containsErrors(errors) ? ValidationStatus.Error : containsWarnings(errors) ? ValidationStatus.Warning : ValidationStatus.Valid,
        errors: errors
    };
};

function containsErrors(errors: ValidationError[]) {
    return errors.some((error) => error.type === "error")
}

function containsWarnings(errors: ValidationError[]) {
    return errors.some((error) => error.type === "warning")
}