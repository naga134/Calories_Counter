import React, { useEffect, useMemo, useState } from 'react';
import {
  addDatabaseChangeListener,
  deleteDatabaseSync,
  SQLiteDatabase,
  useSQLiteContext,
} from 'expo-sqlite';
import { QueryClient, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button, Colors, Icon, Text, View } from 'react-native-ui-lib';
import { Dimensions, Pressable, ScrollView, StyleSheet } from 'react-native';

// Custom Hooks
import { useColors, MacroColors } from 'context/ColorContext';
import { useDate } from 'context/DateContext';

// Utils
import { formatDate } from 'utils/formatDate';
import getAllMeals from 'database/queries/mealsQueries';

// Components
import PieChart from 'components/Screens/Home/PieChart';
import IconSVG from 'components/Shared/icons/IconSVG';
import MealDrawer from 'components/Screens/Home/MealDrawer';
import MacroOverview from 'components/MacroOverview';
import MacroLegendItem from 'components/Screens/List/MacroLegendItem';

import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import { getEntriesByDate } from 'database/queries/entriesQueries';
import { getNutritableById, getNutritablesByIds } from 'database/queries/nutritablesQueries';
import proportion from 'utils/proportion';
import { Nutritable } from 'database/types';

type MacroName = keyof MacroColors;

