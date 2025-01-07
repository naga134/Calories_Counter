import { useEffect, useMemo, useState } from 'react';
import { Dimensions, StyleSheet, TouchableOpacity } from 'react-native';
import { ExpandableSection, Text, View, Colors, Button, Drawer, Icon } from 'react-native-ui-lib';

import IconSVG from '../../Shared/icons/IconSVG';
import RotatingCaret from './RotatingCaret';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from 'navigation';
import { Food, Meal } from 'database/types';
import { addDatabaseChangeListener, SQLiteDatabase, useSQLiteContext } from 'expo-sqlite';
import { useQuery } from '@tanstack/react-query';
import { deleteEntry, getEntriesByMealAndDate } from 'database/queries/entriesQueries';
import { useDate } from 'context/DateContext';
import { getNutritablesByIds } from 'database/queries/nutritablesQueries';
import { getFoodsByIds } from 'database/queries/foodsQueries';
import proportion from 'utils/proportion';
import { getAllUnits } from 'database/queries/unitsQueries';

type MealDrawerProps = {
  meal: Meal;
};

type DrawerHeaderProps = {
  mealName: string;
  expanded: boolean;
};

type DrawerBodyProps = {
  meal: Meal;
  entries: EntrySummary[];
};

type EntrySummary = {
  id: number;
  amount: number;
  food: Food;
  nutritableId: number;
  unit: string;
  kcals: number;
};

export default function MealDrawer({ meal }: MealDrawerProps) {
  const [expanded, setExpanded] = useState(false);

  const date = useDate();
  const database: SQLiteDatabase = useSQLiteContext();

  console.log(date.get());

  // FETCHING all relevant ENTRIES
  const {
    data: entries = [],
    refetch: refetchEntries,
    isFetched: entriesFetched,
    isLoading: entriesLoading,
  } = useQuery({
    queryKey: [`MealNo.${meal.id}Entries`],
    queryFn: () => getEntriesByMealAndDate(database, { date: date.get(), mealId: meal.id }),
    initialData: [],
  });

  // FETCHING all relevant NUTRITABLES
  const {
    data: nutritables = [],
    refetch: refetchNutritables,
    isFetched: nutritablesFetched,
    isLoading: nutritablesLoading,
  } = useQuery({
    queryKey: [`MealNo.${meal.id}Nutritables`],
    queryFn: () => {
      const tableIds = new Set(entries.map((entry) => entry.nutritableId));
      return getNutritablesByIds(database, { ids: Array.from(tableIds) });
    },
    initialData: [],
    enabled: entriesFetched && entries.length > 0,
  });

  // FETCHING all relevant FOODS
  const {
    data: foods = [],
    refetch: refetchFoods,
    isFetched: foodsFetched,
    isLoading: foodsLoading,
  } = useQuery({
    queryKey: [`MealNo.${meal.id}Foods`],
    queryFn: () => {
      const tableIds = new Set(entries.map((entry) => entry.foodId));
      return getFoodsByIds(database, { ids: Array.from(tableIds) });
    },
    initialData: [],
    enabled: entriesFetched && entries.length > 0,
  });

  // FETCHING all UNITS
  const { data: units = [], isFetched: unitsFetched } = useQuery({
    queryKey: ['allUnits'],
    queryFn: () => getAllUnits(database),
    initialData: [],
  });

  useEffect(() => {
    const listener = addDatabaseChangeListener((change) => {
      if (change.tableName === 'entries') refetchEntries();
      if (change.tableName === 'nutritables') refetchNutritables();
      if (change.tableName === 'foods') refetchFoods();
    });
    return () => {
      listener.remove();
    };
  }, []);

  useEffect(() => {
    refetchEntries();
  }, [date.get()]);

  useEffect(() => {
    refetchFoods();
    refetchNutritables();
  }, [entries]);

  const entriesSummary: EntrySummary[] = useMemo(() => {
    if (!foodsFetched || !nutritablesFetched) {
      return [];
    }

    return entries.map((entry) => {
      const nutritable = nutritables.find((table) => table.id === entry.nutritableId);
      const food = foods.find((f) => f.id === entry.foodId);

      if (!nutritable) {
        // Fallback if no matching nutritable exists
        return {
          id: entry.id,
          amount: entry.amount,
          food,
          nutritableId: entry.nutritableId,
          kcals: 0,
          unit: '',
        };
      }

      return {
        id: entry.id,
        amount: entry.amount,
        food,
        nutritableId: entry.nutritableId,
        kcals: proportion(nutritable.kcals, entry.amount, nutritable.baseMeasure),
        // use optional chaining on unitId:
        unit: units.find((u) => u.id === nutritable.unitId)?.symbol ?? '',
      };
    });
  }, [entries, nutritables, foods, foodsFetched, nutritablesFetched, units]);

  return (
    <ExpandableSection
      expanded={expanded}
      onPress={() => setExpanded(!expanded)}
      sectionHeader={<DrawerHeader mealName={meal.name} expanded={expanded} />}>
      <DrawerBody meal={meal} entries={entriesSummary} />
    </ExpandableSection>
  );
}

