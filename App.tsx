import 'react-native-gesture-handler';

import RootStack from './navigation';

import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { DateProvider } from 'context/DateContext';
import { ColorsProvider } from 'context/ColorContext';
import { Suspense } from 'react';
import { Text } from 'react-native-ui-lib';
import { SQLiteProvider } from 'expo-sqlite';

const queryClient = new QueryClient();

export default function App() {
  return (
    <GestureHandlerRootView>
      <QueryClientProvider client={queryClient}>
        <SQLiteProvider
          useSuspense
          databaseName="appDatabase.db"
          // options={{ enableChangeListener: true }}
          assetSource={{
            assetId: require('assets/database/appDatabase.db'),
          }}>
          <DateProvider>
            <ColorsProvider>
              <Suspense fallback={<Text>Loading...</Text>}>
                <RootStack />
              </Suspense>
            </ColorsProvider>
          </DateProvider>
        </SQLiteProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
