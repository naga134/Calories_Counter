import { Unit } from "database/types";
import { SQLiteDatabase } from "expo-sqlite";

export const getAllUnits = async (database: SQLiteDatabase): Promise<Unit[]> => {
    const query = "SELECT * FROM units;";
    const queryResult = await database.getAllAsync(query);
    const units = queryResult.map((row: any) => ({
        id: row.id,
        symbol: row.symbol,
    }));

    return units
};