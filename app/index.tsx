import IconSVG from "@/components/icons/IconSVG";
import MealDrawer from "@/components/MealDrawer";
import getAllMeals from "@/database/queries/mealsQueries";
import { QueryClient, useQuery, useQueryClient } from "@tanstack/react-query";
import { SQLiteDatabase, useSQLiteContext } from "expo-sqlite";
import { Dimensions } from "react-native";
import { Text, View } from "react-native-ui-lib";

export default function Index() {
  const database: SQLiteDatabase = useSQLiteContext();
  const queryClient: QueryClient = useQueryClient();
  const screenHeight = Dimensions.get("window").height;

  // Retrieving the list of daily meals from the database
  const { data: meals = [] } = useQuery({
    queryKey: ["meals"],
    queryFn: () => getAllMeals(database),
    initialData: [],
  });

  return (
    <View
      style={{
        gap: "16",
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
