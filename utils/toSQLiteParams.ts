// This function takes a dictionary of the form { key: value} and returns
// the same dictionary, but in the form { "$key": value }.

// This is done merely for expo-sqlite to accept them as query parameters.

type PrefixedKeys<T extends Record<string, any>> = {
    [K in keyof T as `$${K & string}`]: T[K];
};

const toSQLiteParams = <T extends Record<string, any>>(
    dictionary: T
): PrefixedKeys<T> => {
    const result = {} as PrefixedKeys<T>;

    Object.keys(dictionary).forEach((key) => {
        (result as any)[`$${key}`] = dictionary[key];
    });

    return result;
};

export default toSQLiteParams;
