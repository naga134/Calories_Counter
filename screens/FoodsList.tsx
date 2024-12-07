import getAllFoods from 'database/queries/foodsQueries';
import { SQLiteDatabase, useSQLiteContext } from 'expo-sqlite';
import { Pressable, ScrollView } from 'react-native-gesture-handler';
import { QueryClient, useQuery, useQueryClient } from '@tanstack/react-query';
import FoodListItem from 'components/FoodsListItem';

export default function FoodsList() {
  const database: SQLiteDatabase = useSQLiteContext();
  const queryClient: QueryClient = useQueryClient();

  // Retrieving the list of daily meals from the database
  const { data: foods = [] } = useQuery({
    queryKey: ['foods'],
    queryFn: () => getAllFoods(database),
    initialData: [],
  });

  return (
    <ScrollView contentContainerStyle={{ padding: 20, gap: 12 }}>
      {foods.map((food) => (
        <FoodListItem key={food.id} food={food} />
      ))}
    </ScrollView>
  );
}
