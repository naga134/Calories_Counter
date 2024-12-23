import React, { useEffect, useState } from 'react';
import { Dimensions, StyleSheet } from 'react-native';
import { Colors, KeyboardAwareScrollView, Text, TouchableOpacity, View } from 'react-native-ui-lib';
import { Portal } from 'react-native-paper';
import { useQuery } from '@tanstack/react-query';
import { getAllUnits } from 'database/queries/unitsQueries';
import { SQLiteDatabase, useSQLiteContext } from 'expo-sqlite';

import { useColors } from 'context/ColorContext';
import { StaticScreenProps } from '@react-navigation/native';
import { Food, Meal, Nutritable, Unit } from 'database/types';
import { getNutritablesByFood } from 'database/queries/nutritablesQueries';
import IconSVG from 'components/Shared/icons/IconSVG';
import ToggleView from 'components/Screens/Read/ToggleView';

export enum ViewMode {
  Simple,
  Meal,
  Day,
}

type Props = StaticScreenProps<{
  food: Food;
  meal: Meal;
}>;

type NutritableQueryReturn = {
  data: Nutritable[];
  isFetched: boolean;
};

type UnitsQueryReturn = {
  data: Unit[];
  isFetched: boolean;
};

export default function Read({ route }: Props) {
  const { food, meal } = route.params;

  const colors = useColors();
  const screenWidth = Dimensions.get('window').width;

  const database: SQLiteDatabase = useSQLiteContext();

  // Fetching the food's nutritables
  const { data: nutritables = [], isFetched: nutritablesFetched }: NutritableQueryReturn = useQuery(
    {
      queryKey: [`FoodNo.${food.id}Nutritables`],
      queryFn: () => getNutritablesByFood(database, { foodId: food.id }),
      initialData: [],
    }
  );

  // Fetching all possible measurement units
  const { data: allUnits = [], isFetched: unitsFetched }: UnitsQueryReturn = useQuery({
    queryKey: ['allUnits'],
    queryFn: () => getAllUnits(database),
    initialData: [],
  });

  // Determining which measurement units are currently in use and which are not.
  const [usedUnits, setUsedUnits] = useState<Unit[]>();
  const [unusedUnits, setUnusedUnits] = useState<Unit[]>();
  useEffect(() => {
    if (nutritablesFetched && unitsFetched) {
      const tempUsedUnits = nutritables.map((nutritable) => nutritable.unit);
      setUnusedUnits(allUnits.filter((unit) => !tempUsedUnits?.includes(unit)));
      setUsedUnits(tempUsedUnits);
    }
  }, [nutritables, allUnits]);

  const [measurement, setMeasurement] = useState();
  const [selectedNutritable, setSelectedNutritable] = useState<Nutritable>();

  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.Simple);

  console.log(viewMode);

  // Return a blank screen if the relevant data has not as of yet been properly fetched.
  if (
    !nutritablesFetched ||
    !unitsFetched ||
    !usedUnits ||
    usedUnits.length === 0 ||
    !unusedUnits ||
    unusedUnits.length === 0
  ) {
    return <></>;
  }

  return (
    <>
      <Portal.Host>
        <Portal></Portal>
        <KeyboardAwareScrollView
          behavior="padding"
          nestedScrollEnabled
          extraScrollHeight={160}
          contentContainerStyle={styles.container}>
          {/* Food Name */}
          <View style={styles.nameField}>
            <Text style={styles.nameInput}>{food.name}</Text>
          </View>
          {/* View Toggle */}
          <ToggleView viewMode={viewMode} setViewMode={setViewMode} />
          {/* Buttons section */}
          <View style={styles.buttonsFlex}>
            {/* button: DELETE nutritable */}
            <TouchableOpacity style={styles.button}>
              <IconSVG
                name="solid-square-list-circle-xmark"
                color={'white'}
                width={28}
                style={{ marginLeft: 4 }}
              />
            </TouchableOpacity>
            {/* button: EDIT nutritable */}
            <TouchableOpacity style={styles.button}>
              <IconSVG
                name="solid-square-list-pen"
                color={'white'}
                width={28}
                style={{ marginLeft: 4 }}
              />
            </TouchableOpacity>
            {/* button: ADD nutritable */}
            <TouchableOpacity style={styles.button}>
              <IconSVG
                name="solid-square-list-circle-plus"
                color={'white'}
                width={28}
                style={{ marginLeft: 4 }}
              />
            </TouchableOpacity>
            {/* button: create ENTRY */}
            <TouchableOpacity style={styles.button}>
              <IconSVG name="utensils-solid" color={'white'} width={24} />
            </TouchableOpacity>
          </View>
        </KeyboardAwareScrollView>
      </Portal.Host>
    </>
  );
}

const styles = StyleSheet.create({
  unitIconBox: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.violet30,
    width: 40,
    height: 40,
    borderRadius: 10,
  },
  unitCaret: {
    position: 'absolute',
    transform: [{ rotate: '-90deg' }],
    right: -20,
    zIndex: 1,
  },
  nameField: {
    backgroundColor: Colors.violet30,
    height: 60,
    borderRadius: 20,
    overflow: 'scroll',
  },
  nameInput: {
    flex: 1,
    textAlign: 'center',
    textAlignVertical: 'center',
    color: 'white',
    fontSize: 20,
    paddingHorizontal: 20,
  },
  container: {
    gap: 20,
    padding: 20,
  },
  unitPickerFlex: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  buttonsFlex: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: 12,
    paddingHorizontal: 20,
    backgroundColor: Colors.violet70,
    paddingBottom: 12,
    paddingTop: 12,
    borderRadius: 24,
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 48,
    width: 48,
    borderRadius: '100%',
    backgroundColor: Colors.violet30,
  },
});
