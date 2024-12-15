import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import FoodWriteDetails from 'components/FoodWriteDetails';
import { createNutritable } from 'database/queries/nutritablesQueries';
import { useSQLiteContext } from 'expo-sqlite';
import { RootStackParamList } from 'navigation';
import { useEffect, useMemo, useState } from 'react';
import calculateCalories from 'utils/calculateCalories';

type AddScreenProp = RouteProp<RootStackParamList, 'Add'>;

export default function Add() {
  const { food, units } = useRoute<AddScreenProp>().params;

  const database = useSQLiteContext();
  const navigation = useNavigation();

  // Declaring the stateful variable which will hold the currently selected unit's id.
  const [selectedUnitId, setSelectedUnitId] = useState<number | null>(units[0].id);

  // Food's DATA:
  const [name, setName] = useState(food.name);
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

  return (
    <FoodWriteDetails
      currentName={food.name}
      disableNameEdit
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
        createNutritable(database, {
          foodId: food.id,
          unitId: selectedUnit!.id,
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
