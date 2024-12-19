import { useNavigation } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import { createFood } from 'database/queries/foodsQueries';
import { useSQLiteContext } from 'expo-sqlite';
import { useEffect, useMemo, useState } from 'react';
import { Dimensions } from 'react-native';
import { getAllUnits } from 'database/queries/unitsQueries';
import { useHeaderHeight } from '@react-navigation/elements';
import calculateCalories from 'utils/calculateCalories';
import { createNutritable } from 'database/queries/nutritablesQueries';
import FoodWriteDetails from 'components/FoodWriteDetails';

export default function Create() {
  const database = useSQLiteContext();
  const navigation = useNavigation();

  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;
  const headerHeight = useHeaderHeight();

  // Retrieving all possible measurement units.
  const { data: units = [], isFetched: unitsFetched } = useQuery({
    queryKey: ['allUnits'],
    queryFn: () => getAllUnits(database),
    initialData: [],
  });

  // Declaring the stateful variable which will hold the currently selected unit's id.
  const [selectedUnitId, setSelectedUnitId] = useState<number | null>(null);

  // Initializing the currently selected unit as soon as the units have been fetched.
  useEffect(() => {
    if (unitsFetched && units.length > 0 && selectedUnitId === null) {
      setSelectedUnitId(units[0].id);
    }
  }, [units, unitsFetched]);

  // Food's DATA:
  const [name, setName] = useState('');
  const [measure, setMeasure] = useState('');
  const [kcals, setKcals] = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fat, setFat] = useState('');

  const [expectedKcals, setExpectedKcals] = useState('');
  useEffect(() => {
    setExpectedKcals(
      calculateCalories(Number(protein), Number(carbs), Number(fat)).toFixed(2).toString()
    );
  }, [protein, carbs, fat]);

  const selectedUnit = useMemo(() => {
    return units.find((unit) => unit.id === selectedUnitId);
  }, [units, selectedUnitId]);

  // COMPONENT
  return !unitsFetched || selectedUnit === null || selectedUnit === undefined ? (
    <></>
  ) : (
    <FoodWriteDetails
      // getters
      name={name}
      measure={measure}
      kcals={kcals}
      protein={protein}
      carbs={carbs}
      fat={fat}
      // setters
      setName={setName}
      setMeasure={setMeasure}
      setKcals={setKcals}
      setProtein={setProtein}
      setCarbs={setCarbs}
      setFat={setFat}
      selectedUnitId={selectedUnitId}
      setSelectedUnitId={setSelectedUnitId}
      // rest
      units={units}
      queryRunnerFunction={() => {
        const foodId = createFood(database, { foodName: name }).lastInsertRowId;
        createNutritable(database, {
          foodId,
          unitId: selectedUnit.id,
          baseMeasure: Number(measure),
          // If no kcals are informed, use the expected kcals instead.
          kcals: Number(kcals === '' ? expectedKcals : kcals),
          protein: Number(protein),
          carbs: Number(carbs),
          fats: Number(fat),
        });
        navigation.goBack();
      }}
    />
  );
}
