import React, { createContext, useContext, ReactNode, useMemo } from 'react';
import { useSQLiteContext } from 'expo-sqlite';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { addDatabaseChangeListener } from 'expo-sqlite';

import { getEntriesByDate } from 'database/queries/entriesQueries';
import { getNutritablesByIds } from 'database/queries/nutritablesQueries';
import { Nutritable } from 'database/types';
import { useDate } from 'context/DateContext';

export type MacroSummary = {
  mealId: 0 | 1 | 2 | 3 | 4 | 5;
  kcals: number;
  protein: number;
  fat: number;
  carbs: number;
};

type MealSummaries = Record<
  | 'day' /*       mealId: 0*/
  | 'breakfast' /* mealId: 1*/
  | 'morning' /*   mealId: 2*/
  | 'lunch' /*     mealId: 3*/
  | 'afternoon' /* mealId: 4*/
  | 'dinner' /*    mealId: 5*/,
  MacroSummary
>;

type MealSummariesContextType = MealSummaries;
const MealSummariesContext = createContext<MealSummariesContextType | undefined>(undefined);

export function useMealSummaries() {
  const context = useContext(MealSummariesContext);
  if (!context) {
    throw new Error('useMealSummaries must be used within a MealSummariesProvider');
  }
  return context;
}

type MealSummariesProviderProps = {
  children: ReactNode;
};

export function MealSummariesProvider({ children }: MealSummariesProviderProps) {
  const database = useSQLiteContext();
  const queryClient = useQueryClient();
  const date = useDate().get();

  // Fetch relevant (date) entries
  const {
    data: entries = [],
    refetch: refetchEntries,
    isFetched: entriesFetched,
  } = useQuery({
    queryKey: ['entries'],
    queryFn: () => getEntriesByDate(database, { date: date }),
    initialData: [],
  });

  // Fetch relevant (entries) nutritables
  const { data: nutritables = [], refetch: refetchNutritables } = useQuery({
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

  // Listen for database changes
  React.useEffect(() => {
    const listener = addDatabaseChangeListener((change) => {
      if (change.tableName === 'entries') queryClient.invalidateQueries({ queryKey: ['entries'] });
      if (change.tableName === 'nutritables')
        queryClient.invalidateQueries({ queryKey: ['nutritables'] });
    });
    return () => {
      listener.remove();
    };
  }, [refetchEntries, refetchNutritables]);

  // Refetch when date changes
  React.useEffect(() => {
    refetchEntries();
  }, [date, refetchEntries]);

  // Refetch nutritables when entries change
  React.useEffect(() => {
    refetchNutritables();
  }, [entries, refetchNutritables]);

  // Calculate Summaries
  const summaries: MealSummaries = useMemo(() => {
    const empty = { kcals: 0, fat: 0, protein: 0, carbs: 0 };

    const mealSummaries: MealSummaries = {
      day: { mealId: 0, ...empty },
      breakfast: { mealId: 1, ...empty },
      morning: { mealId: 2, ...empty },
      lunch: { mealId: 3, ...empty },
      afternoon: { mealId: 4, ...empty },
      dinner: { mealId: 5, ...empty },
    };

    if (entries.length === 0 || nutritables.length === 0) {
      return mealSummaries;
    }

    const nutritableMap = new Map<number, Nutritable>();
    nutritables.forEach((n) => nutritableMap.set(n.id, n));

    entries.forEach((entry) => {
      const nutritable = nutritableMap.get(entry.nutritableId);
      if (!nutritable) return;

      const ratio = entry.amount / nutritable.baseMeasure;

      const mealSummary = Object.values(mealSummaries).find(
        (summary) => summary.mealId === entry.mealId
      );

      if (mealSummary) {
        mealSummary.kcals += nutritable.kcals * ratio;
        mealSummary.fat += nutritable.fats * ratio;
        mealSummary.protein += nutritable.protein * ratio;
        mealSummary.carbs += nutritable.carbs * ratio;
      }
    });

    // Calculate day summary
    mealSummaries.day = Object.values(mealSummaries).reduce((total, meal) => ({
      mealId: 0,
      kcals: total.kcals + meal.kcals,
      fat: total.fat + meal.fat,
      protein: total.protein + meal.protein,
      carbs: total.carbs + meal.carbs,
    }));

    return mealSummaries;
  }, [entries, nutritables]);

  return (
    <MealSummariesContext.Provider value={{ ...summaries }}>
      {children}
    </MealSummariesContext.Provider>
  );
}
