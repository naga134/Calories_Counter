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
            errorType: ErrorType.Error,
            errorMessage: 'Name cannot be empty.',
        });
    } else if (existingNames.includes(name.trim())) {
        errors.push({
            errorType: ErrorType.Error,
            errorMessage: `There already exists a food named "${name}", foods must be uniquely named.`,
        });
    }

    // Validates measure
    if (measure.trim() === '' || measureValue <= 0) {
        errors.push({
            errorType: ErrorType.Error,
            errorMessage: 'The measure field can neither be empty nor zero.',
        });
    }

    // Validates kcals
    const margin = expectedKcalsValue * 0.05;
    if (Math.abs(expectedKcalsValue - kcalsValue) > margin) {
        errors.push({
            errorType: ErrorType.Warning,
            errorMessage: `Total calories and macros mismatch. Expected calories: ${expectedKcals}. Informed calories: ${kcalsValue}`,
        });
    }

    // Returns object
    return {
        status: containsErrors(errors) ? ValidationStatus.Error : containsWarnings(errors) ? ValidationStatus.Warning : ValidationStatus.Valid,
        errors: errors
    };
};

function containsErrors(errors: ValidationError[]) {
    return errors.some((error) => error.errorType === "error")
}

function containsWarnings(errors: ValidationError[]) {
    return errors.some((error) => error.errorType === "warning")
}