import IconSVG from "@/components/icons/IconSVG";
import MealDrawer from "@/components/MealDrawer";
import RotatingCaret from "@/components/RotatingCaret";
import getAllFoods from "@/database/queries/foodsQueries";
import { Food } from "@/database/types";
import { QueryClient, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigation } from "expo-router";
import { navigate } from "expo-router/build/global-state/routing";
import { SQLiteDatabase, useSQLiteContext } from "expo-sqlite";
import { useState } from "react";
import { TouchableOpacity } from "react-native";
import { Pressable, ScrollView } from "react-native-gesture-handler";
import { Colors, Text, View } from "react-native-ui-lib";

export default function FoodsList() {
  const database: SQLiteDatabase = useSQLiteContext();
  const queryClient: QueryClient = useQueryClient();

  // Retrieving the list of daily meals from the database
  const { data: foods = [] } = useQuery({
    queryKey: ["foods"],
    queryFn: () => getAllFoods(database),
    initialData: [],
  });

  console.log(foods);

  return (
    <ScrollView contentContainerStyle={{ padding: 20, gap: 12 }}>
      {foods.map((food) => (
        <FoodListItem key={food.id} food={food} />
      ))}
    </ScrollView>
  );
}

function FoodListItem({ food }: { food: Food }) {
  const [rotated, setRotated] = useState(false);

  return (
    <View
      key={food.id}
      style={{
        height: "auto",
        backgroundColor: Colors.white,
        padding: 15,
        borderRadius: 10,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <Text style={{fontSize: 18}}>{food.name}</Text>
      <TouchableOpacity onPress={() => setRotated(!rotated)}>
        <RotatingCaret rotated={rotated} color={Colors.grey20} />
      </TouchableOpacity>
    </View>
  );
}