export default function Home() {
  // SECTION 1: UI

  const colors = useColors();
  const screenWidth = Dimensions.get('window').width;

  // SECTION 2: Title and Date Picker

  const date = useDate();
  // const navigation = useNavigation();
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);

  const handleDateChange = (event: DateTimePickerEvent, selectedDate: Date | undefined) => {
    if (selectedDate) {
      setDatePickerVisible(false);
      date.set(selectedDate);
    }
  };

  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      title: formatDate(date.get()),
      headerRight: () => (
        <Pressable onPress={() => setDatePickerVisible(true)}>
          <IconSVG
            name="calendar-1"
            width={32}
            style={{ marginRight: 8 }}
            color={Colors.violet40}
          />
        </Pressable>
      ),
    });
  }, [navigation, date]);

  // SECTION 3: Database Logic

  const database: SQLiteDatabase = useSQLiteContext();
  const queryClient: QueryClient = useQueryClient();

  // Retrieving the list of daily meals from the database
  const { data: meals = [] } = useQuery({
    queryKey: ['meals'],
    queryFn: () => getAllMeals(database),
    initialData: [],
  });

  // FETCHING all relevant ENTRIES
  const {
    data: entries = [],
    refetch: refetchEntries,
    isFetched: entriesFetched,
  } = useQuery({
    queryKey: ['entries'],
    queryFn: () => getEntriesByDate(database, { date: date.get() }),
    initialData: [],
  });

  // FETCHING all relevant NUTRITABLES
  const {
    data: nutritables = [],
    refetch: refetchNutritables,
    // isLoading: nutritablesLoading,
    // error: nutritablesError,
  } = useQuery({
    queryKey: ['nutritables'],
    queryFn: () => {
      // Makes a set out of the used ids, making sure their values are unique.
      const tableIds = new Set(entries.map((entry) => entry.nutritableId));
      // Fetches each unique nutritable.
      return getNutritablesByIds(database, { ids: Array.from(tableIds) });
    },
    initialData: [],
    enabled: entriesFetched && entries.length > 0,
  });

  useEffect(() => {
    const listener = addDatabaseChangeListener((change) => {
      if (change.tableName === 'entries') refetchEntries();
      if (change.tableName === 'nutritables') refetchNutritables();
    });
    return () => {
      listener.remove(); // Is this really necessary?
    };
  }, []);

  useEffect(() => {
    refetchEntries();
    // refetchNutritables();
  }, [date.get()]);

  const { fat, protein, carbohydrates, kcals } = useMemo(() => {
    if (!entries || entries.length === 0 || nutritables.length === 0) {
      return {
        fat: 0,
        protein: 0,
        carbohydrates: 0,
        kcals: 0,
      };
    }

    const nutritableMap = new Map<number, Nutritable>();
    nutritables.forEach((n) => nutritableMap.set(n.id, n));

    let totalFat = 0;
    let totalProtein = 0;
    let totalCarbs = 0;
    let totalKcals = 0;

    entries.forEach((entry) => {
      const nutritable = nutritableMap.get(entry.nutritableId);
      totalFat += proportion(nutritable.fats, entry.amount, nutritable.baseMeasure);
      totalProtein += proportion(nutritable.protein, entry.amount, nutritable.baseMeasure);
      totalCarbs += proportion(nutritable.carbs, entry.amount, nutritable.baseMeasure);
      totalKcals += proportion(nutritable.kcals, entry.amount, nutritable.baseMeasure);
    });

    return {
      fat: totalFat.toFixed(2),
      protein: totalProtein.toFixed(2),
      carbohydrates: totalCarbs.toFixed(2),
      kcals: totalKcals.toFixed(0),
    };
  }, [entries, nutritables]);

  const macronutrients: { name: MacroName; grams: number }[] = [
    { name: 'fat', grams: fat },
    { name: 'protein', grams: protein },
    { name: 'carbs', grams: carbohydrates },
  ];

  // Adding insignificant data to ensure the drawing of the graph even for empty macros
  const chartData = [...macronutrients.map((macro) => macro.grams), 0.0001];
  const chartColors = [...macronutrients.map((macro) => colors.get(macro.name)), Colors.grey50];

  // TODO: Make this whole thing a separate component
  const macroItems = [
    {
      color: colors.get('fat'),
      iconName: 'bacon-solid',
      amount: fat,
      unit: 'g',
      // onPress: () => setFat(fat + 10),
    },
    {
      color: colors.get('carbs'),
      iconName: 'wheat-solid',
      amount: carbohydrates,
      unit: 'g',
      // onPress: () => setCarbohydrates(carbohydrates + 10),
    },
    {
      color: colors.get('protein'),
      iconName: 'meat-solid',
      amount: protein,
      unit: 'g',
      // onPress: () => setProtein(protein + 10),
    },
    {
      color: colors.get('kcals'),
      iconName: 'ball-pile-solid',
      amount: kcals,
      unit: 'g',
      onPress: () => {
        // setProtein(0), setCarbohydrates(0), setFat(0);
      },
    },
  ] as const;

  // SECTION 4: Component itself

  return (
    <>
      {/* Modal */}
      {isDatePickerVisible && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date.get()}
          mode="date"
          onChange={handleDateChange}
        />
      )}

      <ScrollView
        contentContainerStyle={{
          alignItems: 'center',
        }}>
        {/* Top-level macronutrients' overview */}
        <View
          style={{
            flexDirection: 'row',
          }}>
          {macroItems.map((macro, index) => (
            <MacroOverview
              key={index}
              color={macro.color}
              iconName={macro.iconName}
              amount={macro.amount}
              unit={macro.unit}
            />
          ))}
        </View>
        {/* Piechart and Legend Box*/}
        <View
          style={{
            flexDirection: 'row',
            width: screenWidth * 0.8,
            gap: 24,
            marginVertical: 24,
          }}>
          {/* Chart */}
          <PieChart data={chartData} colors={chartColors} innerRadius={50} outerRadius={80} />
          {/* Chart's legend */}
          <View style={{ flex: 1, justifyContent: 'flex-end' }}>
            <MacroLegendItem macro="Fat" color={colors.get('fat')} />
            <MacroLegendItem macro="Carbohydrates" color={colors.get('carbs')} />
            <MacroLegendItem macro="Protein" color={colors.get('protein')} />
            <MacroLegendItem macro="Calories" color={colors.get('kcals')} />
          </View>
        </View>
        {/* Meals' List */}
        <View style={{ gap: 10, paddingTop: 10, paddingBottom: 40 }}>
          {meals.map((meal) => (
            <MealDrawer key={meal.id} meal={meal} />
          ))}
        </View>
      </ScrollView>
    </>
  );
}

StyleSheet;
