import { SQLiteDatabase, useSQLiteContext } from "expo-sqlite";
import { QueryClient, useQuery, useQueryClient } from "@tanstack/react-query";
import { View } from "react-native-ui-lib";
import { Dimensions } from "react-native";

// My stuff
import MealDrawer from "@/components/MealDrawer";
import getAllMeals from "@/database/queries/mealsQueries";

export default function Index() {
  const database: SQLiteDatabase = useSQLiteContext();
  const queryClient: QueryClient = useQueryClient();

  // Retrieving the list of daily meals from the database
  const { data: meals = [] } = useQuery({
    queryKey: ["meals"],
    queryFn: () => getAllMeals(database),
    initialData: [],
  });

  return (
    <View
      style={{
        gap: 16,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {meals.map((meal) => (
        <MealDrawer key={meal.id} mealName={meal.name} />
      ))}
    </View>
  );
}