// This is the header for each meal's drawer.
// It should contain: kcals overview, meal name, caret.
function DrawerHeader({ expanded, mealName }: DrawerHeaderProps) {
  const screenWidth = Dimensions.get('window').width;

  return (
    <View
      style={[
        styles.sectionHeader,
        {
          width: screenWidth * 0.8,
          borderBottomLeftRadius: expanded ? 0 : 10,
          borderBottomRightRadius: expanded ? 0 : 10,
        },
      ]}>
      <View>{/* kcals overview comes here */}</View>
      <Text grey10 text70>
        {mealName}
      </Text>
      <RotatingCaret
        size={16}
        rotated={expanded}
        color={expanded ? Colors.grey50 : Colors.grey20}
      />
    </View>
  );
}

// This is the body for each meal's drawer.
// It should contain: each food, its amount, its caloric total; "add food" button.
function DrawerBody({ meal, entries }: DrawerBodyProps) {
  const database: SQLiteDatabase = useSQLiteContext();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const screenWidth = Dimensions.get('window').width;

  return (
    <View style={styles.sectionBody}>
      {/* Each entry COMES HERE*/}
      {entries?.map(
        (entry) =>
          entry.food && (
            <Drawer
              disableHaptic
              itemsTintColor=""
              style={{ flex: 1, borderRadius: 100 }}
              key={entry.id}
              bounciness={100}
              fullSwipeRight
              onFullSwipeRight={() => deleteEntry(database, { entryId: entry.id })}
              rightItems={[
                {
                  customElement: (
                    <View centerH>
                      <IconSVG
                        name="trash-circle-solid"
                        color={Colors.violet40}
                        width={28}
                        // style={{ marginRight: 2 }}
                      />
                    </View>
                  ),
                  style: { borderRadius: 100 },
                  background: Colors.grey80,
                  onPress: () => {
                    deleteEntry(database, { entryId: entry.id });
                  },
                },
              ]}>
              <View row key={entry.id} style={{ flex: 1, width: screenWidth * 0.8 * 0.88 }}>
                <View
                  flex
                  style={{
                    // width:
                    paddingStart: 20,
                    paddingEnd: 8,
                    backgroundColor: Colors.violet80,
                    paddingVertical: 8,
                    borderTopStartRadius: 100,
                    borderBottomStartRadius: 100,
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 4,
                  }}>
                  {/* <Text violet40>{`${entry.kcals} kcal `}</Text> */}
                  <Text style={{ flex: 1, fontSize: 16 }}>{entry.food.name}</Text>
                  <Text violet50>{`${entry.amount}${entry.unit}`}</Text>
                </View>
                <View
                  row
                  center
                  style={{
                    backgroundColor: Colors.violet50,
                    borderTopEndRadius: 100,
                    borderBottomEndRadius: 100,
                    minWidth: 68,
                    paddingEnd: 12,
                    paddingStart: 8,
                    paddingVertical: 4,
                    gap: 4,
                  }}>
                  <IconSVG name="ball-pile-solid" color={Colors.violet40} width={12} />
                  <Text violet40>{entry.kcals}</Text>
                </View>
              </View>
            </Drawer>
          )
      )}

      <TouchableOpacity
        onPress={() => navigation.navigate('List', { meal })}
        style={{
          flex: 1,
          width: 40,
          height: 40,
          borderRadius: 100,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: Colors.violet70,
        }}>
        <IconSVG name={'plus-solid'} width={16} color={Colors.violet40} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionHeader: {
    height: 'auto',
    backgroundColor: Colors.white,
    padding: 15,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionBody: {
    gap: 8,
    backgroundColor: Colors.grey80,
    minHeight: 60,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
