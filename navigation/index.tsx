import { HeaderBackButton } from '@react-navigation/elements';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Food, Meal, Nutritable, Unit } from 'database/types';
import React from 'react';
import { View, Text, Button, StyleSheet, Modal as RNModal } from 'react-native';
import Add from 'screens/Add';
import Create from 'screens/Create';
import Edit from 'screens/Edit';

import Home from 'screens/Home';
import List from 'screens/List';
import Read from 'screens/Read';
import Update from 'screens/Update';

export type RootStackParamList = {
  Home: undefined; // Displays entries, daily meals and daily nutritional overview. Allows:
  // - Changing selected date;
  // - Adding an entry to a meal.

  List: { meal: Meal }; // Lists existing foods.
  Create: undefined; // Creates food.

  Read: { meal: Meal; foodId: number }; // Displays food and its nutritables, allows:
  // - Editing the food's name;
  // - Adding a specified amount of said food to a previously selected meal.

  Update: { nutritable: Nutritable; food: Food }; // Allows editing of nutritional table.
  Add: { food?: Food; units?: Unit[] }; // Creates nutritable
};

const Stack = createStackNavigator<RootStackParamList>();

const RootStack = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen
          name="List"
          component={List}
          options={({ route }) => ({
            title: `Add to ${route.params.meal.name}`, // Set the title dynamically
            animation: 'slide_from_right',
          })}
        />
        <Stack.Screen
          name="Read"
          component={Read}
          options={({ route }) => ({
            title: `Specify amount`, // Set the title dynamically
            animation: 'slide_from_right',
          })}
        />

        <Stack.Screen
          name="Create"
          component={Create}
          options={{
            title: 'Create food',
            animation: 'slide_from_right',
          }}
        />
        <Stack.Screen
          name="Add"
          component={Add}
          // TODO: - pass food and existing nutritables as parameters
          // - set title dynamically: "Add nutritional table to [foodname]
          options={{
            title: 'Add nutritional table',
            animation: 'slide_from_right',
          }}
        />
        <Stack.Screen
          name="Update"
          component={Update}
          // TODO: - pass food and existing nutritables as parameters
          // - set title dynamically: "Edit [foodname]'s nutritional table
          options={({ route }) => ({
            title: `Edit nutritional table`,
            animation: 'slide_from_right',
          })}
        />
      </Stack.Navigator>
      {/* Triggered from the navigation */}
    </NavigationContainer>
  );
};

export default RootStack;
