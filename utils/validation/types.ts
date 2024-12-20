
export enum ErrorType {
    Error = 'error',
    Warning = 'warning',
}

export enum ValidationStatus {
    Valid = 'valid',
    Error = 'error',
    Warning = 'warning',
}

export type Validation = {
    status: ValidationStatus,
    errors: ValidationError[]
}

export interface ValidationError {
    type: ErrorType;
    message: string;
}

export interface validateFoodInputsParams {
    // name validation
    name: string,
    existingNames: string[]
    // calories validation
    kcals: string,
    expectedKcals: string,
    // measure validation
    measure: string,
}