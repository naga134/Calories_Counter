import 'react-native-gesture-handler';

import RootStack from './navigation';

import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { DateProvider } from 'context/DateContext';
import { ColorsProvider } from 'context/ColorContext';
import { Suspense } from 'react';
import { Text } from 'react-native-ui-lib';
import { SQLiteProvider } from 'expo-sqlite';
import { MealSummariesProvider } from 'context/SummariesContext';

const queryClient = new QueryClient();

export default function App() {
  return (
    <GestureHandlerRootView>
      {/* Enables access to the React Query's query client */}
      <QueryClientProvider client={queryClient}>
        {/* Enables access to the SQLite database */}
        <SQLiteProvider
          databaseName="database.db"
          options={{ enableChangeListener: true }}
          assetSource={{
            assetId: require('assets/database/appDatabase.db'),
          }}>
          {/* Makes currently selected date available via context */}
          <DateProvider>
            {/* Makes meals' summaries available via context */}
            <MealSummariesProvider>
              <ColorsProvider>
                <RootStack />
              </ColorsProvider>
            </MealSummariesProvider>
          </DateProvider>
        </SQLiteProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
