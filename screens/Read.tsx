import React, { useCallback, useEffect, useState, useMemo } from 'react';

import { Portal } from 'react-native-paper';
import { RootStackParamList } from 'navigation';
import { StackNavigationProp } from '@react-navigation/stack';
import { SQLiteDatabase, useSQLiteContext } from 'expo-sqlite';
import { StaticScreenProps, useNavigation } from '@react-navigation/native';
import { Dimensions, LayoutChangeEvent, Pressable, StyleSheet } from 'react-native';
import { Colors, KeyboardAwareScrollView, Text, TouchableOpacity, View } from 'react-native-ui-lib';

import mealKey from 'utils/mealKey';
import toCapped from 'utils/toCapped';
import proportion from 'utils/proportion';

import { useColors } from 'context/ColorContext';
import { useDate } from 'context/DateContext';
import { useMealSummaries } from 'context/SummariesContext';

import { Meal, Nutritable } from 'database/types';
import { useFoodData } from 'database/hooks/useFoodData';
import { deleteFood } from 'database/queries/foodsQueries';
import { createEntry } from 'database/queries/entriesQueries';
import { deleteNutritable } from 'database/queries/nutritablesQueries';

import IconSVG from 'components/Shared/icons/IconSVG';
import MacrosAccordion from 'components/Screens/Read/MacrosAccordion';
import KcalsTransition from 'components/Screens/Read/KcalsTransition';
import MacrosTransition from 'components/Screens/Read/MacrosTransition';
import MacroInputField from 'components/Screens/Create/MacroInputField';
import ToggleView, { ViewMode } from 'components/Screens/Read/ToggleView';
import HorizontalUnitPicker from 'components/Screens/Read/HorizontalUnitPicker';
import SegmentedMacrosBarChart from 'components/Screens/Read/SegmentedMacrosBarChart';

type Props = StaticScreenProps<{
  foodId: number;
  meal: Meal;
}>;

