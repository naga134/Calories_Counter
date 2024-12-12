import { SQLiteDatabase } from "expo-sqlite";
import { Food } from "database/types";



export const getAllFoods = async (database: SQLiteDatabase): Promise<Food[]> => {

  // console.log("aa")
  const query = "SELECT * FROM foods;";
  const queryResult = await database.getAllAsync(query);
  const foods = queryResult.map((row: any) => ({
    id: row.id,
    name: row.name,
    isDeleted: !!row.isDeleted
  }));

  console.log("database => ", database)
  console.log("getAllFoods => ", foods)
  return foods

};

export const getAllFoodNames = async (database: SQLiteDatabase): Promise<string[]> => {
  const query = "SELECT name FROM foods;";
  const queryResult = await database.getAllAsync(query);
  // console.log(queryResult.map((row) => row.name))
  return queryResult.map((row: any) => row.name)

}

// export default getAllFoods;