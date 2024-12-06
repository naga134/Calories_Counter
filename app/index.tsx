import { SQLiteDatabase, useSQLiteContext } from "expo-sqlite";
import { QueryClient, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Colors, View } from "react-native-ui-lib";
import { Dimensions } from "react-native";

// My stuff
import MealDrawer from "@/components/MealDrawer";
import getAllMeals from "@/database/queries/mealsQueries";
import PieChart from "@/components/PieChart";
import { useState } from "react";

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

  const [fat, setFat] = useState(5);
  const [protein, setProtein] = useState(15);
  const [carbohydrates, setCarbohydrates] = useState(10);

  const macronutrients = [
    { macro: "fat", grams: fat },
    { macro: "protein", grams: protein },
    { macro: "carbohydrates", grams: carbohydrates },
  ];

  const data = macronutrients.map((macro) => macro.grams);
  const colors = [Colors.green40, Colors.red40, Colors.blue40];

  return (
    <View
      style={{
        width: screenWidth,
        // flex: 1,
        justifyContent: "center",
        // alignContent: "center",
        alignItems: "center",
        marginTop: 40,
      }}
    >
      <PieChart
        data={data}
        colors={colors}
        innerRadius={70}
        outerRadius={100}
      />
      <View row style={{ gap: 10, margin: 36 }}>
        <Button
          label={"Increase"}
          backgroundColor={Colors.red40}
          onPress={() => setProtein(protein + 15)}
        />
        <Button
          label={"Increase"}
          backgroundColor={Colors.green40}
          onPress={() => setFat(fat + 15)}
        />
        <Button
          label={"Increase"}
          backgroundColor={Colors.blue40}
          onPress={() => setCarbohydrates(carbohydrates + 15)}
        />
      </View>
    </View>
  );
}
