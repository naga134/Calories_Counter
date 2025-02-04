import { SQLiteDatabase } from "expo-sqlite";
import { Nutritable } from "database/types";
import toSQLiteParams from "utils/toSQLiteParams";

export const getNutritablesByFood = async (database: SQLiteDatabase, params: { foodId: number }): Promise<Nutritable[]> => {
    const query = `SELECT 
                       n.id AS id,
                       n.foodId,
                       u.id AS unitId,
                       u.symbol AS unitSymbol,
                       n.baseMeasure AS baseMeasure,
                       n.kcals,
                       n.carbs,
                       n.fats,
                       n.protein
                   FROM 
                       nutritables AS n
                   INNER JOIN 
                       units AS u ON n.unitId = u.id
                   WHERE 
                       n.foodId = $foodId
                   AND
                       n.isDeleted = 0;
    `;

    // Querying the database
    const queryResult = await database.getAllAsync(query, toSQLiteParams(params));
    // Mapping the database results to Food objects
    return queryResult.map((table: any) => ({
        // identifiers
        id: table.id,
        foodId: table.foodId,
        unit: {
            id: table.unitId,
            symbol: table.unitSymbol,
        },
        // measurements
        baseMeasure: table.baseMeasure,
        kcals: table.kcals,
        carbs: table.carbs,
        fats: table.fats,
        protein: table.protein,
    }));
};


// 
export const createNutritable = (database: SQLiteDatabase, params: {
    foodId: number,
    unitId: number,
    baseMeasure: number,
    kcals: number
    protein: number
    carbs: number
    fats: number
}) => {
    const query = `INSERT INTO nutritables
                   (foodId, unitId, baseMeasure, kcals, protein, carbs, fats, isDeleted)
                   VALUES ( $foodId, $unitId, $baseMeasure, $kcals, $protein, $carbs, $fats, 0);`;
    return database.runSync(query, toSQLiteParams(params));
}

// 
export const updateNutritable = (database: SQLiteDatabase, params: {
    baseMeasure: number,
    kcals: number,
    carbs: number,
    fats: number,
    protein: number,
    nutritableId: number
}) => {
    const query = `
    UPDATE nutritables SET
    baseMeasure = $baseMeasure,
    kcals = $kcals,
    carbs = $carbs,
    fats = $fats,
    protein = $protein
    WHERE id = $nutritableId;
    `;
    return database.runSync(query, toSQLiteParams(params));
}

export const deleteNutritable = (database: SQLiteDatabase, params: {
    nutritableId: number
}) => {
    const entry = database.getAllSync("SELECT * FROM entries WHERE nutritableId = $nutritableId", toSQLiteParams(params))
    const query = `DELETE FROM nutritables WHERE id = $nutritableId;`
    const altQuery = `UPDATE nutritables SET isDeleted = 1 WHERE id = $nutritableId;`
    return database.runSync(entry ? query : altQuery, toSQLiteParams(params))
}

export const getNutritableById = async (database: SQLiteDatabase, params: { id: number }): Promise<Nutritable | null> => {
    const query = "SELECT * FROM nutritables WHERE id = $id;"
    return await database.getFirstAsync<Nutritable>(query, toSQLiteParams(params))
}

export const getNutritablesByIds = async (database: SQLiteDatabase, params: { ids: number[] }): Promise<Nutritable[]> => {
    const { ids } = params;
    if (ids.length === 0) return [];

    const placeholders = ids.map((_, index) => `$id${index}`).join(", ");
    const query = `SELECT * FROM nutritables WHERE id IN (${placeholders});`

    // Building a dictionary of the sort "id0": "4" 
    const paramDict: Record<string, number> = {};
    params.ids.forEach((id, index) => {
        paramDict[`id${index}`] = id;
    });

    const queryReturn = await database.getAllAsync<Nutritable>(query, toSQLiteParams(paramDict))

    return queryReturn.map((table: any) => ({
        // identifiers
        id: table.id,
        foodId: table.foodId,
        unit: {
            id: table.unitId,
            symbol: table.unitSymbol,
        },
        // measurements
        baseMeasure: table.baseMeasure,
        kcals: table.kcals,
        carbs: table.carbs,
        fats: table.fats,
        protein: table.protein,
        isDeleted: table.isDeleted
    }));
}