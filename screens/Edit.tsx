import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamList } from 'navigation';
import { useNavigation } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import { useSQLiteContext } from 'expo-sqlite';
import { useEffect, useMemo, useState } from 'react';
import { Dimensions } from 'react-native';
import { getAllUnits } from 'database/queries/unitsQueries';
import { useHeaderHeight } from '@react-navigation/elements';
import calculateCalories from 'utils/calculateCalories';
import FoodWriteDetails from 'components/FoodWriteDetails';
import macroToString from 'utils/macroToString';
import { updateFoodName } from 'database/queries/foodsQueries';
import { updateNutritable } from 'database/queries/nutritablesQueries';

type EditScreenProp = RouteProp<RootStackParamList, 'Edit'>;

export default function Edit() {
  const { nutritable, food } = useRoute<EditScreenProp>().params;

  // console.log(nutritable, food);

  const database = useSQLiteContext();
  const navigation = useNavigation();

  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;
  const headerHeight = useHeaderHeight();

  // Retrieving all possible measurement units.
  const units = [nutritable.unit];

  // Declaring the stateful variable which will hold the currently selected unit's id.
  const [selectedUnitId, setSelectedUnitId] = useState<number | null>(nutritable.unit.id);

  // Food's DATA:
  const [name, setName] = useState(food.name);
  const [measure, setMeasure] = useState(macroToString(nutritable.baseMeasure));
  const [kcals, setKcals] = useState(macroToString(nutritable.kcals));
  const [protein, setProtein] = useState(macroToString(nutritable.protein));
  const [carbs, setCarbs] = useState(macroToString(nutritable.carbs));
  const [fat, setFat] = useState(macroToString(nutritable.fats));

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
        if (name !== food.name) {
          updateFoodName(database, { foodId: food.id, newFoodName: name });
        }
        if (
          nutritable.baseMeasure !== Number(measure) ||
          nutritable.kcals !== Number(kcals === '' ? expectedKcals : kcals) ||
          nutritable.carbs !== Number(carbs) ||
          nutritable.fats !== Number(fat) ||
          nutritable.protein !== Number(protein)
        ) {
          updateNutritable(database, {
            baseMeasure: Number(measure),
            kcals: Number(kcals === '' ? expectedKcals : kcals),
            carbs: Number(carbs),
            fats: Number(fat),
            protein: Number(protein),
            nutritableId: nutritable.id,
          });
        }
      }}
    />
  );
}
