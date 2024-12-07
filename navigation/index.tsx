import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Home from 'screens/Home';
import FoodsList from 'screens/FoodsList';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { DateProvider } from 'context/DateContext';
import { ColorsProvider } from 'context/ColorContext';
import { Suspense } from 'react';
import { Text } from 'react-native-ui-lib';
import { SQLiteProvider } from 'expo-sqlite';

export type RootStackParamList = {
  Home: undefined;
  FoodList: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const queryClient = new QueryClient();

export default function RootStack() {
  return (
    <GestureHandlerRootView>
      <NavigationContainer>
        <QueryClientProvider client={queryClient}>
          <SQLiteProvider
            useSuspense
            databaseName="appDatabase.db"
            assetSource={{
              assetId: require('assets/database/appDatabase.db'),
            }}>
            <DateProvider>
              <ColorsProvider>
                <Suspense fallback={<Text>Loading...</Text>}>
                  <Stack.Navigator initialRouteName="Home">
                    <Stack.Screen name="Home" component={Home} />
                    <Stack.Screen
                      name="FoodList"
                      component={FoodsList}
                      options={{ animation: 'slide_from_right' }}
                    />
                  </Stack.Navigator>
                </Suspense>
              </ColorsProvider>
            </DateProvider>
          </SQLiteProvider>
        </QueryClientProvider>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}
