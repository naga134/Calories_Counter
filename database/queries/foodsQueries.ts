import { SQLiteDatabase } from "expo-sqlite";
import { Food } from "database/types";
import toSQLiteParams from "utils/toSQLiteParams";

export const getAllFoods = async (database: SQLiteDatabase): Promise<Food[]> => {
  const query = "SELECT * FROM foods;";
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

export const getAllFoodNames = async (database: SQLiteDatabase): Promise<string[]> => {
  const query = "SELECT name FROM foods;";
  const queryResult = await database.getAllAsync(query);
  return queryResult.map((row: any) => row.name)
}

export const createFood = (database: SQLiteDatabase, params: { foodName: string }) => {
  const query = "INSERT INTO foods (name, isDeleted) VALUES ($foodName, 0);";
  return database.runSync(query, toSQLiteParams(params));
};

export const deleteFood = (database: SQLiteDatabase, params: { foodId: number }) => {
  const query = `DELETE FROM foods WHERE id = $foodId;`
  return database.runSync(query, toSQLiteParams(params));
};

export const updateFoodName = (database: SQLiteDatabase, params: { foodId: number, newFoodName: string }) => {
  const query = `UPDATE foods SET name = $newFoodName WHERE id = $foodId;`;
  return database.runSync(query, toSQLiteParams(params));
}



// import toSQLiteParameters from "../functions/toSQLiteParameters";




