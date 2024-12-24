import React, { useCallback, useEffect, useState } from 'react';
import { Dimensions, LayoutChangeEvent, StyleSheet } from 'react-native';
import {
  Colors,
  Icon,
  KeyboardAwareScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native-ui-lib';
import { Portal } from 'react-native-paper';
import { useQuery } from '@tanstack/react-query';
import { getAllUnits } from 'database/queries/unitsQueries';
import { SQLiteDatabase, useSQLiteContext } from 'expo-sqlite';

import { useColors } from 'context/ColorContext';
import { StaticScreenProps } from '@react-navigation/native';
import { Food, Meal, Nutritable, Unit } from 'database/types';
import { getNutritablesByFood } from 'database/queries/nutritablesQueries';
import IconSVG from 'components/Shared/icons/IconSVG';
import ToggleView, { ViewMode } from 'components/Screens/Read/ToggleView';
import MacrosBarChart from 'components/Screens/Create/MacrosBarChart';
import MacroInputField from 'components/Screens/Create/MacroInputField';
import SegmentedMacrosBarChart from 'components/Screens/Read/SegmentedMacrosBarChart';
import HorizontalUnitPicker from 'components/Screens/Read/HorizontalUnitPicker';
import { FlatList } from 'react-native-gesture-handler';
import MacrosTransition from 'components/Screens/Read/MacrosTransition';
import KcalsTransition from 'components/Screens/Read/KcalsTransition';
import MacrosAccordion from 'components/Screens/Read/MacrosAccordion';

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

  const [measurement, setMeasurement] = useState<string>('');
  const [selectedNutritable, setSelectedNutritable] = useState<Nutritable>();

  // THIS TOGGLES THE VIEW MODE
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.Simple);
  // Simple: displays the bar chart as seen before
  // Meal: displays a segmented bar chart in which grey-coloured segments represent the
  // amount of each macro that was present in the meal before this entry's addition
  // Day: same as the meal, but for the day.

  const [accordionHeight, setAccordionHeight] = useState(0);
  const [kcalsHeight, setKcalsHeight] = useState(0);

  const onAccordionLayout = useCallback((e: LayoutChangeEvent) => {
    setAccordionHeight(e.nativeEvent.layout.height);
  }, []);

  const onKcalsLayout = useCallback((e: LayoutChangeEvent) => {
    setKcalsHeight(e.nativeEvent.layout.height);
  }, []);

  const leftoverSpace = Math.max(accordionHeight - kcalsHeight, 0);

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
          contentContainerStyle={styles.container}
          // style={styles.container}
        >
          {/* Food Name */}
          <View style={styles.nameBox}>
            <Text style={styles.name}>{food.name}</Text>
          </View>
          {/* View Toggle */}
          <ToggleView viewMode={viewMode} setViewMode={setViewMode} />

          {/* Bars Chart */}
          {/* BAR CHARTS COME HERE */}
          <SegmentedMacrosBarChart protein={0} fat={0} carbs={0} />

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
                <KcalsTransition
                  onLayout={onKcalsLayout}
                  current={0}
                  after={0}
                  expanded={viewMode !== ViewMode.Simple}
                  expandedHeight={accordionHeight / 4}
                />
                <MacrosAccordion
                  expanded={viewMode !== ViewMode.Simple}
                  leftoverSpace={(accordionHeight / 4) * 3}>
                  <MacrosTransition current={0} after={0} macro={'fat'} />
                  <MacrosTransition current={0} after={0} macro={'carbs'} />
                  <MacrosTransition current={0} after={0} macro={'protein'} />
                </MacrosAccordion>
              </View>
            </View>
            {/* Unit Picker Flex Box */}
            <View
              style={{
                flex: 1,
                alignItems: 'center',
                gap: 12,
                position: 'relative',
              }}>
              {/* Unit Picker */}
              <HorizontalUnitPicker data={allUnits} wheelWidth={(screenWidth - 52) / 2} />
              {/* Caret Indicator */}
              <IconSVG
                style={{ position: 'absolute', top: 68, transform: [{ rotate: '180deg' }] }}
                color={Colors.violet30}
                name="caret-down-solid"
              />
              {/* Ruler Icon Box */}
              <View
                style={{
                  width: 40,
                  height: 40,
                  backgroundColor: Colors.violet30,
                  borderRadius: 12,
                }}>
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
  container: {
    gap: 20,
    padding: 20,
  },
  nameBox: {
    backgroundColor: Colors.violet30,
    height: 60,
    borderRadius: 20,
    overflow: 'scroll',
  },
  name: {
    flex: 1,
    textAlign: 'center',
    textAlignVertical: 'center',
    color: 'white',
    fontSize: 20,
    paddingHorizontal: 20,
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
  flex: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 8,
  },
});
