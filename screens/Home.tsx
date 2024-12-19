import React, { useEffect, useState } from 'react';
import { deleteDatabaseSync, SQLiteDatabase, useSQLiteContext } from 'expo-sqlite';
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

  const [fat, setFat] = useState(0);
  const [protein, setProtein] = useState(0);
  const [carbohydrates, setCarbohydrates] = useState(0);

  const macronutrients: { name: MacroName; grams: number }[] = [
    { name: 'fat', grams: fat },
    { name: 'protein', grams: protein },
    { name: 'carbohydrates', grams: carbohydrates },
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
      color: colors.get('carbohydrates'),
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
      color: colors.get('calories'),
      iconName: 'ball-pile-solid',
      amount: fat * 8 + carbohydrates * 4 + protein * 4,
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
            <MacroLegendItem macro="Carbohydrates" color={colors.get('carbohydrates')} />
            <MacroLegendItem macro="Protein" color={colors.get('protein')} />
            <MacroLegendItem macro="Calories" color={colors.get('calories')} />
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
