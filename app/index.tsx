import { SQLiteDatabase, useSQLiteContext } from "expo-sqlite";
import { QueryClient, useQuery, useQueryClient } from "@tanstack/react-query";
import { Colors, View } from "react-native-ui-lib";
import { Dimensions } from "react-native";

// My stuff
import MealDrawer from "@/components/MealDrawer";
import getAllMeals from "@/database/queries/mealsQueries";
import PieChart from "@/components/PieChart";

export default function Index() {
  const database: SQLiteDatabase = useSQLiteContext();
  const queryClient: QueryClient = useQueryClient();
  const screenWidth = Dimensions.get("window").width;

  // Retrieving the list of daily meals from the database
  const { data: meals = [] } = useQuery({
    queryKey: ["meals"],
    queryFn: () => getAllMeals(database),
    initialData: [],
  });

  return (
    <View
      style={{
        width: screenWidth,
        flex: 1,
        justifyContent: "center",
        // alignContent: "center",
        alignItems: "center",
      }}
    >
      <PieChart />
    </View>
  );
}
