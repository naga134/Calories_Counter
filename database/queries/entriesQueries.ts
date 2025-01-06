import { SQLiteDatabase } from "expo-sqlite";
import { Entry } from "database/types";
import toSQLiteParams from "utils/toSQLiteParams";

export const createEntry = (
    database: SQLiteDatabase,
    params: {
        foodId: number,
        nutritablesId: number,
        date: Date,
        amount: number,
        unitId: number,
        mealId: number
    }
) => {
    const query = `
    INSERT INTO entries (foodId, nutritableId, date, amount, unitId, mealId)
    VALUES ($foodId, $nutritableId, $date, $amount, $unitId, $mealId);`
    return database.runSync(query, toSQLiteParams({ ...params, date: params.date.toDateString() /* timezone issues? */ }));
}

export const getEntriesByDate = (database: SQLiteDatabase, params: { date: Date }): Entry[] => {
    const query = "SELECT * FROM entries WHERE date = $date"
    const queryResult = database.getAllSync(query, toSQLiteParams({ date: params.date.toDateString() }))
    return queryResult.map((row: any) => ({
        id: row.id,
        foodId: row.foodId,
        nutritableId: row.nutritableId,
        date: new Date(row.date),
        amount: row.amount,
        unitId: row.unitId,
        mealId: row.mealId
    }))
}