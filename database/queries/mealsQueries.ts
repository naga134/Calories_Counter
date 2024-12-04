import { SQLiteDatabase } from "expo-sqlite";
import { Meal } from "@/database/types";

const query = "SELECT * FROM meals;";

const getAllMeals = async (database: SQLiteDatabase): Promise<Meal[]> => {
  // Querying the database
  const queryResult = await database.getAllAsync(query);
  // Mapping the database results to Meal objects
  return queryResult.map((row: any) => ({
    id: row.id,
    name: row.name,
    isDeleted: !!row.isDeleted
  }));
};

export default getAllMeals;