import React, { useCallback, useEffect, useState, useMemo } from 'react';
import { Dimensions, LayoutChangeEvent, Pressable, StyleSheet } from 'react-native';
import { Colors, KeyboardAwareScrollView, Text, TouchableOpacity, View } from 'react-native-ui-lib';
import { Portal } from 'react-native-paper';
import { useQuery } from '@tanstack/react-query';
import { getAllUnits } from 'database/queries/unitsQueries';
import { SQLiteDatabase, useSQLiteContext } from 'expo-sqlite';
import { useColors } from 'context/ColorContext';
import { StaticScreenProps, useNavigation } from '@react-navigation/native';
import { Food, Meal, Nutritable, Unit } from 'database/types';
import { getNutritablesByFood } from 'database/queries/nutritablesQueries';
import IconSVG from 'components/Shared/icons/IconSVG';
import ToggleView, { ViewMode } from 'components/Screens/Read/ToggleView';
import MacroInputField from 'components/Screens/Create/MacroInputField';
import SegmentedMacrosBarChart from 'components/Screens/Read/SegmentedMacrosBarChart';
import HorizontalUnitPicker from 'components/Screens/Read/HorizontalUnitPicker';
import MacrosTransition from 'components/Screens/Read/MacrosTransition';
import KcalsTransition from 'components/Screens/Read/KcalsTransition';
import MacrosAccordion from 'components/Screens/Read/MacrosAccordion';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from 'navigation';
import proportion from 'utils/proportion';

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
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const database: SQLiteDatabase = useSQLiteContext();

  // FETCHING the food's nutritables
  const { data: nutritables = [], isFetched: nutritablesFetched }: NutritableQueryReturn = useQuery(
    {
      queryKey: [`FoodNo.${food.id}Nutritables`],
      queryFn: () => getNutritablesByFood(database, { foodId: food.id }),
      initialData: [],
    }
  );

  // FETCHING all possible measurement units
  const { data: allUnits = [], isFetched: unitsFetched }: UnitsQueryReturn = useQuery({
    queryKey: ['allUnits'],
    queryFn: () => getAllUnits(database),
    initialData: [],
  });

  // Keeping track of USED and UNUSED measurement UNITS
  const { usedUnits, unusedUnits } = useMemo(() => {
    if (!nutritablesFetched || !unitsFetched) {
      return { usedUnits: [], unusedUnits: [] };
    }
    // Creates a Set of used unit symbols for efficient lookup
    const usedUnitSymbols = new Set(nutritables.map((nutritable) => nutritable.unit.symbol));
    // Filters allUnits to get the usedUnits and the unusedUnits
    const usedUnits = allUnits.filter((unit) => usedUnitSymbols.has(unit.symbol));
    const unusedUnits = allUnits.filter((unit) => !usedUnitSymbols.has(unit.symbol));
    return { usedUnits, unusedUnits };
  }, [nutritables, allUnits, nutritablesFetched, unitsFetched]);

  const [measurement, setMeasurement] = useState<string>('');
  const [selectedNutritable, setSelectedNutritable] = useState<Nutritable>();

  useEffect(() => setSelectedNutritable(nutritables[0]), [nutritablesFetched, nutritables]);

  // console.log('UNUSED');
  // useEffect(() => console.log(unusedUnits), [unusedUnits]);

  // THIS TOGGLES THE VIEW MODE
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.Simple);
  // Simple: displays the bar chart as seen before
  // Meal: displays a segmented bar chart in which grey-coloured segments represent the
  // amount of each macro that was present in the meal before this entry's addition
  // Day: same as the meal, but for the day.

  // ANIMATION LOGIC BASED ON VIEW MODE

  const [accordionHeight, setAccordionHeight] = useState(0);

  const onAccordionLayout = useCallback((e: LayoutChangeEvent) => {
    setAccordionHeight(e.nativeEvent.layout.height);
  }, []);

  // Consolidated Macros State
  const [macros, setMacros] = useState({
    kcals: 0,
    fat: 0,
    carbs: 0,
    protein: 0,
  });

  // Calculate Macros using useMemo
  const calculatedMacros = useMemo(() => {
    if (!selectedNutritable || !measurement)
      return {
        kcals: 0,
        fat: 0,
        carbs: 0,
        protein: 0,
      };

    const {
      kcals: tableKcals,
      fats: tableFats,
      carbs: tableCarbs,
      protein: tableProtein,
      baseMeasure,
    } = selectedNutritable;
    const entryAmount = Number(measurement);

    return {
      kcals: proportion(tableKcals, entryAmount, baseMeasure),
      fat: proportion(tableFats, entryAmount, baseMeasure),
      carbs: proportion(tableCarbs, entryAmount, baseMeasure),
      protein: proportion(tableProtein, entryAmount, baseMeasure),
    };
  }, [measurement, selectedNutritable]);

  // Update Macros State
  useEffect(() => {
    setMacros(calculatedMacros);
  }, [calculatedMacros]);

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
          <View style={styles.nameBox}>
            <Text style={styles.name}>{food.name}</Text>
          </View>
          {/* View Toggle */}
          <ToggleView viewMode={viewMode} setViewMode={setViewMode} />

          {/* Bars Chart */}
          <SegmentedMacrosBarChart protein={macros.protein} fat={macros.fat} carbs={macros.carbs} />

          {/* Input Field: AMOUNT */}
          <MacroInputField
            text={measurement}
            onChangeText={(text) => setMeasurement(text)}
            unitSymbol={nutritables[0].unit.symbol}
            unitIndicatorWidth={60}
            iconName={'scale-unbalanced-solid'}
            maxLength={7}
          />

          <View flex row style={{ flex: 1, gap: 12 }}>
            {/* Macros Box */}
            <View flex onLayout={onAccordionLayout}>
              <View style={{ overflow: 'hidden', borderRadius: 20 }}>
                {/* This shows the total calories or its change */}
                <KcalsTransition
                  current={0}
                  after={macros.kcals}
                  expanded={viewMode !== ViewMode.Simple}
                  expandedHeight={accordionHeight / 4}
                />
                {/* This shows the change in macros */}
                <MacrosAccordion
                  expanded={viewMode !== ViewMode.Simple}
                  leftoverSpace={(accordionHeight / 4) * 3}>
                  <MacrosTransition current={0} after={macros.fat} macro={'fat'} />
                  <MacrosTransition current={0} after={macros.carbs} macro={'carbs'} />
                  <MacrosTransition current={0} after={macros.protein} macro={'protein'} />
                </MacrosAccordion>
              </View>
            </View>
            {/* Unit Picker Flex Box */}
            <View style={styles.unitPickerFlex}>
              {/* Unit Picker */}
              <HorizontalUnitPicker data={usedUnits} wheelWidth={(screenWidth - 52) / 2} />
              {/* Caret Indicator */}
              <IconSVG
                style={{ position: 'absolute', top: 68, transform: [{ rotate: '180deg' }] }}
                color={Colors.violet30}
                name="caret-down-solid"
              />
              {/* Ruler Icon Box */}
              <View style={styles.rulerIconBox}>
                {/* Ruler Icon */}
                <IconSVG
                  width={24}
                  name={'ruler-solid'}
                  color={Colors.white}
                  style={{ margin: 'auto' }}
                />
              </View>
            </View>
          </View>

          {/* Buttons section */}
          <View style={styles.buttonsFlex}>
            {/* button: DELETE nutritable */}
            <Pressable style={styles.button} onPress={() => console.log('DELETE')}>
              <IconSVG
                name="solid-square-list-circle-xmark"
                color={'white'}
                width={28}
                style={{ marginLeft: 4 }}
              />
            </Pressable>
            {/* button: EDIT nutritable */}
            <Pressable style={styles.button} onPress={() => navigation.navigate('Update')}>
              <IconSVG
                name="solid-square-list-pen"
                color={'white'}
                width={28}
                style={{ marginLeft: 4 }}
              />
            </Pressable>
            {/* button: ADD nutritable */}
            <Pressable
              style={styles.button}
              disabled={unusedUnits.length === 0}
              onPress={() => navigation.navigate('Add', { food, units: unusedUnits })}>
              <IconSVG
                name="solid-square-list-circle-plus"
                color={'white'}
                width={28}
                style={{ marginLeft: 4 }}
              />
            </Pressable>
            {/* button: create ENTRY */}
            <TouchableOpacity style={styles.button} onPress={() => console.log('Create Entry')}>
              <IconSVG name="utensils-solid" color={'white'} width={24} />
            </TouchableOpacity>
          </View>
        </KeyboardAwareScrollView>
      </Portal.Host>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 20,
    padding: 20,
  },
  nameBox: {
    backgroundColor: Colors.violet30,
    height: 60,
    borderRadius: 20,
    justifyContent: 'center', // Center vertically
    alignItems: 'center', // Center horizontally
  },
  name: {
    color: 'white',
    fontSize: 20,
    textAlign: 'center',
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
    borderRadius: 24, // Ensure it's circular
    backgroundColor: Colors.violet30,
  },
  flex: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 8,
  },
  unitPickerFlex: {
    flex: 1,
    alignItems: 'center',
    gap: 12,
    position: 'relative',
  },
  rulerIconBox: {
    width: 40,
    height: 40,
    backgroundColor: Colors.violet30,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
