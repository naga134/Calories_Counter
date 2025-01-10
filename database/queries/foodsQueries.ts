import { SQLiteDatabase } from "expo-sqlite";
import { Food } from "database/types";
import toSQLiteParams from "utils/toSQLiteParams";

export const getAllFoods = async (database: SQLiteDatabase): Promise<Food[]> => {
  const query = "SELECT * FROM foods WHERE isDeleted = 0;";
  const queryResult = await database.getAllAsync(query);
  return queryResult.map((row: any) => ({
    id: row.id,
    name: row.name,
    isDeleted: !!row.isDeleted
  }));
};

export const getFoodById = async (database: SQLiteDatabase, params: { foodId: number }): Promise<Food | null> => {
  const query = "SELECT * FROM foods WHERE id = $foodId;";
  const queryResult = await database.getFirstAsync<Food>(query, toSQLiteParams(params));
  return queryResult;
};

export const getFoodsByIds = async (database: SQLiteDatabase, params: { ids: number[] }): Promise<Food[]> => {
  const { ids } = params;
  if (ids.length === 0) return [];

  const placeholders = ids.map((_, index) => `$id${index}`).join(", ");
  const query = `SELECT * FROM foods WHERE id IN (${placeholders});`

  const paramDict: Record<string, number> = {};
  params.ids.forEach((id, index) => {
    paramDict[`id${index}`] = id;
  });

  return await database.getAllAsync<Food>(query, toSQLiteParams(paramDict))
}

export const getAllFoodNames = async (database: SQLiteDatabase): Promise<string[]> => {
  const query = "SELECT name FROM foods WHERE isDeleted = 0;";
  const queryResult = await database.getAllAsync(query);
  return queryResult.map((row: any) => row.name)
}

export const createFood = (database: SQLiteDatabase, params: { foodName: string }) => {
  const query = "INSERT INTO foods (name, isDeleted) VALUES ($foodName, 0);";
  return database.runSync(query, toSQLiteParams(params));
};

export const deleteFood = (database: SQLiteDatabase, params: { foodId: number }) => {
  const entry = database.getFirstSync("SELECT * FROM entries WHERE foodId = $foodId", toSQLiteParams(params))
  const query = `DELETE FROM foods WHERE id = $foodId;`
  const altQuery = `UPDATE foods SET isDeleted = 1 WHERE id = $foodId;`
  return database.runSync(entry ? query : altQuery, toSQLiteParams(params));
};

export const updateFoodName = (database: SQLiteDatabase, params: { foodId: number, newFoodName: string }) => {
  const query = `UPDATE foods SET name = $newFoodName WHERE id = $foodId;`;
  return database.runSync(query, toSQLiteParams(params));
}



