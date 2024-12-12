import { useNavigation } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import { getAllFoodNames } from 'database/queries/foodsQueries';
import { useSQLiteContext } from 'expo-sqlite';
import { useLayoutEffect } from 'react';
import { HeaderBackButton } from '@react-navigation/elements';

export default function CreateFood() {
  const database = useSQLiteContext();

  const navigation = useNavigation();

  const { data: names = [] } = useQuery({
    queryKey: ['foodnames'],
    queryFn: () => getAllFoodNames(database),
    initialData: [],
  });

  console.log(names);

  return <></>;
}
