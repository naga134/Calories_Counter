import { ErrorType, validateFoodInputsParams, ValidationError, Validation, ValidationStatus, validateEntryInputsParams } from "./types";

export const validateEntryInputs = ({
    measure
}: validateEntryInputsParams): Validation => {
    // Declares array to hold errors
    const errors: ValidationError[] = [];

    // Parses inputs
    const measureValue = Number(measure);

    // Validates measure
    if (measureValue <= 0) {
        errors.push({
            type: ErrorType.Error,
            message: 'The measure field can neither be empty nor zero.',
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