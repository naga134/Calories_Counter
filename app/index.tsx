import { SQLiteDatabase, useSQLiteContext } from "expo-sqlite";
import { QueryClient, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Colors, View } from "react-native-ui-lib";
import { Dimensions, ScrollView } from "react-native";

// My stuff
import MealDrawer from "@/components/MealDrawer";
import getAllMeals from "@/database/queries/mealsQueries";
import PieChart from "@/components/PieChart";
import { useState } from "react";
import IconSVG from "@/components/icons/IconSVG";
import { Pressable } from "react-native-gesture-handler";
import MacroOverview from "@/components/MacroOverview";
import DateBanner from "@/components/DateBanner";

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
    <>
      <DateBanner />
      <ScrollView
        contentContainerStyle={{
          width: screenWidth,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            width: "100%",
            paddingHorizontal: 20,
            gap: 24,
            alignItems: "center",
            marginVertical: 24,
          }}
        >
          <PieChart
            data={data}
            colors={colors}
            innerRadius={70}
            outerRadius={100}
          />
          <View
            style={{
              flex: 1,
              justifyContent: "space-between",
              gap: 8,
            }}
          >
            <MacroOverview
              color={Colors.red40}
              iconName="meat-solid"
              onPress={() => setProtein(protein + 15)}
              amount={protein}
              unit={"g"}
            />
            <MacroOverview
              color={Colors.green40}
              iconName="bacon-solid"
              onPress={() => setFat(fat + 15)}
              amount={fat}
              unit={"g"}
            />
            <MacroOverview
              color={Colors.blue40}
              iconName="wheat-solid"
              onPress={() => setCarbohydrates(carbohydrates + 15)}
              amount={carbohydrates}
              unit={"g"}
            />
            <MacroOverview
              color={Colors.orange40}
              iconName="ball-pile-solid"
              onPress={() => {}}
              amount={protein * 4 + fat * 8 + carbohydrates * 4}
              unit={"kcal"}
            />
          </View>
        </View>

        <View style={{ gap: 10, padding: 10 }}>
          {meals.map((meal) => (
            <MealDrawer key={meal.id} mealName={meal.name} />
          ))}
        </View>
      </ScrollView>
    </>
  );
}