export default function Read({ route }: Props) {
  const { foodId, meal } = route.params;

  const colors = useColors();
  const screenWidth = Dimensions.get('window').width;

  // Comparative-view-specific data retrieval
  const daySummary = useMealSummaries().day;
  const mealSummary = useMealSummaries()[mealKey(meal.id)];

  // General-purpose data retrieval
  const date = useDate();
  const database: SQLiteDatabase = useSQLiteContext();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  // Food-specific data retrieval
  const { foodData, nutritablesData, units } = useFoodData({ foodId, database });
  const { food } = foodData;
  const { nutritables, fetched: nutritablesFetched } = nutritablesData;
  const { used: usedUnits, unused: unusedUnits } = units;

  // Stateful variables
  const [measurement, setMeasurement] = useState<string>('');
  const [selectedNutritable, setSelectedNutritable] = useState<Nutritable>(nutritables[0]);
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.Simple);
  const isSimple = viewMode === ViewMode.Simple;

  // Simple: displays the bar chart as seen before
  // Meal: displays a segmented bar chart in which grey-coloured segments represent the
  // amount of each macro that was present in the meal before this entry's addition
  // Day: same as the meal, but for the day.

  // ANIMATION LOGIC BASED ON VIEW MODE

  const [accordionHeight, setAccordionHeight] = useState(0);

  const onAccordionLayout = useCallback((e: LayoutChangeEvent) => {
    setAccordionHeight(e.nativeEvent.layout.height);
  }, []);

  // Calculate Macros using useMemo
  const calculatedMacros = useMemo(() => {
    if (!selectedNutritable || !measurement) return { kcals: 0, fat: 0, carbs: 0, protein: 0 };

    // destructuring tableMacros
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

  // Pre-defines the base for comparative view calculation
  const base = useMemo(() => {
    if (isSimple) {
      return { kcals: 0, fat: 0, carbs: 0, protein: 0 };
    }
    return viewMode === ViewMode.Meal ? mealSummary : daySummary;
  }, [isSimple, viewMode, mealSummary, daySummary]);

  // Manages the currently selected HorizontalUnitPicker's index
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Redefines the selected nutritable and HorizontalPicker's index upon nutritable deletion
  useEffect(() => {
    if (!nutritables.includes(selectedNutritable)) {
      const newIndex = selectedIndex === 0 ? 0 : selectedIndex - 1;
      setSelectedIndex(newIndex);
      if (nutritables.length > 0) setSelectedNutritable(nutritables[newIndex]);
    }
  }, [selectedNutritable, usedUnits]);

  // Return a blank screen if the relevant data has not been properly fetched yet.
  if (!food || !nutritablesFetched || !usedUnits || usedUnits.length === 0 || !unusedUnits) {
    return <></>; // POSSIBLE ISSUE: fetchedUnits removed
  }

  return (
    <>
      <Portal.Host>
        <Portal>{/* display any necessary pop-ups here */}</Portal>
        <KeyboardAwareScrollView
          behavior="padding"
          nestedScrollEnabled
          extraScrollHeight={160}
          contentContainerStyle={styles.container}>
          {/* Food Name */}
          <View style={styles.nameBox}>
            <Text style={styles.name}>{food.name}</Text>
          </View>
          {/* View Mode Toggle */}
          <ToggleView viewMode={viewMode} setViewMode={setViewMode} />
          {/* Bars Chart */}
          <SegmentedMacrosBarChart
            viewMode={viewMode}
            currentMacros={{
              fat: base.fat,
              protein: base.protein,
              carbs: base.carbs,
            }}
            macrosToAdd={{
              fat: calculatedMacros.fat,
              protein: calculatedMacros.protein,
              carbs: calculatedMacros.carbs,
            }}
          />
          {/* Input Field: AMOUNT */}
          <MacroInputField
            text={measurement}
            onChangeText={(text) => setMeasurement(text)}
            unitSymbol={selectedNutritable?.unit.symbol || '- - -'}
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
                  current={toCapped(isSimple ? calculatedMacros.kcals : base.kcals, 2)}
                  after={toCapped(calculatedMacros.kcals + base.kcals, 2)}
                  expanded={!isSimple}
                  expandedHeight={accordionHeight / 4}
                />
                {/* This shows the change in macros */}
                <MacrosAccordion expanded={!isSimple} leftoverSpace={(accordionHeight / 4) * 3}>
                  <MacrosTransition
                    current={toCapped(base.fat, 2)}
                    after={toCapped(calculatedMacros.fat + base.fat, 2)}
                    macro="fat"
                  />
                  <MacrosTransition
                    current={toCapped(base.carbs, 2)}
                    after={toCapped(calculatedMacros.carbs + base.carbs, 2)}
                    macro="carbs"
                  />
                  <MacrosTransition
                    current={toCapped(base.protein, 2)}
                    after={toCapped(calculatedMacros.protein + base.protein, 2)}
                    macro="protein"
                  />
                </MacrosAccordion>
              </View>
            </View>
            {/* Unit Picker Flex Box */}
            <View style={styles.unitPickerFlex}>
              {/* Unit Picker */}
              <HorizontalUnitPicker
                data={usedUnits}
                selectedIndex={{ value: selectedIndex, set: setSelectedIndex }}
                onChangeUnit={() => setSelectedNutritable(nutritables[selectedIndex])}
                wheelWidth={(screenWidth - 52) / 2}
              />
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
            <Pressable
              style={styles.button}
              onPress={() => {
                if (nutritables.length !== 1) {
                  deleteNutritable(database, { nutritableId: selectedNutritable.id });
                } else {
                  deleteNutritable(database, { nutritableId: selectedNutritable.id });
                  deleteFood(database, { foodId });
                  navigation.pop();
                }
              }}>
              <IconSVG
                name="solid-square-list-circle-xmark"
                color={'white'}
                width={28}
                style={{ marginLeft: 4 }}
              />
            </Pressable>
            {/* button: EDIT nutritable */}
            <Pressable
              style={styles.button}
              onPress={() =>
                navigation.navigate('Update', { food, nutritable: selectedNutritable! })
              }>
              <IconSVG
                name="solid-square-list-pen"
                color={'white'}
                width={28}
                style={{ marginLeft: 4 }}
              />
            </Pressable>
            {/* button: ADD nutritable */}
            <Pressable
              style={[
                styles.button,
                unusedUnits.length === 0 && { backgroundColor: Colors.violet60 },
              ]}
              disabled={unusedUnits.length === 0}
              onPress={() => navigation.navigate('Add', { food, units: unusedUnits })}>
              <IconSVG
                name="solid-square-list-circle-plus"
                color={unusedUnits.length === 0 ? Colors.violet80 : 'white'}
                width={28}
                style={{ marginLeft: 4 }}
              />
            </Pressable>
            {/* button: create ENTRY */}
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                // TODO: VALIDATE FIRST!
                const queryResult = createEntry(database, {
                  foodId: food.id,
                  nutritableId: selectedNutritable.id,
                  date: date.get(),
                  amount: Number(measurement),
                  unitId: selectedNutritable.unit.id,
                  mealId: meal.id,
                });
                // console.log(queryResult);
                navigation.popTo('Home');
              }}>
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
