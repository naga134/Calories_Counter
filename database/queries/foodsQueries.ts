import { SQLiteDatabase } from "expo-sqlite";
import { Food } from "@/database/types";

const query = "SELECT * FROM foods;";

const getAllFoods = async (database: SQLiteDatabase): Promise<Food[]> => {
  // Querying the database
  const queryResult = await database.getAllAsync(query);
  // Mapping the database results to Food objects
  return queryResult.map((row: any) => ({
    id: row.id,
    name: row.name,
    isDeleted: !!row.isDeleted
  }));
};

export default getAllFoods;