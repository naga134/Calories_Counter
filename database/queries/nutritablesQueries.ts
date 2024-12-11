import { SQLiteDatabase } from "expo-sqlite";
import { Nutritable } from "database/types";
import toSQLiteParams from "utils/toSQLiteParams";

interface queryParams {
    foodId: number; // or string, depending on your database schema
}

const query = ` 
SELECT 
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
    nutrients AS n
INNER JOIN 
    units AS u ON n.unitId = u.id
WHERE 
    n.foodId = $foodId
AND
    n.isDeleted = 0;
`;

const getNutritables = async (database: SQLiteDatabase, params: queryParams): Promise<Nutritable[]> => {
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

export default getNutritables;